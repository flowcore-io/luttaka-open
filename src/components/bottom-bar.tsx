"use client"

import React from "react"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { IconProp } from "@fortawesome/fontawesome-svg-core"
import {
  faTicket,
  faPeopleGroup,
  faHouse,
  faCalendarDays,
  faMagnifyingGlass,
} from "@fortawesome/free-solid-svg-icons"
import Link from "next/link"

export const BottomBar = () => {
  return (
    <div className="fixed bottom-0 min-h-[86px] w-full bg-[#48556E] text-white sm:hidden">
      <div className="flex h-[86px] flex-row justify-between text-5xl">
        <Link href="/me/tickets" className="m-auto">
          <FontAwesomeIcon icon={faTicket as IconProp} />
        </Link>
        <Link href="/attendees" className="m-auto">
          <FontAwesomeIcon icon={faPeopleGroup as IconProp} />
        </Link>
        <Link href="/" className="m-auto">
          <FontAwesomeIcon icon={faHouse as IconProp} />
        </Link>
        <Link href="/conferences" className="m-auto">
          <FontAwesomeIcon icon={faCalendarDays as IconProp} />
        </Link>
        <Link href="/me" className="m-auto">
          <FontAwesomeIcon icon={faMagnifyingGlass as IconProp} />
        </Link>
      </div>
    </div>
  )
}
