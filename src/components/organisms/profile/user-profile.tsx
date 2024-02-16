"use client"

import React, {type FC, useMemo} from "react";
import Link from "next/link";
import {type UserProfileDto} from "@/dtos/profile/user-profile.dto";
import {Avatar, AvatarFallback, AvatarImage} from "@/components/ui/avatar";
import {convertUrlToSlugWithDomain} from "@/lib/format/convert-url-to-slug-with-domain";

export type UserProfileProps = {
  user: UserProfileDto;
}


export const UserProfile: FC<UserProfileProps> = ({user}) => {

  const prettySocials = useMemo(
    () => convertUrlToSlugWithDomain(user.socials ?? ""),
    [user.socials]
  );

  return (
    <div className={"md:flex md:space-x-4"}>
      <Avatar className={"rounded w-[100%] h-auto md:h-56 md:w-56"}>
        <AvatarImage src={user.avatarUrl} alt={"profile picture"}/>
        <AvatarFallback>DP</AvatarFallback>
      </Avatar>
      <div>
        <div className={"text-center mt-2 md:text-left"}>
          <h1 className={"text-4xl font-bold"}>{user.displayName}</h1>
          {user.title ? <p>{user.title}</p> : <p className={"text-muted italic"}>no title</p>}
        </div>
        <div className={"mb-2 text-center md:text-left"}>
          <Link
            className={"text-primary hover:underline"}
            href={user.socials ?? ""}
            target={"_blank"}>
            {prettySocials}
          </Link>
        </div>
        <div>
          <h2 className={"text-2xl font-bold"}>Company</h2>
          {
            user.company
              ? <p>{user.company}</p>
              : <p className={"italic"}>Individual</p>
          }
        </div>
        <div className={"mt-5"}>
          <h2 className={"text-2xl font-bold"}>About</h2>
          <section>
            {
              user.description
                ? <p>{user.description}</p>
                : <p className={"text-muted italic"}>No description</p>
            }
          </section>
        </div>
      </div>

    </div>
  )
}