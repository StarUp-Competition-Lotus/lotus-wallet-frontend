import PageContent from "../PageContent";
import WithdrawsTable from "./WithdrawsTable";

const Withdraws = () => {
    const contentList = [
        {
            section: "Withdraw Requests",
            component: <WithdrawsTable />,
        },
    ];

    return <PageContent title="Withdraw Requests" contentList={contentList} />;
};

export default Withdraws;