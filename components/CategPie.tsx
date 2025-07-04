"use client"

import React, { useState } from 'react'
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts'

import { Expense } from '@/types'

export type CategPie = {
    expense: Expense[];
}




const CategPie = ({expense}: CategPie) => {

    const groupedByCategory = expense.reduce((acc, expense) => {
    const category = expense.category || 'Uncategorized'
    const amount = expense.amount || 0

    if (!acc[category]) acc[category] = 0
    acc[category] += amount

    return acc
    }, {} as Record<string, number>)

    const pieData = Object.entries(groupedByCategory).map(([key, value]) => ({
    name: key,
    value,
    }))


  return (
      <div className="w-full">
        {/* <h2 className="text-xl font-semibold mb-4 text-white text-right">Spending by Category</h2> */}
        <ResponsiveContainer width="100%" height={300}>
            <PieChart>
            <Pie
                data={pieData}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={100}
                fill="#8884d8"
                label
            >
                {pieData.map((entry, index) => (
                <Cell
                    key={`cell-${index}`}
                    fill={['#8884d8', '#82ca9d', '#ffc658', '#ff8042', '#a4de6c'][index % 5]}
                />
                ))}
            </Pie>
            <Tooltip 
            contentStyle={{
                    backgroundColor: '#ffffff',
                    border: '1px solid #e5e7eb',
                    borderRadius: '0.5rem',
                    fontSize: '0.85rem',
                    color: '#111827',
                }}
                formatter={(value: any, name: any) => [`₹${value}`, name]}/>
            <Legend 
            iconType="circle"
                verticalAlign="bottom"
                height={36}
                wrapperStyle={{
                    fontSize: '0.85rem',
                    marginTop: '12px',
                    color: '#4b5563'
                }}/>
            </PieChart>
        </ResponsiveContainer>
        </div>
  )
}

export default CategPie
