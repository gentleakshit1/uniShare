"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { motion } from "framer-motion";

export default function AnimatedBackground() {
  const cursorRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      gsap.to(cursorRef.current, {
        x: e.clientX,
        y: e.clientY,
        duration: 0.8,
        ease: "power2.out",
      });
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none -z-10 bg-white dark:bg-zinc-950 transition-colors duration-500">
      {/* GSAP Cursor Follower */}
      <div 
        ref={cursorRef} 
        className="fixed top-0 left-0 w-[600px] h-[600px] -ml-[300px] -mt-[300px] bg-blue-500/10 dark:bg-blue-500/5 rounded-full blur-[100px]"
      />
      
      {/* Framer Motion Static Orbs */}
      <motion.div 
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 2, repeat: Infinity, repeatType: "reverse" }}
        className="absolute top-1/4 right-1/4 w-[400px] h-[400px] bg-indigo-500/10 rounded-full blur-[80px]"
      />
    </div>
  );
}
