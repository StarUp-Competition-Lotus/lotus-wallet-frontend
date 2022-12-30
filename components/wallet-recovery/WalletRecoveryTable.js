import { useMemo } from "react";

import { Table, Button, Modal, Popconfirm, Input, Empty, Tooltip } from "antd";
import { CiCircleCheck, CiCircleChevRight } from "react-icons/ci";
import { BsCheck2All } from "react-icons/bs";

import useWalletRecovery from "../../hooks/useWalletRecovery";
import { shortenAddress } from "../../utils/utils";

const recoveryData = [
    {
        address: "0xb607A500574fE29afb0d0681f1dC3E82f79f4877",
        approvals: {
            "0xb607A500574fE29afb0d0681f1dC3E82f79f4877": true,
            "0x5FcF81463a2A63c10F51c4F9D55Fb7403759C8B9": false,
        },
    },
    {
        address: "0xb607A500574fE29afb0d0681f1dC3E82f79f4877",
        approvals: {
            "0xb607A500574fE29afb0d0681f1dC3E82f79f4877": false,
            "0x5FcF81463a2A63c10F51c4F9D55Fb7403759C8B9": false,
        },
    },
    {
        address: "0xb607A500574fE29afb0d0681f1dC3E82f79f4877",
        approvals: {
            "0xb607A500574fE29afb0d0681f1dC3E82f79f4877": true,
            "0x5FcF81463a2A63c10F51c4F9D55Fb7403759C8B9": true,
        },
    },
];

const getApprovedNum = (approvals) => {
    let approvedNum = 0;
    for (const guardian in approvals) {
        if (approvals[guardian]) {
            approvedNum++;
        }
    }
    return approvedNum;
};

const WalletRecoveryTable = () => {
    const {
        setRecoverWalletInput,
        setNewSigningAddrInput,
        initiateRecovery,
        notificationContextHolder,
        isTransacting,
        isModalOpen,
        setIsModalOpen,
        walletAddr,
        isTableLoading,
        recoveryRequests,
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

    const columns = useMemo(
        () => [
            {
                title: "Address",
                dataIndex: "walletAddr",
                key: "walletAddr",
                render: (walletAddr) => (
                    <Tooltip title={walletAddr}>
                        <p style={{ color: "#1777FE" }}>{shortenAddress(walletAddr)}</p>
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
                title: <p style={{ textAlign: "center" }}>Approve</p>,
                dataIndex: "approvals",
                key: "approvals",
                render: (approvals) => {
                    return approvals[walletAddr] ? (
                        <Tooltip title="Approved">
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
                        <Popconfirm title="Approve this recovery?" okText="Approve" icon={null}>
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
            {
                title: <p style={{ textAlign: "center" }}>Execute</p>,
                dataIndex: "approvals",
                key: "approvals",
                render: (approvals) => {
                    const guardiansNum = Object.keys(approvals).length;
                    const approvedNum = getApprovedNum(approvals);
                    return approvedNum === guardiansNum ? (
                        <Popconfirm
                            title="Execute this recovery?"
                            cancelText="No"
                            okText="Yes"
                            icon={null}
                        >
                            <div
                                style={{
                                    display: "flex",
                                    justifyContent: "center",
                                    alignContent: "center",
                                }}
                            >
                                <CiCircleChevRight color="#54B435" size={30} />
                            </div>
                        </Popconfirm>
                    ) : null;
                },
            },
        ],
        [walletAddr]
    );

    return (
        <>
            {notificationContextHolder}
            <div className="table-container">
                {recoveryData.length === 0 ? (
                    <Empty description="No Wallet Recovery request that needs your support at the moment" />
                ) : (
                    <Table
                        columns={columns}
                        dataSource={recoveryRequests}
                        pagination={{
                            hideOnSinglePage: true,
                            pageSize: 3,
                            position: ["bottomCenter"],
                        }}
                        loading={isTableLoading}
                        bordered={true}
                    />
                )}
                <Button
                    onClick={showModal}
                    style={{ height: "50px", marginTop: "auto" }}
                    type="primary"
                    size="large"
                    block
                    disabled={isTableLoading}
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
