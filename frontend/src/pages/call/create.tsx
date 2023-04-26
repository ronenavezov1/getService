import { useQueryClient } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { useCreateCall } from "~/api/call";
import { NextPageWithAuth, UserRole } from "~/components/Auth";
import { CallForm, callCreateFormSchema } from "~/components/CallForm";

const Create: NextPageWithAuth = () => {
  const router = useRouter();
  const { data: session } = useSession();
  const { mutateAsync: createCall } = useCreateCall(session?.idToken ?? "");
  const queryClient = useQueryClient();

  const onSubmit = async (data: callCreateFormSchema) => {
    await createCall(data, {
      onSuccess: async () => {
        await queryClient.invalidateQueries(["userCalls", session?.idToken]);
        await router.push("/call");
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
