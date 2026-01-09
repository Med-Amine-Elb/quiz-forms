"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";

interface WelcomeMessageProps {
  onComplete: () => void;
}

export default function WelcomeMessage({ onComplete }: WelcomeMessageProps) {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    // Display for 2 seconds, then fade out
    const timer = setTimeout(() => {
      setIsVisible(false);
      // Call onComplete after fade out animation completes (0.5s)
      setTimeout(onComplete, 500);
    }, 2000);

    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <AnimatePresence mode="wait">
      {isVisible && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ 
            duration: 0.5,
            ease: [0.16, 1, 0.3, 1]
          }}
          className="fixed inset-0 flex items-center justify-center z-[101] pointer-events-none"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 30 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -20 }}
            transition={{
              duration: 0.6,
              ease: [0.16, 1, 0.3, 1],
            }}
            className="relative rounded-3xl p-12 shadow-2xl backdrop-blur-2xl border-2 pointer-events-auto"
            style={{
              background: `linear-gradient(135deg, rgba(255, 255, 255, 0.98), rgba(255, 255, 255, 0.95))`,
              borderColor: `#0EA5E940`,
              boxShadow: `0 25px 80px #0EA5E925, 0 0 0 1px #0EA5E915`,
            }}
          >
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-5xl sm:text-6xl font-bold font-inter text-center mb-4"
              style={{ color: '#0EA5E9' }}
            >
              Bienvenue!
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="text-xl text-gray-700 font-inter text-center"
            >
              Commençons votre parcours
            </motion.p>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}


