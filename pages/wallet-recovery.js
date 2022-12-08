import styles from "../styles/Home.module.css";

import Navigation from "../components/Navigation";
import WalletRecovery from "../components/wallet-recovery";

export default () => {
    return (
        <div className={styles.app}>
            <div className={styles.navigation}>
                <Navigation />
            </div>
            <div className={styles.body}>
                <WalletRecovery />
            </div>
        </div>
    );
};
