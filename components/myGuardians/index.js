import PageContainer from "../PageContainer";
import MyGuardiansTable from "./MyGuardiansTable";

const MyGuardians = () => {
    const contentList = [
        {
            section: "Guardians",
            component: <MyGuardiansTable />,
        },
    ];

    return <PageContainer title="My Guardians" contentList={contentList} />;
};

export default MyGuardians;
