import { NextPageWithAuth, UserRole } from "~/components/Auth";

const Status: NextPageWithAuth = () => {
  return <div>call/status</div>;
};

Status.auth = {
  requiredRoles: [UserRole.ADMIN, UserRole.CUSTOMER, UserRole.WORKER],
};

export default Status;
