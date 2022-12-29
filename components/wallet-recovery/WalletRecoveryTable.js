import { useState } from "react";

import { Table, Button, Modal, Popconfirm, Input, Empty } from "antd";
import { CiCircleCheck } from "react-icons/ci";

import useWalletRecovery from "../../hooks/useWalletRecovery";

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

    const {
        newSigningAddrInput,
        setRecoverWalletInput,
        setNewSigningAddrInput,
        initiateRecovery,
        notificationContextHolder,
        isTransacting,
    } = useWalletRecovery();

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
            {notificationContextHolder}
            <div className="table-container">
                {data.length === 0 ? (
                    <Empty description="No Wallet Recovery request that needs your support at the moment" />
                ) : (
                    <Table
                        columns={columns}
                        dataSource={data}
                        pagination={{
                            hideOnSinglePage: true,
                            pageSize: 3,
                            position: ["bottomCenter"],
                        }}
                        bordered={true}
                    />
                )}
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
                footer={[
                    <Button onClick={handleCancel}>Cancel</Button>,
                    <Button type="primary" loading={isTransacting} onClick={initiateRecovery}>
                        Recover
                    </Button>,
                ]}
            >
                <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
                    <div>
                        <h4 style={{ marginBottom: "0.3rem" }}>Wallet Address to recover</h4>
                        <Input
                            onChange={(e) => {
                                setRecoverWalletInput(e.target.value);
                            }}
                        />
                    </div>
                    <div>
                        <h4 style={{ marginBottom: "0.3rem" }}>Recovery code</h4>
                        <Input
                            onChange={(e) => {
                                setNewSigningAddrInput(e.target.value);
                            }}
                        />
                    </div>
                </div>
            </Modal>
        </>
    );
};

export default WalletRecoveryTable;
