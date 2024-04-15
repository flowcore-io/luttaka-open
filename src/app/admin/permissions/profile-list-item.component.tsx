import { Loader, Trash } from "lucide-react"
import React, { type FC, useCallback, useState } from "react"
import { toast } from "sonner"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { type UserProfile } from "@/contracts/profile/user-profile"
import { api } from "@/trpc/react"

export type ProfileListItemProps = {
  profile: UserProfile
  refetch: () => Promise<void>
}

export const ProfileListItem: FC<ProfileListItemProps> = ({
  profile,
  refetch,
}) => {
  const [loading, setLoading] = useState(false)
  const { data: myProfile } = api.profile.me.useQuery()
  const apiRemoveAdmin = api.profile.removeAdmin.useMutation()
  const removeAdmin = useCallback(async () => {
    setLoading(true)
    const success = await apiRemoveAdmin.mutateAsync({
      userId: profile.userId,
    })
    if (success) {
      await refetch()
      toast.success("Admin removed")
    } else {
      toast.error("Admin removal failed")
    }
    setLoading(false)
  }, [profile.userId])
  return (
    <li
      key={profile.id}
      className={"flex items-center space-x-3 border-b border-accent py-3"}>
      <Avatar className={"h-12 w-12 flex-grow-0 rounded-full"}>
        <AvatarImage src={profile.avatarUrl} alt={profile.displayName} />
        <AvatarFallback className={"rounded"}>
          {profile.initials}
        </AvatarFallback>
      </Avatar>
      <div className={"flex-1"}>
        <p className={"font-bold"}>{profile.displayName}</p>
      </div>
      {myProfile?.userId !== profile.userId && (
        <Button
          className={"ml-2"}
          size={"sm"}
          onClick={(e) => {
            e.stopPropagation()
            return removeAdmin()
          }}
          disabled={loading}>
          {loading ? <Loader className={"animate-spin"} /> : <Trash />}
        </Button>
      )}
    </li>
  )
}
