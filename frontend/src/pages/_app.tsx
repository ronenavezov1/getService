import { type AppType } from "next/app";
import { type Session } from "next-auth";
import { SessionProvider } from "next-auth/react";

import "~/styles/globals.css";
import RequireUser from "~/components/RequireUser";

const MyApp: AppType<{ session: Session | null }> = ({
  Component,
  pageProps: { session, ...pageProps },
}) => {
  return (
    <SessionProvider session={session}>
      <RequireUser>
        <Component {...pageProps} />
      </RequireUser>
    </SessionProvider>
  );
};

export default MyApp;
