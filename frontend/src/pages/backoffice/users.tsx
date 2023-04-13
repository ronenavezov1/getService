import { NextPageWithAuth, UserRole } from "~/components/Auth";

const Users: NextPageWithAuth = () => {
  return <div>backoffice/users</div>;
};

Users.auth = {
  requiredRoles: [UserRole.ADMIN],
};

export default Users;
