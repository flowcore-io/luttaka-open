"use client";

import {api} from "@/trpc/react";
import React, {useMemo} from "react";
import {Avatar, AvatarFallback, AvatarImage} from "@/components/ui/avatar";
import Link from "next/link";


export default function ProfilePage() {

  const profilesRequest = api.profile.page.useQuery();

  const profiles = useMemo(() => {
    if (profilesRequest.data) {
      return profilesRequest.data;
    }
    return [];
  }, [profilesRequest.data]);

  return (
    <ul className={"space-y-2"}>
      {profiles.map(profile => {
        return (
          <Link href={`/profiles/${profile.id}`}>
            <li key={profile.id} className={"flex space-x-3 py-3 items-center border-b border-accent"}>
              <Avatar className={"rounded-full h-12 w-12 flex-grow-0"}>
                <AvatarImage src={profile.avatarUrl} alt={profile.displayName}/>
                <AvatarFallback className={"rounded"}>{profile.initials}</AvatarFallback>
              </Avatar>
              <div className={"flex-1"}>
                <p className={"font-bold"}>{profile.displayName}</p>
                <p className={"font-thin"}>{profile.title || "No Title"}</p>
              </div>
            </li>
          </Link>
        );
      })}
    </ul>
  );
}
