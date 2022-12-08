import PageContent from "../PageContent";
import WithdrawRequestsTable from "./WithdrawRequestsTable";

const WithdrawApprovals = () => {
    const contentList = [
        {
            section: "Withdraw Requests",
            component: <WithdrawRequestsTable />,
        },
    ];

    return <PageContent title="Withdraw Requests" contentList={contentList} />;
};

export default WithdrawApprovals;
