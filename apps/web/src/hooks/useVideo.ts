'use client'
import { useAuthStore } from "@/zustand/auth"
import { useSocketStore } from "@/zustand/socket"
import { useEffect, useRef, useState } from "react"
function useVideo() {

  // TODO: Move socket to context
  // TODO: Move streams to context too as it may be required in other pages
  const peerConnection = useRef<RTCPeerConnection>(null)
  const socket = useSocketStore((state)=> state.socket) 
  const setSocket = useSocketStore((state)=> state.setSocket) 
  const {user} = useAuthStore()
  const myVideo = useRef<HTMLVideoElement>(null)
  const remoteVideo = useRef<HTMLVideoElement>(null)
  const [myStream, setMyStream] = useState<MediaStream | null>(null)
  const [_, setRemoteStream] = useState<MediaStream | null>(null)

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
  const handleStopStream = () => {
    myStream?.getTracks().forEach(track => track.enabled = false);
    myVideo.current!.srcObject = null;
  };

  const handleResumeStream = () => {
    myStream?.getTracks().forEach(track =>track.enabled = true);
    myVideo.current!.srcObject = myStream;
  };

  const handleMuteAudio = ()=>{
    if(!myStream) return
    myStream.getAudioTracks().forEach(track => track.enabled = false);
  }
  const handleUnmuteAudio = ()=>{
    if(!myStream) return
    myStream.getAudioTracks().forEach(track => track.enabled = true);
  }

  const handleMuteVideo = ()=>{
    if(!myStream) return
    myStream.getVideoTracks().forEach(track => track.enabled = false);
  }
  const handleUnmuteVideo = ()=>{
    if(!myStream) return
    myStream.getVideoTracks().forEach(track => track.enabled = true);
  }

  useEffect(() => {
    navigator.mediaDevices.getUserMedia({video: true, audio: true}).then(stream => {
      setMyStream(stream)
      myVideo.current!.srcObject = stream
    })
    if(!socket){
      const wsocket = new WebSocket('ws://localhost:8000')
      setSocket(wsocket)
    }
  }, [])

  useEffect(() => {
    if (socket && myStream && peerConnection.current) {
      myStream.getTracks().forEach(track => {
        if(peerConnection.current)
          peerConnection.current.addTrack(track, myStream);
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
   {
    peer: peerConnection.current,
    createPeer,
    handleMuteAudio,
    handleMuteVideo,
    handleStopStream,
    handleResumeStream,
    handleUnmuteAudio,
    handleUnmuteVideo,
    myVideo,
    remoteVideo,
    startCall
   }
  )
}

export default useVideo
