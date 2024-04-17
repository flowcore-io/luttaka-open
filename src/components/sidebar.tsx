import {
  BookmarkCheck,
  BookOpen,
  BuildingIcon,
  CalendarCheckIcon,
  CalendarIcon,
  Home,
  KeyRoundIcon,
  Newspaper,
  Ticket,
  TicketIcon,
  Users,
} from "lucide-react"

import { LuttakaLogoAndTitle } from "./luttaka-logo-and-title"
import { Nav } from "./nav"

const Sidebar = () => {
  return (
    <aside className="w-42 flex h-screen flex-col bg-sidebar p-4">
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
            href: "/activities",
            title: "Activities",
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
            href: "/admin/tickets",
            title: "Manage Tickets",
            label: "",
            superuserRequired: true,
            icon: TicketIcon,
          },
          {
            href: "/admin/activities",
            title: "Manage Activities",
            label: "",
            superuserRequired: true,
            icon: CalendarCheckIcon,
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
          {
            href: "/admin/permissions",
            title: "Manage Permissions",
            label: "",
            superuserRequired: true,
            icon: KeyRoundIcon,
          },
        ]}
      />
    </aside>
  )
}

export default Sidebar
