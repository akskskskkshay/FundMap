"use client";


import { useRouter } from "next/navigation"
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import type { User } from "@supabase/supabase-js";
import { DashboardCard, ExpenseModal, TopExpTable } from "@/components";
import type { Expense, FormData } from "@/types";



const Dashboard = () => {
    const [user, setUser] = useState<User | null>(null);
    const [expenses, setExpenses] = useState<Expense[]>([]);
    const [fetchedData, setFetchedData] = useState(false);
    const [showModal, setShowModal] = useState(false);


    const [formData, setFormData] = useState<FormData>({title: '', amount: '', category: '', date: ''})

    const [totalSpent, setTotalSpent] = useState<number | null>();

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
                setExpenses(data ?? []);
                setFetchedData(true)
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

    
    
    const handleAddExpense = async (e: React.FormEvent) => {
        e.preventDefault()

        const { error } = await supabase.from("expenses").insert([
            {
                title: formData.title,
                amount: parseFloat(String(formData.amount)),
                category: formData.category,
                date: formData.date,
                user_id: user?.id,
            }
        ])

        if(error) {
            console.log("Theres been an error logging your expenses, Try Again!", error)
        }
        else{
            setFormData(
                {
                    title: '', 
                    amount: '', 
                    category: '', 
                    date: ''
                })
            setShowModal(false)
        }


        const { data, error: fetchError } = await supabase
        .from('expenses')
        .select('*')
        .order('date', { ascending: false })

        if (!fetchError) {
        setExpenses(data)
        }
    }


    //compute stats
    useEffect(() => {
        if (expenses && expenses.length > 0) {
            console.log(expenses);

            const amounts = expenses.map(expense => expense.amount);
            const total = amounts.reduce((acc, curr) => acc + curr, 0);
            setTotalSpent(total);
        }
    }, [expenses])
    
    

    if (!user) return (
        <div className="bg-amber-50 h-screen flex justify-center items-center">
            <h1 className="text-4xl font-bold">Loading...</h1>
        </div>
    )
    


    return (
        <main className="bg-amber-50 h-screen p-5">
        <h1 className="text-3xl text-amber-900"><span className="font-black text-amber-900">Dashboard</span>, Welcome {user?.email}</h1>
        
        
        <div className="flex justify-end">
            <button 
            onClick={() => setShowModal(true)}
            className="border border-black p-3 bg-amber-400 rounded-xl font-bold text-amber-900 cursor-pointer hover:bg-amber-300 transition duration-200"> 
                + Add Expense
            </button>
        </div>

        {/* data cards */}
        <section className="mt-5 flex flex-wrap gap-4 justify-center">
            <div className="flex-1 min-w-[220px] max-w-sm">
            <DashboardCard title="Total Spent" value={totalSpent ?? 0}/>
            </div>
            <div className="flex-1 min-w-[220px] max-w-sm">
            <DashboardCard title="Increased By" value={"5.3%"}/>
            </div>
            <div className="flex-1 min-w-[220px] max-w-sm">
            <DashboardCard title="Total Investments" value={0}/>
            </div>
            <div className="flex-1 min-w-[220px] max-w-sm">
            <DashboardCard title="Balance" value={0}/>
            </div>
        </section>
        {/* data cards */}

        {showModal && 
        <ExpenseModal isOpen={showModal} onClose={() => {setShowModal(false); setFormData({title: '', amount: '', category: '', date: ''})}}>
                <h1 className="text-xl text-amber-800 font-bold">Add Expense</h1>
                <form onSubmit={handleAddExpense} className="flex flex-wrap gap-3 mt-5">
                    <input 
                    type="text" 
                    required
                    placeholder="Title" 
                    value={formData.title}
                    onChange={(e) => {
                        const value = e.currentTarget.value;
                        setFormData(prev => ({...prev, title: value}))}
                    }
                    className="border-1 border-black p-3 flex-1 rounded-xl focus:outline-amber-400"></input>

                    <input 
                    type="number" 
                    required
                    placeholder="Amount" 
                    value={formData.amount}
                    onChange={(e) => {
                        const value = e.currentTarget.value;
                        setFormData(prev =>  ({...prev, amount: value}))}
                    }
                    className="border-1 border-black p-3 flex-1 rounded-xl focus:outline-amber-400"></input>

                    <input 
                    type="text" 
                    required
                    placeholder="Category" 
                    value={formData.category}
                    onChange={(e) => {
                        const value = e.currentTarget.value;
                        setFormData(prev => ({...prev, category: value}) )} 
                    }
                    className="border-1 border-black p-3 flex-1 rounded-xl focus:outline-amber-400"></input>

                    <input 
                    type="date" 
                    required
                    placeholder="Date" 
                    value={formData.date}
                    onChange={(e) => {
                        const value = e.currentTarget.value;
                        setFormData(prev => ({...prev, date: value}))}
                    }
                    className="border-1 border-black p-3 flex-1 rounded-xl focus:outline-amber-400"></input>

                    <button 
                    className="mt-3 border-1 p-2 w-full rounded-xl bg-amber-400 hover:bg-amber-300 cursor-pointer hover:text-black transition duration-200 text-lg border-black ">
                        Add Now
                    </button>
                </form>
            </ExpenseModal>}

            <div>
               {!fetchedData ? <h1 className="mt-4">Fetching your Data...</h1> : (expenses?.length === 0 ? <h1 className="mt-4">No Transactions Yet! Add your first transaction now!</h1> : <TopExpTable expense={expenses}/>)} 
                
            </div>

        </main>
    )
}

export default Dashboard
