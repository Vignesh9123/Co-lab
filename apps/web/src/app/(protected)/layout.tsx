import React from 'react'
import SidebarComponent from '@/components/SidebarComponent'
function layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="mx-auto flex w-full flex-1 flex-col overflow-hidden rounded-md border border-neutral-200 bg-gray-100 md:flex-row dark:border-neutral-700 dark:bg-neutral-800 h-screen">
      <SidebarComponent />
      <div className='overflow-y-auto bg-background flex-1' >
        {children}
      </div>
    </div>
  )
}

export default layout
