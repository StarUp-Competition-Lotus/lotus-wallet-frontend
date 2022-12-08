import { useState } from "react";
import { Table, Button, Modal, Input, Popconfirm } from "antd";
import { CiCircleRemove } from "react-icons/ci";

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
            <Popconfirm title="Delete this guardian?" okText="Delete">
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
            <div className="my-guardians-table-container">
                <Table
                    columns={columns}
                    dataSource={data}
                    showHeader={false}
                    pagination={{ hideOnSinglePage: true }}
                    bordered={true}
                />
                <Button
                    onClick={showModal}
                    className="add-guardian-button"
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
                onOk={handleOk}
                onCancel={handleCancel}
                okText="Add"
                bodyStyle={{ margin: "1rem 0" }}
            >
                <Input placeholder="Address" />
            </Modal>
        </>
    );
};

export default MyGuardiansTable;
