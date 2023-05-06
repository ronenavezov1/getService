import type { GetServerSidePropsContext, GetServerSidePropsResult } from "next";
import { useSession } from "next-auth/react";
import { useGetCall } from "~/api/call";
import { useGetUserByIdToken } from "~/api/user";
import { type NextPageWithAuth, UserRole } from "~/components/Auth";
import CallCard from "~/components/CallCard";
import { MessageCard } from "~/components/MessageCards";

interface CallIndexProps {
  id: string;
}

const CallIndex: NextPageWithAuth<CallIndexProps> = ({ id }) => {
  const { data: session, status } = useSession();
  const { data: user, isLoading: isLoadingUser } = useGetUserByIdToken(
    session?.idToken ?? ""
  );

  const {
    data: calls,
    isLoading,
    isFetching,
  } = useGetCall(session?.idToken ?? "", {
    id: id,
  });

  if (isLoadingUser || status == "loading" || isLoading) {
    return <MessageCard message={"Loading call"} />;
  }

  const call = calls?.[0];

  return (
    <div className="bodyDiv">
      {call && user && (
        <CallCard
          call={call}
          userRole={user?.type}
          userId={user.id}
          isFetchingCalls={isFetching}
          key={call.id}
          fullSize={true}
        />
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
