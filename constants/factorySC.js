import { Contract } from "zksync-web3";
import { deployAccount } from "./main";

export const FACTORY_ADDRESS = "0x8Fc1005D71cefF1D4b99c25b828a47c9135DCD82";
export const FACTORY_ABI = [
    {
        inputs: [
            {
                internalType: "bytes32",
                name: "_aaBytecodeHash",
                type: "bytes32",
            },
        ],
        stateMutability: "nonpayable",
        type: "constructor",
    },
    {
        anonymous: false,
        inputs: [
            {
                indexed: true,
                internalType: "address",
                name: "walletAddress",
                type: "address",
            },
            {
                indexed: true,
                internalType: "address",
                name: "signingAddress",
                type: "address",
            },
        ],
        name: "WalletCreated",
        type: "event",
    },
    {
        inputs: [],
        name: "aaBytecodeHash",
        outputs: [
            {
                internalType: "bytes32",
                name: "",
                type: "bytes32",
            },
        ],
        stateMutability: "view",
        type: "function",
    },
    {
        inputs: [
            {
                internalType: "bytes32",
                name: "salt",
                type: "bytes32",
            },
            {
                internalType: "address",
                name: "signingAddress",
                type: "address",
            },
        ],
        name: "deployWallet",
        outputs: [
            {
                internalType: "address",
                name: "walletAddress",
                type: "address",
            },
        ],
        stateMutability: "nonpayable",
        type: "function",
    },
];

const factoryContract = new Contract(FACTORY_ADDRESS, FACTORY_ABI, deployAccount);
export default factoryContract;
