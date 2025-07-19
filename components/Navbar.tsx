"use client"

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
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        const {data} = supabase.auth.onAuthStateChange((event, _session) => {
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

            if (data.session) {
              setIsLogged(true);
            } else {
              setIsLogged(false);
            }
        }
    
        getSession()


        return() => {
            data.subscription.unsubscribe()
        }
}, [])

     const handleSignout = async () => {
        setLoading(true)
        const error = await supabase.auth.signOut();
        localStorage.clear();
        sessionStorage.clear();
        router.push("/login")
        setIsLogged(false)
        setLoading(false)
        console.log(error)
    }



  return (
    <header className="w-full bg-gradient-to-r from-gray-900/90 via-purple-900/90 to-gray-900/90 backdrop-blur border-b border-white/10 text-white flex items-center justify-between px-8 min-h-16 relative">
    {/* <Link href={"/"}>
        <Image
        src="/fundmap_logo.png" 
        alt="FundMap Logo"
        width={70}
        height={50}></Image>
    </Link> */}

      <Link href={"/"}> <h1 className="text-3xl font-semibold text-purple-300 drop-shadow-[0_0_10px_#A855F7]">[FM]</h1></Link>
      
      {/* Centered Dashboard Link */}
      {isLogged && (
        <div className="absolute left-1/2 transform -translate-x-1/2">
          <Link href={"/dashboard"} className={clsx("text-md hover:text-white text-purple-300 transition duration-300", inter.className)}>Dashboard</Link>
        </div>
      )}
      
      <nav className="flex gap-6 items-center">
        {isLogged ? <button onClick={handleSignout} className={clsx("bg-[#A855F7]/30 text-purple-300 backdrop-blur-md border border-purple-400/40 shadow-[0_0_10px_#A855F7] hover:shadow-[0_0_20px_#A855F7] transition-all p-2 font-bold cursor-pointer duration-200 rounded-full w-30 flex items-center justify-center gap-1", inter.className)}>Sign Out {loading && <div className='loader_btn'></div>}</button> :
        <button onClick={()=> {router.push("/login")}} className={clsx("bg-[#A855F7]/30 text-purple-300 backdrop-blur-md border border-purple-400/40 shadow-[0_0_10px_#A855F7] hover:shadow-[0_0_20px_#A855F7] transition-all p-2 font-bold cursor-pointer duration-200 rounded-full w-30", inter.className)}>Sign In {loading && <div className='loader_btn'></div>}</button>}
        
      </nav>
    </header>
  )
}

export default Navbar
