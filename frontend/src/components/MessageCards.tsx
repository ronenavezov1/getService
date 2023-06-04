import type { FC } from "react";
import toolsAnimation from "../../public/lottie/95851-tools.json";
import noDataAnimation from "../../public/lottie/107420-no-data-loader.json";
import xMarkAnimation from "../../public/lottie/103831-circle-x.json";
import Lottie from "lottie-react";

interface MessageCardProps {
  message?: string;
}

export const MessageCardCenteredNotFound: FC<MessageCardProps> = ({
  message,
}) => {
  return (
    <div className="grid min-h-screen w-full place-items-center justify-center">
      <div className="m-auto w-full max-w-md text-center text-5xl text-white">
        <h1>{message}</h1>
        <Lottie animationData={noDataAnimation} loop={true} />
      </div>
    </div>
  );
};

export const MessageCardCenteredLoading: FC<MessageCardProps> = ({
  message,
}) => {
  return (
    <div className="flex min-h-screen flex-col place-items-center justify-center gap-10">
      {message && (
        <h1 className="text-center text-5xl text-white">{message}</h1>
      )}
      <Lottie
        animationData={toolsAnimation}
        loop={true}
        className=" max-w-[12rem]"
      />
    </div>
  );
};

export const MessageCardCenteredXMark: FC<MessageCardProps> = ({ message }) => {
  return (
    <div className="flex min-h-screen flex-col place-items-center justify-center gap-10 ">
      <h1 className="text-center text-5xl text-white">{message}</h1>
      <Lottie animationData={xMarkAnimation} loop={true} className="max-w-xs" />
    </div>
  );
};
