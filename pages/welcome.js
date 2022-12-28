import { useState } from "react";
import { Modal, Button } from "antd";
import { CiImport, CiWallet, CiRepeat } from "react-icons/ci";

export default () => {
    return (
        <div className="welcome-screen">
            <img src="/logo.png" className="welcome-logo" />
            <div style={{ textAlign: "center" }}>
                <h1>Welcome to Lotus Wallet</h1>
                <p style={{ color: "#aaaaaa", marginTop: "5px" }}>Cheap - Reliable - Secure</p>
            </div>
            <div className="welcome-action-buttons">
                <ActionButton icon={<CiWallet />} title="Create a new Wallet" action={() => {}} />
                <ActionButton icon={<CiRepeat />} title="Recover a Wallet" action={() => {}} />
                <ActionButton
                    icon={<CiImport />}
                    title="Import wallet secret key"
                    action={() => {}}
                />
            </div>
        </div>
    );
};

const ActionButton = ({ icon, title, action }) => {
    return (
        <Button size="large" onClick={action}>
            <div
                style={{
                    display: "flex",
                    alignItems: "center",
                    width: "200px",
                    gap: "0.5rem",
                }}
            >
                {icon}
                <p>{title}</p>
            </div>
        </Button>
    );
};
