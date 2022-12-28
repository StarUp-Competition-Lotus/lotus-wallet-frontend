import { useContext } from "react";
import { WalletContext } from "./walletContext";

export default () => {
    const walletContext = useContext(WalletContext);
    const { walletAddr, signingKey } = walletContext;

    const createNewWallet = () => {

    }

    return {
        createNewWallet
    }
};
