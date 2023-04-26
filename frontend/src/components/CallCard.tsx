import type { FC, MouseEventHandler, ReactNode } from "react";
import type { Call } from "~/api/call";

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
  actionRow?: ReactNode;
  fullSize?: boolean;
  onBodyClick?: MouseEventHandler<HTMLButtonElement>;
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

const CallCard: FC<CallCardProps> = ({
  call,
  actionRow,
  fullSize,
  onBodyClick,
}) => {
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

  return (
    <div
      className={`${
        fullSize ? "max-w-2xl" : "max-w-sm"
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
        <button
          className="my-6 "
          onClick={onBodyClick ?? undefined}
          disabled={!onBodyClick}
        >
          <p className="text-center text-lg font-medium   text-black">
            {!fullSize ? sliceDescription(description, 64) : <>{description}</>}
          </p>
        </button>

        {/* PanelFooter */}
        <div className="flex flex-grow ">
          <div className="flex h-fit w-full items-center justify-between self-end text-xs">
            <p>{creationTime}</p>
            <div className="flex gap-2">{actionRow}</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CallCard;
