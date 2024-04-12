import { SignInButton } from "@clerk/nextjs"
import Image from "next/image"

import tonikLogo from "../../public/images/tonik-logo.jpg"

const PublicHeader = () => {
  return (
    <header className="flex min-h-12 items-center justify-between">
      <Image
        src={tonikLogo as unknown as string}
        alt="Tonik"
        priority
        className="m-auto"
      />
    </header>
  )
}

export default PublicHeader
