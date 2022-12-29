import { useState, useCallback, useEffect } from "react";
import { doc, setDoc, collection } from "firebase/firestore";
import firestoreDb from "../firebase";
import * as ethers from "ethers";
import useAATransaction from "./useAATransaction";
import useWalletContract from "./useWalletContract";

export default () => {
    const [recoveryRequests, setRecoveryRequests] = useState([]);
    const [isTransacting, setIsTransacting] = useState(false);
    const [isTableLoading, setIsTableLoading] = useState(false);
    const [recoverWalletInput, setRecoverWalletInput] = useState("");
    const [newSigningAddrInput, setNewSigningAddrInput] = useState("");

    const { walletContract, getWalletContract } = useWalletContract();
    const { executeAA, notificationContextHolder } = useAATransaction();

    const targetWalletContract = getWalletContract(recoverWalletInput);
    const initiateRecovery = useCallback(async () => {
        const tx = await targetWalletContract.populateTransaction.initiateRecovery(
            newSigningAddrInput
        );
        setIsTransacting(true);
        await executeAA(tx, "Recovery initiated successfully", "Error initiating recovery");
        setIsTransacting(false);
    }, [recoverWalletInput, newSigningAddrInput]);

    useEffect(() => {
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
                    });
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
    };
};
