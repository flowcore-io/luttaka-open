"use client"

import { type IconProp } from "@fortawesome/fontawesome-svg-core"
import {
  faBuilding,
  faCalendarDays,
  faHouse,
  faPeopleGroup,
  faTicket,
} from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import Link from "next/link"
import { usePathname } from "next/navigation"
import React from "react"

export const BottomBar = () => {
  const pathname = usePathname()
  const linkClass = (path: string) => {
    if (pathname === path) {
      return "bg-gradient-to-t from-[#FFDD57] to-[#FF51FF] w-[86px] h-[86px] flex justify-center items-center"
    }
    return "w-[86px] h-[86px] flex justify-center items-center"
  }
  //219, 20%, 19.61%
  return (
    <div className="fixed bottom-0 w-full bg-navigation sm:hidden">
      <div className="flex flex-row justify-between text-5xl">
        <Link href="/me/tickets" className={`${linkClass("/me/tickets")}`}>
          <FontAwesomeIcon icon={faTicket as IconProp} />
        </Link>
        <Link href="/activities" className={`${linkClass("/activities")}`}>
          <FontAwesomeIcon icon={faCalendarDays as IconProp} />
        </Link>
        <Link href="/" className={`${linkClass("/")}`}>
          <FontAwesomeIcon icon={faHouse as IconProp} />
        </Link>
        <Link href="/networking" className={`${linkClass("/networking")}`}>
          <FontAwesomeIcon icon={faPeopleGroup as IconProp} />
        </Link>
        <Link href="/companies" className={`${linkClass("/companies")}`}>
          <FontAwesomeIcon icon={faBuilding as IconProp} />
        </Link>
      </div>
    </div>
  )
}
