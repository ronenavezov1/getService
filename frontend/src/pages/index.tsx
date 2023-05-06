import { signIn, signOut, useSession } from "next-auth/react";
import { type NextPageWithAuth, UserRole } from "~/components/Auth";

const Home: NextPageWithAuth = () => {
  const { data: session } = useSession();
  // console.log(session);

  if (session) {
    return (
      <div className="container ">
        <p className=" w-full break-words text-xl">{`${JSON.stringify(
          session
        )}`}</p>

        {/* <p className=" w-full break-words text-xl">{`${session?.idToken}`}</p> */}
        <button onClick={() => void signOut()}>Sign out</button>
      </div>
    );
  }
  
  return (
    <>
      Not signed in <br />
      <button onClick={() => void signIn()}>Sign in</button>
    </>
  );
};

Home.auth = {
  requiredRoles: [UserRole.ADMIN, UserRole.CUSTOMER, UserRole.WORKER],
};

export default Home;
