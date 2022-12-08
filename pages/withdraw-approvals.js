import styles from "../styles/Home.module.css";

import Navigation from "../components/Navigation";

export default function WithdrawApprovals() {
    return (
        <div className={styles.app}>
            <div className={styles.navigation}>
                <Navigation />
            </div>
            withdraw approvals
        </div>
    );
}