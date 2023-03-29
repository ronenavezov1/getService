import { signIn, useSession } from "next-auth/react";
import type { ReactNode } from "react";

interface RequireUserProps {
  children: ReactNode;
}

const RequireUser = ({ children }: RequireUserProps) => {
  const { data: session, status } = useSession();

  if (status === "loading") return <div>loading...</div>;
  if (status === "unauthenticated") signIn();

  //TOOD add check for full user and redirect to profile page if not complete

  return <>{session && children}</>;
};

export default RequireUser;
