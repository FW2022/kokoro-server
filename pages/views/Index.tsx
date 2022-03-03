import { NextPageContext } from "next";
import EmailVerification from "../container/EmailVerification";
import SignIn from "../container/SignIn";
import { User } from "../../src/api/user/entities/user.entity";
import { useRouter } from "next/dist/client/router";
import { useEffect } from "react";

export type IndexProps = {
    query: {
        user?: User;
        isAuth: boolean;
        isEmailVerified: boolean;
        email: string;
    };
};

export default function Index(props: IndexProps) {
    const { isAuth, isEmailVerified, email } = props.query;

    const router = useRouter();

    useEffect(() => {
        if (isAuth && isEmailVerified) {
            router.replace("/home");
        }
    }, []);

    return isAuth ? (
        <EmailVerification email={email} router={router} />
    ) : (
        <SignIn router={router} />
    );
}

Index.getInitialProps = async function (context: NextPageContext) {
    const { query } = context;
    return { query };
};
