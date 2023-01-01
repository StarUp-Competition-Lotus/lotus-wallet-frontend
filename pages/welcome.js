import Head from "next/head";
import { useRouter } from "next/router";
import { useState } from "react";
import { Modal, Button, Input, Tooltip, message } from "antd";
import { CiImport, CiWallet, CiRepeat } from "react-icons/ci";
import {
    InfoCircleOutlined,
    CopyOutlined,
    EyeOutlined,
    EyeInvisibleOutlined,
} from "@ant-design/icons";

import SpinningScreen from "../components/SpinningScreen";
import useWalletContract from "../hooks/useWalletContract";
import useWelcome from "../hooks/useWelcome";

export default () => {
    const { walletAddr, signingKey, isLoadingFromLS } = useWalletContract();
    const router = useRouter();

    if (isLoadingFromLS) return <SpinningScreen />;

    if (walletAddr && signingKey && !isLoadingFromLS) {
        router.push("/");
        return;
    }
    const [isImportingKeyModalOpen, setIsImportingKeyModalOpen] = useState(false);
    const [isRecoverModalOpen, setIsRecoverModalOpen] = useState(false);
    const [showNewSecretKey, setShowNewSecretKey] = useState(false);
    const [inputSK, setInputSK] = useState("");

    const [messageApi, contextHolder] = message.useMessage();

    const {
        createNewWallet,
        importSecretKey,
        isImportingSK,
        notificationContextHolder,
        isCreatingWallet,
        newSigningAddr,
        newSK,
    } = useWelcome();

    const showImportingModal = () => {
        setIsImportingKeyModalOpen(true);
    };

    const notShowImportingModal = () => {
        setIsImportingKeyModalOpen(false);
    };

    const showRecoveryModal = () => {
        setIsRecoverModalOpen(true);
    };

    const hideRecoveryModal = () => {
        setIsRecoverModalOpen(false);
    };

    const handleCopyRecoveryCode = () => {
        navigator.clipboard.writeText(newSigningAddr);
        messageApi.open({
            type: "success",
            content: "Copied Recovery Code to clipboard",
        });
    };

    const handleCopyNewSK = () => {
        navigator.clipboard.writeText(newSK);
        messageApi.open({
            type: "success",
            content: "Copied new Secret Key to clipboard",
        });
    };

    return (
        <>
            <Head>
                <title>Louts | Welcome</title>
                <link rel="icon" href="/logo.png" />
            </Head>
            {notificationContextHolder}
            {contextHolder}
            <div className="welcome-screen">
                <img src="/logo.png" className="welcome-logo" />
                <div style={{ textAlign: "center" }}>
                    <h1>Welcome to Lotus Wallet</h1>
                    <p style={{ color: "#aaaaaa", marginTop: "5px" }}>Secure - Cheap - Reliable</p>
                </div>
                <div className="welcome-action-buttons">
                    <ActionButton
                        disabled={isCreatingWallet}
                        loading={isCreatingWallet}
                        icon={<CiWallet />}
                        title="Create a new Wallet"
                        action={createNewWallet}
                    />
                    <ActionButton
                        disabled={isCreatingWallet}
                        loading={false}
                        icon={<CiRepeat />}
                        title="Recover a Wallet"
                        action={showRecoveryModal}
                    />
                    <ActionButton
                        disabled={isCreatingWallet}
                        loading={false}
                        icon={<CiImport />}
                        title="Import wallet secret key"
                        action={showImportingModal}
                    />
                </div>
            </div>
            <Modal
                title="Importing Secret Key"
                centered
                open={isImportingKeyModalOpen}
                onOk={async () => {
                    await importSecretKey(inputSK);
                }}
                onCancel={notShowImportingModal}
                okText="Import"
                // bodyStyle={{ margin: "1rem 0" }}
                footer={[
                    <Button onClick={notShowImportingModal}>Cancel</Button>,
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
            <Modal
                centered
                width={500}
                maskClosable={false}
                closable={false}
                cancelText={null}
                okText="Confirm"
                onOk={hideRecoveryModal}
                onCancel={hideRecoveryModal}
                open={isRecoverModalOpen}
                title="Recover Wallet"
            >
                <div
                    style={{
                        display: "flex",
                        flexDirection: "column",
                        gap: "0.75rem",
                        marginTop: "0.5rem",
                        width: "100%",
                    }}
                >
                    <div>
                        <h4 style={{ marginBottom: "0.3rem" }}>Recovery Code</h4>
                        <div style={{ display: "flex", justifyContent: "space-between" }}>
                            <div style={{ flex: 1 }}>
                                <Input
                                    disabled
                                    value={newSigningAddr}
                                    style={{ maxWidth: "395px" }}
                                    suffix={
                                        <Tooltip title="Send this code to the guardians of your wallet to start recovery.">
                                            <InfoCircleOutlined
                                                style={{ color: "rgba(0,0,0,.45)" }}
                                            />
                                        </Tooltip>
                                    }
                                />
                            </div>
                            <Button
                                onClick={handleCopyRecoveryCode}
                                type="text"
                                style={{ padding: "4px", justifySelf: "end" }}
                            >
                                <div
                                    style={{
                                        display: "flex",
                                        justifyContent: "center",
                                        alignItems: "center",
                                    }}
                                >
                                    <CopyOutlined style={{ color: "rgba(0,0,0,.45)" }} />
                                </div>
                            </Button>
                        </div>
                    </div>
                    <div>
                        <h4 style={{ marginBottom: "0.3rem" }}>New Secret Key</h4>
                        <div style={{ display: "flex", justifyContent: "space-between" }}>
                            <div style={{ flex: 1 }}>
                                <Input
                                    disabled
                                    value={showNewSecretKey ? newSK : "••••••••"}
                                    style={{ maxWidth: "395px" }}
                                    suffix={
                                        <Tooltip title="DO NOT SEND THIS TO ANYONE. New Secret Key for you to login your wallet after all the guardians has support your request.">
                                            <InfoCircleOutlined
                                                style={{ color: "rgba(0,0,0,.45)" }}
                                            />
                                        </Tooltip>
                                    }
                                />
                            </div>
                            <div style={{ display: "flex", gap: "3px" }}>
                                <Button
                                    onClick={() => {
                                        setShowNewSecretKey((prev) => !prev);
                                    }}
                                    type="text"
                                    style={{ padding: "4px" }}
                                >
                                    <div
                                        style={{
                                            display: "flex",
                                            justifyContent: "center",
                                            alignItems: "center",
                                        }}
                                    >
                                        {showNewSecretKey ? (
                                            <EyeOutlined style={{ color: "rgba(0,0,0,.45)" }} />
                                        ) : (
                                            <EyeInvisibleOutlined
                                                style={{ color: "rgba(0,0,0,.45)" }}
                                            />
                                        )}
                                    </div>
                                </Button>
                                <Button
                                    onClick={handleCopyNewSK}
                                    type="text"
                                    style={{ padding: "4px" }}
                                >
                                    <div
                                        style={{
                                            display: "flex",
                                            justifyContent: "center",
                                            alignItems: "center",
                                        }}
                                    >
                                        <CopyOutlined style={{ color: "rgba(0,0,0,.45)" }} />
                                    </div>
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            </Modal>
        </>
    );
};

const ActionButton = ({ icon, title, action, disabled, loading }) => {
    return (
        <Button loading={loading} disabled={disabled} size="large" onClick={action}>
            <div
                style={{
                    display: "flex",
                    alignItems: "center",
                    width: "200px",
                    gap: "0.5rem",
                }}
            >
                {!loading && (
                    <>
                        {icon}
                        <p>{title}</p>
                    </>
                )}
            </div>
        </Button>
    );
};
