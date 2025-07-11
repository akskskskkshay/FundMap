"use client"

import type { ExpModal } from "@/types/index"
import { useEffect, useRef } from "react";

const ExpenseModal = ({isOpen, onClose, children}: ExpModal) => {
    const modalRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!isOpen) return;
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape') onClose();
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [isOpen, onClose]);

    if (!isOpen) return null;

    return (
        <div
            className="fixed inset-0 z-50 flex justify-center items-center bg-black/30 transition-opacity duration-300 animate-fadein"
            onClick={(e) => {
                if (e.target === e.currentTarget) onClose();
            }}
        >
            <div
                ref={modalRef}
                className="p-6 rounded-2xl shadow-3xl w-full max-w-md relative shadow-2xl bg-white/10 backdrop-blur-lg border border-white/10 transition-transform duration-300 animate-scalein"
                style={{ animation: 'scalein 0.25s cubic-bezier(0.4,0,0.2,1)' }}
                onClick={e => e.stopPropagation()}
            >
                <button 
                    onClick={onClose}
                    aria-label="Close"
                    className="absolute top-2 right-3 text-gray-400 hover:text-purple-300 text-xl bg-white/10 border rounded-full w-10 h-10 flex items-center justify-center p-0 cursor-pointer transition duration-200">
                    &times;
                </button>
                {children}
            </div>
            <style jsx global>{`
                @keyframes fadein {
                    from { opacity: 0; }
                    to { opacity: 1; }
                }
                .animate-fadein {
                    animation: fadein 0.25s cubic-bezier(0.4,0,0.2,1);
                }
                @keyframes scalein {
                    from { opacity: 0; transform: scale(0.95); }
                    to { opacity: 1; transform: scale(1); }
                }
                .animate-scalein {
                    animation: scalein 0.25s cubic-bezier(0.4,0,0.2,1);
                }
            `}</style>
        </div>
    )
}

export default ExpenseModal
