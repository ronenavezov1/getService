import { Disclosure } from "@headlessui/react";
import {
  ChevronDownIcon,
  ChevronUpIcon,
  PencilSquareIcon,
  TrashIcon,
} from "@heroicons/react/20/solid";
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { useSession } from "next-auth/react";
import { FC } from "react";
import { Call, useDeleteCall, useUserCalls } from "~/api/call";
import { NextPageWithAuth, UserRole } from "~/components/Auth";
import { MessageCard } from "~/components/MessageCards";

const columnHelper = createColumnHelper<Call>();

const columns = [
  columnHelper.accessor("id", {
    header: "ID",
    cell: (info) => <i>{info.getValue()}</i>,
  }),
  columnHelper.accessor("customerId", {
    header: "CustomerID",
    cell: (info) => <i>{info.getValue()}</i>,
  }),
  columnHelper.accessor("workerId", {
    header: "workerID",
    cell: (info) => <i>{info.getValue()}</i>,
  }),
  columnHelper.accessor("service", {
    header: "Service",
    cell: (info) => <i>{info.getValue()}</i>,
  }),
  columnHelper.accessor("description", {
    header: "Description",
    cell: (info) => <i>{info.getValue()}</i>,
  }),
  columnHelper.accessor("city", {
    header: "City",
    cell: (info) => <i>{info.getValue()}</i>,
  }),
  columnHelper.accessor("address", {
    header: "Address",
    cell: (info) => <i>{info.getValue()}</i>,
  }),
  columnHelper.accessor("status", {
    header: "Status",
    cell: (info) => <i>{info.getValue()}</i>,
  }),
  columnHelper.display({
    id: "actions",
    header: "Actions",
    cell: (props) => <ActionRow callId={props.row.original.id} />, // TODO: fix this
  }),
];

const Status: NextPageWithAuth = () => {
  const { data: session, status } = useSession();
  const { data: calls, isLoading } = useUserCalls(session?.idToken);

  return (
    <>
      {isLoading || status == "loading" ? (
        <MessageCard message={"Loading user calls"} />
      ) : (
        <UserCallsTable calls={calls} />
      )}
    </>
  );
};

Status.auth = {
  requiredRoles: [UserRole.ADMIN, UserRole.CUSTOMER, UserRole.WORKER],
};

export default Status;

interface UserCallsTableProps {
  calls?: Call[];
}

const UserCallsTable: FC<UserCallsTableProps> = ({ calls }) => {
  const table = useReactTable({
    columns: columns,
    data: calls ?? [],
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
  });

  return (
    <div className="overflow-auto px-1">
      {calls ? (
        <table className=" mx-auto max-w-fit table-auto border-separate  border-spacing-0 overflow-hidden  rounded-xl   shadow-md   ">
          <thead>
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <th
                    key={header.id}
                    className=" bg-indigo-900 bg-opacity-90 py-1 px-2 text-white"
                  >
                    {header.isPlaceholder ? null : (
                      <div
                        {...{
                          className: header.column.getCanSort()
                            ? "cursor-pointer select-none flex items-center "
                            : "inline-block",

                          onClick: header.column.getToggleSortingHandler(),
                        }}
                      >
                        {flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}

                        {{
                          asc: <ChevronUpIcon className="w-6" />,
                          desc: <ChevronDownIcon className="w-6" />,
                        }[header.column.getIsSorted() as string] ?? null}
                      </div>
                    )}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody className="rounded-xl bg-yellow-50 bg-opacity-70 ">
            {table.getRowModel().rows.map((row) => (
              <tr key={row.id} className=" ">
                {row.getVisibleCells().map((cell) => (
                  <td key={cell.id} className="py-1 px-2  ">
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <div>No user Calls</div>
      )}
    </div>
  );
};

interface ActionRowProps {
  callId: string;
}

const ActionRow = ({ callId }: ActionRowProps) => {
  const { data: session, status } = useSession();
  const deleteCall = useDeleteCall(session?.idToken);

  return (
    <>
      {status == "loading" || !deleteCall ? (
        <div>loading</div>
      ) : (
        <div className="flex justify-center gap-2">
          <PencilSquareIcon className="w-5 fill-indigo-700" />
          <TrashIcon
            className="w-5 fill-red-600 "
            onClick={() => {
              console.log("deleteRow");
              deleteCall!.mutate(callId);
            }}
          />
        </div>
      )}
    </>
  );
};
