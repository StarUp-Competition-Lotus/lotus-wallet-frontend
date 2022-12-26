import { Provider, Wallet } from "zksync-web3";

const PRIVATE_KEY = "8ed772c06d5241f5b82ee5b950dabc21c11916d4fdcd6053d3b0ff864c00c9c0";

export const provider = new Provider("https://zksync2-testnet.zksync.dev");
export const deployAccount = new Wallet(PRIVATE_KEY).connect(provider);