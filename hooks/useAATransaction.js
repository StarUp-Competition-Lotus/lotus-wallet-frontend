import useWalletContract from "./useWalletContract";
import useNotification from "./useNotification";
import { executeAAWalletTransaction } from "../utils/aa";

export default () => {
    const { walletAddr, signingKey } = useWalletContract();
    const { raiseSuccess, raiseFailure, notificationContextHolder } = useNotification();

    const executeAA = async (tx, successMessage, failureMessage) => {
        try {
            await executeAAWalletTransaction(walletAddr, signingKey, tx);
            raiseSuccess(successMessage);
        } catch (e) {
            console.log("error: ", e);
            raiseFailure(failureMessage);
            return e;
        }
    };

    return { executeAA, notificationContextHolder};
};
