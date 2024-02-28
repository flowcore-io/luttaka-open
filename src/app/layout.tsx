import "@/styles/globals.css";

import {Inter} from "next/font/google";
import {cookies} from "next/headers";

import {TRPCReactProvider} from "@/trpc/react";
import {ClerkProvider, SignedIn, SignedOut} from "@clerk/nextjs";
import PublicPage from "./public-page";
import ProtectedPage from "./protected-page";
import {type Viewport} from "next";
import {Toaster} from "@/components/ui/sonner";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata = {
  manifest: "/manifest.json",
  title: "Flowcore Open Source Conference App",
  description: "The open source Conference App from Flowcore",
  icons: [{ rel: "icon", url: "/favicon.ico" }],
};

export const viewport: Viewport = {
  themeColor: "#FFFFFF"
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`min-h-screen ${inter.variable} font-inter`}>
        <ClerkProvider>
          <SignedOut>
            <PublicPage children={children} />
          </SignedOut>
          <SignedIn>
            <TRPCReactProvider cookies={cookies().toString()}>
              <ProtectedPage children={children} />
              <Toaster />
            </TRPCReactProvider>
          </SignedIn>
        </ClerkProvider>
      </body>
    </html>
  );
}
