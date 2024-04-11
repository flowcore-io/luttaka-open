"use client"

import { useAuth } from "@clerk/nextjs"

import HomeProtectedPage from "./home-protected-page"
import HomePublicPage from "./home-public-page"

export default function Home() {
  const { isLoaded, userId } = useAuth()
  if (!isLoaded || !userId) {
    return <HomePublicPage />
  }
  return <HomeProtectedPage />
}
