import PageContent from "../PageContent";
import ProtectingWalletsTable from "./ProtectingWalletsTable";

const ProtectingWallets = () => {
    const contentList = [
        {
            section: "Protecting Wallets",
            component: <ProtectingWalletsTable />,
        },
    ];

    return <PageContent title="Protecting Wallets" contentList={contentList} />;
};

export default ProtectingWallets;
