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

    const getGuardians = async () => {
        try {
            const guardians = await walletContract.getGuardians();
            setGuardians(guardians);
        } catch (e) {
            console.log("error: ", e);
            raiseFailure("Error loading guardian");
        }

    };

    const getWithdrawRequestsCount = async () => {
        try {
            const withdrawRequestCount = await walletContract.getWithdrawRequestsCount();
            setwithdrawRequestCount(bigNumberToInt(withdrawRequestCount));
        } catch (e) {
            console.log("error: ", e);
            raiseFailure("Error loading guardian");
        }
    };

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

        console.log('getting withdraws: ', subWithdraws)

        if (subWithdraws.length > 0 || withdraws.length == 0) {
            setWithdraws(withdraws.concat(subWithdraws)) 
        }
        
        setIsTableLoading(false)
    }, []);

    const createWithdrawRequest = useCallback(async () => {
        setIsTransacting(true);
        const tx = await walletContract.populateTransaction.createWithdrawRequest(parseUnits((newWithdrawAmount), "ether"), newWithdrawReceiver);
        await executeAA(tx, "Withdraw request created successfully", "Error creating withdraw request");
        setIsTransacting(false);
        setNewWithdrawAmount("");
        setNewWithdrawReceiver("");
    });

    const cancelWithdrawRequest = useCallback(async (index) => {
        setIsTableLoading(true)
        const tx = await walletContract.populateTransaction.cancelWithdrawRequest(index);
        await executeAA(tx, "Withdraw request cancelled successfully", "Error cancelling withdraw request");
    });

    const executeWithdrawRequest = useCallback(async (index) => {
        setIsTableLoading(true)
        const tx = await walletContract.populateTransaction.executeWithdrawRequest(index);
        await executeAA(tx, "Withdraw request executed successfully", "Error executing withdraw request");
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
            setIsTableLoading(false)
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
            setIsTableLoading(false)
        });
    }, []);

    useEffect(() => {
        walletContract.on("WithdrawRequestApproved", (walletAddr, withdrawIndex, guardianApproved) => {
            const withdrawIndexInt = bigNumberToInt(withdrawIndex) - 1;
            const handleWithdrawRequestApproved = async () => {
                const docRef = doc(firestoreDb, "withdraws", walletAddr.toString(16) + withdrawIndexInt.toString(16));
                await setDoc(docRef, {
                    requiredGuardians: {
                        [guardianApproved]: true
                    }
                }, {merge: true});
                await getActiveWithdraws();
            }
            handleWithdrawRequestApproved();
        });
    }, []);

    useEffect(() => {
        getGuardians();
        getWithdrawRequestsCount();
        getActiveWithdraws();
    }, []);

    return {
        newWithdrawAmount,
        setNewWithdrawAmount,
        newWithdrawReceiver,
        setNewWithdrawReceiver,
        withdraws,
        withdrawRequestCount,
        isTableLoading,
        isTransacting,
        notificationContextHolder,
        createWithdrawRequest,
        cancelWithdrawRequest,
        executeWithdrawRequest
    };
};
