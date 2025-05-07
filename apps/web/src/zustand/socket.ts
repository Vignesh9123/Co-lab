import { SocketState } from '@repo/types'
import {create} from 'zustand'

export const useSocketStore = create<SocketState>()((set)=>(
    {
        socket: null,
        setSocket:(s: WebSocket)=>set({socket: s})
    }
))