import { Container } from "@mui/material";
import axios from "axios";
import moment from "moment";
import App, { AppContext } from "next/app";
import { useRouter } from "next/dist/client/router";
import { useEffect } from "react";
import Header from "./components/Header";
import Layout from "./components/Layout";

moment.locale("ko");

export default function AppRoot({ Component, pageProps }) {
    const router = useRouter();

    useEffect(() => {
        if (pageProps.setAuthorization) {
            axios.defaults.headers["authorization"] =
                pageProps.setAuthorization;
        }
    }, []);

    return (
        <Layout>
            <Container maxWidth="md" style={{ height: "10%" }}>
                <Header
                    router={router}
                    authStatus={!!pageProps.setAuthorization}
                ></Header>
            </Container>
            <Container maxWidth="md" style={{ display: "flex", height: "90%" }}>
                <Component {...pageProps} />
            </Container>
        </Layout>
    );
}

AppRoot.getInitialProps = async (appContext: AppContext) => {
    const appProps = await App.getInitialProps(appContext);

    const cookie = appContext?.ctx?.req?.headers?.cookie?.split("=");
    const isToken = cookie?.indexOf("access_token");

    if (!appContext?.ctx?.req?.headers?.authorization && isToken > -1) {
        const authorization = "Bearer " + cookie[isToken + 1];
        appProps.pageProps.setAuthorization = authorization;
    }

    return { ...appProps };
};
