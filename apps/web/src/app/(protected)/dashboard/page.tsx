'use client'
import React, { useEffect , useState} from 'react'
import {useAuthStore} from '@/zustand/auth'
import { useRouter } from 'next/navigation';
import { Sidebar ,SidebarLink, SidebarBody} from '@/components/ui/sidebar';
import { Home, Video, PencilRuler, Youtube, Headphones } from 'lucide-react'
import {motion} from 'motion/react'
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
