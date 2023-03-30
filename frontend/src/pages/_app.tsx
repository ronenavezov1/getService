import { AppProps, type AppType } from "next/app";
import { SessionProvider, useSession } from "next-auth/react";
import "~/styles/globals.css";
import RequireUser from "~/components/RequireUser";

import type { NextComponentType } from "next"; //Import Component type
import { useRouter } from "next/router";
import { ReactNode } from "react";

//Add custom appProp type then use union to add it
type AuthAppProps = AppProps & {
  Component: NextComponentType & { auth?: boolean }; // add auth type
};

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

function Auth({ children }: { children: ReactNode }) {
  // if `{ required: true }` is supplied, `status` can only be "loading" or "authenticated"
  const router = useRouter();
  const { data: session, status } = useSession({ required: true });

  if (status === "loading") {
    return <div>Loading...</div>;
  }

  if (session && !session.user) router.push("/onboarding/completeDetails");
  return <>{session.user && children}</>;
}

export default MyApp;
