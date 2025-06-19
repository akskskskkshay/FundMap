import React from 'react'
import type { DashboardCardProps } from '@/types'


const DashboardCard = ({title, value} : DashboardCardProps) => {
  return (
    <div className='flex flex-col items-center bg-amber-400 shadow-2xl rounded-2xl p-4'>
        <h5 className='text-xl font-bold text-amber-900'>{title}</h5>   
        <h3 className='text-2xl font-black text-amber-900'>{value}</h3>
    </div>
  )
}

export default DashboardCard
