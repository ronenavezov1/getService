import { NextPageWithAuth } from "../_app";

const Create: NextPageWithAuth = () => {
  return <div>call/create</div>;
};

Create.auth = { requiredRole: "customer" };

export default Create;
