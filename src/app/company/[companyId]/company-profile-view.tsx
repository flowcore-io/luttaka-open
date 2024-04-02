"use client"

import { EditIcon } from "lucide-react"
import { useRouter } from "next/navigation"
import React, { type FC } from "react"

import MarkdownViewer from "@/components/md-viewer"
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
    <div className={`md:flex md:space-x-4`}>
      {/*<Avatar className={`h-auto w-[100%] rounded md:h-56 md:w-56`}>*/}
      {/*  <AvatarImage src={profile.avatarUrl} alt={`profile picture`} />*/}
      {/*  <AvatarFallback className={`rounded`}>*/}
      {/*    {profile.initials}*/}
      {/*  </AvatarFallback>*/}
      {/*</Avatar>*/}
      <div>
        <div className={`mt-2 text-center md:text-left`}>
          <div className={`flex flex-row`}>
            <h1 className={`text-4xl font-bold`}>{profile.name}</h1>
            {profile.isOwner && (
              <EditIcon
                className={`h-4 w-4 cursor-pointer`}
                onClick={() => router.push(`${profile.id}/edit`)}
              />
            )}
          </div>
          {profile.description ? (
            <div>
              <MarkdownViewer source={profile.description} className={`mt-2`} />
            </div>
          ) : (
            <div className={`mt-10 italic text-muted`}>No description</div>
          )}
        </div>
      </div>
    </div>
  )
}
