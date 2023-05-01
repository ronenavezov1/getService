import { PencilSquareIcon, TrashIcon } from "@heroicons/react/20/solid";
import { useQueryClient } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import type { FC } from "react";
import { toast } from "react-toastify";
import { type Call, useDeleteCall, useGetCall } from "~/api/call";
import { useGetUserByIdToken } from "~/api/user";
import { type NextPageWithAuth, UserRole } from "~/components/Auth";
import CallCard from "~/components/CallCard";
import { MessageCard } from "~/components/MessageCards";
import { sortByDate } from "~/utils/sortUtils";

const Status: NextPageWithAuth = () => {
  const { data: session, status } = useSession();
  const { data: user, isLoading: isLoadingUser } = useGetUserByIdToken(
    session?.idToken ?? ""
  );
  const {
    data: calls,
    isLoading: isLoadingCalls,
    isFetching,
  } = useGetCall(session?.idToken ?? "", { customerId: user?.id });
  const router = useRouter();

  const onBodyClickHandler = async (id: string) =>
    await router.push(`${router.asPath}/${id}`);

  return (
    <div className="flex flex-wrap items-stretch justify-center  gap-4 px-2 py-4">
      {isLoadingUser || isLoadingCalls || status == "loading" ? (
        <MessageCard message={"Loading user calls"} />
      ) : (
        calls &&
        calls
          .sort(sortByDate)
          .map((call) => (
            <CallCard
              key={call.id}
              call={call}
              onBodyClick={() => void onBodyClickHandler(call.id)}
              fullSize={false}
              actionRow={<ActionRow callId={call.id} isFetching={isFetching} />}
            />
          ))
      )}
    </div>
  );
};

Status.auth = {
  requiredRoles: [UserRole.ADMIN, UserRole.CUSTOMER, UserRole.WORKER],
};

export default Status;

interface ActionRowProps {
  callId: string;
  isFetching?: boolean;
}

const ActionRow: FC<ActionRowProps> = ({ callId, isFetching }) => {
  const { asPath, push } = useRouter();
  const { data: session, status } = useSession();
  const { mutate, isIdle } = useDeleteCall(session?.idToken ?? "");
  const queryClient = useQueryClient();

  const handleOnEditClick = () => {
    void push(`${asPath}/${callId}/edit`);
  };

  if (status == "loading") {
    return null;
  }

  return (
    <>
      <button disabled={isFetching || !isIdle} onClick={handleOnEditClick}>
        <PencilSquareIcon className="w-5 fill-blue-600 " />
      </button>
      <button
        disabled={!isIdle}
        onClick={() => {
          mutate(callId, {
            onSuccess: () => {
              void queryClient.invalidateQueries(["call"]);
              toast.success("Call deleted successfully");
            },
          });
        }}
      >
        <TrashIcon className="w-5 fill-red-600 " />
      </button>
    </>
  );
};
