import Link from "next/link";
import Image from "next/image";
import flowcoreLogo from "@/images/flowcore-logo.svg";
import {Nav} from "./nav";
import {Home, User, Users} from "lucide-react";

interface SidebarProps {
  isSidebarOpen?: boolean;
  setIsSidebarOpen?: (isOpen: boolean) => void;
}

const Sidebar = ({isSidebarOpen, setIsSidebarOpen}: SidebarProps) => {
  return (
    <aside className="w-42 flex h-screen flex-col bg-slate-700 p-4 text-white ">
      <div className="mb-8 flex flex-col items-start">
        <Link
          href="/"
          onClick={() => {
            if (isSidebarOpen && setIsSidebarOpen) {
              setIsSidebarOpen(false);
            }
          }}
        >
          <Image src={flowcoreLogo as string} alt="Flowcore" priority/>
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
            href: "/contacts",
            title: "Contacts",
            label: "",
            superuserRequired: true,
            icon: Users,
          },
          {
            href: "/me",
            title: "Profile",
            label: "",
            superuserRequired: false,
            icon: User,
          }
        ]}
        isSidebarOpen={isSidebarOpen}
        setIsSidebarOpen={setIsSidebarOpen}
      />
    </aside>
  );
};

export default Sidebar;
