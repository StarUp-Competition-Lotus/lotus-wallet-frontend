import { useState, useEffect, createContext } from "react";

export const WalletContext = createContext();

const WALLET_ADDRESS = "0x895A9189411cd81a65f944249df92463b4c264FE";
const SIGNING_KEY = "0x46ef21917e713ed1b103d060fa9733fd631da8c2406a54e22c1cb67a93e1394c";

export const WalletContextProvider = ({ children }) => {
    const [walletAddr, setWalletAddr] = useState(WALLET_ADDRESS);
    const [signingKey, setSigningKey] = useState(SIGNING_KEY);

    useEffect(() => {}, []);

    return (
        <WalletContext.Provider value={{ walletAddr, setWalletAddr, signingKey, setSigningKey }}>
            {children}
        </WalletContext.Provider>
    );
};
