"use client"

import { useClerk, useUser } from "@clerk/nextjs"
import * as DropdownMenu from "@radix-ui/react-dropdown-menu"
import Image from "next/image"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useState } from "react"

import { UserRole } from "@/contracts/user/user-role"

import { RestrictedToRole } from "./restricted-to-role"

export const LuttakaUserButton = () => {
  const { isLoaded, user } = useUser()
  const { signOut, openUserProfile } = useClerk()
  const router = useRouter()
  const [open, setOpen] = useState(false)
  if (!isLoaded) return null
  if (!user?.id) return null

  return (
    <DropdownMenu.Root onOpenChange={setOpen}>
      <DropdownMenu.Trigger asChild>
        <button
          className={`relative flex h-[63px] w-[63px] flex-row rounded-full ${open ? "bg-gradient-to-t from-[#FF51FF] to-[#FFDD57]" : ""} transition-colors duration-300`}>
          <div
            className={`absolute inset-[-0.2em] z-0 rounded-full bg-gradient-to-t from-[#FF51FF] to-[#FFDD57] ${open ? "opacity-1" : "opacity-0"} transition-opacity duration-300`}
          />
          <Image
            unoptimized
            alt={
              user?.primaryEmailAddress?.emailAddress ?? "Email address missing"
            }
            src={user?.imageUrl}
            width={55}
            height={55}
            className="z-10 m-auto rounded-full"
          />
        </button>
      </DropdownMenu.Trigger>
      <DropdownMenu.Portal>
        <DropdownMenu.Content className="mt-2 flex w-52 flex-col items-start gap-2 rounded border border-gray-200 bg-white px-6 py-4 font-lato text-black drop-shadow-2xl">
          <DropdownMenu.Item asChild>
            <Link href="/me" passHref>
              Profile
            </Link>
          </DropdownMenu.Item>
          <DropdownMenu.Item asChild>
            <button onClick={() => openUserProfile()}>Account Settings</button>
          </DropdownMenu.Item>
          <RestrictedToRole role={UserRole.admin}>
            <DropdownMenu.DropdownMenuSeparator className="mt-4 w-full border border-slate-200" />
            <DropdownMenu.DropdownMenuLabel className="text-slate-400">
              Admin
            </DropdownMenu.DropdownMenuLabel>
            <DropdownMenu.Item asChild>
              <Link href="/admin/check-in" passHref>
                Check-in
              </Link>
            </DropdownMenu.Item>
            <DropdownMenu.Item asChild>
              <Link href="/admin/events" passHref>
                Manage Events
              </Link>
            </DropdownMenu.Item>
            <DropdownMenu.Item asChild>
              <Link href="/admin/tickets" passHref>
                Manage Tickets
              </Link>
            </DropdownMenu.Item>
            <DropdownMenu.Item asChild>
              <Link href="/admin/activities" passHref>
                Manage Activities
              </Link>
            </DropdownMenu.Item>
            <DropdownMenu.Item asChild>
              <Link href="/admin/newsitems" passHref>
                Manage News Items
              </Link>
            </DropdownMenu.Item>
            <DropdownMenu.Item asChild>
              <Link href="/admin/companies" passHref>
                Manage Companies
              </Link>
            </DropdownMenu.Item>
            <DropdownMenu.Item asChild>
              <Link href="/admin/permissions" passHref>
                Manage Permissions
              </Link>
            </DropdownMenu.Item>
          </RestrictedToRole>
          <DropdownMenu.DropdownMenuSeparator className="mt-4 w-full border border-slate-200" />
          <DropdownMenu.Item asChild>
            <button onClick={() => signOut(() => router.push("/"))}>
              Sign Out{" "}
            </button>
          </DropdownMenu.Item>
        </DropdownMenu.Content>
      </DropdownMenu.Portal>
    </DropdownMenu.Root>
  )
}
