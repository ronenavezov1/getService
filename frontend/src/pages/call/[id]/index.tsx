import type { GetServerSidePropsContext, GetServerSidePropsResult } from "next";
import { useSession } from "next-auth/react";
import { useGetCall } from "~/api/call";
import { type NextPageWithAuth, UserRole } from "~/components/Auth";
import CallCard from "~/components/CallCard";
import { MessageCard } from "~/components/MessageCards";

interface CallIndexProps {
  id: string;
}

const CallIndex: NextPageWithAuth<CallIndexProps> = ({ id }) => {
  const { data: session, status } = useSession();
  const { data: calls, isLoading } = useGetCall(session?.idToken ?? "", {
    id: id,
  });

  const call = calls?.[0];

  return (
    <div className="bodyDiv">
      {isLoading || status == "loading" ? (
        <MessageCard message={"Loading user calls"} />
      ) : (
        call && <CallCard call={call} key={call.id} fullSize={true} />
      )}
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

CallIndex.auth = {
  requiredRoles: [UserRole.ADMIN, UserRole.CUSTOMER, UserRole.WORKER],
};

export default CallIndex;
