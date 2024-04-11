import Image from "next/image"
import Link from "next/link"
const PublicHeader = () => {
  return (
    <header className="mt-12 flex min-h-12 items-center justify-center">
      <Link href="/">
        <Image
          src="/images/luttaka_logo.png"
          alt="logo"
          width={150}
          height={150}
        />
      </Link>
    </header>
  )
}

export default PublicHeader
