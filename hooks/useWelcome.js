import { useState, useContext } from "react";
import { Wallet } from "zksync-web3";
import { collection, query, where, getDocs } from "firebase/firestore";

import firestoreDb from "../firebase";
import { WalletContext } from "./walletContext";
import useNotification from "./useNotification";

export default () => {
    const walletContext = useContext(WalletContext);
    const [isImportingSK, setIsImportingSK] = useState(false);
    const { setWalletAddr, setSigningKey } = walletContext;

    const { raiseSuccess, raiseFailure, notificationContextHolder } = useNotification();

    const createNewWallet = () => {};

    const importSecretKey = async (secretKey) => {
        try {
            setIsImportingSK(true);
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

    return {
        createNewWallet,
        importSecretKey,
        isImportingSK,
        notificationContextHolder,
    };
};
