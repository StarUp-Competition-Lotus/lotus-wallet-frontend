import Link from "next/link";
import { useRouter } from "next/router";
import {
    CiWallet,
    CiVault,
    CiUser,
    CiRead,
    CiRepeat,
    CiTurnR1,
    CiFileOn,
    CiLogin,
} from "react-icons/ci";

const Navigation = () => {
    return (
        <>
            <div className="nav-header">
                <img src="/logo.png" className="nav-logo" />
                <h1>Lotus</h1>
            </div>
            <div className="nav-body">
                <div className="nav-body-section">
                    <NavigationItem Icon={CiWallet} title="Main Wallet" uri="/" />
                    <NavigationItem Icon={CiVault} title="Vault" uri="/vault" />
                    <NavigationItem Icon={CiUser} title="My Guardians" uri="/my-guardians" />
                </div>
                <hr className="nav-hr" />
                <div className="nav-body-section">
                    <NavigationItem Icon={CiRead} title="Guardian List" uri="/guardian-list" />
                    <NavigationItem
                        Icon={CiRepeat}
                        title="Wallet Recovery"
                        uri="/wallet-recovery"
                    />
                    <NavigationItem
                        Icon={CiTurnR1}
                        title="Withdraw Approvals"
                        uri="/withdraw-approvals"
                    />
                </div>
            </div>
            <div className="nav-footer">
                <p className="nav-text nav-address">0x5fcf8146...59c8b9</p>
                <div className="nav-footer-icon">
                    <CiFileOn size={20} color="#B2B2B2" />
                    <CiLogin size={20} color="#B2B2B2" />
                </div>
            </div>
        </>
    );
};

const NavigationItem = ({ Icon, title, uri }) => {
    const router = useRouter();
    const pathname = router.pathname;
    console.log("uri :", uri);
    console.log("pathname :", pathname);

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
