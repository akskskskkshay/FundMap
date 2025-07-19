'use client';

import { Anton } from 'next/font/google';
import { supabase } from '@/lib/supabaseClient';
import { useState, useRef } from 'react';
import { clsx } from 'clsx';
import { useRouter } from "next/navigation"
import { Eye, EyeOff, ArrowLeft } from "lucide-react"
import { capitalize } from '@/utils/capitalize';
import Link from 'next/link';

const anton = Anton({
    subsets: ['latin'],
    weight: '400',
})

export default function Login() {
    const [userCreds, setUserCreds] = useState({fullName: '', email: '', password: ''});
    const [pwdVerify, SetPwdVerify] = useState<string>("")
    const [isLogin, setIsLogin] = useState(true);
    const [isInvalidData, setIsInvalidData] = useState(false);
    const [pwdMis, setPwdMis] = useState(false); 
    const [isLoading, setIsLoading] = useState(false);
    const [isNotConfirmed, setIsNotConfirmed] = useState(false);
    const [isError, setIsError] = useState(false);
    const [showPwd, setShowPwd] = useState(false);
    const [isRedirecting, setIsRedirecting] = useState(false);

    const inputRef = useRef<HTMLInputElement>(null);
    const router = useRouter();

    const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        setIsNotConfirmed(false)
        setIsInvalidData(false)
        setIsError(false)
        setIsLoading(true)

        let error
        if(isLogin) {
            ({ error } =await supabase.auth.signInWithPassword({
            email: userCreds.email,
            password: userCreds.password
        }))

            if (error) {
                console.error("Error during authentication:", error.message);
                if(error.message == "Invalid login credentials" || error.message == "missing email or phone"){
                    setIsInvalidData(true)
                    setIsLoading(false)
                }
                else if(error.message.toLowerCase() === "email not confirmed"){
                    setIsNotConfirmed(true)
                    setIsLoading(false)
                }
                else{
                    setTimeout(() => {
                        setIsError(true)
                        setIsLoading(false)
                    }, 4000)
                }
                return
            }
            else {
                setUserCreds({fullName: '', email: '', password: ''}); 
                SetPwdVerify("");
                setIsInvalidData(false)
                setIsNotConfirmed(false)
                setIsLogin(true)
                setIsLoading(false)
                setIsRedirecting(true);
                setTimeout(() => {
                    router.push('/dashboard');
                }, 2000)
            }    
        }
        else {
            if(userCreds.password === pwdVerify){
                setPwdMis(false)
                await supabase.auth.signUp({
                            email: userCreds.email,
                            password: userCreds.password,
                            options: {
                                data: {
                                    displayName: capitalize(userCreds.fullName)
                                }
                            }
                        });
                console.log("User Successfully Created!")
                setIsLogin(true)
                setUserCreds({fullName: '', email: '', password: ''}); 
                SetPwdVerify("");
                setIsLoading(false)
            }
            else{ 
                setUserCreds(prev => ({...prev, password: ''}));
                SetPwdVerify("");
                inputRef.current?.focus()
                setPwdMis(true)
                setIsLoading(false)
            }
        }
    }
    
    if (isRedirecting) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900">
                <div className="flex flex-col items-center">
                    <div className="loader mb-4"></div>
                    <p className="text-white/80 text-lg">Redirecting to dashboard...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 flex items-center justify-center px-4 relative">
            {/* Background decoration */}
            <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 to-transparent"></div>
            
            {/* Back to home button */}
            <Link 
                href="/"
                className="absolute top-8 left-8 flex items-center gap-2 text-white/70 hover:text-purple-300 transition-colors duration-200 z-10"
            >
                <ArrowLeft size={20} />
                <span>Back to Home</span>
            </Link>

            <div className='w-full max-w-md p-8 rounded-2xl shadow-2xl bg-white/10 backdrop-blur-lg border border-white/20 relative z-10'>
                <div className="text-center mb-8">
                    <h1 className={clsx("text-3xl font-bold text-white mb-2", anton.className)}>
                        {isLogin ? 'Welcome Back' : "Join FundMap"}
                    </h1>
                    <p className="text-white/70 text-lg">
                        {isLogin ? 'Sign in to continue your financial journey' : 'Create your account to get started'}
                    </p>
                    {/* <div className="mt-4">
                        <span className='text-4xl font-semibold text-purple-300 drop-shadow-[0_0_20px_#A855F7]'>FundMap</span>
                    </div> */}
                </div>

                {/* Error/Success Messages */}
                {isInvalidData && (
                    <div className='mb-6 p-4 rounded-xl bg-red-500/20 border border-red-400/40 text-red-300 text-center'>
                        Invalid email or password. Please try again.
                    </div>
                )}
                {isNotConfirmed && (
                    <div className='mb-6 p-4 rounded-xl bg-green-500/20 border border-green-400/40 text-green-300 text-center'>
                        Email not confirmed. Please check your inbox and verify your account.
                    </div>
                )}
                {pwdMis && (
                    <div className='mb-6 p-4 rounded-xl bg-red-500/20 border border-red-400/40 text-red-300 text-center'>
                        Passwords don&apos;t match. Please try again.
                    </div>
                )}
                {isError && (
                    <div className='mb-6 p-4 rounded-xl bg-red-500/20 border border-red-400/40 text-red-300 text-center'>
                        An error occurred. Please try again later.
                    </div>
                )}
                <form onSubmit={handleLogin} className="space-y-6">
                    {!isLogin && (
                        <div>
                            <input
                                type="text"
                                required
                                placeholder="Full Name"
                                onChange={(e) => setUserCreds(prev => ({...prev, fullName: e.target.value}))}
                                value={userCreds.fullName}
                                className="w-full p-4 border border-white/20 rounded-xl text-white bg-white/5 backdrop-blur-sm focus:outline-none focus:border-purple-400 focus:ring-2 focus:ring-purple-400/20 transition-all duration-200 placeholder-white/50"
                            />
                        </div>
                    )}
                    
                    <div>
                        <input
                            type="email"   
                            required
                            placeholder="Email Address"
                            onChange={(e) => setUserCreds({...userCreds, email: e.target.value.trim()})}
                            value={userCreds.email}
                            className="w-full p-4 border border-white/20 rounded-xl text-white bg-white/5 backdrop-blur-sm focus:outline-none focus:border-purple-400 focus:ring-2 focus:ring-purple-400/20 transition-all duration-200 placeholder-white/50"
                        />
                    </div>

                    <div className='relative'>
                        <input
                            type={showPwd ? "text" : "password"}
                            ref={inputRef}
                            required
                            placeholder="Password"
                            onChange={(e) => setUserCreds({...userCreds, password: e.target.value})}
                            value={userCreds.password}
                            className="w-full p-4 pr-12 border border-white/20 rounded-xl text-white bg-white/5 backdrop-blur-sm focus:outline-none focus:border-purple-400 focus:ring-2 focus:ring-purple-400/20 transition-all duration-200 placeholder-white/50"
                        />
                        <button 
                            type='button'
                            onClick={() => setShowPwd(prev => !prev)}
                            className='absolute right-4 top-1/2 -translate-y-1/2 text-white/50 hover:text-purple-300 transition-colors duration-200'
                        >
                            {showPwd ? <Eye size={20}/> : <EyeOff size={20} />}
                        </button>
                    </div>
                    
                    {!isLogin && (
                        <div>
                            <input
                                type="password"
                                required
                                placeholder="Confirm Password"
                                onChange={(e) => SetPwdVerify(e.target.value)}
                                value={pwdVerify}
                                className="w-full p-4 border border-white/20 rounded-xl text-white bg-white/5 backdrop-blur-sm focus:outline-none focus:border-purple-400 focus:ring-2 focus:ring-purple-400/20 transition-all duration-200 placeholder-white/50"
                            />
                        </div>
                    )}

                    <button 
                        type="submit"
                        disabled={isLoading}
                        className='w-full bg-gradient-to-r from-purple-600 via-purple-500 to-purple-600 bg-size-200 bg-pos-0 hover:bg-pos-100 text-white backdrop-blur-md border border-purple-400/40 shadow-[0_0_20px_#A855F7] hover:shadow-[0_0_30px_#A855F7] transition-all p-4 font-bold cursor-pointer duration-200 rounded-xl text-lg animate-gradient flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed'>
                        {isLogin ? "Sign In" : "Create Account"}
                        {isLoading && <div className='loader_btn'></div>}
                    </button>
                </form>
                
                <div className="mt-8 text-center">
                    {isLogin ? (
                        <p className='text-white/70'>
                            Don&apos;t have an account?{' '}
                            <button 
                                onClick={() => {
                                    setIsLogin(false); 
                                    setUserCreds({fullName: '', email: '', password: ''}); 
                                    setIsInvalidData(false)
                                }} 
                                className='text-purple-300 hover:text-purple-200 underline transition-colors duration-200 cursor-pointer'
                            >
                                Sign Up
                            </button>
                        </p>
                    ) : (
                        <p className='text-white/70'>
                            Already have an account?{' '}
                            <button 
                                onClick={() => {
                                    setIsLogin(true); 
                                    setUserCreds({fullName: '', email: '', password: ''});
                                    setIsInvalidData(false)
                                }} 
                                className='text-purple-300 hover:text-purple-200 underline transition-colors duration-200 cursor-pointer'
                            >
                                Sign In
                            </button>
                        </p>
                    )}
                </div>
            </div>
        </div>
    );
}