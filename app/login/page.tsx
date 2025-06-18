'use client';

import { Anton } from 'next/font/google';
import { supabase } from '@/lib/supabaseClient';
import { useState, useRef, useEffect } from 'react';
import { clsx } from 'clsx';
import { useRouter } from "next/navigation"




const anton = Anton({
    subsets: ['latin'],
    weight: '400',
})

export default function Login() {
    const [userCreds, setUserCreds] = useState({email: '', password: ''});
    const [pwdVerify, SetPwdVerify] = useState<string>("")
    const [isLogin, setIsLogin] = useState(true);
    const [isInvalidData, setIsInvalidData] = useState(false);
    const [isTouched, setIsTouched] = useState({email: false, pwd: false})
    const [pwdMis, setPwdMis] = useState(false) 

    const inputRef = useRef<HTMLInputElement>(null)
    const router = useRouter();

    //handle redirecting once logged in
    useEffect(()=>{
        const {data} = supabase.auth.onAuthStateChange((event, session) => {
            if (event==="SIGNED_IN"){
                console.log("Log In Successful!")
                router.replace("/dashboard")
            }
        })

        return() => data.subscription.unsubscribe()
    }, [])

    const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()

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
                }
                else{
                    alert("Authentication failed: " + error.message);
                }
                return
            }
            else {
                setUserCreds({email: '', password: ''}); 
                SetPwdVerify("");
                setIsInvalidData(false)
                setIsLogin(true)
                console.log("Authenticated Successfully!", data)
            }    
        }

        else {
            if(userCreds.password === pwdVerify){
                setPwdMis(false)
                await supabase.auth.signUp({
                            email: userCreds.email,
                            password: userCreds.password
                        });
                console.log("User Successfully Created!")
                setIsLogin(true)
                setUserCreds({email: '', password: ''}); 
                SetPwdVerify("");
            }
            else{ 
                setUserCreds(prev => ({...prev, password: ''}));
                SetPwdVerify("");
                inputRef.current?.focus()
                setPwdMis(true)
            }
        }
    }
    

  return (
    <div className="flex items-center justify-center h-screen bg-amber-50">
      <div className='w-full max-w-md p-6 bg-white rounded-lg shadow-2xl'>
        <h1 className={clsx("text-2xl font-bold text-gray-600 text-center mb-3", anton.className)}>{isLogin ? 'Login' : "SignUp"} To FundMap</h1>
        {isInvalidData && (<p className='text-center mb-3 text-red-500'>Invalid Username Or Password, Try Again!</p>)}
        {pwdMis && (<p className='text-center mb-3 text-red-500'>Password doesn't match. Try Again!</p>)}
        <form onSubmit={handleLogin}>
            <input
            onBlur={()=> {setIsTouched(prev => ({...prev, email: true}))}}
            type="email"   
            required
            placeholder="Email"
            onChange={(e) => setUserCreds({...userCreds, email: e.target.value.trim()})}
            value={userCreds.email}
            className={`w-full p-3 mb-4 border border-gray-300 rounded text-black focus:outline-amber-400 ${isTouched.email && 'invalid:border-pink-600'} `}
        />
        <input
            type="password"
            ref={inputRef}
            onBlur={()=> {setIsTouched(prev => ({...prev, pwd: true}))}}
            required
            placeholder="Password"
            onChange={(e) => setUserCreds({...userCreds, password: e.target.value})}
            value={userCreds.password}
            className={`w-full p-3 mb-4 border border-gray-300 rounded text-black focus:outline-amber-400 ${isTouched.pwd && 'invalid:border-pink-600'}` }
        />
        { !isLogin &&
        <input
            type="password"
            onBlur={()=> {setIsTouched(prev => ({...prev, pwd: true}))}}
            required
            placeholder="Re-Enter Password"
            onChange={(e) => SetPwdVerify(e.target.value)}
            value={pwdVerify}
            className={`w-full p-3 mb-4 border border-gray-300 rounded text-black focus:outline-amber-400 ${isTouched.pwd && 'invalid:border-pink-600'}` }
        />
        }

        
        <button className=' text-gray-800 bg-amber-400 p-3 rounded-full w-100 hover:bg-amber-300 hover:text-amber-800 transition duration-200 font-bold cursor-pointer'>{isLogin ? "Login" : "SignUp"}</button>
        </form>
        
        {isLogin ? (
          <p className='text-center mt-4 text-gray-600 cursor-default'>Don't have an account? <button className='cursor-pointer'><a onClick={() => {setIsLogin(false); setUserCreds({email: '', password: ''}); setIsTouched({email: false, pwd: false}); setIsInvalidData(false)}} className='text-amber-500 hover:underline'>Sign Up</a></button></p>
        ) : (
          <p className='text-center mt-4 text-gray-600 cursor-default'>Already have an account? <button className='cursor-pointer'><a onClick={() => {setIsLogin(true); setUserCreds({email: '', password: ''}); setIsTouched({email: false, pwd: false}); setIsInvalidData(false)}} className='text-amber-500 hover:underline'>Login</a></button></p>
        )}
      </div>
    </div>
  );
}