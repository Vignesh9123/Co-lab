'use client'
import React, { useEffect, useRef } from 'react'
import Editor from '@monaco-editor/react';
import { useSocketStore } from '@/zustand/socket';
import { useAuthStore } from '@/zustand/auth';
import { useCodeStore } from '@/zustand/code';
import {useDebouncedCallback} from 'use-debounce'
function Code() {
  const socket = useSocketStore((state) => state.socket);
  const setSocket = useSocketStore((state) => state.setSocket);
  const {user} = useAuthStore()
  const code = useCodeStore((state) => state.code);
  const setCode = useCodeStore((state) => state.setCode);
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

  useEffect(() => {
    if (!user?.id) return;

    connectSocket(); // Initial connection

    return () => {
      socket?.close();
      if (reconnectIntervalRef.current) clearInterval(reconnectIntervalRef.current);
    };
  }, [user?.id]);

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
    <div>
      Code<Editor
      height="90vh"
      defaultLanguage="javascript"
      defaultValue="// some comment"
      theme='vs-dark'
      onChange={debounced}
      value={code}
      
      // onMount={handleEditorDidMount}
    />
    </div>
  )
}

export default Code
