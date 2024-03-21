import {
  BookmarkCheck,
  BookOpen,
  Home,
  Ticket,
  User,
  Users,
} from "lucide-react"
import Image from "next/image"
import Link from "next/link"

import LuttakaLogo from "../../public/images/luttaka_logo.png"
import { Nav } from "./nav"

interface SidebarProps {
  isSidebarOpen?: boolean
  setIsSidebarOpen?: (isOpen: boolean) => void
}

const Sidebar = ({ isSidebarOpen, setIsSidebarOpen }: SidebarProps) => {
  return (
    <aside className="w-42 flex h-screen flex-col bg-card p-4">
      <div className="mb-8 flex flex-col items-start">
        <Link
          href="/"
          className="flex flex-row"
          onClick={() => {
            if (isSidebarOpen && setIsSidebarOpen) {
              setIsSidebarOpen(false)
            }
          }}>
          <Image
            src={LuttakaLogo}
            alt="Luttaka Logo"
            height={50}
            width={50}
            priority
          />
          <div className="flex h-full flex-col justify-center text-lg">
            Luttaka
          </div>
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
            href: "/me/tickets",
            title: "Tickets",
            label: "",
            superuserRequired: false,
            icon: Ticket,
          },
          {
            href: "/attendees",
            title: "Attendees",
            label: "",
            superuserRequired: false,
            icon: Users,
          },
          {
            href: "/conferences",
            title: "Conferences",
            label: "",
            superuserRequired: false,
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
            href: "/admin/check-in",
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
