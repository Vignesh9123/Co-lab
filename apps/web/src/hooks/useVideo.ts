'use client'
import { useRef } from "react"
function useVideo() {
    const peer = useRef(null)
  return (
   {
    peer: peer.current
   }
  )
}

export default useVideo
