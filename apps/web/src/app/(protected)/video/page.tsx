'use client'
import { useAuthStore } from '@/zustand/auth'
import React, {useState, useEffect, useRef} from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import useVideo from '@/hooks/useVideo'
function Video() {

  const {user, loading} = useAuthStore()
  const router = useRouter()
  
  const {handleMuteAudio, handleMuteVideo, handleResumeStream, handleStopStream, handleUnmuteAudio, handleUnmuteVideo, myVideo, startCall, remoteVideo} = useVideo()

  useEffect(() => {
     if(!user && !loading ){
       router.push('/signin');
     }
   }, [user, router, loading])

  
  return (
    <div>
      Video
      <video className='border border-red-600' ref={myVideo} autoPlay muted />
      <video className='border border-green-600' ref={remoteVideo} autoPlay/>
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
