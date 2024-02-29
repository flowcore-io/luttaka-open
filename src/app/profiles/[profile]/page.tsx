import { UserProfileView } from "@/components/organisms/profile/user-profile-view"
import { type WithUrlParams } from "@/lib/next-app.types"
import { api } from "@/trpc/server"

export type UserProfileProps = {
  profile: string
}

export default async function User({
  params,
}: WithUrlParams<UserProfileProps>) {
  const profile = await api.profile.get.query({
    profileId: params.profile,
  })

  return (
    <div>
      <UserProfileView profile={profile} />
    </div>
  )
}
