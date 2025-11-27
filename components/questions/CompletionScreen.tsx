"use client";

import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle2, Sparkles } from "lucide-react";
import gsap from "gsap";

interface CompletionScreenProps {
  onReturnToStart: () => void;
}

export default function CompletionScreen({ onReturnToStart }: CompletionScreenProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const confettiRef = useRef<HTMLDivElement>(null);
  const [showConfetti, setShowConfetti] = useState(true);

  useEffect(() => {
    // Create confetti animation
    if (confettiRef.current && showConfetti) {
      const colors = ['#10B981', '#06B6D4', '#8B5CF6', '#F59E0B', '#EF4444'];
      const confettiCount = 50;

      for (let i = 0; i < confettiCount; i++) {
        const confetti = document.createElement('div');
        confetti.style.position = 'fixed';
        confetti.style.width = `${Math.random() * 12 + 6}px`;
        confetti.style.height = `${Math.random() * 12 + 6}px`;
        confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
        confetti.style.left = `${Math.random() * 100}%`;
        confetti.style.top = '-10px';
        confetti.style.borderRadius = Math.random() > 0.5 ? '50%' : '0';
        confetti.style.pointerEvents = 'none';
        confetti.style.zIndex = '9999';
        confetti.style.opacity = '0.9';
        
        document.body.appendChild(confetti);

        const animation = confetti.animate(
          [
            {
              transform: `translateY(0) rotate(0deg)`,
              opacity: 1,
            },
            {
              transform: `translateY(${window.innerHeight + 100}px) rotate(${Math.random() * 720}deg)`,
              opacity: 0,
            },
          ],
          {
            duration: Math.random() * 2000 + 2000,
            easing: 'cubic-bezier(0.5, 0, 0.5, 1)',
            delay: Math.random() * 500,
          }
        );

        animation.onfinish = () => confetti.remove();
      }

      // Stop confetti after 3 seconds
      setTimeout(() => setShowConfetti(false), 3000);
    }
  }, [showConfetti]);

  return (
    <motion.div
      ref={containerRef}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.8, ease: 'easeInOut' }}
      className="absolute inset-0 w-full h-full flex items-center justify-center overflow-hidden"
      style={{
        zIndex: 10,
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      }}
    >
      {/* Animated background gradient */}
      <motion.div
        className="absolute inset-0"
        animate={{
          background: [
            'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            'linear-gradient(135deg, #764ba2 0%, #667eea 100%)',
            'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          ],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      />

      {/* Confetti container */}
      <div ref={confettiRef} />

      {/* Content */}
      <div className="relative z-10 w-full max-w-3xl mx-auto px-6 py-12 text-center">
        <AnimatePresence mode="wait">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -30 }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
            className="space-y-8"
          >
            {/* Success Icon */}
            <motion.div
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{
                type: "spring",
                stiffness: 200,
                damping: 15,
                delay: 0.2,
              }}
              className="flex justify-center"
            >
              <div className="relative">
                <motion.div
                  animate={{
                    scale: [1, 1.1, 1],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: 'easeInOut',
                  }}
                  className="w-24 h-24 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center border-4 border-white/30"
                >
                  <CheckCircle2 className="w-14 h-14 text-white" strokeWidth={2.5} />
                </motion.div>
                <motion.div
                  animate={{
                    rotate: 360,
                  }}
                  transition={{
                    duration: 20,
                    repeat: Infinity,
                    ease: 'linear',
                  }}
                  className="absolute inset-0 flex items-center justify-center"
                >
                  <Sparkles className="w-6 h-6 text-white/60" />
                </motion.div>
              </div>
            </motion.div>

            {/* Main Message */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4, duration: 0.6 }}
              className="space-y-4"
            >
              <h1 className="text-5xl sm:text-6xl font-bold text-white font-inter leading-tight">
                Merci pour votre participation
              </h1>
              <motion.p
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6, duration: 0.6 }}
                className="text-xl sm:text-2xl text-white/90 font-inter font-medium"
              >
                Votre avis illumine 2025
              </motion.p>
            </motion.div>

            {/* Sub Message */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8, duration: 0.6 }}
              className="space-y-6"
            >
              <p className="text-lg text-white/80 font-inter max-w-2xl mx-auto leading-relaxed">
                Vos réponses ont été enregistrées avec succès. 
                Votre contribution nous aide à améliorer continuellement nos services IT 
                et à créer une expérience encore plus fluide pour toute l'équipe SBM.
              </p>

              {/* Decorative line */}
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: '100%' }}
                transition={{ delay: 1, duration: 0.8, ease: 'easeOut' }}
                className="h-px bg-white/30 mx-auto max-w-md"
              />
            </motion.div>

            {/* Return Button */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.2, duration: 0.6 }}
              className="pt-4"
            >
              <motion.button
                onClick={onReturnToStart}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-8 py-4 rounded-2xl bg-white text-gray-900 font-bold text-lg shadow-xl hover:shadow-2xl transition-all duration-300 font-inter"
              >
                Retour à l'accueil
              </motion.button>
            </motion.div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Floating particles */}
      {typeof window !== 'undefined' && [...Array(20)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-2 h-2 bg-white/20 rounded-full"
          initial={{
            x: Math.random() * (typeof window !== 'undefined' ? window.innerWidth : 1920),
            y: (typeof window !== 'undefined' ? window.innerHeight : 1080) + 20,
            opacity: 0,
          }}
          animate={{
            y: -20,
            opacity: [0, 1, 0],
          }}
          transition={{
            duration: Math.random() * 3 + 2,
            repeat: Infinity,
            delay: Math.random() * 2,
            ease: 'linear',
          }}
        />
      ))}
    </motion.div>
  );
}

