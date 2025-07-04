import React from 'react'
import type { DashboardCardProps } from '@/types'
import {ArrowDown, ArrowUp } from 'lucide-react'


const DashboardCard = ({title, value, increase} : DashboardCardProps) => {

  return (
    <div className='flex flex-col justify-center items-center bg-white/10 backdrop-blur-lg border border-white/10 max-w-md w-full shadow-2xl rounded-2xl p-4'>

      
        <h3 className='text-white text-3xl font-black mb-1 flex items-center'>{increase !== undefined && 
        (increase ? <ArrowUp size={30} strokeWidth={3.25} /> : <ArrowDown size={30} strokeWidth={3.25} />)}{value}</h3>


        <h5 className='text-md font-semibold text-white/70 flex items-center'>
        {title}
        </h5> 
    </div>


  )
}

export default DashboardCard
