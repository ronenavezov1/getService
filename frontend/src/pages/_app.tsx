import { type AppProps } from "next/app";
import { SessionProvider } from "next-auth/react";
import "~/styles/globals.css";
import type { NextComponentType } from "next"; //Import Component type
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import Auth, { PageWithAuth } from "~/components/Auth";

type AuthAppProps = AppProps & {
  Component: NextComponentType & PageWithAuth;
};

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

export default MyApp;
