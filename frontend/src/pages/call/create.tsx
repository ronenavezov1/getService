import { useQueryClient } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { useCreateCall } from "~/api/call";
import { type NextPageWithAuth, UserRole } from "~/components/Auth";
import { CallForm, type callCreateFormSchema } from "~/components/CallForm";

const Create: NextPageWithAuth = () => {
  const router = useRouter();
  const { data: session } = useSession();
  const { mutate } = useCreateCall(session?.idToken ?? "");
  const queryClient = useQueryClient();

  const onSubmit = (data: callCreateFormSchema) => {
    mutate(data, {
      onSuccess: () => {
        void queryClient.invalidateQueries(["call"]);
        void router.push("/call");
      },
    });
  };

  return (
    <div className="bodyDiv ">
      <CallForm onSubmit={onSubmit} />
    </div>
  );
};

Create.auth = {
  requiredRoles: [UserRole.ADMIN, UserRole.CUSTOMER, UserRole.WORKER],
};

export default Create;
