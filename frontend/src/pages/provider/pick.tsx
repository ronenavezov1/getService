import { type NextPageWithAuth } from "next";

const Pick: NextPageWithAuth = () => {
  return <div>provider/pick</div>;
};

Pick.auth = { role: "provider" };

export default Pick;
