import { UserButton } from "@clerk/nextjs"

const Header = () => {
  return (
    <header className="flex min-h-12 items-center justify-between">
      <div>&nbsp;</div>
      <div className="m-2 mr-6 dark:[&_*]:text-white">
        <UserButton afterSignOutUrl="/" showName />
      </div>
    </header>
  )
}

export default Header
