import { useState, useEffect, useCallback, useMemo } from "react";
import { Table, Button, Modal, Input, Popconfirm, Tooltip, Dropdown, Empty } from "antd";
import { CiCircleMinus, CiCircleCheck, CiNoWaitingSign, CiCircleChevRight } from "react-icons/ci";
import { doc, updateDoc, arrayUnion, arrayRemove, getDocs, setDoc, collection } from "firebase/firestore";
import { parseUnits, formatEther } from "ethers/lib/utils";
import firestoreDb from "../../firebase";

import useWalletContract from "../../hooks/useWalletContract";
import useAATransaction from "../../hooks/useAATransaction";

import { shortenAddress } from "../../utils/utils";
import { map } from "@firebase/util";
import { BigNumber } from "ethers";

const MyGuardiansTable = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [guardians, setGuardians] = useState([]);
    const [newWithdrawAmount, setNewWithdrawAmount] = useState("");
    const [newWithdrawReceiver, setNewWithdrawReceiver] = useState("")
    const [withdraws, setWithdraws] = useState([]);
    const [withdrawRequestCount, setwithdrawRequestCount] = useState(0);
    const [isTableLoading, setIsTableLoading] = useState(false);
    const [isTransacting, setIsTransacting] = useState(false);

    const { walletContract, walletAddr } = useWalletContract();
    const { executeAA, notificationContextHolder } = useAATransaction();

    const showModal = () => {
        setIsModalOpen(true);
    };

    const handleOk = () => {
        createWithdrawRequest();
        setIsModalOpen(false);
    };

    const handleCancel = () => {
        cancelWithdrawRequest(withdrawRequestCount);
        setIsModalOpen(false);
    };

    const bigNumberToInt = (bigNumber) => {
        return parseFloat(formatEther(bigNumber, 18)) * 10 ** 18;
    }

    const getGuardians = async () => {
        try {
            const guardians = await walletContract.getGuardians();
            setGuardians(guardians);
        } catch (e) {
            console.log("error: ", e);
            raiseFailure("Error loading guardian");
        }
    };

    const getWithdrawRequestsCount = async () => {
        try {
            const withdrawRequestCount = await walletContract.getWithdrawRequestsCount();
            setwithdrawRequestCount(bigNumberToInt(withdrawRequestCount));
        } catch (e) {
            console.log("error: ", e);
            raiseFailure("Error loading guardian");
        }
    };

    const getActiveWithdraws = async () => {
        let subWithdraws = [];

        const querySnapshot = await getDocs(collection(firestoreDb, "withdraws"))
        querySnapshot.forEach((doc) => {
            if (doc.id.substring(0, 42) == walletAddr && !withdraws.includes(w => w.index == doc.data().index) && doc.data().isActive) {
                subWithdraws.push({
                    receiver: doc.data().receiver,
                    amount: doc.data().amount / 10 ** 18,
                    index: doc.data().index,
                    guardianApprovals: doc.data().requiredGuardians
                });
            }
        });
        if (subWithdraws.length != 0) {
            setWithdraws(withdraws.concat(subWithdraws))
        }
    }

    const createWithdrawRequest = useCallback(async () => {
        const tx = await walletContract.populateTransaction.createWithdrawRequest(parseUnits((newWithdrawAmount), "ether"), newWithdrawReceiver);
        await executeAA(tx, "Withdraw request created successfully", "Error creating withdraw request");
        setNewWithdrawAmount("");
        setNewWithdrawReceiver("");
    });

    const cancelWithdrawRequest = useCallback(async (index) => {
        console.log(`index: ${index}, withdrawCount: ${withdrawRequestCount}`)
        const tx = await walletContract.populateTransaction.cancelWithdrawRequest(index);
        console.log(tx)
        await executeAA(tx, "Withdraw request cancelled successfully", "Error cancelling withdraw request");
    });

    const executeWithdrawRequest = useCallback(async (index) => {
        const tx = await walletContract.populateTransaction.executeWithdrawRequest(index);
        await executeAA(tx, "Withdraw request executed successfully", "Error executing withdraw request");
    });

    useEffect(() => {
        walletContract.on("WithdrawRequestCreated", (walletAddr, withdrawIndex, receiver, amount, requiredGuardians) => {
            console.log(walletAddr, withdrawIndex, receiver, amount, requiredGuardians)
            const withdrawIndexInt = bigNumberToInt(withdrawIndex) - 1;
            const requiredGuardiansMap = Object.assign({}, ...requiredGuardians.map(g => ({[g]: false})))
            const handleWithdrawRequestAdded = async () => {
                const docRef = doc(firestoreDb, "withdraws", walletAddr.toString(16) + withdrawIndexInt.toString(16));
                await setDoc(docRef, {
                    amount: bigNumberToInt(amount),
                    index: withdrawIndexInt,
                    receiver: receiver,
                    isActive: true,
                    walletAddr: walletAddr,
                    requiredGuardians: requiredGuardiansMap
                });
                setWithdraws(withdraws.concat([{
                    receiver: receiver,
                    amount: bigNumberToInt(amount) / 10 ** 18,
                    index: withdrawIndex,
                    guardianApprovals: requiredGuardians
                }]));
            }
            handleWithdrawRequestAdded();
            console.log("withdraw created")
        })
    }, []);

    useEffect(() => {
        walletContract.on("WithdrawRequestCanceled", (walletAddr, withdrawIndex) => {
            console.log(walletAddr, withdrawIndex)
            const withdrawIndexInt = bigNumberToInt(withdrawIndex);
            const handleWithdrawRequestAdded = async () => {
                const docRef = doc(firestoreDb, "withdraws", walletAddr.toString(16) + withdrawIndexInt.toString(16));
                await updateDoc(docRef, {
                    isActive: false,
                });
                setWithdraws(withdraws.filter(w => w.index !== withdrawIndexInt));
            }
            handleWithdrawRequestAdded();
            console.log("withdraw cancelled")
        })
    }, []);

    useEffect(() => {
        walletContract.on("WithdrawRequestExecuted", (walletAddr, withdrawIndex) => {
            const withdrawIndexInt = bigNumberToInt(withdrawIndex);
            const handleWithdrawRequestExecuted = async () => {
                const docRef = doc(firestoreDb, "withdraws", walletAddr.toString(16) + withdrawIndexInt.toString(16));
                await updateDoc(docRef, {
                    isActive: false,
                });
                setWithdraws(withdraws.filter(w => w.index !== withdrawIndexInt));
            }
            handleWithdrawRequestExecuted();
            console.log('recovery executed')
        })
    })

    useEffect(() => {
        walletContract.on("WithdrawRequestApproved"), (walletAddr, withdrawIndex, guardianApproved) => {
            const withdrawIndexInt = bigNumberToInt(withdrawIndex);
            console.log(guardianApproved)
            const handleWithdrawRequestApproved = async () => {
                const docRef = doc(firestoreDb, "withdraws", walletAddr.toString(16) + withdrawIndexInt.toString(16));
                await updateDoc(docRef, {
                    requiredGuardians: {
                        ...doc.data().requiredGuardians,
                        [guardianApproved]: true
                    }
                });

                setWithdraws(withdraws.map(w => {
                    if (w.index == withdrawIndexInt) {
                        return {
                            ...w,
                            requiredGuardians: {
                                ...requiredGuardians,
                                [guardianApproved]: true
                            } 
                        }
                    }
                }));
            }
            handleWithdrawRequestApproved();
        }
    })

    useEffect(() => {
        getGuardians();
        getWithdrawRequestsCount();
        getActiveWithdraws();
    }, []);

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

        ], []
    );
    
    const withdrawsData = useMemo(() => {

    }, [withdraws]);

    // const data = [
    //     {
    //         receiver: "0xb607A500574fE29afb0d0681f1dC3E82f79f4877fake",
    //         amount: 0.01,
    //         guardianApprovals: Object.assign({}, ...guardians.map(g => ({[g]: false})))
    //     },
    //     {
    //         receiver: "0xb607A500574fE29afb0d0681f1dC3E82f79f4877fake",
    //         amount: 0.02,
    //         guardianApprovals: Object.assign({}, ...guardians.map(g => ({[g]: false})))
    //     },
    //     {
    //         receiver: "0xb607A500574fE29afb0d0681f1dC3E82f79f4877fake",
    //         amount: 0.3,
    //         guardianApprovals: Object.assign({}, ...guardians.map(g => ({[g]: false})))
    //     },
    // ];

    const data = useMemo(() => {
        return withdraws
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
                    />
                )}
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
