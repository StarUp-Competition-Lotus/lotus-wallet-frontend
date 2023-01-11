/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: false,
    env: {
        PRIVATE_KEY: process.env.PRIVATE_KEY,
        ALLOW_CREATE_WALLET: process.env.ALLOW_CREATE_WALLET,
    },
};

module.exports = nextConfig;
