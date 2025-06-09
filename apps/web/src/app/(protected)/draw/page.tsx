'use client'
import { div } from 'motion/react-client';
import React, { useEffect } from 'react'

function Draw() {
  useEffect(() => {
    const canvas = document.getElementById("canvas") as HTMLCanvasElement;
const ctx = canvas?.getContext("2d");
if(!ctx) return
window.addEventListener('resize', resizeCanvas, false);
        
function resizeCanvas() {
  canvas.width = window.innerWidth - 50;
  canvas.height = window.innerHeight;
    
}

resizeCanvas();
ctx.strokeStyle = "red";
    let initialX;
    let initialY;
    let clicked = false;
    window.addEventListener("mousedown", (e) => {
      clicked = true;
      initialX = e.clientX;
      initialY = e.clientY;
    })
    window.addEventListener("mousemove", (e) => {
      if(clicked) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.strokeRect(initialX, initialY, e.clientX - initialX, e.clientY - initialY);
      }
    })
    window.addEventListener("mouseup", () => {
      clicked = false;
    })
  }, [])
  return (
    <div className='w-full h-screen'>

    <canvas className='block' id="canvas">

    </canvas>
    </div>
  )
}

export default Draw
