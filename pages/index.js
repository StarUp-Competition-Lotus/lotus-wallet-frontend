import Head from "next/head";
import { useRouter } from "next/router";

import useWalletContract from "../hooks/useWalletContract";
import SpinningScreen from "../components/SpinningScreen";
import PageLayout from "../components/PageLayout";
import Vault from "../components/vault";

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
                <title>Lotus | Vault</title>
                <link rel="icon" href="/logo.png" />
            </Head>
            <Vault />
        </PageLayout>
    );
};
