'use client'
import { useAuthStore } from "@/zustand/auth"
import { useSocketStore } from "@/zustand/socket"
import { useVideoStore } from "@/zustand/video"
import { useEffect, useRef, useState } from "react"
function useVideo() {

  // TODO: Move socket to context
  // TODO: Move streams to context too as it may be required in other pages
  const peerConnection = useVideoStore((state)=> state.peerConnection)
  const setPeerConnection = useVideoStore((state)=> state.setPeerConnection)
  const socket = useSocketStore((state)=> state.socket) 
  const setSocket = useSocketStore((state)=> state.setSocket) 
  const {user} = useAuthStore()
  const myVideo = useRef<HTMLVideoElement>(null)
  const remoteVideo = useRef<HTMLVideoElement>(null)
  // const [myStream, setMyStream] = useState<MediaStream | null>(null)
  const myStream = useVideoStore((state)=> state.myStream)
  const setMyStream = useVideoStore((state)=> state.setMyStream)
  // const [_, setRemoteStream] = useState<MediaStream | null>(null)
  const  setRemoteStream = useVideoStore((state)=> state.setRemoteStream)

  const createPeer = () => {
    console.log('createPeer')
    if(!socket) {
      console.log('socket is null')
      return
    }
    console.log('creatingPeer')
    const peer = new RTCPeerConnection(
      {
        iceServers: [
          { urls: 'stun:stun.l.google.com:19302' },
        ]
      }
    )
    setPeerConnection(peer)
    peer.onicecandidate = ({candidate})=>{
      if(!candidate) return
      socket?.send(JSON.stringify({
        type: 'iceCandidate',
        iceCandidate: candidate,
        roomId: '1',
        from: user?.id
      }))
    }
    
    if(!remoteVideo.current) {
      console.log('remoteVideo is null')
      return
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
    if(!myStream) {
      console.log('myStream is null')
      return
    }
    myStream.getVideoTracks().forEach(track => track.enabled = false);
  }
  const handleUnmuteVideo = ()=>{
    if(!myStream) return
    myStream.getVideoTracks().forEach(track => track.enabled = true);
  }

  useEffect(() => {
    navigator.mediaDevices.getUserMedia({video: true, audio: true}).then(stream => {
      setMyStream(stream)
      if(!myVideo.current) return
      myVideo.current!.srcObject = stream
    })
    if(!socket){
      const wsocket = new WebSocket('ws://localhost:8000')
      setSocket(wsocket)
    }
  }, [])

  useEffect(() => {
    if(peerConnection && peerConnection.getSenders().length > 0){
      return
    }
    if (socket && myStream && peerConnection) {
      myStream.getTracks().forEach(track => {
          peerConnection.addTrack(track, myStream);
      });
    }
  }, [socket, myStream]);

  const startCall = () => {
    if (!peerConnection) return;
    peerConnection.createOffer().then(offer => {
      console.log('Sending offer', offer)
      peerConnection.setLocalDescription(offer)
      socket?.send(JSON.stringify({
        type: 'offer',
        offer: offer,
        roomId: '1',
        from: user?.id
      }))
    })
  }

  useEffect(() => {
    console.log('myVideo', myVideo.current)
    if(!myVideo.current || !remoteVideo.current || !socket) return
    console.log('remoteVideo', remoteVideo.current)
    // if(!peerConnection) return;
    console.log('peerConnection', peerConnection)
    createPeer()
  }, [myVideo, socket])
  useEffect(()=>{
    if(!socket) return;

    socket.onopen = ()=>{
      socket?.send(JSON.stringify({
        type: 'join-room',
        roomId: '1',
        from: user?.id
      }))
    }

    socket.onmessage = (m)=>{
      const message = JSON.parse(m.data)
      if(message.type == "offer"){
        const peerConnection = useVideoStore.getState().peerConnection
        if (!peerConnection) return;
        console.log("Received offer", message)
        peerConnection.setRemoteDescription(new RTCSessionDescription(message.offer))
        peerConnection.createAnswer().then(answer => {
          peerConnection.setLocalDescription(answer)
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
        const peerConnection = useVideoStore.getState().peerConnection
        if (!peerConnection) return;
        console.log("Received ans", message)
        peerConnection.setRemoteDescription(new RTCSessionDescription(message.answer))
      }
      if(message.type == "iceCandidate"){
        const peerConnection = useVideoStore.getState().peerConnection
        if (!peerConnection) return;
        peerConnection.addIceCandidate(new RTCIceCandidate(message.iceCandidate))
      }
    }
  }, [socket])
  return (
   {
    peer: peerConnection,
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
