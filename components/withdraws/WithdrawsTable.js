import { useState } from "react";
import { Table, Button, Modal, Input, Popconfirm, Tooltip, Dropdown } from "antd";
import { CiCircleMinus, CiCircleCheck, CiNoWaitingSign, CiCircleChevRight } from "react-icons/ci";

import { shortenAddress } from "../../utils/utils";

const columns = [
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
        render: () => (
            <Popconfirm title="Cancel this request?" cancelText="No" okText="Yes" icon={null}>
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
        render: (guardianApprovals) => {
            const guardiansNum = Object.keys(guardianApprovals).length;
            const { approvedNum } = guardianApprovalsDataHandle(guardianApprovals);
            return approvedNum === guardiansNum ? (
                <Popconfirm title="Execute this request?" cancelText="No" okText="Yes" icon={null}>
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
];

const data = [
    {
        receiver: "0xb607A500574fE29afb0d0681f1dC3E82f79f4877",
        amount: 0.01,
        guardianApprovals: {
            "0x8335c2DE1Bb6d606C183D933C92c69BD363DC794": true,
            "0x5FcF81463a2A63c10F51c4F9D55Fb7403759C8B9": true,
        },
    },
    {
        receiver: "0xb607A500574fE29afb0d0681f1dC3E82f79f4877",
        amount: 0.02,
        guardianApprovals: {
            "0x8335c2DE1Bb6d606C183D933C92c69BD363DC794": false,
            "0x5FcF81463a2A63c10F51c4F9D55Fb7403759C8B9": true,
        },
    },
    {
        receiver: "0xb607A500574fE29afb0d0681f1dC3E82f79f4877",
        amount: 0.3,
        guardianApprovals: {
            "0x8335c2DE1Bb6d606C183D933C92c69BD363DC794": false,
            "0x5FcF81463a2A63c10F51c4F9D55Fb7403759C8B9": true,
            "0xb607A500574fE29afb0d0681f1dC3E82f79f4877": true,
        },
    },
];

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
                        <h4 style={{ marginBottom: "0.3rem" }}>Receiver</h4>
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
