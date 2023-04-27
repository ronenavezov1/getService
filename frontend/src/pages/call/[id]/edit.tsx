import { useSession } from "next-auth/react";
import type {
  GetServerSidePropsContext,
  GetServerSidePropsResult,
} from "next/types";
import { useGetCall } from "~/api/call";
import { type NextPageWithAuth, UserRole } from "~/components/Auth";
import { CallForm } from "~/components/CallForm";
import { MessageCard } from "~/components/MessageCards";

interface CallIndexProps {
  id: string;
}

const Edit: NextPageWithAuth<CallIndexProps> = ({ id }) => {
  const { data: session } = useSession();
  const { data: calls, isLoading } = useGetCall(session?.idToken ?? "", {
    id: id,
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
