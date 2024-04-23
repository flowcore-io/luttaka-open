import { LuttakaLogoAndTitle } from "./luttaka-logo-and-title"
import { LuttakaUserButton } from "./luttaka-user-button"

const Header = () => {
  return (
    <header className="relative flex min-h-[78px] items-center justify-between bg-navigation">
      <div className="absolute right-0 left-0 bottom-0 top-[99%] shadow-sm" />
      <div className="ml-4">
        <LuttakaLogoAndTitle />
      </div>
      <div className="m-2 mr-6 dark:[&_*]:text-white">
        <LuttakaUserButton />
      </div>
    </header>
  )
}

export default Header
