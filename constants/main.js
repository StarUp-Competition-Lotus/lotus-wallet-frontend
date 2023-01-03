import { Provider, Wallet } from "zksync-web3";

const PRIVATE_KEY = process.env.PRIVATE_KEY;

export const provider = new Provider("https://zksync2-testnet.zksync.dev");
export const deployAccount = new Wallet(PRIVATE_KEY).connect(provider);