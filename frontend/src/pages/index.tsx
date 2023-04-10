import { signIn, signOut, useSession } from "next-auth/react";
import { NextPageWithAuth } from "./_app";

const Home: NextPageWithAuth = () => {
  const { data: session } = useSession();
  console.log(session);

  if (session) {
    return (
      <div className="container ">
        <p className=" w-full break-words text-xl">{`${JSON.stringify(
          session
        )}`}</p>
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
