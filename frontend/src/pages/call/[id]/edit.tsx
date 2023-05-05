import { useSession } from "next-auth/react";
import type {
  GetServerSidePropsContext,
  GetServerSidePropsResult,
} from "next/types";
import { type Call, useGetCall } from "~/api/call";
import { type NextPageWithAuth, UserRole } from "~/components/Auth";
import { EditCallForm } from "~/components/CallForm";
import { MessageCard } from "~/components/MessageCards";

interface CallIndexProps {
  id: string;
}

const Edit: NextPageWithAuth<CallIndexProps> = ({ id }) => {
  const { data: session, status } = useSession();
  const { data: calls, isLoading: isLoadingCall } = useGetCall(
    session?.idToken ?? "",
    {
      id: id,
    }
  );

  if (status === "loading" || isLoadingCall) {
    return (
      <div className=" bodyDiv ">
        <MessageCard message="Loading call..." />;
      </div>
    );
  }

  if (!calls || calls.length === 0) {
    return (
      <div className=" bodyDiv ">
        <MessageCard message="Call not found" />;
      </div>
    );
  }

  return (
    <div className=" bodyDiv ">
      {calls && <EditCallForm defaultValues={calls[0] as Call} />}
    </div>
  );
};

export const getServerSideProps = ({
  query,
}: GetServerSidePropsContext): GetServerSidePropsResult<{ id: string }> => {
  const { id } = query;

  return {
    props: { id: id as string },
  };
};

Edit.auth = {
  requiredRoles: [UserRole.ADMIN, UserRole.CUSTOMER, UserRole.WORKER],
};

export default Edit;
