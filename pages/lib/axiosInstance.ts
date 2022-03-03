import axios from "axios";

/**
 * @description statusCode 200을 제외한 다른 statusCode들의 statusText를 제대로 반환하기 위해 interceptor 설정을 진행한 axios instnace를 반환하는 함수입니다
 */
export default function axiosInstance() {
    const instance = axios.create({
        timeout: 5000,
    });

    instance.interceptors.response.use(
        function (response) {
            return response;
        },

        function (error) {
            const statusCode = error.response.data.statusCode;
            const message = error.response.data.message;
            const code = error.code;
            return Promise.reject({ statusCode, message, code, error });
        }
    );

    return instance;
}
