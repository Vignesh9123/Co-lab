'use client'
import React, { useEffect , useState} from 'react'
import {useAuthStore} from '@/zustand/auth'
import { useRouter } from 'next/navigation';
import { Sidebar ,SidebarLink, SidebarBody} from '@/components/ui/sidebar';
import { Home, Video, PencilRuler, Youtube, Headphones } from 'lucide-react'
import {motion} from 'motion/react'
function Dashboard() {
  const links = [
    {
      label: "Dashboard",
      href: "#",
      icon: (
        <Home className="h-5 w-5 shrink-0 text-neutral-700 dark:text-neutral-200" />
      ),
    },
    {
      label: "Video",
      href: "#",
      icon: (
        <Video className="h-5 w-5 shrink-0 text-neutral-700 dark:text-neutral-200" />
      ),
    },
    {
      label: "Draw",
      href: "#",
      icon: (
        <PencilRuler className="h-5 w-5 shrink-0 text-neutral-700 dark:text-neutral-200" />
      ),
    },
    {
      label: "Watch",
      href: "#",
      icon: (
        <Youtube className="h-5 w-5 shrink-0 text-neutral-700 dark:text-neutral-200" />
      ),
    },
    {
      label: "Listen",
      href: "#",
      icon: (
        <Headphones className="h-5 w-5 shrink-0 text-neutral-700 dark:text-neutral-200" />
      ),
    },
  ];
  const [open, setOpen] = useState(false);
  const {user, loading} = useAuthStore();
  const router = useRouter();
  useEffect(() => {
    if(!user && !loading ){
      router.push('/signin');
    }
  }, [user, router, loading])
  return (
    
      <div className='overflow-y-auto bg-background flex-1' >

      
      
      </div>
  )
}

export default Dashboard
export const Logo = () => {
  return (
    <a
      href="#"
      className="relative z-20 flex items-center space-x-2 py-1 text-sm font-normal text-black"
    >
      <div className="h-5 w-6 shrink-0 rounded-tl-lg rounded-tr-sm rounded-br-lg rounded-bl-sm bg-black dark:bg-white" />
      <motion.span
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="font-medium whitespace-pre text-black dark:text-white"
      >
        Co-Lab
      </motion.span>
    </a>
  );
};
export const LogoIcon = () => {
  return (
    <a
      href="#"
      className="relative z-20 flex items-center space-x-2 py-1 text-sm font-normal text-black"
    >
      <div className="h-5 w-6 shrink-0 rounded-tl-lg rounded-tr-sm rounded-br-lg rounded-bl-sm bg-black dark:bg-white" />
    </a>
  );
};