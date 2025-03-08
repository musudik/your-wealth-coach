import { useRef, useState, useEffect } from 'react';

export function useSignature() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [hasSignature, setHasSignature] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas size to match its display size
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width;
    canvas.height = rect.height;

    ctx.strokeStyle = '#000';
    ctx.lineWidth = 2;
    ctx.lineCap = 'round';
  }, []);

  const startDrawing = (e: React.MouseEvent | React.TouchEvent) => {
    setIsDrawing(true);
    setHasSignature(true);

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const x = e.type.includes('mouse') 
      ? (e as React.MouseEvent).clientX - rect.left 
      : (e as React.TouchEvent).touches[0].clientX - rect.left;
    const y = e.type.includes('mouse') 
      ? (e as React.MouseEvent).clientY - rect.top 
      : (e as React.TouchEvent).touches[0].clientY - rect.top;

    ctx.beginPath();
    ctx.moveTo(x, y);
  };

  const draw = (e: React.MouseEvent | React.TouchEvent) => {
    if (!isDrawing) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const x = e.type.includes('mouse') 
      ? (e as React.MouseEvent).clientX - rect.left 
      : (e as React.TouchEvent).touches[0].clientX - rect.left;
    const y = e.type.includes('mouse') 
      ? (e as React.MouseEvent).clientY - rect.top 
      : (e as React.TouchEvent).touches[0].clientY - rect.top;

    ctx.lineTo(x, y);
    ctx.stroke();
  };

  const stopDrawing = () => {
    setIsDrawing(false);
  };

  const clear = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    setHasSignature(false);
  };

  const getSignatureData = () => {
    return canvasRef.current?.toDataURL('image/png');
  };

  return {
    canvasRef,
    startDrawing,
    draw,
    stopDrawing,
    clear,
    getSignatureData,
    hasSignature,
    setHasSignature
  };
}
