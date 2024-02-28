"use client";
import Link from "next/link";
import type {LucideIcon} from "lucide-react";
import {cn} from "@/lib/utils";
import {buttonVariants} from "@/components/ui/button";
import type {Url} from "next/dist/shared/lib/router/router";
import {usePathname} from "next/navigation";
import {useEffect, useState} from "react";
import {useOrganizationList} from "@clerk/nextjs";

interface NavProps {
  isSidebarOpen?: boolean;
  setIsSidebarOpen?: (isOpen: boolean) => void;
  links: {
    href?: Url;
    title: string;
    label?: string;
    superuserRequired: boolean;
    icon: LucideIcon;
  }[];
}

export function Nav({ isSidebarOpen, setIsSidebarOpen, links }: NavProps) {
  const pathname = usePathname();
  const { isLoaded, userMemberships } = useOrganizationList({
    userMemberships: {
      infinite: true,
    },
  });
  const [superuser, setSuperuser] = useState(false);
  useEffect(() => {
    if (isLoaded) {
      const isSuperuser =
        userMemberships.data?.filter(
          (mem) => mem.organization.slug === "flowcore",
        ).length > 0;
      setSuperuser(!!isSuperuser);
    }
  }, [isLoaded, userMemberships]);
  return (
    isLoaded && (
      <div className="group flex flex-col gap-4 py-4 data-[collapsed=true]:py-4">
        <nav className="grid gap-2 group-[[data-collapsed=true]]:justify-center group-[[data-collapsed=true]]:px-2">
          {links.map((link, index) => {
            const isCurrent = link.href === pathname;
            if (link.superuserRequired && !superuser) {
              return false;
            }
            return (
              <Link
                key={index}
                href={link.href ?? "/"}
                className={cn(
                  buttonVariants({
                    variant: isCurrent ? "default" : "ghost",
                    size: "sm",
                  }),
                  isCurrent && "text-black bg-pink-400 hover:bg-pink-400 dark:bg-muted dark:text-white dark:hover:bg-muted dark:hover:text-white",
                  "justify-start text-base py-5 font-light"
                )}
                onClick={() => {
                  if (isSidebarOpen && setIsSidebarOpen) {
                    setIsSidebarOpen(false);
                  }
                }}
              >
                <link.icon className="mr-3 h-6 w-6 mr-5" /> {/* Increased icon size and right margin */}
                {link.title}
                {link.label && (
                  <span
                    className={cn(
                      "ml-auto",
                      isCurrent && "text-background dark:text-white",
                    )}
                  >
                    {link.label}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>
      </div>
    )
  );  
}
