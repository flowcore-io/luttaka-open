import React, { type FC } from "react"

import { ProfileListItem } from "@/app/attendees/profile-list-item.component"
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
        return <ProfileListItem profile={profile} />
      })}
    </ul>
  )
}
