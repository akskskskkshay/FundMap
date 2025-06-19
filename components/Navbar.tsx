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
    <header className="w-full bg-amber-100 flex items-center justify-around ">
    <Link href={"/"}>
        <Image
        src="/fundmap_logo.png" 
        alt="FundMap Logo"
        width={70}
        height={50}></Image>
    </Link>
      
      <nav className="flex gap-6 items-center">
        <Link href={"/dashboard"} className={clsx("text-md text-gray-800", inter.className)}>Dashboard</Link>
        {isLogged ? <button onClick={handleSignout} className={clsx("text-md text-black bg-amber-400 hover:bg-amber-300 transition duration-200 p-2 rounded-full border cursor-pointer w-30", inter.className)}>Sign Out</button> :
        <button onClick={()=> {router.push("/login")}} className={clsx("text-md text-black bg-amber-400 hover:bg-amber-300 transition duration-200 p-2 rounded-full border cursor-pointer", inter.className)}>Sign In</button>}
        
      </nav>
    </header>
  )
}

export default Navbar
