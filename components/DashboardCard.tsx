import React from 'react'
import type { DashboardCardProps } from '@/types'


const DashboardCard = ({title, value} : DashboardCardProps) => {
  return (
    <div className='flex flex-col items-center bg-white/10 backdrop-blur-lg border border-white/10 max-w-md w-full shadow-2xl rounded-2xl p-4'>
        <h3 className='text-white text-3xl font-black mb-1'>{value}</h3>
        <h5 className='text-md font-semibold text-white/70'>{title}</h5> 
    </div>
  )
}

export default DashboardCard
