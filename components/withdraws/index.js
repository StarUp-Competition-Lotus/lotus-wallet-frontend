import PageContent from "../PageContent";
import WithdrawsTable from "./WithdrawsTable";

const Withdraws = () => {
    const contentList = [
        {
            section: "My Withdraw Requests",
            component: <WithdrawsTable />,
        },
    ];

    return <PageContent title="My Withdraw Requests" contentList={contentList} />;
};

export default Withdraws;