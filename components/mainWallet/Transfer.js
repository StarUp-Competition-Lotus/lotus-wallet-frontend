import { Input, Button } from "antd";
import { CiUser, CiCoins1 } from "react-icons/ci";

const Transfer = () => {
    return (
        <div className="wallet-transfer">
            <div className="wallet-transfer-input-area">
                <h4>To</h4>
                <Input
                    className="wallet-transfer-input"
                    size="large"
                    placeholder="0x..."
                    bordered={false}
                    prefix={<CiUser size={25} color="B2B2B2" />}
                />
            </div>
            <div className="wallet-transfer-input-area">
                <h4>Amount (ETH)</h4>
                <Input
                    className="wallet-transfer-input"
                    size="large"
                    bordered={false}
                    placeholder="0.0001"
                    prefix={<CiCoins1 size={25} color="B2B2B2" />}
                />
            </div>
            <Button className="wallet-transfer-send-button" type="primary" size="large" block>
                Send
            </Button>
        </div>
    );
};

export default Transfer;
