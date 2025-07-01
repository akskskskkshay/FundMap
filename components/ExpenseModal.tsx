"use client"

import type { ExpModal } from "@/types/index"


const ExpenseModal = ({isOpen, onClose, children}: ExpModal) => {
    
    if (!isOpen) return null;


    return (
        <div className="fixed inset-0 z-50 flex justify-center items-center bg-black/30">
            <div className="p-6 rounded-lg shadow-3xl w-full max-w-md relative shadow-2xl bg-white/10 backdrop-blur-lg border border-white/10">
                <button 
                    onClick={onClose}
                    className="absolute top-2 right-3 text-gray-400 hover:text-purple-300 text-xl bg-white/10 border rounded-full w-10 h-10 flex items-center justify-center p-0 cursor-pointer transition duration-200">
                    &times;
                </button>
                {children}
            </div>
        </div>
    )
}

export default ExpenseModal
