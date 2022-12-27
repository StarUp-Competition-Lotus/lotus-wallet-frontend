import { useState, useEffect } from "react";
import * as ethers from "ethers";
import { Button, Modal, QRCode, message } from "antd";
import { LoadingOutlined } from "@ant-design/icons";

import { provider } from "../../constants/main";
import useWalletContract from "../../hooks/useWalletContract";
import { roundedNumber } from "../../utils/utils";

const Balances = () => {
    const [messageApi, contextHolder] = message.useMessage();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [balance, setBalance] = useState();

    const { walletAddr } = useWalletContract();

    useEffect(() => {
        const getBalance = async () => {
            const balance = await provider.getBalance(walletAddr);
            setBalance(ethers.utils.formatEther(balance));
        };
        getBalance();
    }, []);

    const showModal = () => {
        setIsModalOpen(true);
    };

    const handleCopyAddress = () => {
        navigator.clipboard.writeText(walletAddr);
        messageApi.open({
            type: "success",
            content: "Copied to clipboard",
        });
        setIsModalOpen(false);
    };

    const handleCancel = () => {
        setIsModalOpen(false);
    };

    return (
        <>
            {contextHolder}
            <div className="vault-container">
                <div className="vault-total">
                    <p style={{ color: "#aaaaaa" }}>Total: </p>
                    {balance ? (
                        <h2 className="vault-total-amount">
                            ${roundedNumber(parseFloat(balance))}
                        </h2>
                    ) : (
                        <LoadingOutlined
                            style={{ color: "#1777FE", fontSize: "3rem", margin: "5px 0" }}
                        />
                    )}
                </div>
                <div className="vault-assets">
                    <div className="vault-assets-header">
                        <p>My assets</p>
                    </div>
                    <div className="vault-assets-list">
                        <Token name="ETH" amount="0.00" />
                        <Token name="DAI" amount="0.00" />
                        <Token name="LINK" amount="0.00" />
                    </div>
                    <div style={{ padding: "1rem 1rem" }}>
                        <Button
                            style={{ height: "50px" }}
                            onClick={showModal}
                            type="primary"
                            size="large"
                            block
                        >
                            Add Funds
                        </Button>
                    </div>
                </div>
            </div>
            <Modal
                title="Adding Funds"
                centered
                open={isModalOpen}
                onOk={handleCopyAddress}
                onCancel={handleCancel}
                okText="Copy"
                // bodyStyle={{ margin: "1rem 0" }}
            >
                <div className="vault-receive">
                    <h4 style={{ color: "#3c4048", fontSize: "1.25rem" }}>My QR Code</h4>
                    <QRCode value={walletAddr} />
                    <p style={{ color: "#3c4048" }}>Wallet address</p>
                    <p style={{ color: "#aaaaaa" }}>{walletAddr}</p>
                </div>
            </Modal>
        </>
    );
};

const Token = ({ name, amount }) => {
    return (
        <div className="vault-assets-token">
            <div style={{ width: "20%", display: "flex", alignItems: "center", gap: "0.75rem" }}>
                <div className="vault-assets-symbol" />
                <p style={{ color: "#3c4048" }}>{name}</p>
            </div>
            <p style={{ fontSize: "13px", color: "#aaaaaa", width: "40%", textAlign: "right" }}>
                {amount}
            </p>
            <p style={{ fontSize: "13px", color: "#aaaaaa", width: "40%", textAlign: "right" }}>
                $0.000000
            </p>
        </div>
    );
};

export default Balances;
