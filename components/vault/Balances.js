import { useState } from "react";

import { Button, Modal } from "antd";

const Balances = () => {
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
            <div className="vault-container">
                <div className="vault-total">
                    <p style={{ color: "#aaaaaa" }}>Total: </p>
                    <h2 className="vault-total-amount">$100.00</h2>
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
                        <Button style={{height: "50px"}} onClick={showModal} type="primary" size="large" block>
                            Add Funds
                        </Button>
                    </div>
                </div>
            </div>
            <Modal
                title="Adding Funds"
                centered
                open={isModalOpen}
                onOk={handleOk}
                onCancel={handleCancel}
                okText="Copy"
                // bodyStyle={{ margin: "1rem 0" }}
            >
                <div className="vault-receive">
                    <h4 style={{ color: "#3c4048", fontSize: "1.25rem" }}>My QR Code</h4>
                    <img src="/QR-code.png" style={{ width: "125px", height: "125px" }} />
                    <p style={{ color: "#3c4048" }}>Wallet address</p>
                    <p style={{ color: "#aaaaaa" }}>0x5fcf81463a2a63c10f51c4f9d55fb7403759c8b9</p>
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
