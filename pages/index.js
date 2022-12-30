import { useRouter } from "next/router";
import useWalletContract from "../hooks/useWalletContract";
import { Spin } from "antd";
import PageLayout from "../components/PageLayout";
import Vault from "../components/vault";

export default () => {
    const { walletAddr, signingKey, isLoadingFromLS } = useWalletContract();
    const router = useRouter();

    if (isLoadingFromLS) return <Spin size="large" style={{ marginTop: "20vh" }} />;

    if (!walletAddr && !signingKey && !isLoadingFromLS) {
        typeof window !== "undefined" && router.push("/welcome");
        return;
    }

    return (
        <PageLayout>
            <Vault />
        </PageLayout>
    );
};
