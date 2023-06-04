import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { useGetUserByIdToken } from "~/api/user";
import { type NextPageWithAuth, UserRole } from "~/components/Auth";
import { MessageCardCenteredLoading } from "~/components/MessageCards";

const Home: NextPageWithAuth = () => {
  const router = useRouter();
  const { data: session, status } = useSession({ required: true });
  const { data: user, isLoading: isLoadingUser } = useGetUserByIdToken(
    session?.idToken ?? ""
  );

  if (status === "loading" || isLoadingUser) {
    return <MessageCardCenteredLoading />;
  }

  if (user?.type === UserRole.ADMIN) {
    void router.push("/backoffice/users");
    return null;
  }

  void router.push("/call");
  return null;
};

Home.auth = {
  requiredRoles: [UserRole.ADMIN, UserRole.CUSTOMER, UserRole.WORKER],
};

export default Home;
