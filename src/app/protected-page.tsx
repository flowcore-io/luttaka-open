"use client"

import Header from "@/components/header"
import Sidebar from "@/components/sidebar"
import { EventProvider } from "@/context/event-context"

import { BottomBar } from "../components/bottom-bar"

const ProtectedPage = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="">
      <EventProvider>
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
      </EventProvider>
    </div>
  )
}

export default ProtectedPage
