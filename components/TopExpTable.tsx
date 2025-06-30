'use client'

import React, { useState } from 'react'
import {Expense} from "@/types/index"
import { useEffect } from 'react';



type TopExpTableProps = {
  expense: Expense[];
};

const TopExpTable = ({expense}: TopExpTableProps) => {

  const [total, setTotal] = useState(0)

  useEffect(() => {
    const amounts = expense.slice(0, 5).map(expense => expense.amount);
    const total = amounts.reduce((acc, curr) => acc + curr, 0);
    setTotal(total)
  }, [expense])

  return (
    <div className="relative overflow-x-auto mt-20">
    <table className="w-full text-sm text-left rtl:text-right text-amber-900 bg-amber-50">
        <thead className="text-xs text-amber-900 uppercase bg-amber-400">
            <tr>
                <th scope="col" className="px-6 py-3 rounded-tl-lg">Title</th>
                <th scope="col" className="px-6 py-3">Category</th>
                <th scope="col" className="px-6 py-3">Date</th>
                <th scope='col' className='px-6 py-3 rounded-tr-lg'>Amount</th>
            </tr>
        </thead>
        <tbody>
            {expense.slice(0, 5).map(exp => (
              <tr className="bg-amber-300" key={exp.id}>
                <th scope="row" className="px-6 py-4 font-medium text-amber-900 whitespace-nowrap">{exp.title}</th>
                <td className="px-6 py-4">{exp.category}</td>
                <td className="px-6 py-4">{exp.date}</td>
                <td className="px-6 py-4">{exp.amount}</td>
            </tr>
            ))}
        </tbody>
        <tfoot>
            <tr className="font-semibold text-amber-900 dark:text-amber-900 bg-amber-400  ">
                <th scope="row" className="px-6 py-3 text-base rounded-bl-lg">Total</th>
                <td className="px-6 py-3"></td>
                <td className="px-6 py-3"></td>
                <td className="px-6 py-3 rounded-br-lg">{total}</td>
            </tr>
        </tfoot>
    </table>
</div>
  )
}

export default TopExpTable
