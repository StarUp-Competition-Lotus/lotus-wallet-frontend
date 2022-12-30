import { useState, useEffect, useMemo, useCallback } from "react";
import { Table, Button, Modal, Input, Popconfirm, Empty } from "antd";
import { CiCircleRemove } from "react-icons/ci";
import { doc, updateDoc, arrayUnion, arrayRemove } from "firebase/firestore";
import firestoreDb from "../../firebase";

import useWalletContract from "../../hooks/useWalletContract";
import useAATransaction from "../../hooks/useAATransaction";
import useNotification from "../../hooks/useNotification";

const MyGuardiansTable = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [guardians, setGuardians] = useState([]);
    const [newGuardianInput, setNewGuardianInput] = useState("");
    const [isTransacting, setIsTransacting] = useState(false);
    const [isTableLoading, setIsTableLoading] = useState(true);

    const { walletContract } = useWalletContract();
    const { executeAA, notificationContextHolder } = useAATransaction();
    const { raiseFailure } = useNotification();

    const showModal = () => {
        setIsModalOpen(true);
    };

    const handleCancel = () => {
        setIsModalOpen(false);
    };

    const getGuardians = async () => {
        setIsTableLoading(true);
        try {
            const guardians = await walletContract.getGuardians();
            setGuardians(guardians);
        } catch (e) {
            console.log("error: ", e);
            raiseFailure("Error loading guardian");
        }
        setIsTableLoading(false);
    };

    const addGuardian = useCallback(async () => {
        setIsTransacting(true);
        const tx = await walletContract.populateTransaction.addGuardian(newGuardianInput);
        await executeAA(tx, "Guardian added successfully", "Error adding guardian");
        setIsTransacting(false);
        setIsModalOpen(false);
        setNewGuardianInput("");
    }, [newGuardianInput]);

    const removeGuardian = useCallback(
        async (index) => {
            setIsTableLoading(true);
            const tx = await walletContract.populateTransaction.removeGuardian(index);
            await executeAA(tx, "Guardian removed successfully", "Error removing guardian");
            setIsTableLoading(false);
        },
        [guardians]
    );

    useEffect(() => {
        walletContract.on("GuardianAdded", (walletAddr, guardian) => {
            const handleGuardianAdded = async () => {
                const docRef = doc(firestoreDb, "wallets", walletAddr);
                await updateDoc(docRef, {
                    guardians: arrayUnion(guardian),
                });
                getGuardians();
            };
            handleGuardianAdded();
        });
    }, []);

    useEffect(() => {
        walletContract.on("GuardianRemoved", (walletAddr, guardian) => {
            const handleGuardianRemoved = async () => {
                const docRef = doc(firestoreDb, "wallets", walletAddr);
                await updateDoc(docRef, {
                    guardians: arrayRemove(guardian),
                });
                getGuardians();
            };
            handleGuardianRemoved();
        });
    }, []);

    useEffect(() => {
        getGuardians();
    }, []);

    const guardiansData = useMemo(() => {
        return guardians.map((guardian) => {
            return {
                address: guardian,
            };
        });
    }, [guardians]);

    const tableColumns = useMemo(
        () => [
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
                render: (_, __, index) => (
                    <Popconfirm
                        title="Remove this guardian?"
                        okText="Remove"
                        icon={null}
                        onConfirm={() => {
                            removeGuardian(index);
                        }}
                    >
                        <div
                            style={{
                                display: "flex",
                                justifyContent: "center",
                                alignContent: "center",
                            }}
                        >
                            <CiCircleRemove color="#DC3535" size={30} />
                        </div>
                    </Popconfirm>
                ),
            },
        ],
        [removeGuardian]
    );

    return (
        <>
            {notificationContextHolder}
            <div className="table-container">
                {guardiansData.length === 0 && !isTableLoading ? (
                    <Empty description="No Guardians" />
                ) : (
                    <Table
                        columns={tableColumns}
                        dataSource={guardiansData}
                        showHeader={false}
                        pagination={{
                            hideOnSinglePage: true,
                            pageSize: 4,
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
                    block
                    disabled={isTableLoading}
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
                    <Button onClick={handleCancel}>Cancel</Button>,
                    <Button type="primary" loading={isTransacting} onClick={addGuardian}>
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
