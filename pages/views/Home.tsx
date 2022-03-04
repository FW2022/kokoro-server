import {
    Button,
    Card,
    CardContent,
    Container,
    Pagination,
} from "@mui/material";
import { NextPageContext } from "next";
import { useRouter } from "next/dist/client/router";
import SwipeableViews from "react-swipeable-views";
import { Board } from "../../src/api/board/entities/board.entity";
import { useState } from "react";
import moment from "moment";
import { FindAllArgDto } from "../../src/api/board/dto/board.dto";
import { User } from "../../src/api/user/entities/user.entity";

type HomeProps = {
    query: {
        board: Board[];
        boardLength: number;
        user: User;
    };
    imagePage: {
        [boardID: string]: number;
    };
    skip: number;
    reqQuery: FindAllArgDto;
};

export default function Home(props: HomeProps) {
    const router = useRouter();
    const { reqQuery, query } = props;
    const { board, user } = query;
    const [imagePage, setImagePage] = useState(props.imagePage);

    return (
        <>
            <Container maxWidth="md">
                <div
                    style={{
                        display: "flex",
                        flexDirection: "row",
                        flexWrap: "wrap",
                        width: "900px",
                    }}
                >
                    {board &&
                        board.map((data) => {
                            return (
                                <Card key={data.id} sx={{ width: 250 + 33 }}>
                                    <CardContent>
                                        <SwipeableViews
                                            index={imagePage[data.id] - 1}
                                        >
                                            {data.image &&
                                                data.image.map((v, idx) => {
                                                    return (
                                                        <div
                                                            key={`${data.id}_${idx}`}
                                                        >
                                                            {/* <p>{data["emotion"][idx]}</p> */}
                                                            <img
                                                                key={`${data.id}_${idx}`}
                                                                src={`/${v}`}
                                                                width={250}
                                                                height={250}
                                                            />
                                                        </div>
                                                    );
                                                })}
                                        </SwipeableViews>
                                        <Pagination
                                            hideNextButton
                                            hidePrevButton
                                            count={data.image.length}
                                            page={imagePage[data.id]}
                                            style={{
                                                display: "flex",
                                                justifyContent: "center",
                                            }}
                                            onChange={(event, v) => {
                                                imagePage[data.id] = v;
                                                setImagePage({
                                                    ...imagePage,
                                                    [data.id]: v,
                                                });
                                                // console.log(imageIndex);
                                            }}
                                        />
                                        <div>
                                            <div>
                                                <a
                                                    href={`/home?userID=${data.authorID}`}
                                                >
                                                    {data.authorID}
                                                </a>
                                                {` ${moment(
                                                    data.createdAt
                                                ).format("YYYY. M. D. HH:mm")}`}
                                            </div>
                                            <div
                                                dangerouslySetInnerHTML={{
                                                    __html: data.content,
                                                }}
                                            ></div>
                                            <div
                                                style={{
                                                    display: "flex",
                                                    justifyContent: "end",
                                                }}
                                            >
                                                {user.id === data.authorID && (
                                                    <Button
                                                        onClick={() => {
                                                            router.push(
                                                                `/edit?id=${data.id}`
                                                            );
                                                        }}
                                                    >
                                                        수정
                                                    </Button>
                                                )}
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            );
                        })}
                </div>
                <div>
                    <Pagination
                        count={Math.ceil(props.query.boardLength / 9)}
                        page={Math.floor(props.skip / 9) + 1}
                        style={{
                            display: "flex",
                            justifyContent: "center",
                        }}
                        onChange={(event, v) => {
                            let urlQuery = `skip=${(v - 1) * 9}`;
                            Object.keys(reqQuery).forEach((v) => {
                                if (v === "skip") return;
                                urlQuery += `&${v}=${reqQuery[v]}`;
                            });
                            router.push(`/home?${urlQuery}`);
                        }}
                    />
                </div>
            </Container>
        </>
    );
}

Home.getInitialProps = async function (context: NextPageContext) {
    try {
        const { query } = context;

        const reqQuery = context.req["query"];
        const skip = reqQuery?.skip ?? 0;

        const { board } = query as any;

        const imagePage = {};

        board.map((v: Board) => {
            imagePage[v.id] = 1;
            if (v.hashtag && v.hashtag.length > 0) {
                const hashtags = v.hashtag.join("|");

                const hashtagRegex = RegExp(`#(${hashtags}*)`, "g");
                v.content = v.content.replace(hashtagRegex, (tag) => {
                    return `<a href="/home/?hashtagEqual=${tag.replace(
                        "#",
                        ""
                    )}">${tag}</a>`;
                });
            }
        });

        return { query, imagePage, skip, reqQuery };
    } catch (err) {
        console.log(err);
        throw err;
    }
};
