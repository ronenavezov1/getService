import { NextPageWithAuth } from "../_app";

const Status: NextPageWithAuth = () => {
  return <div>provider/status</div>;
};

Status.auth = { requiredRoles: ["provider"] };

export default Status;
