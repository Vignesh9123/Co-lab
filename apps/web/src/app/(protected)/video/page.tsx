'use client'
import { useAuthStore } from '@/zustand/auth'
import React, {useState, useEffect, useRef} from 'react'
import { useRouter } from 'next/navigation'
function Video() {
  const [myStream, setMyStream] = useState<MediaStream | null>(null)
  const [_, setRemoteStream] = useState<MediaStream | null>(null)
  const [socket, setSocket] = useState<WebSocket | null>(null)
  const myVideo = useRef<HTMLVideoElement>(null)
  const remoteVideo = useRef<HTMLVideoElement>(null)
  const {user, loading} = useAuthStore()
  const router = useRouter()
  const peerConnection = useRef<RTCPeerConnection | null>(null)

  
  
  const createPeer = () => {
    const peer = new RTCPeerConnection(
      {
        iceServers: [
          { urls: 'stun:stun.l.google.com:19302' },
        ]
      }
    )
    peerConnection.current = peer
    
    peer.onicecandidate = ({candidate})=>{
      if(!candidate) return
      socket?.send(JSON.stringify({
        type: 'iceCandidate',
        iceCandidate: candidate,
        roomId: '1',
        from: user?.id
      }))
    }
    
    peer.ontrack = (ev)=>{
      setRemoteStream(ev.streams[0]);
      remoteVideo.current!.srcObject = ev.streams[0]
    }
  }
  
  useEffect(() => {
     if(!user && !loading ){
       router.push('/signin');
     }
   }, [user, router, loading])

  useEffect(() => {
    navigator.mediaDevices.getUserMedia({video: true, audio: true}).then(stream => {
      setMyStream(stream)
      myVideo.current!.srcObject = stream
    })

    const wsocket = new WebSocket('ws://localhost:8000')
    setSocket(wsocket)
  }, [])


  useEffect(() => {
    if (socket && myStream && peerConnection.current) {
      myStream.getTracks().forEach(track => {
        peerConnection.current!.addTrack(track, myStream);
      });
    }
  }, [socket, myStream]);

  const startCall = () => {
    if (!peerConnection.current) return;
    peerConnection.current!.createOffer().then(offer => {
      console.log('Sending offer', offer)
      peerConnection.current!.setLocalDescription(offer)
      socket?.send(JSON.stringify({
        type: 'offer',
        offer: offer,
        roomId: '1',
        from: user?.id
      }))
    })
  }

  useEffect(()=>{
    if(!socket) return;

    socket.onopen = ()=>{
      createPeer()
      socket?.send(JSON.stringify({
        type: 'join-room',
        roomId: '1',
        from: user?.id
      }))
    }

    socket.onmessage = (m)=>{
      const message = JSON.parse(m.data)
      if(message.type == "offer"){
        if (!peerConnection.current) return;
        console.log("Received offer", message)
        peerConnection.current!.setRemoteDescription(new RTCSessionDescription(message.offer))
        peerConnection.current!.createAnswer().then(answer => {
          peerConnection.current!.setLocalDescription(answer)
          console.log("Sending answer", answer)
          socket?.send(JSON.stringify({
            type: 'answer',
            answer: answer,
            roomId: '1',
            from: user?.id
          }))
        })
      }
      if(message.type == "answer"){
        if (!peerConnection.current) return;
        console.log("Received ans", message)
        peerConnection.current!.setRemoteDescription(new RTCSessionDescription(message.answer))
      }
      if(message.type == "iceCandidate"){
        if (!peerConnection.current) return;
        peerConnection.current!.addIceCandidate(new RTCIceCandidate(message.iceCandidate))
      }
    }
  }, [socket])
  return (
    <div>
      Video
      <video className='border border-red-600' ref={myVideo} autoPlay muted />
      <video className='border border-green-600' ref={remoteVideo} autoPlay muted/>
      <button onClick={startCall}>Start Call</button>
    </div>
  )
}

export default Video
