import { useState } from "react";

import { Table, Button, Modal, Popconfirm, Input } from "antd";
import { CiCircleCheck } from "react-icons/ci";

const guardiansCount = 3;

const columns = [
    {
        title: "Address",
        dataIndex: "address",
        key: "address",
        render: (address) => <p style={{ color: "#1777FE" }}>{address}</p>,
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
            <Popconfirm title="Approve this recovery?" okText="Approve" icon={null}>
                <div style={{ display: "flex", justifyContent: "center", alignContent: "center" }}>
                    <CiCircleCheck color="#1777FE" size={30} />
                </div>
            </Popconfirm>
        ),
    },
];

const data = [
    {
        address: "0xb607A500574fE29afb0d0681f1dC3E82f79f4877",
        approvals: 2,
    },
    {
        address: "0x5FcF81463a2A63c10F51c4F9D55Fb7403759C8B9",
        approvals: 1,
    },
];

const WalletRecoveryTable = () => {

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
                    Start recover a wallet
                </Button>
            </div>
            <Modal
                title="Start recover a wallet"
                centered
                open={isModalOpen}
                onOk={handleOk}
                onCancel={handleCancel}
                okText="Recover"
                bodyStyle={{ margin: "1rem 0" }}
            >
                <Input placeholder="Address" />
            </Modal>
        </>
    );
};

export default WalletRecoveryTable;
