import PageContainer from '../PageContainer';
import Balances from "./Balances";
import Receive from "./Receive";
import Transfer from "./Transfer";

const MainWallet = () => {

    const contentList = [
        {
            section: "Balances",
            component: <Balances />
        },
        {
            section: "Transfer",
            component: <Transfer />
        },
        {
            section: "Receive",
            component: <Receive />
        }
    ]


    return <PageContainer title="Wallet" contentList={contentList} />

};

export default MainWallet;
