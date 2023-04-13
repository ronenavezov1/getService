import { NextPageWithAuth, UserRole } from "~/components/Auth";

const Pick: NextPageWithAuth = () => {
  return <div>provider/pick</div>;
};

Pick.auth = {
  requiredRoles: [UserRole.ADMIN, UserRole.PROVIDER],
};

export default Pick;
