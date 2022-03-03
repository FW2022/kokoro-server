export default function Layout({ children }) {
    return (
        <>
            {children}
            <style global jsx>
                {`
                    #__next {
                        height: 100%;
                        width: 100%;
                        overflow: auto;
                    }
                `}
            </style>
        </>
    );
}
