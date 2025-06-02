'use client'
import React, { useEffect, useRef } from 'react'
import Editor from '@monaco-editor/react';
import { useSocketStore } from '@/zustand/socket';
import { useAuthStore } from '@/zustand/auth';
import { useCodeStore } from '@/zustand/code';
function Code() {
  const socket = useSocketStore((state) => state.socket);
  const setSocket = useSocketStore((state) => state.setSocket);
  const {user} = useAuthStore()
  const code = useCodeStore((state) => state.code);
  const setCode = useCodeStore((state) => state.setCode);
  const socketReconnectionInterval = useRef<NodeJS.Timeout>(null)
  // useEffect(()=>{
  //   if(!socket) return

    
    
  // }, [])

  useEffect(()=>{
    if(!socket){
      setSocket(new WebSocket('ws://localhost:8000'))
      return
    }
    socket.onopen = ()=>{
      console.log('socket opened')
      if(socketReconnectionInterval.current) clearInterval(socketReconnectionInterval.current)
      socket?.send(JSON.stringify({
        type: 'join-room',
        roomId: '1',
        from: user?.id
      }))
    }
    
    socket.onmessage = (m)=>{
      const message = JSON.parse(m.data)
      if(message.type == "code"){
        setCode(message.code)
      }
    }

    socket.onclose = ()=>{
      console.log('socket closed')
      if(socketReconnectionInterval.current) clearInterval(socketReconnectionInterval.current)
      socketReconnectionInterval.current = setInterval(trySocketReconnection, 1000)
    }
  }, [socket])

  const trySocketReconnection = async() => { // TODO: Make this better as currently many reconnections are made and hence room is populated many times
    if(!socket || socket.readyState !== socket.OPEN) {
      console.log('Trying to reconnect')
      const newSocket = new WebSocket('ws://localhost:8000')
      // // const promise1 =()=> new Promise((resolve, reject) => {
      // //   newSocket.onopen = resolve
      // // })
      // const promise2 = ()=> new Promise((resolve, reject) => {
      //   setTimeout(resolve, 100)
      // })

      // // await Promise.race([promise1(), promise2()])
      // await promise2()
      if(newSocket.readyState === newSocket.CONNECTING) {
        setSocket(newSocket)
      }
    }
  }

  const handleChange = (value: string | undefined) => {
    if(!socket) {
      console.log('socket is null')
      return
    }
    if(value === undefined) return
    setCode(value)
    if(socket.readyState !== socket.OPEN) return
    socket.send(JSON.stringify({type: 'code', code: value}))
  }
  return (
    <div>
      Code<Editor
      height="90vh"
      defaultLanguage="javascript"
      defaultValue="// some comment"
      theme='vs-dark'
      onChange={handleChange}
      value={code}
      
      // onMount={handleEditorDidMount}
    />
    </div>
  )
}

export default Code
