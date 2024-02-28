"use client";

import {api} from "@/trpc/react";
import React, {useMemo} from "react";
import {ProfileList} from "@/app/profiles/profile-list.component";

export default function ProfilePage() {

  const profilesRequest = api.profile.page.useQuery();

  const profiles = useMemo(() => {
    if (profilesRequest.data) {
      return profilesRequest.data;
    }
    return [];
  }, [profilesRequest.data]);

  return (<div>
    <div className={"mt-2 mb-4"}>
      <h1 className={"font-bold text-4xl"}>Participants</h1>
      <p>A list of all the people who are partaking in this conference</p>
    </div>

    <ProfileList profiles={profiles}/>
  </div>);
}
