import styles from "../styles/Home.module.css";

import Navigation from "../components/Navigation";
import MyGuardians from "../components/myGuardians";

export default () => {
    return (
        <div className={styles.app}>
            <div className={styles.navigation}>
                <Navigation />
            </div>
            <div className={styles.body}>
                <MyGuardians />
            </div>
        </div>
    );
}