import { useSession } from "next-auth/react";
import type { NextPage } from "next";
import { useRouter } from "next/router";
import { ReactNode } from "react";
import Navbar from "~/components/Navbar";
import { useUser } from "~/api/users";

//Auth types
export enum UserRole {
  ADMIN = "admin",
  CUSTOMER = "customer",
  WORKER = "worker",
}

export interface PageWithAuth {
  auth: {
    requiredRoles: UserRole[];
  };
}

export type NextPageWithAuth<Props = {}, InitialProps = Props> = NextPage<
  Props,
  InitialProps
> &
  PageWithAuth;

//Auth component
interface AuthProps {
  children: ReactNode;
}

const Auth = ({ children }: AuthProps) => {
  const router = useRouter();
  const { data: session, status } = useSession({ required: true });
  const { data: user, isLoading: isLoadingUser } = useUser(session?.user?.id);

  if (status === "loading" || isLoadingUser) {
    return <div>Loading...</div>;
  }

  if (!user) {
    return <div>No user</div>;
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
      <Navbar name={user.name} role={user.role} />
      {children}
    </>
  );
};

export default Auth;