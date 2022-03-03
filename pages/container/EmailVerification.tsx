import { Button } from "@mui/material";
import axios from "axios";
import { Field, Form, Formik } from "formik";
import { TextField } from "formik-mui";
import { NextRouter } from "next/dist/client/router";
import axiosInstance from "../lib/axiosInstance";

interface EmailVerificationProps {
    email: string;
    router: NextRouter;
}

export default function EmailVerification(props: EmailVerificationProps) {
    return (
        <>
            <div>
                <span>{props.email}</span>
                <Button
                    onClick={() => {
                        axiosInstance()
                            .post("/api/auth/send-email-verification")
                            .then((res) => {
                                console.log("send email result", res.data);
                            })
                            .catch((err) => {
                                console.log(err);
                                // helper.setSubmitting(false);
                            });
                    }}
                >
                    Resend
                </Button>
            </div>
            <div>
                <Formik
                    initialValues={{
                        code: "",
                    }}
                    onSubmit={(value, helper) => {
                        axios
                            .post("/api/auth/verify-email", {
                                ...value,
                            })
                            .then((res) => {
                                console.log("verify result", res.data);
                                if (res.data.result) {
                                    props.router.replace("/home");
                                }
                            })
                            .catch((err) => {
                                console.log(`${err}`);
                                if (`${err}`.includes(`406`)) {
                                    alert("Failed verify. Please resend.");
                                }
                                helper.setSubmitting(false);
                            });
                    }}
                >
                    {({ submitForm, isSubmitting }) => (
                        <Form>
                            <Field
                                component={TextField}
                                name="code"
                                type="text"
                                placeholder="Enter Authentication Number"
                            />
                            <Button
                                variant="contained"
                                color="primary"
                                disabled={isSubmitting}
                                onClick={submitForm}
                            >
                                OK
                            </Button>
                        </Form>
                    )}
                </Formik>
            </div>
        </>
    );
}
