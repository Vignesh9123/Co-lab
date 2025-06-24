'use client'
import React, { useEffect, useRef, useState } from 'react'
import Editor from '@monaco-editor/react';
import { useSocketStore } from '@/zustand/socket';
import { useAuthStore } from '@/zustand/auth';
import { useCodeStore } from '@/zustand/code';
import {useDebouncedCallback} from 'use-debounce'
import { Button } from '@/components/ui/button';
function Code() {
  const socket = useSocketStore((state) => state.socket);
  const setSocket = useSocketStore((state) => state.setSocket);
  const {user} = useAuthStore()
  const code = useCodeStore((state) => state.code);
  const setCode = useCodeStore((state) => state.setCode);
   const [editorHeight, setEditorHeight] = useState("90vh")
  // const socketReconnectionInterval = useRef<NodeJS.Timeout>(null)
  // useEffect(()=>{
    //   if(!socket) return
    
    
    
    // }, [])
    const reconnectIntervalRef = useRef<NodeJS.Timeout>(null);
    const reconnectDelay = useRef(1000); // exponential backoff
    
    // TODO: Use socketstore
  const connectSocket = () => {
    console.log("Connecting to socket...");
    const ws = new WebSocket('ws://localhost:8000');
    setSocket(ws);
  };


  
  useEffect(()=>{
    if(!socket){
      connectSocket()
    }
    return () => {
      socket?.close();
      if (reconnectIntervalRef.current) clearInterval(reconnectIntervalRef.current);
    };
}, [socket])

  useEffect(()=>{
    return () => {
      socket?.close();
      if (reconnectIntervalRef.current) clearInterval(reconnectIntervalRef.current);
    };
  }, [])

  useEffect(() => {
    if (!socket) return;

    socket.onopen = () => {
      console.log('socket opened');
      reconnectDelay.current = 1000; // Reset backoff
      socket.send(JSON.stringify({
        type: 'join-room',
        roomId: '1',
        from: user?.id
      }));
    };

    socket.onmessage = (m) => {
      const message = JSON.parse(m.data);
      if (message.type === "code") {
        setCode(message.code); 
      }
    };

    socket.onclose = () => {
      console.log('socket closed');
      if (reconnectIntervalRef.current) clearInterval(reconnectIntervalRef.current);
      reconnectIntervalRef.current = setTimeout(() => {
        reconnectDelay.current = Math.min(reconnectDelay.current * 2, 30000); // exponential backoff
        connectSocket();
      }, reconnectDelay.current);
    };

    socket.onerror = (err) => {
      console.log('Socket error', err);
      socket.close(); 
    };
  }, [socket]);

  const debounced = useDebouncedCallback((value: string | undefined) => {
    if(!socket) {
      console.log('socket is null')
      return
    }
    if(value === undefined) return
    setCode(value)
    if(socket.readyState !== socket.OPEN) return
    socket.send(JSON.stringify({type: 'code', code: value}))
  }, 1000)
  return (
    <div className='flex items-start p-10'>
    
    <div className='bg-muted h-[90vh] w-[50%]'>
        <div className='flex justify-center gap-2 p-2'>
          <Button>Run</Button>
          <Button variant={"outline"}>Submit</Button>
          <Button onClick={()=>setEditorHeight((prev)=>{if(prev == "50vh") return "90vh"; else return "50vh"})}>
              {editorHeight == "50vh"?"Close Terminal":"Open Terminal"}
          </Button>
        </div>
        <hr/>

    </div>
    <div className='w-[50%]'>
      <Editor
      height={editorHeight}
      defaultLanguage="javascript"
      defaultValue="// some comment"
      theme='vs-dark'
      onChange={debounced}
      value={code}
      
      // onMount={handleEditorDidMount}
    />
    {editorHeight == "50vh" && <div className='h-[40vh] w-full bg-muted'>
      <h1>I am Terminal</h1>
      </div>}
    </div>
      </div>
  )
}

export default Code