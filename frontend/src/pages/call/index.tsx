import { useSession } from "next-auth/react";
import { useGetCall } from "~/api/call";
import { useGetUserByIdToken } from "~/api/user";
import { type NextPageWithAuth, UserRole } from "~/components/Auth";
import CallCard from "~/components/CallCard";
import {
  MessageCardCentered,
  MessageCardCenteredNotFound,
} from "~/components/MessageCards";
import { sortByDate } from "~/utils/sortUtils";

const Status: NextPageWithAuth = () => {
  const { data: session, status } = useSession();
  const { data: user, isLoading: isLoadingUser } = useGetUserByIdToken(
    session?.idToken ?? ""
  );

  if (status == "loading" || isLoadingUser) {
    return <MessageCardCentered message={"Loading user"} />;
  }

  return (
    <>
      {user?.type == UserRole.CUSTOMER ? (
        <CustomerCalls />
      ) : user?.type === UserRole.WORKER ? (
        <WorkerCalls />
      ) : user?.type === UserRole.ADMIN ? (
        <AdminCalls />
      ) : null}
    </>
  );
};

Status.auth = {
  requiredRoles: [UserRole.ADMIN, UserRole.CUSTOMER, UserRole.WORKER],
};

//TODO:implement admin calls
const AdminCalls = () => {
  return (
    <>
      <span>AdminCalls</span>
    </>
  );
};

const WorkerCalls = () => {
  const { data: session, status } = useSession();
  const {
    data: user,
    isLoading: isLoadingUser,
    isFetching,
  } = useGetUserByIdToken(session?.idToken ?? "");

  const {
    data: workerCalls,
    isLoading: isLoadingworkerCalls,
    isFetching: isFetchingWorkerCalls,
  } = useGetCall(session?.idToken ?? "", { workerId: user?.id });

  if (
    isLoadingUser ||
    status == "loading" ||
    isLoadingworkerCalls ||
    isFetching
  ) {
    return <MessageCardCentered message={"Loading worker calls"} />;
  }

  if (workerCalls?.length === 0) {
    return <MessageCardCenteredNotFound message={"No calls found"} />;
  }

  return (
    <div className="flex flex-wrap items-stretch justify-center gap-4  px-2 py-4">
      {workerCalls &&
        user &&
        workerCalls
          .sort(sortByDate)
          .map((call) => (
            <CallCard
              key={call.id}
              call={call}
              userId={user.id}
              userRole={user.type}
              isFetchingCalls={isFetchingWorkerCalls}
              fullSize={false}
            />
          ))}
    </div>
  );
};

const CustomerCalls = () => {
  const { data: session, status } = useSession();
  const { data: user, isLoading: isLoadingUser } = useGetUserByIdToken(
    session?.idToken ?? ""
  );

  const {
    data: customerCalls,
    isLoading: isLoadingCustomerCalls,
    isFetching: isFetchingCustomerCalls,
  } = useGetCall(session?.idToken ?? "", { customerId: user?.id });

  if (
    isLoadingUser ||
    status == "loading" ||
    isLoadingCustomerCalls ||
    isFetchingCustomerCalls
  ) {
    return <MessageCardCentered message={"Loading customer calls"} />;
  }

  if (customerCalls?.length === 0) {
    return <MessageCardCenteredNotFound message={"No calls found"} />;
  }

  return (
    <div className="flex flex-wrap items-stretch justify-center gap-4  px-2 py-4">
      {customerCalls &&
        user &&
        customerCalls
          .sort(sortByDate)
          .map((call) => (
            <CallCard
              key={call.id}
              call={call}
              userId={user.id}
              userRole={user.type}
              isFetchingCalls={isFetchingCustomerCalls}
              fullSize={false}
            />
          ))}
    </div>
  );
};

export default Status;
