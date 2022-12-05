import Head from "next/head";
import styles from "../styles/Home.module.css";

import Navigation from "../components/Navigation";

export default function Home() {
    return (
        <div className={styles.app}>
            <div className={styles.navigation}>
                <Navigation />
            </div>
            vault
        </div>
    );
}