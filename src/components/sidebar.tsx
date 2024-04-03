import {
  BookmarkCheck,
  BookOpen,
  CalendarIcon,
  Home,
  SearchIcon,
  Ticket,
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
            href: "/networking",
            title: "Networking",
            label: "",
            superuserRequired: false,
            icon: Users,
          },
          {
            href: "/programme",
            title: "Programme",
            label: "",
            superuserRequired: false,
            icon: CalendarIcon,
          },
          {
            href: "/search",
            title: "Search",
            label: "",
            superuserRequired: false,
            icon: SearchIcon,
          },
          {
            href: "/admin/check-in",
            title: "Check-In",
            label: "",
            superuserRequired: true,
            icon: BookmarkCheck,
          },
          {
            href: "/admin/events",
            title: "Manage Events",
            label: "",
            superuserRequired: true,
            icon: BookOpen,
          },
        ]}
      />
    </aside>
  )
}

export default Sidebar
