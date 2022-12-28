import { useRouter } from "next/router";
import { useState } from "react";
import { Modal, Button, Input } from "antd";
import { CiImport, CiWallet, CiRepeat } from "react-icons/ci";

import useWalletContract from "../hooks/useWalletContract";
import useWelcome from "../hooks/useWelcome";

export default () => {
    const { walletAddr, signingKey } = useWalletContract();
    const router = useRouter();

    if (walletAddr && signingKey) {
        router.push("/");
        return;
    }
    const [waitingRecovery, setWaitingRecovery] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [inputSK, setInputSK] = useState("");

    const { importSecretKey, isImportingSK, notificationContextHolder } = useWelcome();

    const showModal = () => {
        setIsModalOpen(true);
    };

    const handleCancel = () => {
        setIsModalOpen(false);
    };

    return (
        <>
            {notificationContextHolder}
            <div className="welcome-screen">
                <img src="/logo.png" className="welcome-logo" />
                <div style={{ textAlign: "center" }}>
                    <h1>Welcome to Lotus Wallet</h1>
                    <p style={{ color: "#aaaaaa", marginTop: "5px" }}>Cheap - Reliable - Secure</p>
                </div>
                <div className="welcome-action-buttons">
                    <ActionButton
                        icon={<CiWallet />}
                        title="Create a new Wallet"
                        action={() => {}}
                    />
                    <ActionButton icon={<CiRepeat />} title="Recover a Wallet" action={() => {}} />
                    <ActionButton
                        icon={<CiImport />}
                        title="Import wallet secret key"
                        action={showModal}
                    />
                </div>
            </div>
            <Modal
                title="Importing Secret Key"
                centered
                open={isModalOpen}
                onOk={async () => {
                    console.log(inputSK);
                    await importSecretKey(inputSK);
                }}
                onCancel={handleCancel}
                okText="Import"
                // bodyStyle={{ margin: "1rem 0" }}
                footer={[
                    <Button onClick={handleCancel}>Cancel</Button>,
                    <Button
                        type="primary"
                        loading={isImportingSK}
                        onClick={async () => {
                            await importSecretKey(inputSK);
                        }}
                    >
                        Import
                    </Button>,
                ]}
            >
                <Input
                    value={inputSK}
                    onChange={(e) => {
                        setInputSK(e.target.value);
                    }}
                />
            </Modal>
        </>
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
