"use client";

import type { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { EditContact } from "./edit-contact";
import type { ContactProps, ContactTableMeta } from "./types";
import { DeleteContact } from "./delete-contact";
import Link from "next/link";

export const columns: ColumnDef<ContactProps>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ??
          (table.getIsSomePageRowsSelected() && "indeterminate")
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "name",
    header: ({ column }) => {
      return (
        <div className="text-left">
          <Button
            variant="ghost"
            className="px-0"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Name
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        </div>
      );
    },
    cell: ({ row }) => {
      return (
        <div className="text-left">
          <Link
            href="/contacts/[contactid]"
            as={`/contacts/${row.original.contactid}`}
            passHref
          >
            {row.original.name}
          </Link>
        </div>
      );
    },
  },
  {
    accessorKey: "gender",
    header: ({ column }) => {
      return (
        <div className="text-left">
          <Button
            variant="ghost"
            className="px-0"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Gender
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        </div>
      );
    },
  },
  {
    accessorKey: "email",
    header: ({ column }) => {
      return (
        <div className="text-left">
          <Button
            variant="ghost"
            className="px-0"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Email
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        </div>
      );
    },
  },
  {
    id: "actions",
    cell: ({ table, row }) => {
      const meta = table.options?.meta as ContactTableMeta;
      return (
        <div className="flex flex-row gap-2">
          <EditContact
            contactid={row.original.contactid ?? ""}
            name={row.original.name ?? ""}
            gender={row.original.gender ?? ""}
            email={row.original.email ?? ""}
            updateData={(payload: ContactProps) => meta?.updateData(payload)}
          />
          <DeleteContact
            contactid={row.original.contactid ?? ""}
            name={row.original.name ?? ""}
            deleteData={(contactid: string) => meta?.deleteData(contactid)}
          />
        </div>
      );
    },
  },
];
