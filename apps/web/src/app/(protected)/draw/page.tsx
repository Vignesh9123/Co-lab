'use client';
import React, { useEffect, useRef, useState } from 'react';

interface Shape {
  x: number;
  y: number;
  w: number;
  h: number;
}

function Draw() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [shapes, setShapes] = useState<Shape[]>([]);
  const [drawing, setDrawing] = useState<boolean>(false);
  const [start, setStart] = useState<{ x: number; y: number } | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const resizeCanvas = () => {
      canvas.width = window.innerWidth - 100;
      canvas.height = window.innerHeight;
      redrawAllShapes();
    };

    window.addEventListener('resize', resizeCanvas);
    resizeCanvas();

    return () => {
      window.removeEventListener('resize', resizeCanvas);
    };
  }, []);

  const redrawAllShapes = () => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!ctx || !canvas) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    ctx.strokeStyle = 'red';
    shapes.forEach((shape) => {
      ctx.strokeRect(shape.x, shape.y, shape.w, shape.h);
    });
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const handleMouseDown = (e: MouseEvent) => {
      setStart({ x: e.clientX - 60, y: e.clientY });
      setDrawing(true);
    };

    const handleMouseMove = (e: MouseEvent) => {
      if (!drawing || !start) return;

      ctx.clearRect(0, 0, canvas.width, canvas.height);
      redrawAllShapes(); 

      ctx.strokeStyle = 'red';
      ctx.strokeRect(start.x, start.y, e.clientX - start.x - 50, e.clientY - start.y);
    };

    const handleMouseUp = (e: MouseEvent) => {
      if (!drawing || !start) return;

      setShapes((prev) => [
        ...prev,
        {
          x: start.x,
          y: start.y,
          w: e.clientX - start.x - 50,
          h: e.clientY - start.y,
        },
      ]);
      setDrawing(false);
      setStart(null);
    };

    canvas.addEventListener('mousedown', handleMouseDown);
    canvas.addEventListener('mousemove', handleMouseMove);
    canvas.addEventListener('mouseup', handleMouseUp);

    return () => {
      canvas.removeEventListener('mousedown', handleMouseDown);
      canvas.removeEventListener('mousemove', handleMouseMove);
      canvas.removeEventListener('mouseup', handleMouseUp);
    };
  }, [drawing, start, shapes]);

  useEffect(() => {
    redrawAllShapes();
  }, [shapes]);

  return (
    <div className="w-full h-screen">
      <canvas className="block" ref={canvasRef} />
    </div>
  );
}

export default Draw;
