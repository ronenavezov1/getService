import { type NextPageWithAuth } from "next";

const Status: NextPageWithAuth = () => {
  return <div>provider/status</div>;
};

Status.auth = { role: "provider" };

export default Status;
