import { useState, useEffect, useCallback } from "react";
import { doc, getDocs, setDoc, collection } from "firebase/firestore";
import { parseUnits, formatEther } from "ethers/lib/utils";
import firestoreDb from "../firebase";

import useWalletContract from "../hooks/useWalletContract";
import useAATransaction from "../hooks/useAATransaction";

export default () => {
    const [newWithdrawAmount, setNewWithdrawAmount] = useState("");
    const [newWithdrawReceiver, setNewWithdrawReceiver] = useState("")
    const [withdraws, setWithdraws] = useState([]);
    const [guardians, setGuardians] = useState([]);
    const [withdrawRequestCount, setwithdrawRequestCount] = useState(0);
    const [isTableLoading, setIsTableLoading] = useState(false);
    const [isTransacting, setIsTransacting] = useState(false);

    const { walletContract, walletAddr } = useWalletContract();
    const { executeAA, notificationContextHolder } = useAATransaction();

    const bigNumberToInt = (bigNumber) => {
        return parseInt(parseFloat(formatEther(bigNumber, 18)) * 10 ** 18);
    }

    const getActiveWithdraws = useCallback(async () => {
        setIsTableLoading(true)
        let subWithdraws = [];

        const querySnapshot = await getDocs(collection(firestoreDb, "withdraws"))
        querySnapshot.forEach((doc) => {
            if (doc.id.substring(0, 42) == walletAddr && withdraws.filter(w => w.index == doc.data().index).length == 0 && doc.data().isActive) {
                subWithdraws.push({
                    receiver: doc.data().receiver,
                    amount: doc.data().amount / 10 ** 18,
                    index: doc.data().index,
                    guardianApprovals: doc.data().requiredGuardians
                });
            }
        });

        if (subWithdraws.length > 0 || withdraws.length == 0) {
            setWithdraws(withdraws.concat(subWithdraws)) 
        }
        
        setIsTableLoading(false)
    }, [walletAddr]);

    const createWithdrawRequest = useCallback(async () => {
        setIsTableLoading(true);
        setIsTransacting(true);
        
        const tx = await walletContract.populateTransaction.createWithdrawRequest(parseUnits((newWithdrawAmount), "ether"), newWithdrawReceiver);
        await executeAA(tx, "Withdraw request created successfully", "Error creating withdraw request");
        
        setIsTransacting(false);
        setIsTableLoading(false);
        setNewWithdrawAmount("");
        setNewWithdrawReceiver("");
    });

    const cancelWithdrawRequest = useCallback(async (index) => {
        setIsTableLoading(true)
        setIsTransacting(true)
        const tx = await walletContract.populateTransaction.cancelWithdrawRequest(index);
        await executeAA(tx, "Withdraw request cancelled successfully", "Error cancelling withdraw request");
        setIsTransacting(false);
        setIsTableLoading(false);
    });

    const executeWithdrawRequest = useCallback(async (index) => {
        setIsTableLoading(true)
        setIsTransacting(true)
        const tx = await walletContract.populateTransaction.executeWithdrawRequest(index);
        await executeAA(tx, "Withdraw request executed successfully", "Error executing withdraw request");
        setIsTransacting(false);
        setIsTableLoading(false);
    });

    useEffect(() => {
        walletContract.on("WithdrawRequestCreated", (walletAddr, withdrawIndex, receiver, amount, requiredGuardians) => {
            const withdrawIndexInt = bigNumberToInt(withdrawIndex) - 1;
            const requiredGuardiansMap = Object.assign({}, ...requiredGuardians.map(g => ({[g]: false})))
            const handleWithdrawRequestAdded = async () => {
                const docRef = doc(firestoreDb, "withdraws", walletAddr.toString(16) + withdrawIndexInt.toString(16));
                await setDoc(docRef, {
                    amount: bigNumberToInt(amount),
                    index: withdrawIndexInt,
                    receiver: receiver,
                    isActive: true,
                    walletAddr: walletAddr,
                    requiredGuardians: requiredGuardiansMap
                });
                await getActiveWithdraws();
            }
            handleWithdrawRequestAdded();
        })
    }, []);

    useEffect(() => {
        walletContract.on("WithdrawRequestCanceled", (walletAddr, withdrawIndex) => {
            const withdrawIndexInt = bigNumberToInt(withdrawIndex);
            const handleWithdrawRequestAdded = async () => {
                const docRef = doc(firestoreDb, "withdraws", walletAddr.toString(16) + withdrawIndexInt.toString(16));
                await setDoc(docRef, {
                    isActive: false,
                }, {merge: true});
                await getActiveWithdraws();
            }
            handleWithdrawRequestAdded();
        })
    }, []);

    useEffect(() => {
        walletContract.on("WithdrawRequestExecuted", (walletAddr, withdrawIndex) => {
            const withdrawIndexInt = bigNumberToInt(withdrawIndex);
            const handleWithdrawRequestExecuted = async () => {
                const docRef = doc(firestoreDb, "withdraws", walletAddr.toString(16) + withdrawIndexInt.toString(16));
                await setDoc(docRef, {
                    isActive: false,
                }, {merge: true});
                await getActiveWithdraws();
            }
            handleWithdrawRequestExecuted();
        });
    }, []);

    useEffect(() => {
        walletContract.on("WithdrawRequestApproved", (walletAddr, withdrawIndex, guardianApproved) => {
            const withdrawIndexInt = bigNumberToInt(withdrawIndex);
            const handleWithdrawRequestApproved = async () => {
                const docRef = doc(firestoreDb, "withdraws", walletAddr.toString(16) + withdrawIndexInt.toString(16));
                await setDoc(docRef, {
                    isActive: false,
                }, {merge: true});
                await getActiveWithdraws();
            }
            handleWithdrawRequestApproved();
        });
    }, []);

    useEffect(() => {
        getActiveWithdraws();
    }, []);

    return {
        newWithdrawAmount,
        setNewWithdrawAmount,
        newWithdrawReceiver,
        setNewWithdrawReceiver,
        withdraws,
        isTableLoading,
        isTransacting,
        notificationContextHolder,
        createWithdrawRequest,
        cancelWithdrawRequest,
        executeWithdrawRequest
    };
};
