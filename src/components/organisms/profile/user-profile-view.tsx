"use client"

import Link from "next/link"
import React, { type FC, useMemo } from "react"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { type UserProfile } from "@/contracts/profile/user-profile"
import { convertUrlToSlugWithDomain } from "@/lib/format/convert-url-to-slug-with-domain"

export type UserProfileProps = {
  profile: UserProfile
}

export const UserProfileView: FC<UserProfileProps> = ({ profile }) => {
  const prettySocials = useMemo(
    () => convertUrlToSlugWithDomain(profile.socials ?? ""),
    [profile.socials],
  )

  return (
    <div className={"md:flex md:space-x-4"}>
      <Avatar className={"h-auto w-[100%] rounded md:h-56 md:w-56"}>
        <AvatarImage src={profile.avatarUrl} alt={"profile picture"} />
        <AvatarFallback className={"rounded"}>
          {profile.initials}
        </AvatarFallback>
      </Avatar>
      <div>
        <div className={"mt-2 text-center md:text-left"}>
          <h1 className={"text-4xl font-bold"}>{profile.displayName}</h1>
          {profile.title ? (
            <p>{profile.title}</p>
          ) : (
            <p className={"italic text-muted"}>no title</p>
          )}
        </div>
        <div className={"mb-2 text-center md:text-left"}>
          <Link
            className={"text-primary hover:underline"}
            href={profile.socials ?? ""}
            target={"_blank"}>
            {prettySocials}
          </Link>
        </div>
        <div>
          <h2 className={"text-2xl font-bold"}>Company</h2>
          {profile.company ? (
            <p>
              <Link href={`company/${profile.companyId}`}>
                {profile.company}
              </Link>
            </p>
          ) : (
            <p className={"italic"}>Individual</p>
          )}
        </div>
        <div className={"mt-5"}>
          <h2 className={"text-2xl font-bold"}>About</h2>
          <section>
            {profile.description ? (
              <p>{profile.description}</p>
            ) : (
              <p className={"italic text-muted"}>No description</p>
            )}
          </section>
        </div>
      </div>
    </div>
  )
}
