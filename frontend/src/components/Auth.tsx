import { signOut, useSession } from "next-auth/react";
import type { NextPage } from "next";
import { useRouter } from "next/router";
import type { ReactNode } from "react";
import Navbar from "~/components/Navbar";
import { MessageCardCentered } from "./MessageCards";
import { useGetUserByIdToken } from "~/api/user";
import { toast } from "react-toastify";

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

export type NextPageWithAuth<
  Props = Record<string, never>,
  InitialProps = Props
> = NextPage<Props, InitialProps> & PageWithAuth;

////////////////////////////////////////////////////
interface AuthProps {
  children: ReactNode & { type: { auth: { requiredRoles: UserRole[] } } };
}

const Auth = ({ children }: AuthProps) => {
  const router = useRouter();
  const { data: session, status } = useSession({ required: true });
  const { data: user, isLoading: isLoadingUser } = useGetUserByIdToken(
    session?.idToken ?? ""
  );

  const pushToCompleteDetails = async () => {
    await router.push("/onboarding/completeDetails");
  };

  if (status === "loading") {
    return <MessageCardCentered message="Loading Session" />;
  }

  if (isLoadingUser) {
    return <MessageCardCentered message="Loading User" />;
  }

  if (!user) {
    return <MessageCardCentered message="No User" />;
  }

  // not completed onboarding
  if (user.isOnBoardingCompleted === false) {
    void pushToCompleteDetails();
    return null;
  }

  // not approved
  if (!user.isApproved) {
    toast.onChange((payload) => {
      switch (payload.status) {
        case "removed":
          // toast has been removed
          void signOut();
          break;
      }
    });
    toast.error("Your account is not approved yet");
    return null;
  }

  const pageAuth = children.type.auth;
  const { requiredRoles } = pageAuth;

  // Type/Role check
  if (!requiredRoles.includes(user.type)) {
    return <MessageCardCentered message="Unauthorized" />;
  }

  return (
    <>
      <Navbar
        firstName={user.firstName}
        lastName={user.lastName}
        role={user.type}
      />
      {children}
    </>
  );
};

export default Auth;
