'use client'
import React, { useEffect, useRef} from 'react'
import {useVideoStore} from '@/zustand/video'
import useVideo from '@/hooks/useVideo'
import { Button } from './ui/button'
function VideoChat() {
  const {myVideo, remoteVideo, handleMuteVideo, handleMuteAudio, handleResumeStream, handleStopStream, handleUnmuteAudio, handleUnmuteVideo, startCall} = useVideo()
  const {myStream, setMyStream, peerConnection, remoteStream} = useVideoStore()

  useEffect(() => {
    if(!myStream || !peerConnection || !remoteStream) return
    myVideo.current!.srcObject = myStream
    remoteVideo.current!.srcObject = remoteStream

    peerConnection.ontrack = (e) => {
      remoteVideo.current!.srcObject = e.streams[0]
    }


  }, [myStream, setMyStream, peerConnection])
  return (
    <div>
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

export default VideoChat
