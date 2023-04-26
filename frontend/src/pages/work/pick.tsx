import { type NextPageWithAuth, UserRole } from "~/components/Auth";

const Pick: NextPageWithAuth = () => {
  return <div>worker/pick</div>;
};

Pick.auth = {
  requiredRoles: [UserRole.ADMIN, UserRole.WORKER],
};

export default Pick;
