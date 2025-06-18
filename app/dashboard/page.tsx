"use client";


import { useRouter } from "next/navigation"
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import type { User } from "@supabase/supabase-js"


const Dashboard = () => {
    const [user, setUser] = useState<User | null>(null);

    const router = useRouter();


    useEffect(() => {
        const getSession = async () => {
            const {
                data: {session}
            } = await supabase.auth.getSession();
            console.log("Session Data:", session);
            if (!session){
                router.replace("/login")
            }
            else{
                setUser(session.user)
            }

        }
        
        getSession();

    }, [router]);



  return (
    <main className="bg-amber-50 h-screen">
      <h1>Dashboard</h1>
    </main>
  )
}

export default Dashboard
