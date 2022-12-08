import PageContainer from "../PageContainer";
import ProtectingWalletsTable from "./ProtectingWalletsTable";

const ProtectingWallets = () => {
    const contentList = [
        {
            section: "Protecting Wallets",
            component: <ProtectingWalletsTable />,
        },
    ];

    return <PageContainer title="Protecting Wallets" contentList={contentList} />;
};

export default ProtectingWallets;
