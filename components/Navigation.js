import Link from "next/link";
import { Popconfirm, Tooltip, Button } from "antd";
import { useRouter } from "next/router";
import { CiSignpostR1, CiVault, CiUser, CiRead, CiRepeat, CiTurnR1, CiLogin } from "react-icons/ci";
import { TfiKey } from "react-icons/tfi";
import { message } from "antd";
import { LoadingOutlined } from "@ant-design/icons";

import { shortenAddress } from "../utils/utils";
import useWalletContract from "../hooks/useWalletContract";
import useLogout from "../hooks/useLogout";

const Navigation = () => {
    const [messageApi, contextHolder] = message.useMessage();
    const { walletAddr, signingKey } = useWalletContract();
    const { logout } = useLogout();

    const handleCopyAddress = () => {
        navigator.clipboard.writeText(walletAddr);
        messageApi.open({
            type: "success",
            content: "Copied Wallet Address to clipboard",
        });
    };

    const handleCopySigningKey = () => {
        navigator.clipboard.writeText(signingKey);
        messageApi.open({
            type: "success",
            content: "Copied Signing Key to clipboard",
        });
    };
    return (
        <>
            {contextHolder}
            <div className="nav-header">
                <img src="/logo.png" className="nav-logo" />
                <h1>Lotus</h1>
            </div>
            <div className="nav-body">
                <div className="nav-body-section">
                    <NavigationItem Icon={CiVault} title="Vault" uri="/" />
                    <NavigationItem Icon={CiSignpostR1} title="My Withdraws" uri="/my-withdraws" />
                    <NavigationItem Icon={CiUser} title="My Guardians" uri="/my-guardians" />
                </div>
                <hr className="nav-hr" />
                <div className="nav-body-section">
                    <NavigationItem
                        Icon={CiRead}
                        title="Protecting Wallets"
                        uri="/protecting-wallets"
                    />
                    <NavigationItem
                        Icon={CiRepeat}
                        title="Wallet Recovery"
                        uri="/wallet-recovery"
                    />
                    <NavigationItem
                        Icon={CiTurnR1}
                        title="Withdraw Requests"
                        uri="/withdraw-requests"
                    />
                </div>
            </div>
            <div className="nav-footer">
                <Tooltip
                    placement="topLeft"
                    title={<p style={{ textAlign: "center" }}>{walletAddr}</p>}
                >
                    <Button
                        size="large"
                        style={{ flex: 1, marginRight: "0.5rem" }}
                        onClick={handleCopyAddress}
                    >
                        {walletAddr ? shortenAddress(walletAddr) : <LoadingOutlined />}
                    </Button>
                </Tooltip>
                <div className="nav-footer-icon">
                    <Tooltip title={<p style={{ textAlign: "center" }}>{signingKey}</p>}>
                        <Button size="large" type="text" onClick={handleCopySigningKey}>
                            <div
                                style={{
                                    display: "flex",
                                    justifyContent: "center",
                                    alignItems: "center",
                                }}
                            >
                                <TfiKey size={22} color="#B2B2B2" />
                            </div>
                        </Button>
                    </Tooltip>
                    <Popconfirm title="Logout?" okText="Yes" icon={null} onConfirm={logout}>
                        <Button size="large" type="text">
                            <div
                                style={{
                                    display: "flex",
                                    justifyContent: "center",
                                    alignItems: "center",
                                }}
                            >
                                <CiLogin size={22} color="#B2B2B2" />
                            </div>
                        </Button>
                    </Popconfirm>
                </div>
            </div>
        </>
    );
};

const NavigationItem = ({ Icon, title, uri }) => {
    const router = useRouter();
    const pathname = router.pathname;

    const classes = "nav-item" + (pathname === uri ? " nav-item-selected" : "");

    return (
        <Link href={uri}>
            <div className={classes}>
                <Icon size={25} color="#B2B2B2" />
                <p className="nav-text">{title}</p>
            </div>
        </Link>
    );
};

export default Navigation;
