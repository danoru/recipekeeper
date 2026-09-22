import { GetServerSideProps } from "next";
import { getServerSession } from "next-auth";

import LoginForm from "../src/components/account/LoginForm";

import { authOptions } from "./api/auth/[...nextauth]";

function LoginPage() {
  return <LoginForm />;
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const session = await getServerSession(context.req, context.res, authOptions);

  if (session) {
    const callback = context.query.callbackUrl;
    const destination =
      typeof callback === "string" && callback.startsWith("/") && !callback.startsWith("//")
        ? callback
        : "/";
    return {
      redirect: {
        destination,
        permanent: false,
      },
    };
  }

  return {
    props: {},
  };
};
export default LoginPage;
