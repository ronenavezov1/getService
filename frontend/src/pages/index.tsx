import { signIn, signOut, useSession } from "next-auth/react";
import { NextPageWithAuth, UserRole } from "~/components/Auth";

const Home: NextPageWithAuth = () => {
  const { data: session } = useSession();
  // console.log(session);

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

Home.auth = {
  requiredRoles: [UserRole.ADMIN, UserRole.CUSTOMER, UserRole.PROVIDER],
};

export default Home;
