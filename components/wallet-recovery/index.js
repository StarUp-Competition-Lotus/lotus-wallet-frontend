import PageContent from "../PageContent";
import WalletRecoveryTable from "./WalletRecoveryTable";

const WalletRecovery = () => {
    const contentList = [
        {
            section: "Wallet Recovery",
            component: <WalletRecoveryTable />,
        },
    ];

    return <PageContainer title="Wallet Recovery" contentList={contentList} />;
};

export default WalletRecovery;