import { useState, useEffect, useMemo } from "react";
import { getDocs, collection } from "firebase/firestore";
import firestoreDb from "../../firebase";
import { Table, Empty } from "antd";

import useWalletContract from "../../hooks/useWalletContract";

const ProtectingWalletsTable = () => {
    const [protectingWallets, setProtectingWallets] = useState([]);
    const [isTableLoading, setIsTableLoading] = useState(false);
    const { walletAddr } = useWalletContract();

    const getProtectingData = async () => {
        setIsTableLoading(true);
        let addresses = [];

        const querySnapshot = await getDocs(collection(firestoreDb, "wallets"));
        querySnapshot.forEach((doc) => {
            doc.data().guardians.forEach((subDoc) => {
                if (subDoc === walletAddr && !protectingWallets.includes(doc.id)) {
                    addresses.push(doc.id);
                }
            });
            if (addresses.length != 0) {
                setProtectingWallets(protectingWallets.concat(addresses));
            }
        });
        setIsTableLoading(false);
    };

    useEffect(() => {
        getProtectingData();
    }, [protectingWallets]);

    const protectingGuardiansColumns = [
        {
            title: "Address",
            dataIndex: "address",
            key: "address",
            render: (address) => <p style={{ color: "#1777FE" }}>{address}</p>,
        },
    ];

    const protectingGuardiansData = useMemo(() => {
        return protectingWallets.map((wallet) => {
            return {
                address: wallet,
            };
        });
    }, [protectingWallets]);

    return (
        <div className="table-container">
            {protectingGuardiansData.length === 0 && !isTableLoading ? (
                <Empty description="You are not the guardian of any wallets" />
            ) : (
                <Table
                    columns={protectingGuardiansColumns}
                    dataSource={protectingGuardiansData}
                    showHeader={false}
                    pagination={{ hideOnSinglePage: true, pageSize: 6, position: ["bottomCenter"] }}
                    bordered={true}
                    loading={isTableLoading}
                />
            )}
        </div>
    );
};

export default ProtectingWalletsTable;
