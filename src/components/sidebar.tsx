import {
  BookmarkCheck,
  BookOpen,
  Home,
  Ticket,
  User,
  Users,
} from "lucide-react"

import { LuttakaLogoAndTitle } from "./luttaka-logo-and-title"
import { Nav } from "./nav"

const Sidebar = () => {
  return (
    <aside className="w-42 flex h-screen flex-col bg-card p-4">
      <div className="mb-8 flex flex-col items-start">
        <LuttakaLogoAndTitle />
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
      />
    </aside>
  )
}

export default Sidebar
