import "react-toastify/dist/ReactToastify.css";
// minified version is also included
// import 'react-toastify/dist/ReactToastify.min.css';
import { type AppProps } from "next/app";
import { SessionProvider, signOut } from "next-auth/react";
import "~/styles/globals.css";
import type { NextComponentType } from "next"; //Import Component type
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import Auth, { PageWithAuth } from "~/components/Auth";
import { ToastContainer, toast } from "react-toastify";
import { AxiosError, isAxiosError } from "axios";

type AuthAppProps = AppProps & {
  Component: NextComponentType & PageWithAuth;
};

interface ErrorResponse {
  message: string;
  statusCode: number;
}

/**
 * client default:
 * - onError: if error is axios error show toast with error message, if 401 'Unauthorized' log out
 */

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      onError: async (err: unknown) => {
        if (isAxiosError(err)) {
          const axiosError = err as AxiosError<ErrorResponse>;

          if (axiosError.response?.status === 401) {
            const WAITING_TIME = 5000;

            toast.error("Unauthorized, logging out...");
            return await setTimeout(async () => await signOut(), WAITING_TIME);
          }

          toast.error(axiosError.response?.data.message ?? "An error occurred");
        } else {
          toast.error("Unknown error occurred");
        }
      },
    },
  },
});

const MyApp = ({
  Component,
  pageProps: { session, ...pageProps },
}: AuthAppProps) => {
  return (
    <SessionProvider session={session}>
      <QueryClientProvider client={queryClient}>
        {/* toast container */}
        <ToastContainer
          position="top-center"
          autoClose={5000}
          toastClassName={"m-2 bg-indigo-900 text-yellow-500"}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
        />

        <div className="min-h-screen  bg-indigo-500">
          {/* Auth */}
          {Component.auth ? (
            <Auth>
              <Component {...pageProps} />
            </Auth>
          ) : (
            <Component {...pageProps} />
          )}
          {/* testing dev tool TODO:remove */}
          <ReactQueryDevtools initialIsOpen={false} />
          {/* testing dev tool TODO:remove */}
        </div>
      </QueryClientProvider>
    </SessionProvider>
  );
};

export default MyApp;
