import { useSession } from "next-auth/react";
import type { NextPage } from "next";
import { useRouter } from "next/router";
import { ReactNode } from "react";
import Navbar from "~/components/Navbar";
import { useUserByEmail } from "~/api/user";
import { MessageCardCentered, MessageCard } from "./MessageCards";

//////////////////////////////////////////////// types
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

////////////////////////////////////////////////////
interface AuthProps {
  children: ReactNode;
}

const Auth = ({ children }: AuthProps) => {
  const router = useRouter();
  const { data: session, status } = useSession({ required: true });
  const { data: user, isLoading: isLoadingUser } = useUserByEmail(
    session?.user?.email
  );

  if (status === "loading") {
    return <MessageCardCentered message="Loading Session" />;
  }

  if (isLoadingUser) {
    return <MessageCardCentered message="Loading User" />;
  }

  if (!user) {
    return <MessageCardCentered message="User not found" />;
  }

  if (user.isCompletedOnBoarding === false) {
    router.push("/onboarding/completeDetails");
    return null;
  }

  const pageAuth = (children as any).type.auth;
  const { requiredRoles } = pageAuth;

  //no user will always be unauthorized
  if (!requiredRoles.includes(user?.role)) {
    return <MessageCardCentered message="Unauthorized" />;
  }

  return (
    <>
      <Navbar
        firstName={user.firstName}
        lastName={user.lastName}
        role={user.role}
      />
      {children}
    </>
  );
};

export default Auth;
