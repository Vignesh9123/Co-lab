'use client'
import React, { useEffect} from 'react'
import {useAuthStore} from '@/zustand/auth'
import { useRouter } from 'next/navigation';
function Dashboard() {
  const {user, loading} = useAuthStore();
  const router = useRouter();
  useEffect(() => {
    if(!user && !loading ){
      router.push('/signin');
    }
  }, [user, router, loading])
  return (
    
     <div>
      Dashboard
     </div>
  )
}

export default Dashboard
