import { Spin } from "antd";

const SpinningScreen = () => {
    return (
        <div
            style={{
                height: "100vh",
                backgroundColor: "#F3F4F6",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
            }}
        >
            <Spin size="large" />;
        </div>
    );
};

export default SpinningScreen;
