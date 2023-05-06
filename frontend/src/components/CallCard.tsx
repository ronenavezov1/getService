import DatePicker from "react-datepicker";
import {
  BriefcaseIcon,
  PencilSquareIcon,
  TrashIcon,
  XMarkIcon,
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
import { EditCallForm } from "./CallForm";

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
        fullSize ? "max-w-3xl" : "max-w-xs"
      }   flex w-full flex-col rounded-xl border bg-gray-100 shadow-md`}
    >
      {/* Header */}
      <div
        className={` ${
          status ? StatusColorButton[status] : `bg-red-500 hover:bg-red-600`
        } flex w-full flex-wrap justify-between gap-x-4 rounded-xl p-2 text-sm font-bold text-white `}
      >
        <p>{`${customer.firstName} ${customer.lastName}`}</p>
        <p>{service}</p>
        <p>{`${city} ${address}`}</p>
        <p>Status: {status}</p>
      </div>

      {/* Body */}
      <div className=" flex h-full flex-col p-2">
        {/* PanelHeader */}
        <div className="">
          <div className="flex flex-wrap justify-between text-xs font-semibold  ">
            <p>Call ID: {id}</p>
            <p>{worker.firstName + worker.lastName}</p>
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
                workerId={worker.id}
                callId={call.id}
                callStatus={call.status}
                isFetchingCalls={isFetchingCalls}
              />

              {/* user Actions */}
              <UserActionRow
                userId={userId}
                call={call}
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
  call: Call;
  isFetchingCalls: boolean;
}

const UserActionRow = ({
  call,
  userId,
  isFetchingCalls,
}: UserActionRowProps) => {
  const { id: callId, customer } = call;

  if (customer.id !== userId) {
    return null;
  }

  return (
    <>
      {/* Edit Btn */}

      <EditBtn call={call} isFetchingCalls={isFetchingCalls} />

      {/* Delete Btn */}
      <DeleteBtn callId={callId} isFetchingCalls={isFetchingCalls} />
    </>
  );
};

interface EditBtnProps {
  call: Call;
  isFetchingCalls: boolean;
}

const EditBtn = ({ call, isFetchingCalls }: EditBtnProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const closeModal = () => setIsOpen(false);
  const openModal = () => setIsOpen(true);

  return (
    <>
      <button type="button" onClick={openModal} className="">
        <PencilSquareIcon className="w-5 fill-blue-600 " />
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
                  <button
                    type="button"
                    className="absolute right-2 top-2 h-6 w-6 "
                    onClick={closeModal}
                  >
                    <XMarkIcon className="h-full w-full" />
                  </button>

                  <Dialog.Title
                    as="h3"
                    className="text-lg font-bold leading-6 text-indigo-500"
                  >
                    Edit Call
                  </Dialog.Title>

                  <div className="mt-4">
                    <EditCallForm
                      call={call}
                      isFetchingCalls={isFetchingCalls}
                      closeModal={closeModal}
                    />
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

interface DeleteBtnProps {
  callId: string;
  isFetchingCalls: boolean;
}

const DeleteBtn = ({ callId, isFetchingCalls }: DeleteBtnProps) => {
  const { push, basePath } = useRouter();
  const { data: session } = useSession();
  const { mutate, isIdle: deleteBtnIsIdle } = useDeleteCall(
    session?.idToken ?? ""
  );
  const queryClient = useQueryClient();

  const isDisabled = isFetchingCalls || !deleteBtnIsIdle;

  return (
    <>
      <button
        disabled={isDisabled}
        onClick={() => {
          mutate(callId, {
            onSuccess: () => {
              void queryClient.invalidateQueries(["call"]);
              toast.success("Deleted call successfully");
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
  workerId: string;
  callStatus: CallStatus;
  isFetchingCalls: boolean;
}

const WorkerActions = ({
  callId,
  isFetchingCalls,
  userRole,
  callStatus,
  userId,
  workerId,
}: WorkerActionProps) => {
  if (userRole !== UserRole.WORKER) {
    return null;
  }

  return (
    <>
      {callStatus === CallStatus.NEW && (
        <Pick
          callId={callId}
          isFetchingCalls={isFetchingCalls}
          userId={userId}
        />
      )}
      {callStatus === CallStatus.IN_PROGRESS && workerId === userId && (
        <UnPick callId={callId} isFetchingCalls={isFetchingCalls} />
      )}
    </>
  );
};

interface UnPickProps {
  callId: string;
  isFetchingCalls: boolean;
}

const UnPick = ({ callId, isFetchingCalls }: UnPickProps) => {
  const { data: session } = useSession();
  const { mutate, isIdle: isIdlePostUnPick } = usePostPick(
    session?.idToken ?? "",
    callId
  );
  const queryClient = useQueryClient();

  const onSubmit = () => {
    const removePick = {
      workerId: "",
    };

    mutate(removePick, {
      onSuccess: () => {
        void queryClient.invalidateQueries(["call"]);
        toast.success("Unpicked call successfully");
      },
    });
  };

  const isDisabled = isFetchingCalls || !isIdlePostUnPick;

  return (
    <>
      <button disabled={isDisabled} onClick={onSubmit}>
        <BriefcaseIcon className="w-5 fill-red-600 " />
      </button>
    </>
  );
};

interface PickProps {
  callId: string;
  userId: string;
  isFetchingCalls: boolean;
}

const Pick = ({ callId, isFetchingCalls, userId }: PickProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [expectedArrivalTime, setExpectedArrivalTime] = useState(new Date());
  const { data: session } = useSession();
  const { mutate, isIdle: isIdlePostPick } = usePostPick(
    session?.idToken ?? "",
    callId
  );
  const queryClient = useQueryClient();

  const closeModal = () => setIsOpen(false);
  const openModal = () => setIsOpen(true);

  const onSubmit = () => {
    const pick = {
      workerId: userId,
      status: CallStatus.IN_PROGRESS,
      expectedArrivalTime: expectedArrivalTime,
    };

    mutate(pick, {
      onSuccess: () => {
        void queryClient.invalidateQueries(["call"]);
        toast.success("Picked call successfully");
        closeModal();
      },
    });
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
                <Dialog.Panel className="w-full max-w-md transform rounded-2xl bg-stone-100 p-6 shadow-xl transition-all">
                  <button
                    type="button"
                    className="absolute right-2 top-2 h-6 w-6 "
                    onClick={closeModal}
                  >
                    <XMarkIcon className="h-full w-full" />
                  </button>

                  <Dialog.Title
                    as="h3"
                    className="text-lg font-bold leading-6 text-indigo-500"
                  >
                    Pick call
                  </Dialog.Title>

                  <div className="mt-4">
                    <DatePicker
                      selected={expectedArrivalTime}
                      onChange={(date: Date) => setExpectedArrivalTime(date)}
                      showTimeSelect
                      timeIntervals={30}
                      minDate={new Date()}
                      dateFormat="dd/MM/yyyy HH:mm aa"
                      preventOpenOnFocus={true}
                      className="rounded-md text-center shadow-md"
                    />
                  </div>

                  <div className="mt-4 flex justify-center gap-2 text-white">
                    <button
                      type="button"
                      className="inline-flex justify-center rounded-md border border-transparent bg-green-500 px-4 py-2 text-sm font-medium  hover:bg-green-600 focus:outline-none"
                      onClick={onSubmit}
                      disabled={isFetchingCalls || !isIdlePostPick}
                    >
                      Pick
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
