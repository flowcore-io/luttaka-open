import {type ColumnDef} from "@tanstack/table-core";
import {type UserProfile} from "@/contracts/profile/user-profile";

export const profileColumn: ColumnDef<UserProfile>[] = [
  {
    accessorKey: "displayName",
    header: "Name",
  },
  {
    accessorKey: "title",
    header: "Title",
  },
  {
    accessorKey: "company",
    header: "Company",
  },
]
