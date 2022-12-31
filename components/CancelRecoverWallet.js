import { useEffect, useState, useCallback, useContext } from "react";
import { doc, setDoc } from "firebase/firestore";
import { Alert, Button } from "antd";
import { CiWarning } from "react-icons/ci";

import useWalletContract from "../hooks/useWalletContract";
import useAATransaction from "../hooks/useAATransaction";
import firestoreDb from "../firebase";
import { generateFbId } from "../utils/utils";
import { RecoveryStateContext } from "./PageLayout";

const CancelRecoverWallet = () => {
    const [isCancellingRecovery, setIsCancellingRecovery] = useState(false);

    const { updateWalletState } = useContext(RecoveryStateContext);
    const { walletContract } = useWalletContract();
    const { executeAA, notificationContextHolder } = useAATransaction();

    const cancelRecovery = useCallback(async () => {
        setIsCancellingRecovery(true);
        const tx = await walletContract.populateTransaction.cancelRecovery();
        await executeAA(tx, "Cancelled recovery successfully", "Error cancelling recovery");
        setIsCancellingRecovery(false);
    }, [walletContract]);

    useEffect(() => {
        walletContract.on("RecoveryCanceled", (walletAddr, recoverIndex) => {
            // setIsInRecovery(false);
            const handleRecoveryCanceled = async () => {
                const id = generateFbId(walletAddr, recoverIndex);
                const requestRef = doc(firestoreDb, "recovery-requests", id);
                setDoc(requestRef, { isActive: false }, { merge: true });
                await updateWalletState();
            };
            handleRecoveryCanceled();
        });
    }, []);

    return (
        <>
            {notificationContextHolder}
            <Alert
                banner
                type="error"
                icon={<CiWarning size={20} color="#ff4d4e" />}
                message="The Wallet is currently in Recovery state."
                action={
                    <Button
                        type="link"
                        danger
                        loading={isCancellingRecovery}
                        onClick={cancelRecovery}
                    >
                        Cancel Recovery
                    </Button>
                }
            />
        </>
    );
};

export default CancelRecoverWallet;
