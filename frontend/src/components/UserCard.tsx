import { Switch } from "@headlessui/react";
import { CheckCircleIcon, XCircleIcon } from "@heroicons/react/20/solid";
import { useState } from "react";
import type { FullUser } from "~/api/user";

interface UserCardProps {
  user: FullUser;
}

export const UserCard = ({ user }: UserCardProps) => {
  const {
    firstName,
    lastName,
    email,
    city,
    address,
    isApproved,
    isOnBoardingCompleted,
    type,
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
        } flex w-full flex-wrap justify-between   gap-4 rounded-xl p-2 text-sm font-bold text-white `}
      >
        <div>
          <p className="underline">Name</p>
          <p>{`${firstName} ${lastName}`}</p>
        </div>

        <div>
          <p className="underline">Email</p>
          <p>{email}</p>
        </div>

        <div>
          <p className="underline"> Address</p>
          <p>{`${city} ${address}`}</p>
        </div>

        <div>
          <p className="underline">Role</p>
          <p>{type}</p>
        </div>

        <div className="flex flex-col items-center">
          <p className="underline">Onboarding</p>
          {isOnBoardingCompleted ? (
            <TrueIcon isTrue={isOnBoardingCompleted} />
          ) : (
            <FalseIcon isTrue={!isOnBoardingCompleted} />
          )}
        </div>

        <div className="flex flex-col items-center">
          <p className="underline">Approved</p>
          <div className="flex gap-2">
            <button disabled={isApproved}>
              <TrueIcon isTrue={isApproved} />
            </button>
            <button disabled={!isApproved}>
              <FalseIcon isTrue={!isApproved} />
            </button>
          </div>
        </div>
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
        : `fill-gray-300 stroke-gray-400 hover:fill-red-500 hover:stroke-red-700`
    }
   stroke stroke-3 h-5 w-5  `}
    />
  );
};

const ApproveToggle = ({ isApproved }: { isApproved: boolean }) => {
  return (
    <>
      <p>test</p>
    </>
  );
};

export default UserCard;
