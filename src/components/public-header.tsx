import { SignInButton } from "@clerk/nextjs"
import Image from "next/image"

import flowcoreLogo from "../../public/images/flowcore-logo.svg"

const PublicHeader = () => {
  return (
    <header className="flex min-h-12 items-center justify-between">
      <Image
        src={flowcoreLogo as string}
        alt="Flowcore"
        priority
        className="m-8"
      />
      <div className="hidden md:block">
        <SignInButton redirectUrl="/" mode="modal">
          <button className="dark:hover:bg-blud-700 mx-10 mb-4 h-12 rounded-lg bg-blue-700 px-5 py-2.5 text-sm font-medium text-white hover:bg-blue-800 focus:outline-none focus:ring-4 focus:ring-blue-300 dark:bg-blue-600 dark:focus:ring-blue-800 md:mb-0">
            Login
          </button>
        </SignInButton>
      </div>
    </header>
  )
}

export default PublicHeader
