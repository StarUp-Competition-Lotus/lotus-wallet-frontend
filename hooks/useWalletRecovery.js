import { useState, useCallback, useEffect } from "react";
import { doc, setDoc, collection, query, where, getDocs } from "firebase/firestore";
import firestoreDb from "../firebase";
import * as ethers from "ethers";

import useAATransaction from "./useAATransaction";
import useWalletContract from "./useWalletContract";
import useNotification from "./useNotification";

export default () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [recoveryRequests, setRecoveryRequests] = useState([]);
    const [isTransacting, setIsTransacting] = useState(false);
    const [isTableLoading, setIsTableLoading] = useState(true);
    const [recoverWalletInput, setRecoverWalletInput] = useState("");
    const [newSigningAddrInput, setNewSigningAddrInput] = useState("");

    const { walletAddr, getWalletContract } = useWalletContract();
    const { executeAA, notificationContextHolder } = useAATransaction();
    const { raiseFailure } = useNotification();

    const targetWalletContract = getWalletContract(recoverWalletInput);

    const getRecoveryRequests = useCallback(async () => {
        setIsTableLoading(true);
        try {
            const requestsRef = collection(firestoreDb, "recovery-requests");
            const requestsQuery = query(
                requestsRef,
                where("isActive", "==", true),
                where("requiredGuardians", "array-contains", walletAddr)
            );
            const querySnapshot = await getDocs(requestsQuery);
            const requests = [];
            querySnapshot.forEach((doc) => {
                requests.push(doc.data());
            });
            setRecoveryRequests(requests);
        } catch (e) {
            console.log("error: ", e);
            raiseFailure("Error loading recovery requests");
        }
        setIsTableLoading(false);
    }, [walletAddr]);

    const initiateRecovery = useCallback(async () => {
        const tx = await targetWalletContract.populateTransaction.initiateRecovery(
            newSigningAddrInput
        );
        setIsTransacting(true);
        await executeAA(tx, "Recovery initiated successfully", "Error initiating recovery");
        setIsTransacting(false);
        setIsModalOpen(false);
        setRecoverWalletInput("");
        setNewSigningAddrInput("");
    }, [recoverWalletInput, newSigningAddrInput]);

    useEffect(() => {
        getRecoveryRequests();
    }, [getRecoveryRequests]);

    useEffect(() => {
        if (!targetWalletContract) return;
        targetWalletContract.on(
            "RecoveryInitiated",
            (walletAddr, recoveryCycle, newSigningAddress, requiredGuardians, initiator) => {
                const handleRecoveryRequestsData = async () => {
                    const convertedRecoveryCycle = parseInt(
                        ethers.utils.formatEther(recoveryCycle)
                    );
                    const approvals = {};
                    for (let i = 0; i < requiredGuardians.length; i++) {
                        approvals[requiredGuardians[i]] = false;
                    }
                    approvals[initiator] = true;
                    const id = ethers.utils.keccak256(
                        ethers.utils.toUtf8Bytes(walletAddr + convertedRecoveryCycle)
                    );
                    await setDoc(doc(firestoreDb, "recovery-requests", id), {
                        walletAddr: walletAddr,
                        isActive: true,
                        recoveryCycle: convertedRecoveryCycle,
                        newSigningAddress: newSigningAddress,
                        approvals: approvals,
                        requiredGuardians: requiredGuardians,
                    });
                    await getRecoveryRequests();
                };
                handleRecoveryRequestsData();
            }
        );
    }, []);

    return {
        newSigningAddrInput,
        setRecoverWalletInput,
        setNewSigningAddrInput,
        initiateRecovery,
        notificationContextHolder,
        isTransacting,
        isModalOpen,
        setIsModalOpen,
        walletAddr,
        getRecoveryRequests,
        isTableLoading,
        recoveryRequests,
    };
};
