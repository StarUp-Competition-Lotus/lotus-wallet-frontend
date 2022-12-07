const Balances = () => {
    return (
        <div className="wallet-balances">
            <div className="wallet-total">
                <p style={{ color: "#aaaaaa" }}>Total: </p>
                <h2 className="wallet-total-amount">$100</h2>
            </div>
            <div className="wallet-assets">
                <div className="wallet-assets-header">
                    <p>My assets</p>
                </div>
                <div className="wallet-assets-list">
                    <Token name="ETH" amount="0.00" />
                    <Token name="DAI" amount="0.00" />
                    <Token name="LINK" amount="0.00" />
                </div>
            </div>
        </div>
    );
};

const Token = ({ name, amount }) => {
    return (
        <div className="wallet-assets-token">
            <div style={{ width: "20%", display: "flex", alignItems: "center", gap: "0.75rem" }}>
                <div className="wallet-assets-symbol" />
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
