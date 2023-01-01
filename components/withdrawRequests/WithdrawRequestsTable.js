import { useState, useMemo } from "react";
import { Table, Popconfirm, Tooltip, Empty } from "antd";
import { CiCircleCheck } from "react-icons/ci";

import { shortenAddress } from "../../utils/utils";
import useWalletApproveWithdraw from "../../hooks/useWalletApproveWithdraw";

const WalletRecoveryTable = () => {
    const {
        withdraws,
        notificationContextHolder,
        isTableLoading,
        approveWithdrawRequest
    } = useWalletApproveWithdraw();

    const columns = [
        {
            title: "",
            dataIndex: "index",
            key: "index",
        },
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
            title: "",
            dataIndex: "index",
            key: "",
            render: (index, currentWithdraw) => (
                <Popconfirm title="Approve this withdraw?" okText="Approve" icon={null} onConfirm={() => {approveWithdrawRequest(index, currentWithdraw.from)}}>
                    <div style={{ display: "flex", justifyContent: "center", alignContent: "center" }}>
                        <CiCircleCheck color="#1777FE" size={30} />
                    </div>
                </Popconfirm>
            ),
        },
    ];

    const data = useMemo(() => {
        return withdraws;
    }, [withdraws])

    return (
        <div className="table-container">
            {notificationContextHolder}
            {data.length === 0 ? (
                <Empty description="You don't make any Withdraw Request at the moment" />
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

export default WalletRecoveryTable;
