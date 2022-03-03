import { useCallback, useState } from "react";
import { UiFileInputButton } from "../components/UiFileInputButton";
import { Field, Form, Formik } from "formik";
import { TextField } from "formik-mui";
import {
    Button,
    IconButton,
    ImageList,
    ImageListItem,
    ImageListItemBar,
} from "@mui/material";
import { Cancel } from "@mui/icons-material";
import axiosInstance from "../lib/axiosInstance"

class BoardEditProps {
    status: "EDIT" | "NEW";
    router: any;
    content?: string = "";
    image?: string[] = [];
    id?: string;
}

const BoardEdit = (props: BoardEditProps) => {
    const { router, status, content, image } = props;
    const [thumb, setThumb] = useState<string[]>(image ?? []);
    const [progress, setProgress] = useState<number>(0);
    const onChange = useCallback(
        async (formData: FormData) => {
            const config = {
                headers: { "content-type": "multipart/form-data" },
                onUploadProgress: (event: {
                    loaded: number;
                    total: number;
                }) => {
                    setProgress(Math.round((event.loaded * 100) / event.total));
                },
            };

            axiosInstance()
                .post<any>("/api/board/upload-image", formData, config)
                .then((res) => {
                    const tmpThumb = [
                        ...thumb,
                        ...res.data.files.map((v) => v.filename),
                    ];

                    setThumb(tmpThumb);
                })
                .catch((err) => {
                    console.log(err);
                });
        },
        [thumb]
    );
    const onRemoveImage = useCallback(
        (item) => {
            setThumb((prev) => prev.filter((v) => v !== item));
        },
        [thumb]
    );

    return (
        <>
            <div>
                <Formik
                    initialValues={{
                        content,
                    }}
                    onSubmit={(value, helper) => {
                        if (thumb.length > 0) {
                            if (status === "NEW") {
                                axiosInstance()
                                    .post("/api/board", {
                                        ...value,
                                        image: thumb,
                                    })
                                    .then((res) => {
                                        console.log(
                                            "board upload result",
                                            res.data
                                        );
                                        if (res.data) {
                                            router.replace("/home");
                                        }
                                    })
                                    .catch((err) => {
                                        console.log(err);
                                        helper.setSubmitting(false);
                                    });
                            } else if (status === "EDIT") {
                                axiosInstance()
                                    .patch(`/api/board/${props.id}`, {
                                        ...value,
                                        image: thumb,
                                    })
                                    .then((res) => {
                                        console.log(
                                            "board upload result",
                                            res.data
                                        );
                                        if (res.data) {
                                            router.replace("/home");
                                        }
                                    })
                                    .catch((err) => {
                                        console.log(err);
                                        helper.setSubmitting(false);
                                    });
                            }
                        } else {
                            helper.setSubmitting(false);
                        }
                    }}
                >
                    {({ submitForm, isSubmitting }) => (
                        <Form>
                            <Field
                                component={TextField}
                                name="content"
                                type="text"
                                multiline={false}
                                style={{ width: 240 * 5 }}
                                placeholder={"내용 및 해시태그를 입력하시오"}
                            />
                            <ImageList
                                sx={{
                                    width: 240 * 5,
                                    height: 240,
                                    border: "1px solid black",
                                    overflow: "hidden",
                                }}
                                cols={5}
                            >
                                {thumb &&
                                    thumb.map((item: string, i: number) => {
                                        console.log("item", item);
                                        return (
                                            <ImageListItem key={item}>
                                                <img
                                                    src={`/${item}`}
                                                    width={240}
                                                    height={240}
                                                />
                                                <ImageListItemBar
                                                    position="top"
                                                    sx={{
                                                        background: "#FFFFFF66",
                                                    }}
                                                    actionIcon={
                                                        <IconButton>
                                                            <Cancel
                                                                onClick={() =>
                                                                    onRemoveImage(
                                                                        item
                                                                    )
                                                                }
                                                            />
                                                        </IconButton>
                                                    }
                                                    actionPosition="right"
                                                />
                                            </ImageListItem>
                                        );
                                    })}
                            </ImageList>
                            <UiFileInputButton
                                label="Upload Files"
                                // allowMultipleFiles 가 false 일경우, 하나씩만 올릴 수 있다.
                                allowMultipleFiles={true}
                                uploadFileName="files"
                                onChange={onChange}
                                thumb={thumb}
                            />
                            <Button
                                key="save"
                                variant="contained"
                                color="primary"
                                disabled={isSubmitting}
                                onClick={submitForm}
                            >
                                저장
                            </Button>
                            <br />
                            <br />
                        </Form>
                    )}
                </Formik>
                {status === "EDIT" && (
                    <Button
                        key="delete"
                        variant="outlined"
                        color="error"
                        onClick={() => {
                            axiosInstance()
                                .delete(`/api/board/${props.id}`)
                                .then((res) => {
                                    console.log(
                                        "board remove result",
                                        res.data
                                    );
                                    if (res.data) {
                                        router.replace("/home");
                                    }
                                })
                                .catch((err) => {
                                    console.log(err);
                                });
                        }}
                    >
                        삭제
                    </Button>
                )}
            </div>
        </>
    );
};

export default BoardEdit;
