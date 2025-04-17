import React from 'react'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { getAuth, signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { useAuthStore } from '@/zustand/auth';
import { useRouter } from 'next/navigation';
import {toast} from 'react-toastify';
function SignIn() {
  const auth = getAuth();
const provider = new GoogleAuthProvider();
const {login} = useAuthStore()
const router = useRouter();
const handleGoogleSignIn = async () => {
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      const userData = {
        idtoken: await user.getIdToken(),
      };
      // const signInPromise = axiosInstance
      //   .post(
      //     "/user/google-auth",
      //     userData, 
      //     {
      //       headers: {
      //         "Content-Type": "application/json",
      //       },
      //       withCredentials: true,
      //     }
      //   )
      //   .then((response) => {
      //     localStorage.setItem("token", response.data.data.token);
      //   });
      const signInPromise = login({idToken: userData.idtoken})
      .then(() => {
        router.push('/dashboard');
      })
      toast.promise(signInPromise, {
        pending: "Signing in...",
        success: "Signed in successfully!",
        error: "Failed to sign in. Please try again.",
      });
    } catch (error: any) {
      if (error.status === 429) {
        toast.error("Too Many Requests - please try again later");
        router.push("/");
      }
    }
  };
  return (
    <div className='h-screen p-10'>
        <Link href="/">
        <div className='flex h-10 mx-auto w-fit pt-4 justify-center text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-pink-600 dark:from-purple-400 dark:to-pink-400'>
            Co-Lab
        </div>
        </Link>
    <div className='flex h-full w-full items-center justify-center'>
      <div className='flex flex-col items-center justify-center'>
        <Button onClick={handleGoogleSignIn}>Sign In with Google</Button>
      </div>
    </div>
    <div className="absolute inset-0 w-full h-full dark:bg-black bg-white  -z-10">
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-[800px] h-[800px] dark:bg-purple-500/20 bg-blue-500/20 rounded-full blur-3xl animate-pulse" />
            <div className="absolute w-[600px] h-[600px] dark:bg-pink-500/20 bg-cyan-500/20 rounded-full blur-3xl animate-pulse delay-1000" />
            <div className="absolute w-[400px] h-[400px] dark:bg-indigo-500/20 bg-violet-500/20 rounded-full blur-3xl animate-pulse delay-2000" />
          </div>
        </div>
    </div>
  )
}

export default SignIn
