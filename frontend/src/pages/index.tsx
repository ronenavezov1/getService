import { signIn, signOut, useSession } from "next-auth/react";
import { NextPageWithAuth } from "./_app";

const Home: NextPageWithAuth = () => {
  const { data: session } = useSession();

  if (session) {
    return (
      <>
        Signed in as {JSON.stringify(session)} <br />
        <button onClick={() => signOut()}>Sign out</button>
      </>
    );
  }
  return (
    <>
      Not signed in <br />
      <button onClick={() => signIn()}>Sign in</button>
    </>
  );
};

export default Home;
