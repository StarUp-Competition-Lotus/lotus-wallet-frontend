import { useMemo } from "react";
import { Table, Popconfirm, Tooltip, Empty } from "antd";
import { CiCircleCheck } from "react-icons/ci";
import { BsCheck2All } from "react-icons/bs";

import { shortenAddress } from "../../utils/utils";

import useWalletApproveWithdraw from "../../hooks/useWalletApproveWithdraw";
import useWalletContract from "../../hooks/useWalletContract";

const getApprovedNum = (approvals) => {
    let approvedNum = 0;
    for (const guardian in approvals) {
        if (approvals[guardian]) {
            approvedNum++;
        }
    }
    return approvedNum;
};

const WithdrawRequestsTable = () => {
    const { walletAddr } = useWalletContract();
    const {
        withdraws,
        notificationContextHolder,
        isTableLoading,
        approveWithdrawRequest
    } = useWalletApproveWithdraw();

    const columns = useMemo(
        () => [
            {
                title: "From",
                dataIndex: "from",
                key: "from",
                render: (from) => (
                    <Tooltip placement="topLeft" title={from}>
                        <p style={{ color: "#1777FE" }}>{shortenAddress(from)}</p>
                    </Tooltip>
                ),
            },
            {
                title: "To",
                dataIndex: "to",
                key: "to",
                render: (to) => (
                    <Tooltip placement="topLeft" title={to}>
                        <p style={{ color: "#3c4048" }}>{shortenAddress(to)}</p>
                    </Tooltip>
                ),
            },
            {
                title: "Approvals",
                dataIndex: "approvals",
                key: "approvals",
                render: (approvals) => {
                    const guardiansNum = Object.keys(approvals).length;
                    const approvedNum = getApprovedNum(approvals);
                    return (
                        <p style={{ color: "#3c4048" }}>
                            {approvedNum}/{guardiansNum}
                        </p>
                    );
                },
            },
            {
                title: <p style={{ textAlign: "center" }}>Support</p>,
                dataIndex: "approvals",
                key: "approvals",
                render: (approvals, record) => {
                    return approvals[walletAddr] ? (
                        <Tooltip title="Approve">
                            <div
                                style={{
                                    display: "flex",
                                    justifyContent: "center",
                                    alignContent: "center",
                                }}
                            >
                                <BsCheck2All color="#1777FE" size={30} />
                            </div>
                        </Tooltip>
                    ) : (
                        <Popconfirm
                            title="Approve this withdraw?"
                            okText="Approve"
                            icon={null}
                            onConfirm={() => {
                                approveWithdrawRequest(record.index, record.from);
                            }}
                        >
                            <div
                                style={{
                                    display: "flex",
                                    justifyContent: "center",
                                    alignContent: "center",
                                }}
                            >
                                <CiCircleCheck color="#1777FE" size={30} />
                            </div>
                        </Popconfirm>
                    );
                },
            },
        ]
    );

    const data = useMemo(() => {
        return withdraws;
    }, [withdraws])

    return (
        <div className="table-container">
            {notificationContextHolder}
            {data.length === 0 && !isTableLoading ? (
                <Empty description="You don't have any withdraw request to approve" />
            ) : (
                <Table
                    columns={columns}
                    dataSource={data}
                    pagination={{ hideOnSinglePage: true, pageSize: 3, position: ["bottomCenter"] }}
                    bordered={true}
                    loading={isTableLoading}
                />
            )}
        </div>
    );
};

export default WithdrawRequestsTable;
