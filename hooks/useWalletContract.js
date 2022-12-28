import { useContext } from "react";
import { Wallet, Contract } from "zksync-web3";
import { WalletContext } from "./walletContext";
import { provider } from "../constants/main";
import { WALLET_ABI } from "../constants/walletSC";

export default () => {
    const walletContext = useContext(WalletContext);
    const { walletAddr, signingKey } = walletContext;
    const signingAccount = signingKey ? new Wallet(signingKey).connect(provider) : null;
    const walletContract =
        walletAddr && signingAccount ? new Contract(walletAddr, WALLET_ABI, signingAccount) : null;
    return { walletContract, walletAddr, signingKey };
};
