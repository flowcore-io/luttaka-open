"use client"

import { useAuth } from "@clerk/nextjs"
import Image from "next/image"
import Link from "next/link"

import HomeProtectedPage from "../home-protected-page"

export default function Home() {
  const { isLoaded, userId } = useAuth()
  if (!isLoaded || !userId) {
    return (
      <div>
        <div className="absolute -z-10 w-full">
          <div className="fixed top-0 h-screen w-full">
            <video
              autoPlay
              loop
              muted
              playsInline
              className="h-full w-full object-cover object-[50%_35%]">
              <source src="/vdbg.mp4" type="video/mp4" />
              Your browser does not support the video tag.
            </video>
            <div className="absolute inset-0 bg-blue-300 opacity-80"></div>
          </div>
        </div>
        <div className="mt-16 flex flex-col items-center justify-center gap-8">
          <Image
            src="/images/tonik-logo.svg"
            width={360}
            height={360}
            alt="Tonik logo"
          />
          <div className="Roboto text-3xl font-bold text-white sm:text-6xl">
            Mixtech, Industry & Art
          </div>
          <div className="Roboto text-xl font-bold text-white sm:text-6xl">
            Silo. Tórshavn. 3 May 2024
          </div>
          <div className="mt-16 rounded-lg bg-[#FF00FF] p-8 text-4xl text-white">
            <Link href="/event/tonik-2024">Buy Ticket</Link>
          </div>
        </div>
      </div>
    )
  }
  return <HomeProtectedPage />
}
