import { SignInButton } from "@clerk/nextjs"
import Image from "next/image"

import { Button } from "./ui/button"
import Link from "next/link"

const PublicHeader = () => {
  return (
    <header className="flex min-h-12 flex-row items-center justify-between p-6">
      <Link
        href="/"
        className="flex flex-row items-center justify-start gap-2 text-xl">
        <Image
          src="/images/luttaka_logo.png"
          width={40}
          height={40}
          alt="Luttaka Logo"
          className="m-auto"
        />
        <div>LUTTAKA</div>
      </Link>
      <div className="text-center">
        <SignInButton redirectUrl={`/`} mode="modal">
          <Button>Sign In</Button>
        </SignInButton>
      </div>
    </header>
  )
}

export default PublicHeader
