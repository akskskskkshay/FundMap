"use client"

import Image from "next/image"
import Link from "next/link"
import { clsx } from "clsx"
import { Inter } from "next/font/google"
import { useEffect, useState } from "react"
import {supabase} from "@/lib/supabaseClient"
import { useRouter } from "next/navigation" 

const inter = Inter({
  subsets: ['latin'],
  weight: '400',
})



const Navbar = () => {
    const router = useRouter()

    const [isLogged, setIsLogged] = useState(false)

    useEffect(() => {
        const {data} = supabase.auth.onAuthStateChange((event, session) => {
            console.log(event)
            
            if(event === "SIGNED_OUT"){
                setIsLogged(false)
            }
            else if(event === "SIGNED_IN"){
                setIsLogged(true)
            }
        })


        const getSession = async () => {
            const { data } = await supabase.auth.getSession()
            {data.session ? setIsLogged(true) : setIsLogged(false)}
        }
    
        getSession()


        return() => {
            data.subscription.unsubscribe()
        }
}, [])

     const handleSignout = async () => {
        const error = await supabase.auth.signOut();
        setIsLogged(false)
        console.log(error)
    }



  return (
    <header className="w-full bg-white/5 backdrop-blur border-b border-white/10 border-r text-white flex items-center justify-between px-8 min-h-16">
    {/* <Link href={"/"}>
        <Image
        src="/fundmap_logo.png" 
        alt="FundMap Logo"
        width={70}
        height={50}></Image>
    </Link> */}

      <Link href={"/"}> <h1 className="text-3xl font-semibold text-purple-300 drop-shadow-[0_0_10px_#A855F7]">[FM]</h1></Link>
      
      <nav className="flex gap-6 items-center">
        <Link href={"/dashboard"} className={clsx("text-md", inter.className)}>Dashboard</Link>
        {isLogged ? <button onClick={handleSignout} className={clsx("bg-[#A855F7]/30 text-white backdrop-blur-md border border-purple-400/40 shadow-[0_0_10px_#A855F7] hover:shadow-[0_0_20px_#A855F7] transition-all p-2 font-bold cursor-pointer duration-200 rounded-full w-30", inter.className)}>Sign Out</button> :
        <button onClick={()=> {router.push("/login")}} className={clsx("bg-[#A855F7]/30 text-white backdrop-blur-md border border-purple-400/40 shadow-[0_0_10px_#A855F7] hover:shadow-[0_0_20px_#A855F7] transition-all p-2 font-bold cursor-pointer duration-200 rounded-full w-30", inter.className)}>Sign In</button>}
        
      </nav>
    </header>
  )
}

export default Navbar
