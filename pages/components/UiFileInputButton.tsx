import {useRef} from "react";

export interface IProps {
    acceptedFileTypes?: string;
    allowMultipleFiles?: boolean;
    label: string;
    onChange: (formData: FormData) => void;
    uploadFileName: string;
    thumb: string[];
}

/**
 * Nextjs 에서 MULTER로 이미지 업로드 - 1 -
 * 출처 : https://velog.io/@familyman80/Nextjs-%EC%97%90%EC%84%9C-MULTER%EB%A1%9C-%EC%9D%B4%EB%AF%B8%EC%A7%80-%EC%97%85%EB%A1%9C%EB%93%9C-1-
 */
export const UiFileInputButton: any = (props) => {
    const fileInputRef = useRef<HTMLInputElement | null>(null);
    const formRef = useRef<HTMLFormElement | null>(null);

    const onClickHandler = () => {
        fileInputRef.current?.click();
    };

    const onChangeHandler = (event: any) => {
        if (!event.target.files?.length) {
            return;
        }

        if (event.target.files?.length + props.thumb?.length > 5) {
            console.log("5개 초과", event.target.files, props.thumb);
            return;
        }

        const formData = new FormData();

        Array.from(event.target.files).forEach((file: any) => {
            formData.append(event.target.name, file);
        });

        props.onChange(formData);

        formRef.current?.reset();
    };

    return (
        <form ref={formRef}>
            <button type="button" onClick={onClickHandler}>
                {props.label}
            </button>
            <input
                accept={props.acceptedFileTypes}
                multiple={props.allowMultipleFiles}
                name={props.uploadFileName}
                onChange={onChangeHandler}
                ref={fileInputRef}
                style={{ display: "none" }}
                type="file"
            />
        </form>
    );
};

UiFileInputButton.defaultProps = {
    acceptedFileTypes: "",
    allowMultipleFiles: false,
};
