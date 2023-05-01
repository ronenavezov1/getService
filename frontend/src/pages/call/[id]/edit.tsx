import { useQueryClient } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import type {
  GetServerSidePropsContext,
  GetServerSidePropsResult,
} from "next/types";
import { toast } from "react-toastify";
import { useGetCall, usePutCall } from "~/api/call";
import { type NextPageWithAuth, UserRole } from "~/components/Auth";
import { CallForm, type callCreateFormSchema } from "~/components/CallForm";
import { MessageCard } from "~/components/MessageCards";

interface CallIndexProps {
  id: string;
}

const Edit: NextPageWithAuth<CallIndexProps> = ({ id }) => {
  const { data: session } = useSession();
  const { data: calls, isLoading } = useGetCall(session?.idToken ?? "", {
    id: id,
  });
  const { mutate } = usePutCall(session?.idToken ?? "", calls?.[0]?.id ?? "");
  const queryClient = useQueryClient();
  const router = useRouter();

  const handleOnSubmit = (data: callCreateFormSchema) => {
    mutate(data, {
      onSuccess: () => {
        void router.push("/call");
        void queryClient.invalidateQueries(["call"]);
        toast.success("Call created successfully");
      },
    });
  };

  const call = calls?.[0];

  if (isLoading) {
    return <MessageCard message="Loading Call" />;
  }

  if (!call) {
    return <MessageCard message="Call not found" />;
  }

  return (
    <div className=" bodyDiv ">
      {isLoading ? (
        <MessageCard message="Loading Call" />
      ) : (
        call && <CallForm onSubmit={handleOnSubmit} defaultValues={call} />
      )}
    </div>
  );
};

export const getServerSideProps = ({
  query,
}: GetServerSidePropsContext): GetServerSidePropsResult<{ id: string }> => {
  const { id } = query;
  console.log(id);

  return {
    props: { id: id as string },
  };
};

Edit.auth = {
  requiredRoles: [UserRole.ADMIN, UserRole.CUSTOMER, UserRole.WORKER],
};

export default Edit;
