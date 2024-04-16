"use client"

import { useState } from "react"

import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader } from "@/components/ui/dialog"
import { PageTitle } from "@/components/ui/page-title"
import { api } from "@/trpc/react"

import { AddAdminForm } from "./add-admin.form"
import { ProfileListItem } from "./profile-list-item.component"

export default function AdminPermissionPage() {
  const [addAdminDialogOpened, setAddAdminDialogOpened] = useState(false)
  const { data: admins, refetch } = api.profile.admins.useQuery()

  return (
    <div className="p-4 md:p-6">
      <PageTitle
        title={"Permissions"}
        subtitle={`A list of all the people who have admin permissions.`}
      />
      <div className="flex pb-8">
        <div className="flex-1 text-right">
          <Button onClick={() => setAddAdminDialogOpened(true)}>
            Add administrator
          </Button>
        </div>
      </div>
      <ul className="space-y-4">
        {admins?.map((profile) => (
          <ProfileListItem
            key={profile.id}
            profile={profile}
            refetch={async () => {
              await refetch()
            }}
          />
        ))}
      </ul>
      <Dialog
        open={addAdminDialogOpened}
        onOpenChange={(open) => {
          !open && setAddAdminDialogOpened(open)
        }}>
        <DialogContent
          className={"max-w-4xl"}
          onCloseAutoFocus={() => (document.body.style.overflow = "auto")}>
          <DialogHeader>Add administrator</DialogHeader>
          <AddAdminForm
            close={() => setAddAdminDialogOpened(false)}
            refetch={() => refetch()}
            filterAway={
              admins?.map((admin) => ({ userId: admin.userId })) ?? []
            }
          />
        </DialogContent>
      </Dialog>
    </div>
  )
}
