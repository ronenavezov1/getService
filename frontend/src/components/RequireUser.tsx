import { signIn, useSession } from "next-auth/react";
import { useRouter } from "next/router";
import type { ReactNode } from "react";

interface RequireUserProps {
  children: ReactNode;
}

const RequireUser = ({ children }: RequireUserProps) => {
  const { data: session, status } = useSession();
  const router = useRouter();

  if (status === "loading") return <div>loading...</div>;
  if (status === "unauthenticated") signIn();

  if (session && !session.user) router.push();

  //TOOD add check for full user and redirect to profile page if not complete

  return <>{session && children}</>;
};

export default RequireUser;
