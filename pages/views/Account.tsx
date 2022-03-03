import { Button } from "@mui/material";
import { Field, Form, Formik } from "formik";
import { TextField } from "formik-mui";
import { NextPageContext } from "next";
import { useRouter } from "next/dist/client/router";
import Head from "next/head";
import axiosInstance from "../lib/axiosInstance";

type AccountProps = {
    query: {
        title: string;
    };
};

export default function Account(props: AccountProps) {
    const router = useRouter();

    const { title } = props.query;
    return (
        <>
            <Head>
                <title>{title}</title>
            </Head>
            <div>
                <Formik
                    initialValues={{
                        email: "",
                        name: "",
                        id: "",
                        password: "",
                    }}
                    onSubmit={(value, helper) => {
                        axiosInstance()
                            .post("/api/auth/sign-up", { ...value })
                            .then((res) => {
                                router.push("/");
                            })
                            .catch((err) => {
                                console.log(err);
                                if (
                                    err?.error?.response?.data?.includes(
                                        `"message":"User already exist"`
                                    )
                                ) {
                                    alert("User already exist");
                                }
                                helper.setSubmitting(false);
                            });
                    }}
                >
                    {({ submitForm, isSubmitting }) => (
                        <Form>
                            <Field
                                component={TextField}
                                name="email"
                                type="email"
                                autoComplete="email"
                                placeholder="이메일 주소"
                            />
                            <br />
                            <Field
                                component={TextField}
                                name="name"
                                type="text"
                                autoComplete="name"
                                placeholder="성명"
                            />
                            <br />
                            <Field
                                component={TextField}
                                name="id"
                                type="text"
                                autoComplete="username"
                                placeholder="사용자 이름"
                            />
                            <br />
                            <Field
                                component={TextField}
                                name="password"
                                type="password"
                                autoComplete="new-password"
                                placeholder="비밀번호"
                            />
                            <br />
                            <Button
                                variant="contained"
                                color="primary"
                                disabled={isSubmitting}
                                onClick={submitForm}
                            >
                                가입
                            </Button>
                        </Form>
                    )}
                </Formik>
            </div>
        </>
    );
}

Account.getInitialProps = async function (context: NextPageContext) {
    const { query } = context;
    return { query };
};
