import { signIn, signOut, useSession } from "next-auth/react";
import { NextPageWithAuth } from "./_app";

const Home: NextPageWithAuth = () => {
  const { data: session } = useSession();

  if (session) {
    return (
      <div className=" modal">
        <h1 className="text-6xl">
          Signed in as {JSON.stringify(session)} <br />
          {JSON.stringify(session.user)}
        </h1>
        <button onClick={() => signOut()}>Sign out</button>
      </div>
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
