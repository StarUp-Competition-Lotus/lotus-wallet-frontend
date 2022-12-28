import Link from "next/link";
import { Popconfirm } from "antd";
import { useRouter } from "next/router";
import {
    CiSignpostR1,
    CiVault,
    CiUser,
    CiRead,
    CiRepeat,
    CiTurnR1,
    CiFileOn,
    CiLogin,
} from "react-icons/ci";
import { message } from "antd";
import { LoadingOutlined } from "@ant-design/icons";

import { shortenAddress } from "../utils/utils";
import useWalletContract from "../hooks/useWalletContract";
import useLogout from "../hooks/useLogout";

const Navigation = () => {
    const [messageApi, contextHolder] = message.useMessage();
    const { walletAddr } = useWalletContract();
    const { logout } = useLogout();

    const handleCopyAddress = () => {
        navigator.clipboard.writeText(walletAddr);
        messageApi.open({
            type: "success",
            content: "Copied to clipboard",
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
                <p className="nav-text nav-address">
                    {walletAddr ? shortenAddress(walletAddr) : <LoadingOutlined />}
                </p>
                <div className="nav-footer-icon">
                    <CiFileOn size={20} color="#B2B2B2" onClick={handleCopyAddress} />
                    <Popconfirm title="Logout?" okText="Yes" icon={null} onConfirm={logout}>
                        <CiLogin size={20} color="#B2B2B2" />
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
