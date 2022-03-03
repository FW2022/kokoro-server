import { Button, List, ListItem, ListItemText } from "@mui/material";
import { NextPageContext } from "next";
import { useRouter } from "next/dist/client/router";
import { User } from "../../src/api/user/entities/user.entity";
import axiosInstance from "../lib/axiosInstance";

type FollowProps = {
    query: {
        userList: User[];
        user: User;
    };
};

export default function Follow(props: FollowProps) {
    const { userList, user } = props.query;
    const router = useRouter();
    return (
        <>
            <div>
                <List sx={{ width: "320px", overflowY: "auto" }}>
                    {userList &&
                        userList.map((data) => {
                            if (data.id === user.id) return null;
                            return (
                                <ListItem
                                    key={data.id}
                                    secondaryAction={
                                        <Button
                                            onClick={() => {
                                                axiosInstance()
                                                    .post("/api/user/follow", {
                                                        targetUserID: data.id,
                                                    })
                                                    .then((res) => {
                                                        // console.log(
                                                        //     JSON.stringify(
                                                        //         res.data
                                                        //     )
                                                        // );
                                                        router.reload();
                                                    })
                                                    .catch((err) => {
                                                        console.log(err);
                                                    });
                                            }}
                                        >
                                            {user.following?.length > 0 &&
                                            user.following.some(
                                                (v) => v.id === data.id
                                            )
                                                ? "FOLLOWING"
                                                : "FOLLOW"}
                                        </Button>
                                    }
                                >
                                    <ListItemText
                                        primary={data.id}
                                        secondary={data.name}
                                    />
                                </ListItem>
                            );
                        })}
                </List>
            </div>
        </>
    );
}

Follow.getInitialProps = async function (context: NextPageContext) {
    const { query } = context;
    // console.dir(query, {
    //     maxArrayLength: 10,
    //     depth: null,
    // });
    return { query };
};
