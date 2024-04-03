"use client"

import Image from "next/image"
import Link from "next/link"
import { useContext } from "react"

import { EventContext } from "@/context/event-context"

import LuttakaLogo from "../../public/images/luttaka_logo.png"

export const LuttakaLogoAndTitle = () => {
  const { eventName } = useContext(EventContext)
  const showEventName = eventName
    ? eventName.substring(0, 13).toUpperCase()
    : "LUTTAKA"
  return (
    <Link href="/" className="flex cursor-pointer flex-row items-center gap-2">
      <Image
        src={LuttakaLogo}
        alt="Luttaka Logo"
        height={50}
        width={50}
        priority
      />
      <div className="pt-2 font-dongle text-5xl text-[#48556E]">
        {showEventName}
      </div>
    </Link>
  )
}
