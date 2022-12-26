import { WalletContextProvider } from "../hooks/walletContext";
import "../styles/globals.css";
import "../styles/navigation.css";
import "../styles/page-content.css";
import "../styles/vault.css";

function MyApp({ Component, pageProps }) {
    return (
        <WalletContextProvider>
            <Component {...pageProps} />;
        </WalletContextProvider>
    );
}

export default MyApp;
