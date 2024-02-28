import "@/styles/globals.css"

import { ClerkProvider, SignedIn, SignedOut } from "@clerk/nextjs"
import { type Viewport } from "next"
import { Inter } from "next/font/google"
import { cookies } from "next/headers"

import { Toaster } from "@/components/ui/sonner"
import { TRPCReactProvider } from "@/trpc/react"

import ProtectedPage from "./protected-page"
import PublicPage from "./public-page"

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
})

export const metadata = {
  manifest: "/manifest.json",
  title: "Flowcore Open Source Conference App",
  description: "The open source Conference App from Flowcore",
  icons: [{ rel: "icon", url: "/favicon.ico" }],
}

export const viewport: Viewport = {
  themeColor: "#FFFFFF",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={`min-h-screen font-sans ${inter.variable}`}>
        <ClerkProvider>
          <SignedOut>
            <PublicPage children={children} />
          </SignedOut>
          <SignedIn>
            <TRPCReactProvider cookies={cookies().toString()}>
              <ProtectedPage children={children} />
              <Toaster richColors />
            </TRPCReactProvider>
          </SignedIn>
        </ClerkProvider>
      </body>
    </html>
  )
}
