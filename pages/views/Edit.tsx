import React, { useEffect } from "react";
import { useRouter } from "next/dist/client/router";
import BoardEdit from "../container/BoardEdit";
import { NextPageContext } from "next";
import { Board } from "../../src/api/board/entities/board.entity";

class EditProps {
    query: {
        board: Board;
    };
    reqQuery: {
        id: string;
    };
}

const Edit = (props: EditProps) => {
    const router = useRouter();
    const { query, reqQuery } = props;
    const { image, content } = query.board;

    useEffect(() => {
        if (!reqQuery?.id) {
            router.replace("/");
        }
    }, []);

    return (
        <>
            <div>
                <BoardEdit
                    router={router}
                    image={image}
                    content={content}
                    status="EDIT"
                    id={reqQuery.id}
                />
            </div>
        </>
    );
};

Edit.getInitialProps = async function (context: NextPageContext) {
    const { query, req } = context;
    const reqQuery = req["query"];
    return { query, reqQuery };
};

export default Edit;
