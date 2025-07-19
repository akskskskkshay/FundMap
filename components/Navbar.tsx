"use client"

import Link from "next/link"
import { clsx } from "clsx"
import { Inter } from "next/font/google"
import { useEffect, useState } from "react"
import {supabase} from "@/lib/supabaseClient"
import { useRouter } from "next/navigation" 
import { Menu, X } from "lucide-react"
import { createPortal } from "react-dom";

const inter = Inter({
  subsets: ['latin'],
  weight: '400',
})



const Navbar = () => {
    const router = useRouter()

    const [isLogged, setIsLogged] = useState(false)
    const [loading, setLoading] = useState(false)
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

    useEffect(() => {
        const getSession = async () => {
            const { data } = await supabase.auth.getSession()
            if (data.session) {
              setIsLogged(true);
            } else {
              setIsLogged(false);
            }
        }
        getSession()

        // Listen for auth changes to update UI state only
        const { data: authListener } = supabase.auth.onAuthStateChange((_event, session) => {
            setIsLogged(!!session);
        });

        return () => {
            authListener.subscription.unsubscribe();
        };
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

    // Close mobile menu on route/page change
    useEffect(() => {
        setIsMobileMenuOpen(false);
    }, [router]);

    const toggleMobileMenu = () => {
        setIsMobileMenuOpen((prev) => !prev);
    };



  return (
    <header className="z-50 w-full bg-gradient-to-r from-gray-900/90 via-purple-900/90 to-gray-900/90 backdrop-blur border-b border-white/10 text-white relative">
      {/* Main navbar row */}
      <div className="flex items-center justify-between px-4 md:px-8 min-h-16 relative z-20">
        <Link href={"/"}> 
          <h1 className="text-3xl font-semibold text-purple-300 drop-shadow-[0_0_10px_#A855F7]">[FM]</h1>
        </Link>
        {/* Centered Dashboard Link - Desktop Only */}
        {isLogged && (
          <div className="hidden md:block absolute left-1/2 transform -translate-x-1/2">
            <Link href={"/dashboard"} className={clsx("text-md hover:text-white text-purple-300 transition duration-300", inter.className)}>
              Dashboard
            </Link>
          </div>
        )}
        {/* Desktop Navigation */}
        <nav className="hidden md:flex gap-6 items-center">
          {isLogged ? (
            <button 
              onClick={handleSignout} 
              className={clsx("bg-[#A855F7]/30 text-purple-300 backdrop-blur-md border border-purple-400/40 shadow-[0_0_10px_#A855F7] hover:shadow-[0_0_20px_#A855F7] transition-all p-2 font-bold cursor-pointer duration-200 rounded-full w-30 flex items-center justify-center gap-1", inter.className)}
            >
              Sign Out {loading && <div className='loader_btn'></div>}
            </button>
          ) : (
            <button 
              onClick={()=> {router.push("/login")}} 
              className={clsx("bg-[#A855F7]/30 text-purple-300 backdrop-blur-md border border-purple-400/40 shadow-[0_0_10px_#A855F7] hover:shadow-[0_0_20px_#A855F7] transition-all p-2 font-bold cursor-pointer duration-200 rounded-full w-30", inter.className)}
            >
              Sign In {loading && <div className='loader_btn'></div>}
            </button>
          )}
        </nav>
        {/* Mobile Menu Button */}
        <button
          onClick={toggleMobileMenu}
          className="md:hidden p-2 text-white hover:text-purple-300 transition-colors duration-200 z-20"
          aria-label={isMobileMenuOpen ? 'Close menu' : 'Open menu'}
        >
          {isMobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
        </button>
      </div>
      {/* Mobile Menu and overlay rendered via portal */}
      {typeof window !== 'undefined' && createPortal(
        <>
          <div
            className={`md:hidden fixed inset-0 z-50 bg-black/30 transition-opacity duration-300 ${isMobileMenuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}
            onClick={() => setIsMobileMenuOpen(false)}
            aria-hidden={!isMobileMenuOpen}
          />
          <nav
            className={`md:hidden fixed top-0 right-0 h-full w-64 bg-gradient-to-b from-gray-900/95 to-purple-900/95 backdrop-blur border-l border-white/10 shadow-2xl z-50 transform transition-transform duration-300 flex flex-col ${isMobileMenuOpen ? 'translate-x-0' : 'translate-x-full'}`}
            aria-label="Mobile menu"
          >
            <div className="flex items-center justify-between px-4 pt-4 pb-2 mb-6">
              <Link href="/" className="text-2xl font-bold text-purple-300" onClick={() => setIsMobileMenuOpen(false)}>[FM]</Link>
              <button
                onClick={() => setIsMobileMenuOpen(false)}
                className="text-white hover:text-purple-300 cursor-pointer transition-colors duration-200 md:hidden"
                aria-label="Close menu"
                type="button"
              >
                <X size={28} />
              </button>
            </div>
            <div className="flex-1 flex flex-col p-6 pt-0 pb-0">
              <div className="space-y-6">
                {isLogged && (
                  <Link 
                    href={"/dashboard"} 
                    className={clsx("block text-lg hover:text-purple-300 text-white transition duration-300 py-2", inter.className)}
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Dashboard
                  </Link>
                )}
              </div>
              <div className="mt-auto pb-6">
                {isLogged ? (
                  <button 
                    onClick={() => {
                      handleSignout();
                      setIsMobileMenuOpen(false);
                    }} 
                    className={clsx("w-full bg-[#A855F7]/30 text-purple-300 backdrop-blur-md border border-purple-400/40 shadow-[0_0_10px_#A855F7] hover:shadow-[0_0_20px_#A855F7] transition-all p-3 font-bold cursor-pointer duration-200 rounded-xl flex items-center justify-center gap-2", inter.className)}
                  >
                    Sign Out {loading && <div className='loader_btn'></div>}
                  </button>
                ) : (
                  <button 
                    onClick={() => {
                      router.push("/login");
                      setIsMobileMenuOpen(false);
                    }} 
                    className={clsx("w-full bg-[#A855F7]/30 text-purple-300 backdrop-blur-md border border-purple-400/40 shadow-[0_0_10px_#A855F7] hover:shadow-[0_0_20px_#A855F7] transition-all p-3 font-bold cursor-pointer duration-200 rounded-xl", inter.className)}
                  >
                    Sign In {loading && <div className='loader_btn'></div>}
                  </button>
                )}
              </div>
            </div>
          </nav>
        </>,
        document.body
      )}
    </header>
  )
}

export default Navbar
