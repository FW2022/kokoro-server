import {
    Button,
    Container,
    List,
    ListItem,
    ListItemButton,
    ListItemText,
} from "@mui/material";
import { Box } from "@mui/system";
import { Field, Form, Formik } from "formik";
import { TextField } from "formik-mui";
import { NextPageContext } from "next";
import { useRouter } from "next/dist/client/router";
import { useEffect, useState } from "react";
import { FindMessageRes } from "../../src/api/messenger/dto/messenger.dto";
import { MessengerText } from "../../src/api/messenger/entities/messengerText.entity";
import { MessengerUser } from "../../src/api/messenger/entities/messengerUser.entity";
import { User } from "../../src/api/user/entities/user.entity";
import axiosInstance from "../lib/axiosInstance";

type MessageProps = {
    query: {
        user: User;
        messenger: FindMessageRes[];
    };
};

export default function Msg(props: MessageProps) {
    const { user, messenger } = props.query;

    const router = useRouter();

    const [selectedIndex, setSelectedIndex] = useState("");
    const [messages, setMessages] = useState<MessengerText[]>([]);

    const handleListItemClick = (
        event: React.MouseEvent<HTMLDivElement, MouseEvent>,
        index: string
    ) => {
        setSelectedIndex(index);
    };

    useEffect(() => {
        if (selectedIndex) {
            axiosInstance()
                .get<{
                    msgUser: MessengerUser;
                    messages: MessengerText[];
                }>(`/api/messenger/message?messengerID=${selectedIndex}`)
                .then((res) => {
                    setMessages(res.data.messages);
                });
        }
    }, [selectedIndex]);

    return (
        <>
            <List sx={{ width: "320px", overflowY: "auto" }}>
                {messenger &&
                    messenger.map((data, i) => {
                        return (
                            <ListItem key={data.messenger.id}>
                                <ListItemButton
                                    selected={
                                        selectedIndex === data.messenger.id
                                    }
                                    onClick={(event) =>
                                        handleListItemClick(
                                            event,
                                            data.messenger.id
                                        )
                                    }
                                >
                                    <ListItemText
                                        primary={data.targetUserInfo.id}
                                        secondary={data.targetUserInfo.name}
                                    />
                                </ListItemButton>
                            </ListItem>
                        );
                    })}
            </List>
            <Box
                style={{
                    width: "100%",
                    height: "100%",
                    backgroundColor: "#666666",
                    flexDirection: "column-reverse",
                    display: "flex",
                }}
            >
                <Formik
                    initialValues={{
                        text: "",
                    }}
                    onSubmit={(value, helper) => {
                        axiosInstance()
                            .post("/api/messenger/message", {
                                messengerID: selectedIndex,
                                text: value.text,
                            })
                            .then((res) => {
                                router.reload();
                                helper.setSubmitting(false);
                            })
                            .catch((err) => {
                                console.log(err);
                            })
                            .finally(() => {
                                helper.setSubmitting(false);
                            });
                    }}
                >
                    {({ submitForm, isSubmitting }) => (
                        <Form
                            style={{
                                width: "100%",
                                display: "flex",
                            }}
                        >
                            <Field
                                component={TextField}
                                name="text"
                                type="text"
                                style={{
                                    width: "100%",
                                }}
                            />
                            <Button
                                variant="contained"
                                color="primary"
                                disabled={isSubmitting}
                                onClick={submitForm}
                            >
                                전송
                            </Button>
                        </Form>
                    )}
                </Formik>
                <div
                    style={{
                        overflowY: "auto",
                        display: "flex",
                        flex: 1,
                        flexDirection: "column-reverse",
                    }}
                >
                    {messages?.length > 0 &&
                        messages.map((message) => (
                            <div
                                key={message.id}
                                style={{
                                    display: "flex",
                                    placeContent:
                                        message.userID === user.id &&
                                        "flex-end",
                                    margin: "5px",
                                    backgroundColor: "#FFFFFF",
                                }}
                            >
                                {message.text}
                            </div>
                        ))}
                </div>
            </Box>
        </>
    );
}

Msg.getInitialProps = async function (context: NextPageContext) {
    const { query } = context;
    return { query };
};
