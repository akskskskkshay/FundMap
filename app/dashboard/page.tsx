"use client";


import { useRouter } from "next/navigation"
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import type { User } from "@supabase/supabase-js";
import DashboardCard from "@/components/DashboardCard";



const Dashboard = () => {
    const [user, setUser] = useState<User | null>(null);
    const [expenses, setExpenses] = useState<Array<any> | null>([]);
    const [fetchedData, setFetchedData] = useState(false)
    const [totalSpent, setTotalSpent] = useState(0)

    const router = useRouter();

    //check if user is logged in
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

    //fetch data to expenses state
    useEffect(() => {
        const getData = async () => {
            setFetchedData(false)
            if(user){
                const { data } = await supabase.from("expenses").select("*").order("date", { ascending: false });
                setExpenses(data);
                setFetchedData(true)
                console.log(data);
            } else {
                console.log("No User Logged In!", user);
            }
        }
        

        getData()
    }, [user])


    //send to login if signout
    useEffect(()=>{
            const {data} = supabase.auth.onAuthStateChange((event, session) => {
                if(event === "SIGNED_OUT"){
                    router.replace("/login")
                }
            })

            return() => {data.subscription.unsubscribe()}
        }, [])

    

    if (!user) return (
        <div className="bg-amber-50 h-screen flex justify-center items-center">
            <h1 className="text-4xl font-bold">Loading...</h1>
        </div>
    )
    


    return (
        <main className="bg-amber-50 h-screen p-5">
        <h1 className="text-3xl"><span className="font-black">Dashboard</span>, Welcome {user?.email}</h1>
        {!fetchedData ? <h1 className="mt-4">Fetching your Data</h1> : (expenses?.length === 0 && <h1 className="mt-4">No Records Found Yet!</h1>)}

        {/* data cards */}
        <section className="mt-5 flex flex-wrap gap-4">
            <div className="flex-1 min-w-[220px] max-w-xs">
            <DashboardCard title="Total Spent" value={0}/>
            </div>
            <div className="flex-1 min-w-[220px] max-w-xs">
            <DashboardCard title="Increased By" value={"5.3%"}/>
            </div>
            <div className="flex-1 min-w-[220px] max-w-xs">
            <DashboardCard title="Total Investments" value={0}/>
            </div>
            <div className="flex-1 min-w-[220px] max-w-xs">
            <DashboardCard title="Balance" value={0}/>
            </div>
        </section>
        {/* data cards */}


        
        </main>
    )
}

export default Dashboard
