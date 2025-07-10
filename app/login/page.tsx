'use client';

import { Anton } from 'next/font/google';
import { supabase } from '@/lib/supabaseClient';
import { useState, useRef, useEffect } from 'react';
import { clsx } from 'clsx';
import { useRouter } from "next/navigation"
import { Eye, EyeOff } from "lucide-react"
import { capitalize } from '@/utils/capitalize';




const anton = Anton({
    subsets: ['latin'],
    weight: '400',
})

export default function Login() {
    const [userCreds, setUserCreds] = useState({fullName: '', email: '', password: ''});
    const [pwdVerify, SetPwdVerify] = useState<string>("")
    const [isLogin, setIsLogin] = useState(true);
    const [isInvalidData, setIsInvalidData] = useState(false);
    const [isTouched, setIsTouched] = useState({name: false, email: false, pwd: false, repwd: false})
    const [pwdMis, setPwdMis] = useState(false); 
    const [isLoading, setIsLoading] = useState(false);
    const [isNotConfirmed, setIsNotConfirmed] = useState(false);
    const [showPwd, setShowPwd] = useState(false);

    const inputRef = useRef<HTMLInputElement>(null);
    const router = useRouter();

    //handle redirecting once logged in
    // useEffect(()=>{
    //     const {data} = supabase.auth.onAuthStateChange((event, session) => {
    //         if (event==="SIGNED_IN"){
    //             console.log("Log In Successful!")
    //             router.replace("/dashboard")
    //         }
    //     })

    //     return() => data.subscription.unsubscribe()
    // }, [])

    const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        setIsNotConfirmed(false)
        setIsInvalidData(false)
        setIsLoading(true)

        let data, error
        if(isLogin) {
            ({ data, error } =await supabase.auth.signInWithPassword({
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
                    alert("Authentication failed: " + error.message);
                    setIsLoading(false)
                }
                return
            }
            else {
                setTimeout(() => {
                    router.push('/dashboard')
                }, 200) 

                setUserCreds({fullName: '', email: '', password: ''}); 
                SetPwdVerify("");
                setIsInvalidData(false)
                setIsNotConfirmed(false)
                setIsTouched({name: false, email: false, pwd: false, repwd: false})
                setIsLogin(true)
                setIsLoading(false)
                console.log("Authenticated Successfully!", data)
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
    

  return (
    <div className="flex items-center justify-center h-screen">
      <div className='w-full max-w-md p-6 rounded-2xl shadow-2xl bg-white/10 backdrop-blur-lg border border-white/10'>
        <h1 className={clsx("text-2xl font-bold text-white text-center mb-3", anton.className)}>{isLogin ? 'Login' : "Sign Up"} To <span className='text-3xl font-semibold text-purple-300 drop-shadow-[0_0_10px_#A855F7]'>FundMap</span></h1>
        {isInvalidData && (<p className='text-center mb-3 text-red-500'>Invalid Username Or Password, Try Again!</p>)}
        {isNotConfirmed && (<p className='text-center mb-3 text-green-500'>Email Not Confirmed.. Check your Mail!</p>)}
        {pwdMis && (<p className='text-center mb-3 text-red-500'>Password doesn't match. Try Again!</p>)}
        <form onSubmit={handleLogin}>
            { !isLogin &&
            <input
                type="text"
                onBlur={()=> {setIsTouched(prev => ({...prev, name: true}))}}
                required
                placeholder="Full Name"
                onChange={(e) => setUserCreds(prev => ({...prev, fullName: e.target.value}))}
                value={userCreds.fullName}
                className={`w-full p-3 mb-4 border border-white rounded text-white focus:outline-purple-300 ${isTouched.repwd && 'invalid:border-pink-600'}` }
            />
            }
            <input
            onBlur={()=> {setIsTouched(prev => ({...prev, email: true}))}}
            type="email"   
            required
            placeholder="Email"
            onChange={(e) => setUserCreds({...userCreds, email: e.target.value.trim()})}
            value={userCreds.email}
            className={`w-full p-3 mb-4 border border-white rounded text-white focus:outline-purple-300 ${isTouched.email && 'invalid:border-pink-600'} `}
        />
        <div className='relative w-full'>
            <input
            type={showPwd ? "text" : "password"}
            ref={inputRef}
            onBlur={()=> {setIsTouched(prev => ({...prev, pwd: true}))}}
            required
            placeholder="Password"
            onChange={(e) => setUserCreds({...userCreds, password: e.target.value})}
            value={userCreds.password}
            className={`w-full p-3 mb-4 border border-white rounded text-white focus:outline-purple-300 ${isTouched.pwd && 'invalid:border-pink-600'}` }
        />
        <button 
            type='button'
            onClick={() => {
                setShowPwd(prev => !prev)
            }}
            className='absolute right-3 top-1/2 translate-y-[-80%] text-gray-500 hover:text-white transition duration-300 cursor-pointer'
        >{showPwd ? <Eye size={21}/> : <EyeOff size={21} />}</button>
        </div>
        
        { !isLogin &&
        <input
            type="password"
            onBlur={()=> {setIsTouched(prev => ({...prev, repwd: true}))}}
            required
            placeholder="Re-Enter Password"
            onChange={(e) => SetPwdVerify(e.target.value)}
            value={pwdVerify}
            className={`w-full p-3 mb-4 border border-white rounded text-white focus:outline-purple-300 ${isTouched.repwd && 'invalid:border-pink-600'}` }
        />
        }

        
        <button className='rounded-xl w-full bg-[#A855F7]/30 text-purple-300 backdrop-blur-md border border-purple-400/40 shadow-[0_0_10px_#A855F7] hover:shadow-[0_0_20px_#A855F7] transition-all p-3 font-bold cursor-pointer duration-200 flex items-center justify-center gap-2'>
            {isLogin ? "Login" : "SignUp"} 
            {isLoading && <div className='loader_btn'></div>}
        </button>
        </form>
        
        {isLogin ? (
          <p className='text-center mt-4 text-white cursor-default'>Don't have an account? <button className='cursor-pointer'><a onClick={() => {setIsLogin(false); setUserCreds({fullName: '', email: '', password: ''}); setIsTouched({name: false, email: false, pwd: false, repwd: false}); setIsInvalidData(false)}} className='text-purple-300 hover:underline'>Sign Up</a></button></p>
        ) : (
          <p className='text-center mt-4 text-white cursor-default'>Already have an account? <button className='cursor-pointer'><a onClick={() => {setIsLogin(true); setUserCreds({fullName: '', email: '', password: ''}); setIsTouched({name: false, email: false, pwd: false, repwd: false}); setIsInvalidData(false)}} className='text-purple-300 hover:underline'>Login</a></button></p>
        )}
      </div>
    </div>
  );
}