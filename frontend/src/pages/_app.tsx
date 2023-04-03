import { type AppProps } from "next/app";
import { SessionProvider, useSession } from "next-auth/react";
import "~/styles/globals.css";
import type { NextComponentType, NextPage } from "next"; //Import Component type
import { useRouter } from "next/router";
import { ReactNode } from "react";

type AuthAppProps = AppProps & {
  Component: NextComponentType & PageWithAuth;
};

export type PageWithAuth = {
  auth?: {
    requiredRole: string;
  };
};

export type NextPageWithAuth<Props = {}, InitialProps = Props> = NextPage<
  Props,
  InitialProps
> &
  PageWithAuth;

const MyApp = ({
  Component,
  pageProps: { session, ...pageProps },
}: AuthAppProps) => {
  return (
    <SessionProvider session={session}>
      {Component.auth ? (
        <Auth>
          <Component {...pageProps} />
        </Auth>
      ) : (
        <Component {...pageProps} />
      )}
    </SessionProvider>
  );
};

type AuthProps = {
  children: ReactNode;
};

function Auth({ children }: AuthProps) {
  const router = useRouter();
  const { data: session, status } = useSession({ required: true });

  if (status === "loading") {
    return <div>Loading...</div>;
  }

  if (!session.user) {
    router.push("/onboarding/completeDetails");
    return null;
  }

  const pageAuth = (children as any).type.auth;
  const { requiredRole } = pageAuth;

  if (session.user.role !== requiredRole) {
    return <div> Unauthorized </div>; //change to unauthorized page?
  }

  return <>{children}</>;
}

export default MyApp;
