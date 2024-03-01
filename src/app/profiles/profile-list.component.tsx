import Link from "next/link"
import React, { type FC } from "react"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { MissingText } from "@/components/ui/messages/missing-text"
import { type UserProfile } from "@/contracts/profile/user-profile"

export type ProfileListProps = {
  profiles: UserProfile[]
}

export const ProfileList: FC<ProfileListProps> = ({ profiles }) => {
  if (profiles.length < 1) {
    return <MissingText text={"No profiles found"} />
  }

  return (
    <ul className={"space-y-2"}>
      {profiles.map((profile) => {
        return (
          <Link href={`/profiles/${profile.id}`}>
            <li
              key={profile.id}
              className={
                "flex items-center space-x-3 border-b border-accent py-3"
              }>
              <Avatar className={"h-12 w-12 flex-grow-0 rounded-full"}>
                <AvatarImage
                  src={profile.avatarUrl}
                  alt={profile.displayName}
                />
                <AvatarFallback className={"rounded"}>
                  {profile.initials}
                </AvatarFallback>
              </Avatar>
              <div className={"flex-1"}>
                <p className={"font-bold"}>{profile.displayName}</p>
                <p className={"font-thin"}>{profile.title || "No Title"}</p>
              </div>
            </li>
          </Link>
        )
      })}
    </ul>
  )
}
