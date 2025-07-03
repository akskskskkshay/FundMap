"use client";


import { useRouter } from "next/navigation"
import { use, useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import type { User } from "@supabase/supabase-js";
import { DashboardCard, ExpenseModal, TopExpTable } from "@/components";
import type { Expense, FormData } from "@/types";
import CategPie from "@/components/CategPie";
import { categorizeFromClient } from "@/actions/categorizeExpenseAction";



const Dashboard = () => {
    const [user, setUser] = useState<User | null>(null);
    const [expenses, setExpenses] = useState<Expense[]>([]);
    const [fetchedData, setFetchedData] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [isLoading, setIsLoading] = useState(false)

    const [formData, setFormData] = useState<FormData>({title: '', amount: '', date: ''})

    const [totalSpent, setTotalSpent] = useState<number | null>();
    const [totalInvestment, setTotalInvestment] = useState<number | null>()

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

        setIsLoading(true)

        const result = await categorizeFromClient(formData.title)
        console.log(result)

        const { error } = await supabase.from("expenses").insert([
            {
                title: formData.title,
                amount: parseFloat(String(formData.amount)),
                category: result,
                date: formData.date,
                user_id: user?.id,
            }
        ])
        setIsLoading(false)
        if(error) {
            console.log("Theres been an error logging your expenses, Try Again!", error)
        }
        else{
            setFormData(
                {
                    title: '', 
                    amount: '', 
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

            const amounts = expenses.map(expense => expense.amount);
            const total = amounts.reduce((acc, curr) => acc + curr, 0);
            setTotalSpent(total);

            const investmentTotal = expenses
            .filter(exp => exp.category.toUpperCase() === "INVESTMENT")
            .reduce((acc, exp) => acc + exp.amount, 0);
            setTotalInvestment(investmentTotal);

        }
    }, [expenses])
    
    

    if (!user) return (
        <div className="h-screen flex justify-center items-center z-20">
            <div className="loader"></div>
        </div>
    )
    


    return (
        <main className="text-white min-h-screen p-5">


        <h1 className="text-3xl text-white font-black">Dashboard</h1>
        <div className="flex  justify-between items-center">
            <p className="text-white">Welcome Back, {user?.email}</p>
            <button 
            onClick={() => setShowModal(true)}
            className="rounded-xl bg-[#A855F7]/30 text-white backdrop-blur-md border border-purple-400/40 shadow-[0_0_10px_#A855F7] hover:shadow-[0_0_20px_#A855F7] transition-all  p-3 font-bold cursor-pointer duration-200"> 
                + Add Expense
            </button>    
        </div>

        {/* data cards */}
        <section className="mt-5 flex flex-wrap gap-4 justify-center">
            <div className="flex-1 min-w-[220px] max-w-sm">
            <DashboardCard title="Total Spent (this month)" value={totalSpent ?? 0}/>
            </div>
            <div className="flex-1 min-w-[220px] max-w-sm">
            <DashboardCard title="Increased By (last month)" value={"5.3%"}/>
            </div>
            <div className="flex-1 min-w-[220px] max-w-sm">
            <DashboardCard title="Total Investments" value={totalInvestment ?? 0}/>
            </div>
            <div className="flex-1 min-w-[220px] max-w-sm">
            <DashboardCard title="Balance" value={0}/>
            </div>
        </section>
        {/* data cards */}

        {showModal && 
        <ExpenseModal isOpen={showModal} onClose={() => {setShowModal(false); setFormData({title: '', amount: '', date: ''})}}>
                <h1 className="text-xl text-purple-300 font-bold">Add Expense</h1>
                <form onSubmit={handleAddExpense} className="flex flex-col flex-wrap gap-3 mt-5">
                    <input 
                    type="text" 
                    required
                    placeholder="What did you spent money of this time?" 
                    value={formData.title}
                    onChange={(e) => {
                        const value = e.currentTarget.value;
                        setFormData(prev => ({...prev, title: value}))}
                    }
                    className="border-1 border-grey-300 p-3 flex-1 rounded-xl focus:outline-purple-300"></input>
                    <div className="flex gap-3">
                        <input 
                        type="number" 
                        required
                        placeholder="Amount" 
                        value={formData.amount}
                        onChange={(e) => {
                            const value = e.currentTarget.value;
                            setFormData(prev =>  ({...prev, amount: value}))}
                        }
                        className="border-1 border-grey-300 p-3 flex-1 rounded-xl focus:outline-purple-300"></input>

                        <input 
                        type="date" 
                        required
                        placeholder="Date" 
                        value={formData.date}
                        onChange={(e) => {
                            const value = e.currentTarget.value;
                            setFormData(prev => ({...prev, date: value}))}
                        }
                        className="border-1 border-grey-300 p-3 flex-1 rounded-xl focus:outline-purple-300"></input>
                    </div>
                   

                    {/* <input 
                    type="text" 
                    required
                    placeholder="Category" 
                    value={formData.category}
                    onChange={(e) => {
                        const value = e.currentTarget.value;
                        setFormData(prev => ({...prev, category: value}) )} 
                    }
                    className="border-1 border-grey-300 p-3 flex-1 rounded-xl focus:outline-purple-300"></input> */}

                    

                    <button 
                    className="bg-[#A855F7]/30 text-white backdrop-blur-md border border-purple-400/40 shadow-[0_0_10px_#A855F7] hover:shadow-[0_0_20px_#A855F7] transition-all p-2 font-semibold cursor-pointer duration-200 mt-3 w-full rounded-xl text-lg flex items-center justify-center gap-2">
                        Add Now
                        {isLoading && <div className='loader_btn'></div>}
                    </button>
                </form>
            </ExpenseModal>}

            <div className="flex mt-20 gap-20">
               {!fetchedData ? <h1 className="mt-4">Fetching your Data...</h1> : (expenses?.length === 0 ? <h1 className="mt-4">No Transactions Yet! Add your first transaction now!</h1> : (<>
                    <TopExpTable expense={expenses}/>
                    <CategPie expense={expenses}/> </>))} 
                
            </div>

        </main>
    )
}

export default Dashboard
