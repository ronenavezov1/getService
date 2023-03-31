import { type NextPageWithAuth } from "next";

const Status: NextPageWithAuth = () => {
  return <div>call/status</div>;
};

Status.auth = { requiredRole: "user" };

export default Status;
