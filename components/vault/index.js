import PageContent from "../PageContent";
import Balances from "./Balances";

const Vault = () => {
    const contentList = [
        {
            section: "Vault",
            component: <Balances />,
        },
    ];

    return <PageContent title="Vault" contentList={contentList} />;
};

export default Vault;