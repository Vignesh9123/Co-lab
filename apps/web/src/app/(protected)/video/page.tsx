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
  
  const {handleMuteAudio, handleMuteVideo, handleResumeStream, handleStopStream, handleUnmuteAudio, handleUnmuteVideo, startCall} = useVideo()

  useEffect(() => {
     if(!user && !loading ){
       router.push('/signin');
     }
   }, [user, router, loading])

  
  return (
    <div>
      Video
      <VideoChat/>
      <Button onClick={handleStopStream}>Stop Stream</Button>
      <Button onClick={handleResumeStream}>Resume Stream</Button>
      <Button onClick={handleMuteAudio}>Mute Audio</Button>
      <Button onClick={handleUnmuteAudio}>Unmute Audio</Button>
      <Button onClick={handleMuteVideo}>Mute Video</Button>
      <Button onClick={handleUnmuteVideo}>Unmute Video</Button>
      <button onClick={startCall}>Start Call</button>
    </div>
  )
}

export default Video
