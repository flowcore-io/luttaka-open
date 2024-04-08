import {
  BookmarkCheck,
  BookOpen,
  BuildingIcon,
  CalendarIcon,
  Home,
  Newspaper,
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
            href: "/programme",
            title: "Programme",
            label: "",
            superuserRequired: false,
            icon: CalendarIcon,
          },
          {
            href: "/networking",
            title: "Networking",
            label: "",
            superuserRequired: false,
            icon: Users,
          },
          {
            href: "/companies",
            title: "Companies",
            label: "",
            superuserRequired: false,
            icon: BuildingIcon,
          },
          {
            href: "",
            title: "",
            label: "",
            superuserRequired: true,
            icon: null,
          },
          {
            href: "",
            title: "Admin",
            label: "",
            superuserRequired: true,
            icon: null,
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
          {
            href: "/admin/newsitems",
            title: "Manage News Items",
            label: "",
            superuserRequired: true,
            icon: Newspaper,
          },
          {
            href: "/admin/companies",
            title: "Manage Companies",
            label: "",
            superuserRequired: true,
            icon: BuildingIcon,
          },
        ]}
      />
    </aside>
  )
}

export default Sidebar
