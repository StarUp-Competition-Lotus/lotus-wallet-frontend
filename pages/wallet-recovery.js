import { useRouter } from "next/router";
import useWalletContract from "../hooks/useWalletContract";
import PageLayout from "../components/PageLayout";
import WalletRecovery from "../components/wallet-recovery";

export default () => {
    const { walletAddr, signingKey } = useWalletContract();
    const router = useRouter();

    if (!walletAddr && !signingKey) {
        typeof window !== "undefined" && router.push("/welcome");
        return;
    }

    return (
        <PageLayout>
            <WalletRecovery />
        </PageLayout>
    );
};
