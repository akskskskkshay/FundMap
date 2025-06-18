"use client";


import { useRouter } from "next/navigation"
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import type { User } from "@supabase/supabase-js";


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

    useEffect(()=>{
            const {data} = supabase.auth.onAuthStateChange((event, session) => {
                console.log(event)
                if(event === "SIGNED_OUT"){
                    router.replace("/login")
                }
            })

            return() => {data.subscription.unsubscribe()}
        }, [])

    


  return (
    <main className="bg-amber-50 h-screen p-5">
      <h1 className="text-3xl"><span className="font-black">Dashboard</span>, Welcome {user?.email}</h1>
    </main>
  )
}

export default Dashboard
