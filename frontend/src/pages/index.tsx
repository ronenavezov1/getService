import { useRouter } from "next/router";
import { type NextPageWithAuth, UserRole } from "~/components/Auth";

const Home: NextPageWithAuth = () => {
  const router = useRouter();

  void router.push("/call");
  return null;
};

Home.auth = {
  requiredRoles: [UserRole.ADMIN, UserRole.CUSTOMER, UserRole.WORKER],
};

export default Home;
