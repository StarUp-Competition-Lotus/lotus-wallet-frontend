import styles from "../styles/Home.module.css";

import Navigation from "./Navigation";

export default function PageLayout({ children }) {
    return (
        <div className={styles.app}>
            <div className={styles.navigation}>
                <Navigation />
            </div>
            <div className={styles.body}>{children}</div>
        </div>
    );
}
