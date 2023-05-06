import type { FC } from "react";

interface MessageCardProps {
  message: string;
}

export const MessageCard: FC<MessageCardProps> = ({ message }) => {
  return (
    <div className="px-1">
      <div className="card m-auto w-full max-w-md text-center">
        <h1 className=" ">{message}</h1>
      </div>
    </div>
  );
};

export const MessageCardCentered: FC<MessageCardProps> = ({ message }) => {
  return (
    <div className="flex h-screen justify-center px-1">
      <div className="card m-auto w-full max-w-md text-center">
        <h1>{message}</h1>
      </div>
    </div>
  );
};
