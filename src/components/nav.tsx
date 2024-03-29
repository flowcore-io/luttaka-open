"use client"

import type { LucideIcon } from "lucide-react"
import type { Url } from "next/dist/shared/lib/router/router"
import Link from "next/link"
import { usePathname } from "next/navigation"

import { Button } from "@/components/ui/button"
import { UserRole } from "@/contracts/user/user-role"
import { cn } from "@/lib/utils"
import { api } from "@/trpc/react"

interface NavProps {
  links: {
    href?: Url
    title: string
    label?: string
    superuserRequired: boolean
    icon: LucideIcon
  }[]
}

export function Nav({ links }: NavProps) {
  const userRole = api.user.role.useQuery()
  const pathname = usePathname()

  return (
    <div className="group flex flex-col gap-4 py-4 data-[collapsed=true]:py-4">
      <nav className="grid gap-2 group-[[data-collapsed=true]]:justify-center group-[[data-collapsed=true]]:px-2">
        {links.map((link, index) => {
          const isCurrent = link.href === pathname
          if (link.superuserRequired && userRole.data !== UserRole.admin) {
            return false
          }
          return (
            <Button
              key={index}
              className="items-start justify-start"
              asChild
              variant={isCurrent ? "default" : "ghost"}>
              <Link href={link.href ?? "/"}>
                <link.icon className="mr-2 h-5 w-5" />
                {link.title}
                {link.label && (
                  <span
                    className={cn(
                      "ml-auto",
                      isCurrent && "text-background dark:text-white",
                    )}>
                    {link.label}
                  </span>
                )}
              </Link>
            </Button>
          )
        })}
      </nav>
    </div>
  )
}
