import * as ethers from "ethers";

export const shortenAddress = (address) => {
    return `${address.slice(0, 10)}...${address.slice(-4)}`;
};

export const roundedNumber = (num) => {
    return Math.round(num * 10000) / 10000;
};

export const generateFbId = (walletAddr, index) => {
    return ethers.utils.keccak256(
        ethers.utils.toUtf8Bytes(walletAddr + parseInt(ethers.utils.formatEther(index) * 10 ** 18))
    );
};
