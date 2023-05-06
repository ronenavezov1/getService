import DatePicker from "react-datepicker";
import {
  BriefcaseIcon,
  PencilSquareIcon,
  TrashIcon,
} from "@heroicons/react/20/solid";
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
import { Fragment, useState } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { usePostPick } from "~/api/pick";

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
    customer,
    description,
    service,
    status,
    worker,
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
        <h1>{customer.firstName + customer.lastName}</h1>
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
            {worker && <p>{worker.firstName + worker.lastName}</p>}
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
                userId={userId}
                callId={call.id}
                callStatus={call.status}
                isFetchingCalls={isFetchingCalls}
              />

              {/* user Actions */}
              <UserActionRow
                userId={userId}
                customerId={call.customer.id}
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

interface WorkerActionProps {
  userRole: string;
  callId: string;
  userId: string;
  callStatus: CallStatus;
  isFetchingCalls: boolean;
}

const WorkerActions = ({
  callId,
  isFetchingCalls,
  userRole,
  callStatus,
  userId,
}: WorkerActionProps) => {
  if (userRole !== UserRole.WORKER || callStatus !== CallStatus.NEW) {
    return null;
  }

  return (
    <>
      <Pick
        callId={callId}
        isFetchingCalls={isFetchingCalls}
        workerId={userId}
      />
    </>
  );
};

interface PickProps {
  callId: string;
  workerId: string;
  isFetchingCalls: boolean;
}

const Pick = ({ callId, isFetchingCalls, workerId }: PickProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [expectedArrivalTime, setExpectedArrivalTime] = useState(new Date());
  const { data: session } = useSession();
  const { mutate, isIdle: isIdlePostPick } = usePostPick(
    session?.idToken ?? "",
    callId
  );

  const closeModal = () => setIsOpen(false);
  const openModal = () => setIsOpen(true);

  const onSubmit = () => {
    const pick = {
      workerId: workerId,
      status: CallStatus.IN_PROGRESS,
      expectedArrivalTime: expectedArrivalTime,
    };

    mutate(pick);
    closeModal();
  };

  return (
    <>
      <button type="button" onClick={openModal} className="">
        <BriefcaseIcon className="h-5 w-5 fill-green-500" />
      </button>
      <Transition appear show={isOpen} as={Fragment}>
        <Dialog as="div" className="relative z-10" onClose={closeModal}>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black bg-opacity-25" />
          </Transition.Child>

          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4 text-center">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <Dialog.Panel className="w-full max-w-md transform  rounded-2xl bg-stone-100 p-6   shadow-xl transition-all">
                  <Dialog.Title
                    as="h3"
                    className="text-lg font-bold leading-6 text-gray-900"
                  >
                    Pick call
                  </Dialog.Title>

                  <div className="mt-4">
                    <DatePicker
                      selected={expectedArrivalTime}
                      onChange={(date: Date) => setExpectedArrivalTime(date)}
                      showTimeSelect
                      timeFormat="p"
                      timeIntervals={30}
                      dateFormat="Pp"
                      preventOpenOnFocus={true}
                      className="rounded-md text-center shadow-md"
                    />
                  </div>

                  <div className="mt-4 flex justify-center gap-2 text-white">
                    <button
                      type="button"
                      className="inline-flex justify-center rounded-md border border-transparent bg-green-500 px-4 py-2 text-sm font-medium  hover:bg-blue-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
                      onClick={onSubmit}
                      disabled={isFetchingCalls || !isIdlePostPick}
                    >
                      {/* //TODO implemnet pick call */}
                      Pick test
                    </button>
                    <button
                      type="button"
                      className="inline-flex justify-center rounded-md border border-transparent bg-red-500 px-4 py-2 text-sm font-medium  hover:bg-red-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
                      onClick={closeModal}
                    >
                      Close
                    </button>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
    </>
  );
};

export default CallCard;
