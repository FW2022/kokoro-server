import { NextPageContext } from "next";
import { User } from "../../src/api/user/entities/user.entity";

type ProfileProps = {
    query: {
        username: string;
        user: User;
    };
};

export default function Profile(props: ProfileProps) {
    const { username, user } = props.query;
    return (
        <>
            <div>
                <p>로그인 한 ID(사용자 이름) : {username}</p>
                <p>Date and Time : {new Date().toISOString()}</p>
                <p>내가 팔로잉 중인 사람 {user.following.length}명</p>
                <p>나를 팔로우 중인 사랑 {user.follower.length}명</p>
            </div>
        </>
    );
}

Profile.getInitialProps = async function (context: NextPageContext) {
    const { query } = context;
    return { query };
};
