"use client";

import {api} from "@/trpc/react";
import React, {useMemo} from "react";
import {ProfileList} from "@/app/profiles/profile-list.component";
import {PageTitle} from "@/components/ui/page-title";

export default function ProfilePage() {

  const profilesRequest = api.profile.page.useQuery();

  const profiles = useMemo(() => {
    if (profilesRequest.data) {
      return profilesRequest.data;
    }
    return [];
  }, [profilesRequest.data]);

  return (<div>
    <PageTitle
      title={"Participants"}
      subtitle={"A list of all the people who are partaking in this conference"}
    />
    <ProfileList profiles={profiles}/>
  </div>);
}
