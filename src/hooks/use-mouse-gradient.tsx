"use client"
import { useState, useEffect } from 'react';
import useIsMobile from "@/hooks/use-mobile";

export default function UseMouseGradient() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (event: MouseEvent) => {
      setMousePosition({ x: event.clientX, y: event.clientY });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  const gradientStyle = {
    background: `radial-gradient(300px at ${mousePosition.x}px ${mousePosition.y}px, hsl(var(--primary) / 0.3), transparent 80%)`,
  };

  return (
    <div
        className={`${!useIsMobile()?"block":"hidden"} absolute inset-0 transition duration-300 ease-in-out`}
        style={gradientStyle}
        aria-hidden="true"
    />
  );
}

