import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useSession } from "next-auth/react";
import React, { useMemo } from "react";
import { useCities } from "~/api/cities";
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { ChevronDownIcon, ChevronUpIcon } from "@heroicons/react/20/solid";

type Post = {
  id: number;
  userId: number;
  title: string;
  body: string;
};

const columnHelper = createColumnHelper<Post>();

// Make some columns!
const columns = [
  columnHelper.accessor("id", {
    cell: (info) => info.getValue(),
    header: () => <span>ID</span>,
  }),
  columnHelper.accessor((row) => row.userId, {
    id: "userId",
    cell: (info) => <i>{info.getValue()}</i>,
    header: () => <span>UserId</span>,
  }),
  columnHelper.accessor((row) => row.title, {
    id: "title",
    cell: (info) => <i>{info.getValue().slice(0, 50) + "..."}</i>,
    header: () => <span>Title</span>,
  }),
  columnHelper.accessor((row) => row.body, {
    id: "body",
    cell: (info) => <i>{info.getValue()}</i>,
    header: () => <span>Last Name</span>,
  }),
  columnHelper.display({
    id: "actions",
    cell: (props) => <div>actions</div>,
    header: () => <span>Actions</span>,
  }),
];

const TestPage = () => {
  const { data: posts } = useQuery(["posts"], async () => {
    const { data } = await axios.get(
      "https://jsonplaceholder.typicode.com/posts"
    );
    return data;
  });

  //person table instance
  const table = useReactTable({
    columns: columns,
    data: posts ? posts : [],
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
  });

  return (
    <div className="p-4">
      <table className=" container table-auto border-separate  border-spacing-0 overflow-hidden  rounded-xl   shadow-md   ">
        <thead>
          {table.getHeaderGroups().map((headerGroup) => (
            <tr key={headerGroup.id} className="">
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
        <tbody className=" rounded-xl bg-yellow-50   bg-opacity-70 text-center">
          {table.getRowModel().rows.map((row) => (
            <tr key={row.id} className=" ">
              {row.getVisibleCells().map((cell) => (
                <td key={cell.id} className="  ">
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default TestPage;
