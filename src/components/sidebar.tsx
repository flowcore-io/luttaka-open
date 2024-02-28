import flowcoreLogo from "@/images/flowcore-logo.svg"
import { BookmarkCheck, BookOpen, Home, Ticket, User } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { Nav } from "./nav"

interface SidebarProps {
  isSidebarOpen?: boolean
  setIsSidebarOpen?: (isOpen: boolean) => void
}

const Sidebar = ({ isSidebarOpen, setIsSidebarOpen }: SidebarProps) => {
  return (
    <aside className="w-42 flex h-screen flex-col bg-slate-700 p-4 text-white ">
      <div className="mb-8 flex flex-col items-start">
        <Link
          href="/"
          onClick={() => {
            if (isSidebarOpen && setIsSidebarOpen) {
              setIsSidebarOpen(false)
            }
          }}>
          <Image src={flowcoreLogo as string} alt="Flowcore" priority />
        </Link>
      </div>
      <Nav
        links={[
          {
            href: "/",
            title: "Overview",
            label: "",
            superuserRequired: false,
            icon: Home,
          },
          {
            href: "/tickets",
            title: "Tickets",
            label: "",
            superuserRequired: false,
            icon: Ticket,
          },
          {
            href: "/conferences",
            title: "Conferences",
            label: "",
            superuserRequired: true,
            icon: BookOpen,
          },
          {
            href: "/me",
            title: "Profile",
            label: "",
            superuserRequired: false,
            icon: User,
          },
          {
            href: "/check-in",
            title: "Check In",
            label: "",
            superuserRequired: true,
            icon: BookmarkCheck,
          },
        ]}
        isSidebarOpen={isSidebarOpen}
        setIsSidebarOpen={setIsSidebarOpen}
      />
    </aside>
  )
}

export default Sidebar
