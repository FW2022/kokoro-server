import { useRouter } from "next/dist/client/router";
import BoardEdit from "../container/BoardEdit";

const New = () => {
    const router = useRouter();
    return (
        <>
            <div>
                <BoardEdit router={router} status="NEW" />
            </div>
        </>
    );
};

export default New;
