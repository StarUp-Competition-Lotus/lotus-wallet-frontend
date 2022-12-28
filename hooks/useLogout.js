import { useContext } from "react";
import { WalletContext } from "./walletContext";

export default () => {
    const walletContext = useContext(WalletContext);
    const { setWalletAddr, setSigningKey } = walletContext;

    const logout = () => {
        setWalletAddr(null);
        setSigningKey(null);
        localStorage.removeItem("WalletAddress");
        localStorage.removeItem("SigningKey");
    };

    return { logout };
};