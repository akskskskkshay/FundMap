import Image from "next/image"
import Link from "next/link"
import { clsx } from "clsx"
import { Inter } from "next/font/google"

const inter = Inter({
  subsets: ['latin'],
  weight: '400',
})

const Navbar = () => {
  return (
    <header className="w-full bg-amber-100 flex items-center justify-around ">
    <Link href={"/"}>
        <Image className="ml-4"
        src="/fundmap_logo.png" 
        alt="FundMap Logo"
        width={70}
        height={50}></Image>
    </Link>
      
      <nav className="flex gap-6 items-center">
        <Link href={"/dashboard"} className={clsx("text-lg text-gray-800", inter.className)}>Dashboard</Link>
        <Link href={"/login"} className={clsx("text-lg text-gray-800", inter.className)}>SignUp</Link>
      </nav>
    </header>
  )
}

export default Navbar
