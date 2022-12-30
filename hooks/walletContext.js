import { useState, useEffect, createContext } from "react";

export const WalletContext = createContext();

export const WalletContextProvider = ({ children }) => {
    const [isLoadingFromLS, setIsLoadingFromLS] = useState(true);
    const [walletAddr, setWalletAddr] = useState();
    const [signingKey, setSigningKey] = useState();

    useEffect(() => {
        const walletAddr = localStorage.getItem("WalletAddress");
        const signingKey = localStorage.getItem("SigningKey");
        if (walletAddr && signingKey) {
            setWalletAddr(walletAddr);
            setSigningKey(signingKey);
        }
        setIsLoadingFromLS(false);
    }, [setIsLoadingFromLS]);

    return (
        <WalletContext.Provider
            value={{
                walletAddr,
                setWalletAddr,
                signingKey,
                setSigningKey,
                isLoadingFromLS,
                setIsLoadingFromLS,
            }}
        >
            {children}
        </WalletContext.Provider>
    );
};
