import { NextPageWithAuth } from "../_app";

const Users: NextPageWithAuth = () => {
  return <div>backoffice/users</div>;
};

Users.auth = { requiredRole: "admin" };

export default Users;
