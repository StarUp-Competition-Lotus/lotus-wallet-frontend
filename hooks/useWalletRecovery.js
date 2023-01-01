import { useState, useCallback, useEffect } from "react";
import { doc, setDoc, collection, query, where, getDocs, getDoc } from "firebase/firestore";
import firestoreDb from "../firebase";
import * as ethers from "ethers";

import useAATransaction from "./useAATransaction";
import useWalletContract from "./useWalletContract";
import useNotification from "./useNotification";
import { generateFbId } from "../utils/utils";

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
    }, [targetWalletContract, recoverWalletInput, newSigningAddrInput]);

    const supportRecovery = useCallback(async (supportingWalletAddr) => {
        const supportingRecoveryContract = getWalletContract(supportingWalletAddr);
        const tx = await supportingRecoveryContract.populateTransaction.supportRecovery();
        setIsTableLoading(true);
        await executeAA(tx, "Recovery supported successfully", "Error supporting recovery");
        setIsTableLoading(false);
    }, []);

    const executeRecovery = useCallback(async (executingWalletAddr) => {
        const executingRecoveryContract = getWalletContract(executingWalletAddr);
        const tx = await executingRecoveryContract.populateTransaction.executeRecovery();
        setIsTableLoading(true);
        await executeAA(tx, "Recovery executed successfully", "Error executing recovery");
        setIsTableLoading(false);
    }, []);

    useEffect(() => {
        getRecoveryRequests();
    }, []);

    useEffect(() => {
        if (!targetWalletContract) return;
        targetWalletContract.on(
            "RecoveryInitiated",
            (walletAddr, recoveryCycle, newSigningAddress, requiredGuardians, initiator) => {
                const handleRecoveryRequestsData = async () => {
                    const convertedRecoveryCycle = parseInt(
                        ethers.utils.formatEther(recoveryCycle) * 10 ** 18
                    );
                    const approvals = {};
                    for (let i = 0; i < requiredGuardians.length; i++) {
                        approvals[requiredGuardians[i]] = false;
                    }
                    approvals[initiator] = true;
                    const id = generateFbId(walletAddr, recoveryCycle);
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

    useEffect(() => {
        targetWalletContract.on(
            "RecoverySupported",
            (walletAddr, recoverIndex, guardianSupported) => {
                const handleRecoverSupported = async () => {
                    try {
                        const id = generateFbId(walletAddr, recoverIndex);
                        await setDoc(
                            doc(firestoreDb, "recovery-requests", id),
                            {
                                approvals: { [`${guardianSupported}`]: true },
                            },
                            { merge: true }
                        );
                        await getRecoveryRequests();
                    } catch (e) {
                        console.log("error: ", e);
                    }
                };
                handleRecoverSupported();
            }
        );
    }, []);

    useEffect(() => {
        targetWalletContract.on("RecoveryExecuted", (walletAddr, recoverIndex) => {
            const handleRecoverExecuted = async () => {
                try {
                    const id = generateFbId(walletAddr, recoverIndex);
                    const recoveryRef = doc(firestoreDb, "recovery-requests", id);
                    const recoverySnap = await getDoc(recoveryRef);
                    const newSigningAddress = recoverySnap.data().newSigningAddress;
                    await setDoc(
                        doc(firestoreDb, "wallets", walletAddr),
                        {
                            signingAddr: newSigningAddress,
                        },
                        { merge: true }
                    );
                    await setDoc(
                        doc(firestoreDb, "recovery-requests", id),
                        {
                            isActive: false,
                        },
                        { merge: true }
                    );
                    await getRecoveryRequests();
                } catch (e) {
                    console.log("error: ", e);
                }
            };
            handleRecoverExecuted();
        });
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
        supportRecovery,
        executeRecovery,
    };
};
