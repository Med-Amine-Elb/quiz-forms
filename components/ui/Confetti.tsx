"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";

interface ConfettiProps {
  trigger: boolean;
  color?: string;
  particleCount?: number;
  duration?: number;
}

export default function Confetti({
  trigger,
  color = "#06b6d4",
  particleCount = 50,
  duration = 2000,
}: ConfettiProps) {
  const [particles, setParticles] = useState<Array<{ id: number; x: number; delay: number; size: number }>>([]);

  useEffect(() => {
    if (trigger) {
      // Generate random particles
      const newParticles = Array.from({ length: particleCount }, (_, i) => ({
        id: i,
        x: Math.random() * 100, // Random starting position (0-100%)
        delay: Math.random() * 0.3, // Stagger the animation
        size: Math.random() * 8 + 4, // Random size between 4-12px
      }));
      setParticles(newParticles);

      // Clear particles after animation
      const timer = setTimeout(() => {
        setParticles([]);
      }, duration);
      return () => clearTimeout(timer);
    }
  }, [trigger, particleCount, duration]);

  if (particles.length === 0) return null;

  return (
    <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
      {particles.map((particle) => (
        <motion.div
          key={particle.id}
          className="absolute"
          style={{
            left: `${particle.x}%`,
            top: '-10px',
            width: particle.size,
            height: particle.size,
            backgroundColor: color,
            borderRadius: Math.random() > 0.5 ? '50%' : '2px',
          }}
          initial={{
            y: 0,
            rotate: 0,
            opacity: 1,
          }}
          animate={{
            y: typeof window !== 'undefined' ? window.innerHeight + 100 : 800,
            rotate: 360 + Math.random() * 360,
            opacity: [1, 1, 0],
            x: (Math.random() - 0.5) * 100,
          }}
          transition={{
            duration: 2 + Math.random(),
            delay: particle.delay,
            ease: "easeOut",
          }}
        />
      ))}
    </div>
  );
}

