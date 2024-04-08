"use client"

import { useRouter } from "next/navigation"
import React, { type FC } from "react"

import MarkdownViewer from "@/components/md-viewer"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { PageTitle } from "@/components/ui/page-title"
import { type RouterOutputs } from "@/trpc/shared"

export type CompanyProfileProps = {
  profile: RouterOutputs["company"]["get"]
}

export const CompanyProfileView: FC<CompanyProfileProps> = ({ profile }) => {
  const router = useRouter()

  if (!profile) {
    console.error("No profile found")
    return null
  }

  return (
    <div className={`flex flex-col`}>
      <PageTitle title={"Company Profile"} />
      <div
        className={`flex flex-row items-center gap-12 md:flex md:flex-col md:space-x-4`}>
        <Avatar className={`h-auto w-[125px] rounded-full md:h-56 md:w-56`}>
          <AvatarImage
            src={profile.imageUrl ?? ""}
            alt={`Company Profile Picture`}
          />
          <AvatarFallback className={`rounded-full`}>
            {profile.name.substring(0, 2)}
          </AvatarFallback>
        </Avatar>
        <div>
          <div className={`mt-2 text-center md:text-left`}>
            <div className={`flex flex-row`}>
              <h1 className={`text-4xl font-bold`}>{profile.name}</h1>
            </div>
          </div>
        </div>
      </div>
      <div>
        {profile.description ? (
          <div>
            <MarkdownViewer source={profile.description} className={`mt-2`} />
          </div>
        ) : (
          <div className={`mt-10 italic text-muted`}>No description</div>
        )}
      </div>
      {profile.isOwner && (
        <Button
          className={`mt-12`}
          onClick={() => router.push(`${profile.id}/edit`)}>
          Edit Company Profile
        </Button>
      )}
    </div>
  )
}
