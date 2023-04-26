import { useSession } from "next-auth/react";
import { GetServerSideProps } from "next/types";
import { useGetCall } from "~/api/call";
import { NextPageWithAuth, UserRole } from "~/components/Auth";
import { CallForm } from "~/components/CallForm";
import { MessageCard } from "~/components/MessageCards";

interface CallIndexProps {
  callID: string;
}

const Edit: NextPageWithAuth<CallIndexProps> = ({ callID }) => {
  const { data: session } = useSession();
  const { data: calls, isLoading } = useGetCall(session?.idToken!, {
    id: callID,
  });

  const call = calls?.[0];

  return (
    <div className=" bodyDiv ">
      {isLoading ? (
        <MessageCard message="Loading Call" />
      ) : (
        call && <CallForm onSubmit={() => null} defaultValues={call} />
      )}
    </div>
  );
};

export const getServerSideProps: GetServerSideProps<CallIndexProps> = async ({
  query,
}) => {
  const { id } = query;

  return {
    props: { callID: id as string },
  };
};

Edit.auth = {
  requiredRoles: [UserRole.ADMIN, UserRole.CUSTOMER, UserRole.WORKER],
};

export default Edit;
