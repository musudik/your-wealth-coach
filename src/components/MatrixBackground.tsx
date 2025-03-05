import { useEffect, useRef } from "react";

const MatrixBackground = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    // Set canvas dimensions to match the parent container
    const setCanvasDimensions = () => {
      const parent = canvas.parentElement;
      if (parent) {
        canvas.width = parent.offsetWidth;
        canvas.height = parent.offsetHeight;
      } else {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
      }
    };
    
    setCanvasDimensions();
    window.addEventListener('resize', setCanvasDimensions);
    
    // Matrix rain effect
    const fontSize = 14;
    const columns = Math.floor(canvas.width / fontSize);
    const drops: number[] = [];
    
    // Initialize drops
    for (let i = 0; i < columns; i++) {
      drops[i] = Math.random() * -100;
    }
    
    // Currency symbols from around the world
    const currencySymbols = [
      "€", "$", "£", "¥", "₹", "₽", "₩", "₴", "₦", "₱", 
      "฿", "₫", "₲", "₪", "₡", "₢", "₣", "₤", "₥", "₧", 
      "₨", "₭", "₮", "₯", "₰", "₺", "₼", "₾", "₸", "₿"
    ];
    
    // Digital particles
    const particles: {
      x: number;
      y: number;
      size: number;
      speed: number;
      opacity: number;
      color: string;
    }[] = [];
    
    // Create particles
    for (let i = 0; i < 100; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        size: Math.random() * 3 + 1,
        speed: Math.random() * 1 + 0.2,
        opacity: Math.random() * 0.5 + 0.1,
        color: i % 5 === 0 ? "#4f46e5" : i % 5 === 1 ? "#0ea5e9" : "#ffffff"
      });
    }
    
    // Connection lines
    const connections: {
      x1: number;
      y1: number;
      x2: number;
      y2: number;
      opacity: number;
    }[] = [];
    
    // Create connections
    for (let i = 0; i < 20; i++) {
      connections.push({
        x1: Math.random() * canvas.width,
        y1: Math.random() * canvas.height,
        x2: Math.random() * canvas.width,
        y2: Math.random() * canvas.height,
        opacity: Math.random() * 0.15 + 0.05
      });
    }
    
    // Animation loop
    const draw = () => {
      // Semi-transparent black background to create trail effect
      ctx.fillStyle = "rgba(0, 10, 30, 0.05)";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      // Draw matrix rain with currency symbols
      ctx.font = `${fontSize}px monospace`;
      
      for (let i = 0; i < drops.length; i++) {
        // Random currency symbol
        const symbol = currencySymbols[Math.floor(Math.random() * currencySymbols.length)];
        
        // x coordinate of the drop
        const x = i * fontSize;
        // y coordinate of the drop, +fontSize for the character size
        const y = drops[i] * fontSize;
        
        // Varying colors for different currency symbols
        const colorIndex = Math.floor(Math.random() * 6);
        if (colorIndex === 0) {
          ctx.fillStyle = `rgba(14, 165, 233, ${Math.random() * 0.5 + 0.3})`; // Blue
        } else if (colorIndex === 1) {
          ctx.fillStyle = `rgba(16, 185, 129, ${Math.random() * 0.5 + 0.3})`; // Green
        } else if (colorIndex === 2) {
          ctx.fillStyle = `rgba(245, 158, 11, ${Math.random() * 0.5 + 0.3})`; // Amber
        } else if (colorIndex === 3) {
          ctx.fillStyle = `rgba(168, 85, 247, ${Math.random() * 0.5 + 0.3})`; // Purple
        } else if (colorIndex === 4) {
          ctx.fillStyle = `rgba(255, 255, 255, ${Math.random() * 0.5 + 0.3})`; // White
        } else {
          ctx.fillStyle = `rgba(255, 0, 0, ${Math.random() * 0.5 + 0.3})`; // Red
        }
        
        ctx.fillText(symbol, x, y);
        
        // Sending the drop back to the top randomly after it crosses the screen
        if (y > canvas.height && Math.random() > 0.975) {
          drops[i] = 0;
        }
        
        // Move drops down
        drops[i]++;
      }
      
      // // Update and draw particles
      // for (let i = 0; i < particles.length; i++) {
      //   const p = particles[i];
      //   p.y += p.speed;
        
      //   // Reset particle if it goes off screen
      //   if (p.y > canvas.height) {
      //     p.y = 0;
      //     p.x = Math.random() * canvas.width;
      //   }
        
      //   // Draw particle
      //   ctx.beginPath();
      //   ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      //   ctx.fillStyle = `rgba(${p.color.replace('#', '').match(/.{2}/g)?.map(hex => parseInt(hex, 16)).join(', ') || '255, 255, 255'}, ${p.opacity})`;
      //   ctx.fill();
      // }
      
      // // Update and draw connections
      // for (let i = 0; i < connections.length; i++) {
      //   const c = connections[i];
      //   const p1 = particles[Math.floor(Math.random() * particles.length)];
      //   const p2 = particles[Math.floor(Math.random() * particles.length)];
        
      //   // Update connection points occasionally
      //   if (Math.random() > 0.99) {
      //     c.x1 = p1.x;
      //     c.y1 = p1.y;
      //     c.x2 = p2.x;
      //     c.y2 = p2.y;
      //   }
        
      //   // Draw connection line
      //   ctx.beginPath();
      //   ctx.moveTo(c.x1, c.y1);
      //   ctx.lineTo(c.x2, c.y2);
      //   ctx.strokeStyle = `rgba(255, 255, 255, ${c.opacity})`;
      //   ctx.stroke();
      // }
      
      requestAnimationFrame(draw);
    };
    
    const animationId = requestAnimationFrame(draw);
    
    // Cleanup
    return () => {
      window.removeEventListener('resize', setCanvasDimensions);
      cancelAnimationFrame(animationId);
    };
  }, []);
  
  return (
    <canvas 
      ref={canvasRef} 
      style={{ 
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        filter: 'blur(0.5px)',
        opacity: 0.8,
        zIndex: 1
      }}
    />
  );
};

export default MatrixBackground;