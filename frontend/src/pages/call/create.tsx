import { type NextPageWithAuth } from "next";

const Create: NextPageWithAuth = () => {
  return <div>call/create</div>;
};

Create.auth = { requiredRole: "user" };

export default Create;
