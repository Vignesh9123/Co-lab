import { VideoState } from '@repo/types'
import {create} from 'zustand'

export const useVideoStore = create<VideoState>()((set) => ({
    peerConnection: null,
    setPeerConnection: (p) => set({peerConnection: p}),
    myStream: null,
    setMyStream: (s) => set({myStream: s}),
    remoteStream: null,
    setRemoteStream: (s) => set({remoteStream: s})
}))