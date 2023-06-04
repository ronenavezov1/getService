import { signOut, useSession } from "next-auth/react";
import type { NextPage } from "next";
import { useRouter } from "next/router";
import type { ReactNode } from "react";
import Navbar from "~/components/Navbar";
import {
  MessageCardCenteredLoading,
  MessageCardCenteredXMark,
} from "./MessageCards";
import { useGetUserByIdToken } from "~/api/user";

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

  if (status === "loading" || isLoadingUser) {
    return <MessageCardCenteredLoading />;
  }

  if (!user) {
    return <MessageCardCenteredXMark message="No User" />;
  }

  // not completed onboarding
  if (user.isOnBoardingCompleted === false) {
    void pushToCompleteDetails();
    return null;
  }

  // not approved
  if (!user.isApproved) {
    void setTimeout(() => void signOut(), 3000);
    return (
      <MessageCardCenteredXMark message="User not approved, Logging out..." />
    );
  }

  const pageAuth = children.type.auth;
  const { requiredRoles } = pageAuth;

  // Type/Role check
  if (!requiredRoles.includes(user.type)) {
    return <MessageCardCenteredXMark message="Unauthorized" />;
  }

  return (
    <>
      <Navbar
        firstName={user.firstName}
        lastName={user.lastName}
        role={user.type}
        professions={
          user.type === UserRole.WORKER ? user.professions : undefined
        }
      />
      {children}
    </>
  );
};

export default Auth;
