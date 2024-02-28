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
    <ProfileList profiles={profiles}/>
  </div>);
}
