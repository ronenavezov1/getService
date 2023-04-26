import { PencilSquareIcon, TrashIcon } from "@heroicons/react/20/solid";
import { useQueryClient } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { FC } from "react";
import { Call, useDeleteCall, useGetCall, useUserCalls } from "~/api/call";
import { NextPageWithAuth, UserRole } from "~/components/Auth";
import CallCard from "~/components/CallCard";
import { MessageCard } from "~/components/MessageCards";

const Status: NextPageWithAuth = () => {
  const { data: session, status } = useSession();
  const { data: calls, isLoading, isFetching } = useGetCall(session?.idToken!);
  const router = useRouter();

  const onBodyClickHandler = async (id: string) =>
    await router.push(`${router.asPath}/${id}`);

  return (
    <div className="flex flex-wrap items-stretch justify-center  gap-4 px-2 py-4">
      {isLoading || status == "loading" ? (
        <MessageCard message={"Loading user calls"} />
      ) : (
        calls
          ?.sort(sortByDate)
          .map((call) => (
            <CallCard
              key={call.id}
              call={call}
              onBodyClick={async () => await onBodyClickHandler(call.id)}
              fullSize={false}
              actionRow={<ActionRow callId={call.id} />}
            />
          ))
      )}
    </div>
  );
};

Status.auth = {
  requiredRoles: [UserRole.ADMIN, UserRole.CUSTOMER, UserRole.WORKER],
};

function sortByDate(a: Call, b: Call) {
  return (
    new Date(a.creationTime).getTime() - new Date(b.creationTime).getTime()
  );
}

export default Status;

interface ActionRowProps {
  callId: string;
  isFetching?: boolean;
}

const ActionRow: FC<ActionRowProps> = ({ callId, isFetching }) => {
  const { asPath, push } = useRouter();
  const { data: session, status } = useSession();
  const { mutateAsync, isIdle } = useDeleteCall(session?.idToken ?? "");
  const queryClient = useQueryClient();

  const handleOnEditClick = async () => {
    await push(`${asPath}/${callId}`);
  };

  if (status == "loading") {
    return null;
  }

  return (
    <>
      <button disabled={isFetching} onClick={handleOnEditClick}>
        <PencilSquareIcon className="w-5 fill-blue-600 " />
      </button>
      <button
        disabled={!isIdle}
        onClick={async () => {
          await mutateAsync(callId, {
            onSuccess: () => {
              return queryClient.invalidateQueries(["userCalls"]);
            },
          });
        }}
      >
        <TrashIcon className="w-5 fill-red-600 " />
      </button>
    </>
  );
};
