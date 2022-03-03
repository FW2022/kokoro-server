import { Button, FormControlLabel, Radio } from "@mui/material";
import { NextRouter } from "next/dist/client/router";
import axiosInstance from "../lib/axiosInstance";
import { Field, Form, Formik } from "formik";
import { RadioGroup, TextField } from "formik-mui";

type HeaderProps = {
    router: NextRouter;
    authStatus: boolean;
};

export default function Header(props: HeaderProps) {
    const { router, authStatus } = props;
    return (
        <>
            {authStatus && (
                <header>
                    <Formik
                        initialValues={{
                            type: "name",
                            text: "",
                        }}
                        onSubmit={(value, helper) => {
                            const { type, text } = value;
                            let urlQuery = text ? `${type}=${text}` : "";

                            router.push(`/home?${urlQuery}`);
                        }}
                    >
                        {({ submitForm, isSubmitting }) => (
                            <Form style={{ display: "flex" }}>
                                <Field
                                    component={TextField}
                                    name="text"
                                    type="text"
                                    // autoComplete="username"
                                    // placeholder="이메일 주소 또는 사용자 이름"
                                />
                                <Button
                                    variant="contained"
                                    color="primary"
                                    disabled={isSubmitting}
                                    onClick={submitForm}
                                >
                                    검색
                                </Button>
                                <Field
                                    component={RadioGroup}
                                    name="type"
                                    style={{
                                        marginLeft: "10px",
                                        flexDirection: "row",
                                    }}
                                >
                                    <FormControlLabel
                                        label="작성자"
                                        value="name"
                                        control={
                                            <Radio disabled={isSubmitting} />
                                        }
                                        disabled={isSubmitting}
                                    />
                                    <FormControlLabel
                                        label="일반 텍스트"
                                        value="keyword"
                                        control={
                                            <Radio disabled={isSubmitting} />
                                        }
                                        disabled={isSubmitting}
                                    />
                                    <FormControlLabel
                                        label="Hashtag"
                                        value="hashtag"
                                        control={
                                            <Radio disabled={isSubmitting} />
                                        }
                                        disabled={isSubmitting}
                                    />
                                </Field>
                            </Form>
                        )}
                    </Formik>
                    <nav>
                        <a href="/home">Home</a> <a href="/new">New</a>{" "}
                        <a href="/profile">Profile</a>{" "}
                        <a href="/follow">Follow</a> <a href="/msg">Message</a>{" "}
                        <Button
                            onClick={() => {
                                axiosInstance()
                                    .post("/api/auth/sign-out")
                                    .then((res) => {
                                        router.replace("/");
                                    })
                                    .catch((err) => {
                                        console.log(err);
                                    });
                            }}
                        >
                            Logout
                        </Button>
                    </nav>
                </header>
            )}
        </>
    );
}
