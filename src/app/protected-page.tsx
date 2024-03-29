"use client"

import Header from "@/components/header"
import Sidebar from "@/components/sidebar"
import { BottomBar } from "../components/bottom-bar"
import { ConferenceProvider } from "@/context/conference-context"

const ProtectedPage = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="">
      <ConferenceProvider>
        <div className="flex flex-row">
          <div className="hidden sm:block">
            <Sidebar />
          </div>
          <div className="relative flex w-96 flex-1 flex-col">
            <Header />
            <main>
              <div className="mx-auto mb-24 max-w-screen-2xl 2xl:p-10">
                {children}
              </div>
            </main>
            <BottomBar />
          </div>
        </div>
      </ConferenceProvider>
    </div>
  )
}

export default ProtectedPage
