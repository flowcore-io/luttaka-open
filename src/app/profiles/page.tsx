"use client";

import {api} from "@/trpc/react";
import {DataTable} from "@/app/profiles/profile.table";
import {profileColumn} from "@/app/profiles/profile.column";

export default function ProfilePage() {

  const profilesRequest = api.profile.page.useQuery();

  return (<div>
      <DataTable columns={profileColumn} data={profilesRequest.data ?? []}/>
    </div>
  );
}
