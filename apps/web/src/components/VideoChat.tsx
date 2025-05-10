'use client'
import React, { useEffect, useRef} from 'react'
import {useVideoStore} from '@/zustand/video'
import useVideo from '@/hooks/useVideo'
function VideoChat() {
  const {myVideo, remoteVideo} = useVideo()
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
      
    </div>
  )
}

export default VideoChat
