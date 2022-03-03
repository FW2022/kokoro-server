import { Button } from "@mui/material";
import { Field, Form, Formik } from "formik";
import { TextField } from "formik-mui";
import { NextRouter } from "next/dist/client/router";
import axiosInstance from "../lib/axiosInstance";

interface SignInProps {
    router: NextRouter;
}

export default function SignIn(props: SignInProps) {
    return (
        <>
            <div>
                <Formik
                    initialValues={{
                        username: "",
                        password: "",
                    }}
                    onSubmit={(value, helper) => {
                        axiosInstance()
                            .post("/api/auth/sign-in", {
                                ...value,
                            })
                            .then((res) => {
                                console.log(res);
                                if (
                                    res.data.roles.some(
                                        (v) => v === "EmailVerified"
                                    )
                                ) {
                                    props.router.replace("/home");
                                } else {
                                    props.router.reload();
                                }
                            })
                            .catch((err) => {
                                console.log(err);
                                if (
                                    err?.error?.response?.data?.includes(
                                        `"message":"Password is wrong"`
                                    )
                                ) {
                                    alert("Password is wrong");
                                }
                                if (
                                    err?.error?.response?.data?.includes(
                                        `"message":"User Not Found"`
                                    )
                                ) {
                                    alert("User Not Found");
                                }
                                helper.setSubmitting(false);
                            });
                    }}
                >
                    {({ submitForm, isSubmitting }) => (
                        <Form>
                            <Field
                                component={TextField}
                                name="username"
                                type="text"
                                autoComplete="username"
                                placeholder="이메일 주소 또는 사용자 이름"
                            />
                            <br />
                            <Field
                                component={TextField}
                                name="password"
                                type="password"
                                autoComplete="current-password"
                                placeholder="비밀번호"
                            />
                            <br />
                            <Button
                                variant="contained"
                                color="primary"
                                disabled={isSubmitting}
                                onClick={submitForm}
                            >
                                로그인
                            </Button>
                        </Form>
                    )}
                </Formik>
            </div>
            <div>
                계정이 없으신가요? <a href="/account">회원가입</a>
            </div>
            <div>
                커뮤니티 사이트 입니다
                <img src="https://picsum.photos/200/300" />
            </div>
        </>
    );
}
