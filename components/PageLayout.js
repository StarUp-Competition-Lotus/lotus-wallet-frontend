import { useState, useEffect, createContext } from "react";
import styles from "../styles/Home.module.css";
import Navigation from "./Navigation";
import CancelRecoverWallet from "./CancelRecoverWallet";

import useWalletContract from "../hooks/useWalletContract";

export const RecoveryStateContext = createContext();

export default function PageLayout({ children }) {
    const [isInRecovery, setIsInRecovery] = useState(false);

    const { walletContract } = useWalletContract();

    const updateWalletState = async () => {
        try {
            const state = await walletContract.getRecoveryState();
            setIsInRecovery(state);
        } catch (e) {
            console.log(e);
        }
    };

    useEffect(() => {
        updateWalletState();
    }, [updateWalletState]);

    return (
        <RecoveryStateContext.Provider value={{ isInRecovery, updateWalletState }}>
            <div className={styles.app}>
                <div className={styles.navigation}>
                    <Navigation />
                </div>
                <div className={styles.body}>
                    {isInRecovery && <CancelRecoverWallet />}
                    <div style={{ margin: "auto" }}>{children}</div>
                </div>
            </div>
        </RecoveryStateContext.Provider>
    );
}
