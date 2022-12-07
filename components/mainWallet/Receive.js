import { Button } from "antd";

const Receive = () => {
    return (
        <div className="wallet-receive">
            <h4 style={{ color: "#3c4048", fontSize: "1.25rem" }}>My QR Code</h4>
            <img src="/QR-code.png" style={{ width: "125px", height: "125px" }} />
            <p style={{ color: "#3c4048" }}>Wallet address</p>
            <p style={{ color: "#aaaaaa" }}>0x5fcf81463a2a63c10f51c4f9d55fb7403759c8b9</p>
            <Button style={{ height: "50px" }} type="primary" size="large" block>
                Copy Address
            </Button>
        </div>
    );
};

export default Receive;
