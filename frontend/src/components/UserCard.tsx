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
       flex
        w-full max-w-3xl flex-col rounded-xl border bg-gray-100 shadow-md`}
    >
      {/* Header */}
      <div
        className={` ${
          isApproved
            ? `bg-green-500 hover:bg-green-600`
            : `bg-red-500 hover:bg-red-600`
        } flex w-full flex-wrap justify-between gap-x-4 rounded-xl p-2 text-sm font-bold text-white `}
      >
        <p>{`${firstName} ${lastName}`}</p>
        <p>{email}</p>
        <p>{`${city} ${address}`}</p>
        <p>{type}</p>
        <p>{isApproved}</p>
        <p>{isOnBoardingCompleted}</p>
      </div>
    </div>
  );
};

export default UserCard;
