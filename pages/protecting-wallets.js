import Head from "next/head";
import { useRouter } from "next/router";

import useWalletContract from "../hooks/useWalletContract";
import SpinningScreen from "../components/SpinningScreen";
import PageLayout from "../components/PageLayout";
import ProtectingWallets from "../components/protectingWallets";

export default () => {
    const { walletAddr, signingKey, isLoadingFromLS } = useWalletContract();
    const router = useRouter();

    if (isLoadingFromLS) return <SpinningScreen />;

    if (!walletAddr && !signingKey && !isLoadingFromLS) {
        typeof window !== "undefined" && router.push("/welcome");
        return;
    }

    return (
        <PageLayout>
            <Head>
                <title>Lotus | Protecting Wallets</title>
                <link rel="icon" href="/logo.png" />
            </Head>
            <ProtectingWallets />
        </PageLayout>
    );
};
