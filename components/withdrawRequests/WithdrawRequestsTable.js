import { Table, Popconfirm, Tooltip } from "antd";
import { CiCircleCheck } from "react-icons/ci";

import { shortenAddress } from "../../utils";

const guardiansCount = 3;

const columns = [
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
        render: (approvals) => (
            <p style={{ color: "#3c4048" }}>
                {approvals}/{guardiansCount}
            </p>
        ),
    },
    {
        title: "",
        dataIndex: "",
        key: "",
        render: () => (
            <Popconfirm title="Approve this withdraw?" okText="Approve" icon={null}>
                <div style={{ display: "flex", justifyContent: "center", alignContent: "center" }}>
                    <CiCircleCheck color="#1777FE" size={30} />
                </div>
            </Popconfirm>
        ),
    },
];

const data = [
    {
        from: "0xb607A500574fE29afb0d0681f1dC3E82f79f4877",
        to: "0x5FcF81463a2A63c10F51c4F9D55Fb7403759C8B9",
        approvals: 2,
    },
    {
        from: "0x5FcF81463a2A63c10F51c4F9D55Fb7403759C8B9",
        to: "0xb607A500574fE29afb0d0681f1dC3E82f79f4877",
        approvals: 1,
    },
];

const WalletRecoveryTable = () => {
    return (
        <div className="table-container">
            <Table
                columns={columns}
                dataSource={data}
                pagination={{ hideOnSinglePage: true, pageSize: 3, position: ["bottomCenter"] }}
                bordered={true}
            />
        </div>
    );
};

export default WalletRecoveryTable;
