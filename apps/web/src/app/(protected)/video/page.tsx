'use client'
import { useAuthStore } from '@/zustand/auth'
import React, { useEffect} from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import useVideo from '@/hooks/useVideo'
import VideoChat from '@/components/VideoChat'
function Video() {

  const user = useAuthStore((state)=> state.user)
  const loading = useAuthStore((state)=> state.loading)
  
  const router = useRouter()
  
  // const {handleMuteAudio, handleMuteVideo, handleResumeStream, handleStopStream, handleUnmuteAudio, handleUnmuteVideo, startCall} = useVideo()

  useEffect(() => {
     if(!user && !loading ){
       router.push('/signin');
     }
   }, [user, router, loading])

  
  return (
    <div>
      Video
      <VideoChat/>
      {/*  */}
    </div>
  )
}

export default Video
