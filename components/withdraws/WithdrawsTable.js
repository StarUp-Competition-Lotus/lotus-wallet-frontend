import { useState } from "react";
import { Table, Button, Modal, Input, Popconfirm, Tooltip } from "antd";
import { CiCircleMinus } from "react-icons/ci";

import { shortenAddress } from "../../utils";

const guardiansCount = 3;

const columns = [
    {
        title: "To",
        dataIndex: "to",
        key: "to",
        render: (to) => (
            <Tooltip placement="topLeft" title={to}>
                <p style={{ color: "#1777FE" }}>{shortenAddress(to)}</p>
            </Tooltip>
        ),
    },
    {
        title: "Amount",
        dataIndex: "amount",
        key: "amount",
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
            <Popconfirm title="Cancel this request?" okText="Cancel" icon={null}>
                <div style={{ display: "flex", justifyContent: "center", alignContent: "center" }}>
                    <CiCircleMinus color="#DC3535" size={30} />
                </div>
            </Popconfirm>
        ),
    },
];

const data = [
    {
        to: "0xb607A500574fE29afb0d0681f1dC3E82f79f4877",
        amount: 0.01,
        approvals: 2,
    },
    {
        to: "0x5FcF81463a2A63c10F51c4F9D55Fb7403759C8B9",
        amount: 0.02,
        approvals: 0,
    },
    {
        to: "0xb607A500574fE29afb0d0681f1dC3E82f79f4877",
        amount: 0.3,
        approvals: 1,
    },
];

const MyGuardiansTable = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);

    const showModal = () => {
        setIsModalOpen(true);
    };

    const handleOk = () => {
        setIsModalOpen(false);
    };

    const handleCancel = () => {
        setIsModalOpen(false);
    };

    return (
        <>
            <div className="table-container">
                <Table
                    columns={columns}
                    dataSource={data}
                    pagination={{ hideOnSinglePage: true, pageSize: 3, position: ["bottomCenter"] }}
                    bordered={true}
                />
                <Button
                    onClick={showModal}
                    style={{ height: "50px", marginTop: "auto" }}
                    type="primary"
                    size="large"
                    block
                >
                    Create New Withdraw Request
                </Button>
            </div>
            <Modal
                title="Creating New Withdraw Request"
                centered
                open={isModalOpen}
                onOk={handleOk}
                onCancel={handleCancel}
                okText="Add"
                bodyStyle={{ margin: "1rem 0" }}
            >
                <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
                    <div>
                        <h4 style={{ marginBottom: "0.3rem" }}>To</h4>
                        <Input placeholder="0x..." />
                    </div>
                    <div>
                        <h4 style={{ marginBottom: "0.3rem" }}>Amount (ETH)</h4>
                        <Input placeholder="0.0001" />
                    </div>
                </div>
            </Modal>
        </>
    );
};

export default MyGuardiansTable;
