import Link from "next/link"

import { UserProfileForm } from "@/app/me/user-profile-form"
import { UserProfileView } from "@/components/organisms/profile/user-profile-view"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { api } from "@/trpc/server"

export const dynamic = "force-dynamic"

export default async function MyUserRedirectPage() {
  const profile = await api.profile.me.query()

  return (
    <div className="w-[100%] p-4 md:flex md:space-x-10 md:p-6">
      <div className={"flex-1"}>
        <UserProfileForm user={profile} />
      </div>
      <Card className={"flex-2 mt-8 md:mt-0"}>
        <CardHeader>
          <div className={"flex justify-between"}>
            <h1 className={"text-2xl font-bold"}>Your Profile</h1>
            <Link className={""} href={`/profiles/${profile.id}`}>
              <Button>Visit</Button>
            </Link>
          </div>
        </CardHeader>
        <CardContent className={"px-3"}>
          <UserProfileView profile={profile} />
        </CardContent>
      </Card>
    </div>
  )
}
