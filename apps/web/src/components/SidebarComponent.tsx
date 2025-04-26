'use client'
import React, { useState } from 'react'
import { Sidebar ,SidebarLink, SidebarBody} from '@/components/ui/sidebar';
import { Home, Video, PencilRuler, Youtube, Headphones , Code} from 'lucide-react'
import {motion} from 'motion/react'
import {useAuthStore} from '@/zustand/auth'
function SidebarComponent() {
    const links = [
        {
          label: "Dashboard",
          href: "/dashboard",
          icon: (
            <Home className="h-5 w-5 shrink-0 text-neutral-700 dark:text-neutral-200" />
          ),
        },
        {
          label: "Code",
          href: "/code",
          icon: (
            <Code className="h-5 w-5 shrink-0 text-neutral-700 dark:text-neutral-200" />
          ),
        },
        {
          label: "Video",
          href: "/video",
          icon: (
            <Video className="h-5 w-5 shrink-0 text-neutral-700 dark:text-neutral-200" />
          ),
        },
        {
          label: "Draw",
          href: "/draw",
          icon: (
            <PencilRuler className="h-5 w-5 shrink-0 text-neutral-700 dark:text-neutral-200" />
          ),
        },
        {
          label: "Watch",
          href: "/watch",
          icon: (
            <Youtube className="h-5 w-5 shrink-0 text-neutral-700 dark:text-neutral-200" />
          ),
        },
        {
          label: "Listen",
          href: "/listen",
          icon: (
            <Headphones className="h-5 w-5 shrink-0 text-neutral-700 dark:text-neutral-200" />
          ),
        },
      ];
      const [open, setOpen] = useState(false);
      const {user, loading} = useAuthStore();
  return (
    
      <Sidebar open={open} setOpen={setOpen} >
              <SidebarBody className="justify-between gap-10">
                <div className="flex flex-1 flex-col overflow-x-hidden overflow-y-auto">
                  {open ? <Logo /> : <LogoIcon />}
                  <div className="mt-8 flex flex-col gap-2">
                    {links.map((link, idx) => (
                      <SidebarLink key={idx} link={link} />
                    ))}
                  </div>
                </div>
                <div>
                  <SidebarLink
                    link={{
                      label: user?.name || "",
                      href: "#",
                      icon: (
                        <img
                          src={user?.profilePicture}
                          className="h-7 w-7 shrink-0 rounded-full"
                          width={50}
                          height={50}
                          alt="Avatar"
                          referrerPolicy='no-referrer'
                        />
                      ),
                    }}
                  />
                </div>
              </SidebarBody>
            </Sidebar>
  )
}

export default SidebarComponent
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