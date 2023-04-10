import { NextPageWithAuth } from "../_app";

const Pick: NextPageWithAuth = () => {
  return <div>provider/pick</div>;
};

Pick.auth = {
  requiredRoles: ["provider"],
};

export default Pick;
