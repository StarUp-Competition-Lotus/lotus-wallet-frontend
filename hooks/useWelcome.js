import { useState, useEffect, useContext } from "react";
import { Wallet } from "zksync-web3";
import * as ethers from "ethers";
import { collection, query, where, getDocs, setDoc, doc } from "firebase/firestore";

import firestoreDb from "../firebase";
import { WalletContext } from "./walletContext";
import useNotification from "./useNotification";
import factoryContract from "../constants/factorySC";

export default () => {
    const walletContext = useContext(WalletContext);
    const [isImportingSK, setIsImportingSK] = useState(false);
    const [isCreatingWallet, setIsCreatingWallet] = useState(false);
    const [currentSingingKey, setCurrentSigningKey] = useState();
    const { setWalletAddr, setSigningKey } = walletContext;

    const { raiseSuccess, raiseFailure, notificationContextHolder } = useNotification();

    const createNewWallet = async () => {
        setIsCreatingWallet(true);
        try {
            const signingAccount = Wallet.createRandom();
            const { privateKey: signingKey, address: signingAddress } = signingAccount;
            setCurrentSigningKey(signingKey);
            const salt = ethers.constants.HashZero;

            const tx = await factoryContract.deployWallet(salt, signingAddress);
            await tx.wait(1);
        } catch (e) {
            console.log(e);
        }
        setIsCreatingWallet(false);
    };

    const importSecretKey = async (secretKey) => {
        setIsImportingSK(true);
        try {
            const signingAccount = new Wallet(secretKey);
            const signingAddress = signingAccount.address;
            const getWallet = query(
                collection(firestoreDb, "wallets"),
                where("signingAddr", "==", signingAddress)
            );
            const querySnapshot = await getDocs(getWallet);
            querySnapshot.forEach((doc) => {
                raiseSuccess("Secret key imported successfully");
                localStorage.setItem("SigningKey", secretKey);
                localStorage.setItem("WalletAddress", doc.id);
                setSigningKey(secretKey);
                setWalletAddr(doc.id);
            });
        } catch (e) {
            raiseFailure("Error importing secret key");
            console.log(e);
        }
        setIsImportingSK(false);
    };

    useEffect(() => {
        factoryContract.on("WalletCreated", (walletAddress, signingAddress) => {
            if (!currentSingingKey) return;
            console.log("currentSingingKey :", currentSingingKey);
            const handleWalletCreated = async () => {
                await setDoc(doc(firestoreDb, "wallets", walletAddress), {
                    signingAddr: signingAddress,
                    guardians: [],
                });
                raiseSuccess("Wallet created successfully");
                localStorage.setItem("SigningKey", currentSingingKey);
                localStorage.setItem("WalletAddress", walletAddress);
                setSigningKey(currentSingingKey);
                setWalletAddr(walletAddress);
            };
            handleWalletCreated();
        });
    }, [currentSingingKey]);

    return {
        createNewWallet,
        importSecretKey,
        isImportingSK,
        notificationContextHolder,
        isCreatingWallet,
    };
};
