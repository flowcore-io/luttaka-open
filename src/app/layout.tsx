import "@/styles/globals.css"
// The following import prevents a Font Awesome icon server-side rendering bug,
// where the icons flash from a very large icon down to a properly sized one:
import "@fortawesome/fontawesome-svg-core/styles.css"

import { ClerkProvider, SignedIn, SignedOut } from "@clerk/nextjs"
import { config } from "@fortawesome/fontawesome-svg-core"
import { Dongle, Inter, Lato, Roboto } from "next/font/google"
import { cookies } from "next/headers"

import PublicFooter from "@/components/public-footer"
import PublicHeader from "@/components/public-header"
import { ThemeProvider } from "@/components/theme-provider"
import { Toaster } from "@/components/ui/sonner"
import { TRPCReactProvider } from "@/trpc/react"

import ProtectedPage from "./protected-page"

// Prevent fontawesome from adding its CSS since we did it manually above:
config.autoAddCss = false

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
})

const dongle = Dongle({
  subsets: ["latin"],
  variable: "--font-dongle",
  weight: "300",
})

const lato = Lato({
  subsets: ["latin"],
  variable: "--font-lato",
  weight: "400",
})

const roboto = Roboto({
  subsets: ["latin"],
  variable: "--font-roboto",
  weight: "400",
})

export const metadata = {
  manifest: "/manifest.json",
  title: "Luttaka",
  description: "The open source event experience app from Flowcore",
  icons: [{ rel: "icon", url: "/favicon.ico" }],
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning={true}>
      <body
        className={`min-h-screen ${inter.variable} ${dongle.variable} ${lato.variable} ${roboto.variable} font-inter`}>
        <ThemeProvider
          attribute={"class"}
          defaultTheme={"system"}
          disableTransitionOnChange
          enableSystem>
          <ClerkProvider>
            <SignedOut>
              <TRPCReactProvider cookies={cookies().toString()}>
                <div className="flex h-full min-h-screen flex-row">
                  <div className="relative flex flex-1 flex-col">
                    <PublicHeader />
                    <main>
                      <div className="mx-auto">{children}</div>
                    </main>
                    <PublicFooter />
                  </div>
                </div>
              </TRPCReactProvider>
            </SignedOut>
            <SignedIn>
              <TRPCReactProvider cookies={cookies().toString()}>
                <ProtectedPage children={children} />
                <Toaster richColors />
              </TRPCReactProvider>
            </SignedIn>
          </ClerkProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
