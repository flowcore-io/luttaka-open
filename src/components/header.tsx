import { UserButton } from "@clerk/nextjs"

import { LuttakaLogoAndTitle } from "./luttaka-logo-and-title"

const Header = () => {
  return (
    <header className="flex min-h-[78px] items-center justify-between shadow-lg sm:shadow-none">
      <div className="ml-4 block sm:ml-0 sm:hidden">
        <LuttakaLogoAndTitle />
      </div>
      <div className="hidden sm:block">&nbsp;</div>
      <div className="m-2 mr-6 dark:[&_*]:text-white">
        <UserButton afterSignOutUrl="/" showName />
      </div>
    </header>
  )
}

export default Header
