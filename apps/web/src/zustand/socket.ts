import {create} from 'zustand'

export const socketStore = create()((set)=>(
    {
        socket: null,
        setSocket:(s: WebSocket)=>set({socket: s})
    }
))