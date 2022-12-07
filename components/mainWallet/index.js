import { useState } from "react";

import Balance from "./Balances";
import Receive from "./Receive";
import Transfer from "./Transfer";

const MainWallet = () => {
    const [dataDisplayed, setDataDisplayed] = useState("balances");

    return (
        <div className="main-wallet">
            <div className="main-wallet-header">
                <h2>Wallet</h2>
                <div className="main-wallet-select">
                    <p
                        className={
                            "main-wallet-select-text" +
                            (dataDisplayed === "balances"
                                ? " main-wallet-select-text-selected"
                                : "")
                        }
                        onClick={() => {
                            setDataDisplayed("balances");
                        }}
                    >
                        Balances
                    </p>
                    <p
                        className={
                            "main-wallet-select-text" +
                            (dataDisplayed === "transfer"
                                ? " main-wallet-select-text-selected"
                                : "")
                        }
                        onClick={() => {
                            setDataDisplayed("transfer");
                        }}
                    >
                        Transfer
                    </p>
                    <p
                        className={
                            "main-wallet-select-text" +
                            (dataDisplayed === "receive" ? " main-wallet-select-text-selected" : "")
                        }
                        onClick={() => {
                            setDataDisplayed("receive");
                        }}
                    >
                        Receive
                    </p>
                </div>
            </div>
            <div className="main-wallet-body">
                {dataDisplayed === "balances" && <Balance />}
                {dataDisplayed === "transfer" && <Transfer />}
                {dataDisplayed === "receive" && <Receive />}
            </div>
        </div>
    );
};

export default MainWallet;
