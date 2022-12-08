import PageContent from "../PageContent";
import MyGuardiansTable from "./MyGuardiansTable";

const MyGuardians = () => {
    const contentList = [
        {
            section: "Guardians",
            component: <MyGuardiansTable />,
        },
    ];

    return <PageContent title="My Guardians" contentList={contentList} />;
};

export default MyGuardians;
