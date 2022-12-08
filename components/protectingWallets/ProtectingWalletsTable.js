import { Table } from "antd";

const columns = [
    {
        title: "Address",
        dataIndex: "address",
        key: "address",
        render: (address) => <p style={{ color: "#1777FE" }}>{address}</p>,
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

const ProtectingWalletsTable = () => {
    return (
        <div className="protecting-wallets-table-container">
            <Table
                columns={columns}
                dataSource={data}
                showHeader={false}
                pagination={{ hideOnSinglePage: true, pageSize: 3, position: ["bottomCenter"] }}
                bordered={true}
            />
        </div>
    );
};

export default ProtectingWalletsTable;
