"use client"

import Header from "@/components/header"
import { RestrictedToRole } from "@/components/restricted-to-role"
import Sidebar from "@/components/sidebar"
import { UserRole } from "@/contracts/user/user-role"
import { BottomBar } from "../components/bottom-bar"
import { ConferenceProvider } from "@/context/conference-context"

const ProtectedPage = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="h-screen">
      <RestrictedToRole role={UserRole.admin}>
        <div className={"bg-primary text-center"}>
          <p className={"text-[0.85rem] font-thin text-primary-foreground"}>
            you are an <b>admin</b>
          </p>
        </div>
      </RestrictedToRole>
      <ConferenceProvider>
        <div className="flex flex-row">
          <div className="hidden sm:block">
            <Sidebar />
          </div>
          <div className="relative flex w-96 flex-1 flex-col">
            <Header />
            <main>
              <div className="mx-auto mb-24 max-w-screen-2xl p-4 md:p-6 2xl:p-10">
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
