import { CheckCircleIcon, XCircleIcon } from "@heroicons/react/20/solid";
import { useQueryClient } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import { toast } from "react-toastify";
import { usePostApproveUser } from "~/api/approveUser";
import type { FullUser } from "~/api/user";

interface UserCardProps {
  user: FullUser;
  isFetchingCalls: boolean;
}

export const UserCard = ({ user, isFetchingCalls }: UserCardProps) => {
  const {
    firstName,
    lastName,
    email,
    city,
    address,
    isApproved,
    isOnBoardingCompleted,
    type,
    id,
  } = user;

  return (
    <div
      className={`
       flex w-full
        max-w-3xl flex-col rounded-xl border bg-gray-100 shadow-md`}
    >
      {/* Header */}
      <div
        className={` ${
          isApproved
            ? `bg-green-500 hover:bg-green-600`
            : `bg-red-500 hover:bg-red-600`
        } flex w-full flex-wrap justify-between   gap-4 rounded-xl p-2 text-sm  text-white `}
      >
        <div>
          <p className="font-bold underline">Name</p>
          <p>{`${firstName} ${lastName}`}</p>
        </div>

        <div>
          <p className="font-bold underline">Email</p>
          <p>{email}</p>
        </div>

        <div>
          <p className="font-bold underline"> Address</p>
          <p>{`${city} ${address}`}</p>
        </div>

        <div>
          <p className="font-bold underline">Role</p>
          <p>{type}</p>
        </div>

        <div className="flex flex-col items-center">
          <p className="font-bold underline">Onboarding</p>

          {isOnBoardingCompleted ? (
            <div className="rounded-full bg-black bg-opacity-50">
              <TrueIcon isTrue={isOnBoardingCompleted} />
            </div>
          ) : (
            <div className="rounded-full bg-black bg-opacity-50">
              <FalseIcon isTrue={!isOnBoardingCompleted} />
            </div>
          )}
        </div>

        <ApprovedToggle
          isApproved={isApproved}
          userId={id}
          isFetchingCalls={isFetchingCalls}
        />
      </div>
    </div>
  );
};

interface ApprovedToggleProps {
  userId: string;
  isApproved: boolean;
  isFetchingCalls: boolean;
}

const ApprovedToggle = ({
  userId,
  isApproved,
  isFetchingCalls,
}: ApprovedToggleProps) => {
  const { data: session, status } = useSession();
  const queryClient = useQueryClient();
  const { mutate, isIdle } = usePostApproveUser(session?.idToken ?? "", userId);

  if (status === "loading") return null;

  const onApproveClick = () => {
    mutate(
      { isApproved: true },
      {
        onSuccess: () => {
          void queryClient.invalidateQueries(["users"]);
          toast.success("User have been approved");
        },
      }
    );
  };

  const onDisapproveClick = () => {
    mutate(
      { isApproved: false },
      {
        onSuccess: () => {
          void queryClient.invalidateQueries(["users"]);
          toast.success("User have been disapproved");
        },
      }
    );
  };

  return (
    <div className="flex flex-col items-center">
      <p className="font-bold underline">Approved</p>
      <div className=" flex gap-2 rounded-full bg-black bg-opacity-50">
        <button
          disabled={isApproved || !isIdle || isFetchingCalls}
          onClick={onApproveClick}
        >
          <TrueIcon isTrue={isApproved} />
        </button>
        <button
          disabled={!isApproved || !isIdle || isFetchingCalls}
          onClick={onDisapproveClick}
        >
          <FalseIcon isTrue={!isApproved} />
        </button>
      </div>
    </div>
  );
};

interface IconProps {
  isTrue: boolean;
}

const TrueIcon = ({ isTrue }: IconProps) => {
  return (
    <CheckCircleIcon
      className={`
     ${
       isTrue
         ? `fill-green-500 stroke-green-700`
         : `fill-gray-300 stroke-gray-400 hover:fill-green-500 hover:stroke-green-700`
     }
    stroke stroke-3 h-5 w-5  `}
    />
  );
};

const FalseIcon = ({ isTrue }: IconProps) => {
  return (
    <XCircleIcon
      className={`
    ${
      isTrue
        ? `fill-red-500 stroke-red-700`
        : `fill-gray-300 stroke-gray-400 hover:fill-red-500 hover:stroke-red-700  `
    }
   stroke stroke-3 h-5 w-5  `}
    />
  );
};

export default UserCard;
