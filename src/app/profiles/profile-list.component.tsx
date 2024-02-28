import React, {type FC} from "react";
import {type UserProfile} from "@/contracts/profile/user-profile";
import Link from "next/link";
import {Avatar, AvatarFallback, AvatarImage} from "@/components/ui/avatar";

export type ProfileListProps = {
  profiles: UserProfile[];
}


export const ProfileList: FC<ProfileListProps> = ({profiles}) => {

  if (profiles.length < 1) {
    return (
      <div>
        <p className={"text-center font-light"}>No profiles found 😔</p>
      </div>
    );
  }

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
