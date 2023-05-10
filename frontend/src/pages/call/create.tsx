import { type NextPageWithAuth, UserRole } from "~/components/Auth";
import { CreateCallForm } from "~/components/CallForm";

const Create: NextPageWithAuth = () => {
  return (
    <div className="bodyDiv ">
      <CreateCallForm />
    </div>
  );
};

Create.auth = {
  requiredRoles: [UserRole.ADMIN, UserRole.CUSTOMER],
};

export default Create;
