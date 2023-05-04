import { PencilSquareIcon, TrashIcon } from "@heroicons/react/20/solid";
import { useQueryClient } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { toast } from "react-toastify";
import {
  BASE_CALL_API_URL,
  type Call,
  CallStatus,
  useDeleteCall,
} from "~/api/call";
import { UserRole } from "./Auth";

enum StatusColorButton {
  "new" = "bg-zinc-500 hover:bg-zinc-600",
  "inProgress" = "bg-amber-500 hover:bg-amber-600",
  "done" = "bg-green-500 hover:bg-green-600",
}

// enum StatusColor {
//   "new" = "zinc",
//   "inProgress" = "amber",
//   "done" = "green",
// }

interface CallCardProps {
  call: Call;
  userId: string;
  userRole: string;
  isFetchingCalls: boolean;
  fullSize?: boolean;
}

const sliceDescription = (description: string, maxLength: number) => {
  return description.length > maxLength ? (
    <>
      {description.slice(0, maxLength)}
      <br />
      <span>...</span>
    </>
  ) : (
    <>{description}</>
  );
};

const CallCard = ({
  call,
  userId,
  userRole,
  isFetchingCalls,
  fullSize,
}: CallCardProps) => {
  const { push, basePath } = useRouter();

  const {
    id,
    address,
    city,
    creationTime,
    customerId,
    description,
    service,
    status,
    workerId,
  } = call;

  /**
   * redirect to call page on body click
   */
  const onBodyClick = async () => {
    await push(`${basePath}${BASE_CALL_API_URL}/${id}`);
  };

  return (
    <div
      className={`${
        fullSize ? "max-w-2xl" : "max-w-xs"
      }   flex w-full flex-col rounded-xl border bg-gray-100 shadow-md`}
    >
      {/* Header */}
      <div
        className={` ${
          status ? StatusColorButton[status] : `bg-red-500 hover:bg-red-600`
        } flex w-full flex-wrap justify-between gap-2 rounded-xl p-2 text-sm font-bold text-white `}
      >
        <h1>{customerId}</h1>
        <h1>{service}</h1>
        <h1>{city}</h1>
        <h1>{address}</h1>
      </div>

      {/* Body */}
      <div className=" flex h-full flex-col p-2">
        {/* PanelHeader */}
        <div className="">
          <div className="flex justify-between text-xs font-semibold  ">
            <p>Call ID: {id}</p>
            <p>{status}</p>
            {workerId && <p>{workerId}</p>}
          </div>
        </div>

        {/* PanelBody */}
        <button className="my-6 " onClick={onBodyClick} disabled={!!fullSize}>
          <p className="text-center text-lg font-medium   text-black">
            {!fullSize ? sliceDescription(description, 64) : <>{description}</>}
          </p>
        </button>

        {/* PanelFooter */}
        <div className="flex flex-grow ">
          <div className="flex h-fit w-full items-center justify-between self-end text-xs">
            <p>{creationTime}</p>

            {/* Actions */}
            <div className="flex gap-2">
              {/* worker Actions */}
              <WorkerActions
                userRole={userRole}
                callStatus={call.status}
                callId={call.id}
                isFetchingCalls={isFetchingCalls}
              />

              {/* user Actions */}
              <UserActionRow
                userId={userId}
                customerId={call.customerId}
                callId={call.id}
                isFetchingCalls={isFetchingCalls}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

interface UserActionRowProps {
  userId: string;
  customerId: string;
  callId: string;
  isFetchingCalls: boolean;
}

const UserActionRow = ({
  callId,
  isFetchingCalls,
  customerId,
  userId,
}: UserActionRowProps) => {
  const { push, basePath } = useRouter();
  const { data: session, status } = useSession();
  const { mutate, isIdle: deleteBtnIsIdle } = useDeleteCall(
    session?.idToken ?? ""
  );
  const queryClient = useQueryClient();

  const handleOnEditClick = () => {
    void push(`${basePath}${BASE_CALL_API_URL}/${callId}/edit`);
  };

  const isDisabled = isFetchingCalls || !deleteBtnIsIdle;

  if (customerId !== userId || status === "loading") {
    return null;
  }

  return (
    <>
      {/* Edit Btn */}
      <button disabled={isDisabled} onClick={handleOnEditClick}>
        <PencilSquareIcon className="w-5 fill-blue-600 " />
      </button>

      {/* Delete Btn */}
      <button
        disabled={isDisabled}
        onClick={() => {
          mutate(callId, {
            onSuccess: () => {
              void queryClient.invalidateQueries(["call"]);
              toast.success("Call deleted successfully");
              void push(`${basePath}${BASE_CALL_API_URL}`);
            },
          });
        }}
      >
        <TrashIcon className="w-5 fill-red-600 " />
      </button>
    </>
  );
};

interface WorkerActionRowProps {
  userRole: string;
  callStatus: string;
  callId: string;
  isFetchingCalls: boolean;
}

const WorkerActions = ({
  callId,
  isFetchingCalls,
  callStatus,
  userRole,
}: WorkerActionRowProps) => {
  if (userRole !== UserRole.WORKER || callStatus !== CallStatus.NEW) {
    return null;
  }

  return <>WorkerActions</>;
};

export default CallCard;
