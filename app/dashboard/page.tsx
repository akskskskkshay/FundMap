"use client";


import { useRouter } from "next/navigation"
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import type { User } from "@supabase/supabase-js";
import { DashboardCard, ExpenseModal } from "@/components";



const Dashboard = () => {
    const [user, setUser] = useState<User | null>(null);
    const [expenses, setExpenses] = useState<Array<any> | null>([]);
    const [fetchedData, setFetchedData] = useState(false);
    const [showModal, setShowModal] = useState(false);

    const [expenseTitle, setExpenseTitle] = useState("");
    const [expenseAmount, setExpenseAmount] = useState<number | string>();
    const [expenseCategory, setExpenseCategory] = useState("");
    const [expenseDate, setExpenseDate] = useState<any>();

    const [totalSpent, setTotalSpent] = useState(0);

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

    
    
    const handleAddExpense = async (e: React.FormEvent) => {
        e.preventDefault()


        const { error } = await supabase.from("expenses").insert([
            {
                title: expenseTitle,
                amount: parseFloat(String(expenseAmount)),
                category: expenseCategory,
                date: expenseDate,
                user_id: user?.id,
            }
        ])

        if(error) {
            console.log("Theres been an error logging your expenses, Try Again!", error)
        }
        else{
            setExpenseAmount('')
            setExpenseTitle('')
            setExpenseCategory('')
            setExpenseDate('')

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
    

    if (!user) return (
        <div className="bg-amber-50 h-screen flex justify-center items-center">
            <h1 className="text-4xl font-bold">Loading...</h1>
        </div>
    )
    


    return (
        <main className="bg-amber-50 h-screen p-5">
        <h1 className="text-3xl text-amber-900"><span className="font-black text-amber-900">Dashboard</span>, Welcome {user?.email}</h1>
        {!fetchedData ? <h1 className="mt-4">Fetching your Data...</h1> : (expenses?.length === 0 && <h1 className="mt-4">No Records Found Yet!</h1>)}
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
            <DashboardCard title="Total Spent" value={0}/>
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
        <ExpenseModal isOpen={showModal} onClose={() => setShowModal(false)}>
                <h1 className="text-xl text-amber-800 font-bold">Add Expense</h1>
                <form onSubmit={handleAddExpense} className="flex flex-wrap gap-3 mt-5">
                    <input 
                    type="text" 
                    required
                    placeholder="Title" 
                    value={expenseTitle}
                    onChange={(e) => setExpenseTitle(e.currentTarget.value)}
                    className="border-2 border-black p-3 flex-1 rounded-xl focus:outline-amber-400"></input>

                    <input 
                    type="number" 
                    required
                    placeholder="Amount" 
                    value={expenseAmount}
                    onChange={(e) => setExpenseAmount(Number(e.currentTarget.value))}
                    className="border-2 border-black p-3 flex-1 rounded-xl focus:outline-amber-400"></input>

                    <input 
                    type="text" 
                    required
                    placeholder="Category" 
                    value={expenseCategory}
                    onChange={(e) => setExpenseCategory(e.currentTarget.value)}
                    className="border-2 border-black p-3 flex-1 rounded-xl focus:outline-amber-400"></input>

                    <input 
                    type="date" 
                    required
                    placeholder="Date" 
                    value={expenseDate}
                    onChange={(e) => setExpenseDate(e.currentTarget.value)}
                    className="border-2 border-black p-3 flex-1 rounded-xl focus:outline-amber-400"></input>

                    <button 
                    className="mt-3 border-2 p-2 rounded-br-2xl rounded-tl-2xl bg-amber-400 hover:bg-amber-300 cursor-pointer hover:text-black transition duration-200 text-lg border-black ">
                        Add Now
                    </button>
                </form>
            </ExpenseModal>}

        </main>
    )
}

export default Dashboard
