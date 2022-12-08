import styles from "../styles/Home.module.css";

import Navigation from "../components/Navigation";
import ProtectingWallets from "../components/protectingWallets";

export default () => {
    return (
        <div className={styles.app}>
            <div className={styles.navigation}>
                <Navigation />
            </div>
            <div className={styles.body}>
                <ProtectingWallets />
            </div>
        </div>
    );
}
