import Document, { Html, Head, Main, NextScript } from "next/document";

export default class RootDocument extends Document {
    render() {
        return (
            <Html style={{ height: "100%" }}>
                <Head>
                    <meta charSet="utf-8" />
                </Head>
                <body style={{ height: "100%", margin: 0 }}>
                    <Main />
                    <NextScript />
                </body>
            </Html>
        );
    }
}
