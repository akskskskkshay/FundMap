'use client';

import { Anton } from 'next/font/google';
import { supabase } from '@/lib/supabaseClient';
import { useState } from 'react';
import { clsx } from 'clsx';



const anton = Anton({
    subsets: ['latin'],
    weight: '400',
})

export default function Login() {
    const [userCreds, setUserCreds] = useState({email: '', password: ''});
    const [isLogin, setIsLogin] = useState(true);
    

  return (
    <div className="flex items-center justify-center h-screen bg-amber-50">
      <div className='w-full max-w-md p-6 bg-white rounded-lg shadow-2xl'>
        <h1 className={clsx("text-2xl font-bold text-gray-600 text-center mb-6", anton.className)}>{isLogin ? 'Login' : "SignUp"} To FundMap</h1>
        <input
            type="email"   
            placeholder="Email"
            onChange={(e) => setUserCreds({...userCreds, email: e.target.value})}
            className="w-full p-3 mb-4 border border-gray-300 rounded text-black"
        />
        <input
            type="password"
            placeholder="Password"
            onChange={(e) => setUserCreds({...userCreds, password: e.target.value})}
            className="w-full p-3 mb-4 border border-gray-300 rounded text-black"
        />
        <button className='bg-amber-400 p-3 rounded-full w-100 hover:bg-amber-300 hover:text-amber-800 transition duration-300 font-bold cursor-pointer'>{isLogin ? "Login" : "SignUp"}</button>
        {isLogin ? (
          <p className='text-center mt-4 text-gray-600 cursor-default'>Don't have an account? <button className='cursor-pointer'><a onClick={() => setIsLogin(false)} className='text-amber-500 hover:underline'>Sign Up</a></button></p>
        ) : (
          <p className='text-center mt-4 text-gray-600 cursor-default'>Already have an account? <button className='cursor-pointer'><a onClick={() => setIsLogin(true)} className='text-amber-500 hover:underline'>Login</a></button></p>
        )}
      </div>
    </div>
  );
}