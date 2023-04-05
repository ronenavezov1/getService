import { type AppProps } from "next/app";
import { SessionProvider, useSession } from "next-auth/react";
import "~/styles/globals.css";
import type { NextComponentType, NextPage } from "next"; //Import Component type
import { useRouter } from "next/router";
import { ReactNode } from "react";
import { QueryClient, QueryClientProvider, useQuery } from "react-query";
import { env } from "~/env.mjs";

type AuthAppProps = AppProps & {
  Component: NextComponentType & PageWithAuth;
};

// new page type
type PageWithAuth = {
  auth?: {
    requiredRoles: string[];
  };
};

export type NextPageWithAuth<Props = {}, InitialProps = Props> = NextPage<
  Props,
  InitialProps
> &
  PageWithAuth;

const queryClient = new QueryClient();

const MyApp = ({
  Component,
  pageProps: { session, ...pageProps },
}: AuthAppProps) => {
  return (
    <SessionProvider session={session}>
      <QueryClientProvider client={queryClient}>
        {Component.auth ? (
          <Auth>
            <Component {...pageProps} />
          </Auth>
        ) : (
          <Component {...pageProps} />
        )}
      </QueryClientProvider>
    </SessionProvider>
  );
};

type AuthProps = {
  children: ReactNode;
};

function Auth({ children }: AuthProps) {
  const router = useRouter();
  const { data: session, status } = useSession({ required: true });
  const { data: user, isLoading } = useQuery("user", () =>
    fetch(`http://localhost:4000/api/test/1`).then((res) => {
      console.log(res);
      return res.json();
    })
  );

  if (status === "loading" || isLoading) {
    return <div>Loading...</div>;
  }

  console.log("user:", user);

  if (user.isCompletedOnBoarding === false) {
    router.push("/onboarding/completeDetails");
    return null;
  }

  const pageAuth = (children as any).type.auth;
  const { requiredRoles } = pageAuth;

  if (!!!requiredRoles.includes(user.role)) {
    return <div> Unauthorized </div>; //change to unauthorized page?
  }

  return <>{children}</>;
}

export default MyApp;
