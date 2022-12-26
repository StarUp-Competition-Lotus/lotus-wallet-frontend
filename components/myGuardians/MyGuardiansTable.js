import { useState, useEffect, useCallback } from "react";
import { Table, Button, Modal, Input, Popconfirm } from "antd";
import { CiCircleRemove } from "react-icons/ci";
import { CheckCircleOutlined, CloseCircleOutlined } from "@ant-design/icons";

import useWalletContract from "../../hooks/useWalletContract";
import useNotification from "../../hooks/useNotification";
import { executeAAWalletTransaction } from "../../utils/aa";

const columns = [
    {
        title: "Address",
        dataIndex: "address",
        key: "address",
        render: (address) => <p style={{ color: "#1777FE" }}>{address}</p>,
    },
    {
        title: "Remove",
        dataIndex: "",
        key: "",
        render: () => (
            <Popconfirm title="Delete this guardian?" okText="Delete" icon={null}>
                <div style={{ display: "flex", justifyContent: "center", alignContent: "center" }}>
                    <CiCircleRemove color="#DC3535" size={30} />
                </div>
            </Popconfirm>
        ),
    },
];

const data = [
    {
        address: "0xb607A500574fE29afb0d0681f1dC3E82f79f4877",
    },
    {
        address: "0x5FcF81463a2A63c10F51c4F9D55Fb7403759C8B9",
    },
    {
        address: "0xb607A500574fE29afb0d0681f1dC3E82f79f4877",
    },
];

const MyGuardiansTable = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [newGuardianInput, setNewGuardianInput] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    const { walletAddr, signingKey, walletContract } = useWalletContract();
    const { raiseSuccess, raiseFailure, notificationContextHolder } = useNotification();

    const showModal = () => {
        setIsModalOpen(true);
    };

    const handleCancel = () => {
        setIsModalOpen(false);
    };

    const addGuardian = useCallback(async () => {
        setIsLoading(true);
        try {
            const tx = await walletContract.populateTransaction.addGuardian(newGuardianInput);
            await executeAAWalletTransaction(walletAddr, signingKey, tx);
            raiseSuccess("Guardian added successfully");
        } catch (e) {
            console.log("error: ", e);
            raiseFailure("Error adding guardian");
        }
        setIsLoading(false);
        setIsModalOpen(false);
        setNewGuardianInput("");
    }, [newGuardianInput]);

    useEffect(() => {
        walletContract.on("GuardianAdded", (walletAddr, guardian) => {
            console.log(walletAddr);
            console.log(guardian);
        });
    }, []);

    return (
        <>
            {notificationContextHolder}
            <div className="table-container">
                <Table
                    columns={columns}
                    dataSource={data}
                    showHeader={false}
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
                    Add Guardians
                </Button>
            </div>
            <Modal
                title="Adding Guardians"
                centered
                open={isModalOpen}
                onOk={addGuardian}
                onCancel={handleCancel}
                okText="Add"
                bodyStyle={{ margin: "1rem 0" }}
                footer={[
                    <Button key="back" onClick={handleCancel}>
                        Cancel
                    </Button>,
                    <Button key="submit" type="primary" loading={isLoading} onClick={addGuardian}>
                        Add
                    </Button>,
                ]}
            >
                <Input
                    placeholder="Address"
                    value={newGuardianInput}
                    onChange={(e) => {
                        setNewGuardianInput(e.target.value);
                    }}
                />
            </Modal>
        </>
    );
};

export default MyGuardiansTable;
