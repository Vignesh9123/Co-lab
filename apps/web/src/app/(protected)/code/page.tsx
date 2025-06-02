'use client'
import React, { useEffect } from 'react'
import Editor from '@monaco-editor/react';
import { useSocketStore } from '@/zustand/socket';
import { useAuthStore } from '@/zustand/auth';
function Code() {
  const socket = useSocketStore((state) => state.socket);
  const setSocket = useSocketStore((state) => state.setSocket);
  const {user} = useAuthStore()
  const [code, setCode] = React.useState<string>('');
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
    }
  }, [socket])

  const handleChange = (value: string | undefined) => {
    if(!socket) {
      console.log('socket is null')
      return
    }
    if(value === undefined) return
    setCode(value)
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
