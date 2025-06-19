import React from 'react'
import type { DashboardCardProps } from '@/types'


const DashboardCard = ({title, value} : DashboardCardProps) => {
  return (
    <div className='flex flex-col items-center bg-white shadow-2xl rounded-2xl p-4'>
        <h5 className='text-xl font-bold'>{title}</h5>   
        <h3 className='text-2xl font-black'>{value}</h3>
    </div>
  )
}

export default DashboardCard
