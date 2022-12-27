export const shortenAddress = (address) => {
    return `${address.slice(0, 10)}...${address.slice(-4)}`;
};

export const roundedNumber = (num) => {
    return Math.round(num * 10000) / 10000
}