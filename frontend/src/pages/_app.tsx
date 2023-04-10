import { type AppProps } from "next/app";
import { SessionProvider, signIn, useSession } from "next-auth/react";
import "~/styles/globals.css";
import type { NextComponentType, NextPage } from "next"; //Import Component type
import { useRouter } from "next/router";
import { ReactNode } from "react";
import Navbar from "~/components/Navbar";
import { useUser } from "~/api/users";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

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
        <div className="min-h-screen  bg-indigo-500">
          {Component.auth ? (
            <Auth>
              <Component {...pageProps} />
            </Auth>
          ) : (
            <Component {...pageProps} />
          )}
          {/* testing dev tool TODO:remove */}
          <ReactQueryDevtools initialIsOpen={false} />
        </div>
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
  const { data: user, isLoading: isLoadingUser } = useUser(session?.user?.id);

  if (status === "loading" || isLoadingUser) {
    return <div>Loading...</div>;
  }

  if (user?.isCompletedOnBoarding === false) {
    router.push("/onboarding/completeDetails");
    return null;
  }

  const pageAuth = (children as any).type.auth;
  const { requiredRoles } = pageAuth;

  // console.log("requiredRoles:", requiredRoles);
  // console.log("userRole:", user.role);
  // console.log("includes", requiredRoles.includes(user.role));

  //no user will always be unauthorized
  if (!requiredRoles.includes(user?.role)) {
    return <div> Unauthorized </div>; // TODO : change to unauthorized page?
  }

  return (
    <>
      <Navbar name="UserName" />
      {children}
    </>
  );
}

export default MyApp;
