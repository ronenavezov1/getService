import { NextPageWithAuth } from "../_app";

const Status: NextPageWithAuth = () => {
  return <div>call/status</div>;
};

Status.auth = { requiredRole: "user" };

export default Status;
