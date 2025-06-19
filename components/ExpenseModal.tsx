"use client"

import type { ExpModal } from "@/types/index"


const ExpenseModal = ({isOpen, onClose, children}: ExpModal) => {
    
    if (!isOpen) return null;


    return (
        <div className="bg-black fixed opacity-80 z-50 inset-0 flex justify-center items-center">
            <div className="bg-white p-6 rounded-lg shadow-3xl w-full max-w-md relative">
                <button 
                    onClick={onClose}
                    className="absolute top-2 right-3 text-gray-400 hover:text-black text-xl bg-gray-100 border rounded-full w-10 h-10 flex items-center justify-center p-0 cursor-pointer transition duration-200">
                    &times;
                </button>
                {children}
            </div>
        </div>
    )
}

export default ExpenseModal
