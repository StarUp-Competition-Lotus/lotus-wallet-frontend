import { useState, useMemo } from "react";
import { Table, Button, Modal, Input, Popconfirm, Tooltip, Dropdown, Empty } from "antd";
import { CiCircleMinus, CiCircleCheck, CiNoWaitingSign, CiCircleChevRight } from "react-icons/ci";

import { shortenAddress } from "../../utils/utils";
import useWalletWithdraw from "../../hooks/useWalletWithdraw";

const MyGuardiansTable = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const {
        newWithdrawAmount,
        setNewWithdrawAmount,
        newWithdrawReceiver,
        setNewWithdrawReceiver,
        withdraws,
        withdrawRequestCount,
        isTableLoading,
        isTransacting,
        notificationContextHolder,
        createWithdrawRequest,
        cancelWithdrawRequest,
        executeWithdrawRequest
    } = useWalletWithdraw();

    const showModal = () => {
        setIsModalOpen(true);
    };

    const handleOk = async () => {
        await createWithdrawRequest();
        setIsModalOpen(false);
    };

    const handleCancel = () => {
        cancelWithdrawRequest(withdrawRequestCount);
        setIsModalOpen(false);
    };

    const tableColumns = useMemo(
        () => [
            {
                title: "",
                dataIndex: "index",
                key: "index"
            },
            {
                title: "Receiver",
                dataIndex: "receiver",
                key: "receiver",
                render: (receiver) => (
                    <Tooltip placement="topLeft" title={receiver}>
                        <p style={{ color: "#1777FE" }}>{shortenAddress(receiver)}</p>
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
                dataIndex: "guardianApprovals",
                key: "guardianApprovals",
                render: (guardianApprovals) => {
                    const guardiansNum = Object.keys(guardianApprovals).length;
                    const { dropdownItems, approvedNum } = guardianApprovalsDataHandle(guardianApprovals);
                    return (
                        <Dropdown menu={{ items: dropdownItems }} placement="bottomLeft">
                            <p style={{ color: "#3c4048" }}>
                                {approvedNum}/{guardiansNum}
                            </p>
                        </Dropdown>
                    );
                },
            },
            {
                title: <p style={{ textAlign: "center" }}>Cancel</p>,
                dataIndex: "",
                key: "",
                render: (_, currentWithdraw) => (
                    <Popconfirm title="Cancel this request?" cancelText="No" okText="Yes" icon={null} onConfirm={() => {cancelWithdrawRequest(currentWithdraw.index)}}>
                        <div style={{ display: "flex", justifyContent: "center", alignContent: "center" }}>
                            <CiCircleMinus color="#DC3535" size={30} />
                        </div>
                    </Popconfirm>
                ),
            },
            {
                title: <p style={{ textAlign: "center" }}>Execute</p>,
                dataIndex: "guardianApprovals",
                key: "guardianApprovals",
                render: (guardianApprovals, currentWithdraw) => {
                    const guardiansNum = Object.keys(guardianApprovals).length;
                    const { approvedNum } = guardianApprovalsDataHandle(guardianApprovals);
                    return approvedNum === guardiansNum ? (
                        <Popconfirm title="Execute this request?" cancelText="No" okText="Yes" icon={null} onConfirm={() => {executeWithdrawRequest(currentWithdraw.index)}}>
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
        ]
    );

    const data = useMemo(() => {
        return withdraws;
    }, [withdraws]);
    
    const guardianApprovalsDataHandle = (guardiansApprovals) => {
        const dropdownItems = [];
        let approvedNum = 0;
        for (const guardian in guardiansApprovals) {
            const Icon = guardiansApprovals[guardian] ? <CiCircleCheck /> : <CiNoWaitingSign />;
            const display = (
                <div style={{ display: "flex", gap: "5px", alignItems: "center" }}>
                    {Icon}
                    <p>{shortenAddress(guardian)}</p>
                </div>
            );
            dropdownItems.push({
                key: guardian,
                label: display,
            });
            if (guardiansApprovals[guardian]) {
                approvedNum++;
            }
        }
        return { dropdownItems, approvedNum };
    };

    return (
        <>
            {notificationContextHolder}
            <div className="table-container">
                {data.length === 0 ? (
                    <Empty description="No Withdraw Request that needs your approvals at the moment" />
                ) : (
                    <Table
                        columns={tableColumns}
                        dataSource={data}
                        pagination={{
                            hideOnSinglePage: true,
                            pageSize: 3,
                            position: ["bottomCenter"],
                        }}
                        bordered={true}
                        loading={isTableLoading}
                    />
                )}
                <Button
                    onClick={showModal}
                    style={{ height: "50px", marginTop: "auto" }}
                    type="primary"
                    size="large"
                    loading={isTransacting}
                    block
                >
                    Create New Withdraw Request
                </Button>
            </div>
            <Modal
                title="Creating New Withdraw Request"
                centered
                open={isModalOpen}
                bodyStyle={{ margin: "1rem 0" }}
                footer={[
                    <Button onClick={handleCancel}>Cancel</Button>,
                    <Button type="primary" loading={isTransacting} onClick={handleOk}>
                        Add
                    </Button>,
                ]}
            >
                <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
                    <div>
                        <h4 style={{ marginBottom: "0.3rem" }}>Receiver</h4>
                        <Input 
                            placeholder="0x..." 
                            value={newWithdrawReceiver}
                            onChange={(e) => {
                                setNewWithdrawReceiver(e.target.value)
                            }}
                        />
                    </div>
                    <div>
                        <h4 style={{ marginBottom: "0.3rem" }}>Amount (ETH)</h4>
                        <Input 
                            placeholder="0.0001" 
                            value={newWithdrawAmount}
                            onChange={(e) => {
                                setNewWithdrawAmount(e.target.value)
                            }}
                        />
                    </div>
                </div>
            </Modal>
        </>
    );
};

export default MyGuardiansTable;
