import { useState, useCallback, useEffect } from "react";
import { doc, setDoc, collection, query, where, getDocs } from "firebase/firestore";
import firestoreDb from "../firebase";

import useAATransaction from "./useAATransaction";
import useWalletContract from "./useWalletContract";

export default () => {
    const [withdraws, setWithdraws] = useState([]);
    const [isTableLoading, setIsTableLoading] = useState(false);

    const { walletContract, walletAddr } = useWalletContract();
    const { executeAA, notificationContextHolder } = useAATransaction();

    const approveWithdrawRequest = useCallback(async (index, sender) => {
        setIsTableLoading(true)

        let tx = await walletContract.populateTransaction.approveWithdrawRequest(index);
        tx = {
            ...tx,
            to: sender
        }
        await executeAA(tx, "Withdraw request approved successfully", "Error approving withdraw request");

        const handleWithdrawRequestApproved = async () => {
            const docRef = doc(firestoreDb, "withdraws", sender.toString(16) + index.toString(16));
            await setDoc(docRef, {
                requiredGuardians: { 
                    [`${walletAddr}`]: true 
                },
            }, {merge: true});
            await getActiveWithdraws();
        }
        handleWithdrawRequestApproved();
        setIsTableLoading(false)
    });

    const getActiveWithdraws = useCallback(async () => {
        setIsTableLoading(true)
        let subWithdraws = [];

        const querySnapshot = await getDocs(
            collection(firestoreDb, "withdraws"),
            where("isActive", "==", true)
        );

        querySnapshot.forEach((doc) => {
            if (
                doc.data().requiredGuardians[walletAddr] !== undefined && 
                withdraws.filter(w => w.index === doc.data().index).length == 0) {
                    if (doc.data().requiredGuardians[walletAddr] == false) {
                        subWithdraws.push({
                            from: doc.id.substring(0, 42),
                            to: doc.data().receiver,
                            index: doc.data().index
                        })
                    }
            }
        });

        if (subWithdraws.length > 0 || withdraws.length == 0) {
            setWithdraws(withdraws.concat(subWithdraws)) 
        }
        
        setIsTableLoading(false)
    }, []);

    useEffect(() => {
        getActiveWithdraws();
    }, [])

    return {
        withdraws,
        notificationContextHolder,
        isTableLoading,
        approveWithdrawRequest
    };
}