"use client";

import { motion, AnimatePresence } from "framer-motion";
import { QuestionSection, questionSections } from "@/lib/questionSections";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

interface SectionIntroProps {
  section: QuestionSection;
  onClose: () => void;
}

export default function SectionIntro({ section, onClose }: SectionIntroProps) {
  const [isVisible, setIsVisible] = useState(true);
  const sectionIndex = questionSections.findIndex((s) => s.id === section.id) + 1;
  // Calculate number of questions in this section
  const questionsCount = section.endQuestion - section.startQuestion + 1;
  
  // Debug: Log questions count
  if (process.env.NODE_ENV !== 'production') {
    console.log('SectionIntro - Section:', section.name, 'Questions Count:', questionsCount, 'Start:', section.startQuestion, 'End:', section.endQuestion);
  }

  useEffect(() => {
    // Auto-hide after 2.5 seconds
    const timer = setTimeout(() => {
      setIsVisible(false);
      // Call onClose after fade out animation completes (0.5s)
      setTimeout(onClose, 500);
    }, 2500);

    return () => clearTimeout(timer);
  }, [onClose]);

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
          className="fixed inset-0 flex items-center justify-center z-[100] pointer-events-none"
        >
          {/* Animated Background Overlay - More subtle and modern */}
          <motion.div
            initial={{ opacity: 0, scale: 1.1 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.6 }}
            className="absolute inset-0 backdrop-blur-xl"
            style={{
              background: `radial-gradient(ellipse at center, ${section.accent}08 0%, ${section.accent}03 40%, transparent 70%)`,
            }}
          />

          {/* Animated Gradient Orbs - Subtle background elements */}
          <motion.div
            className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full blur-3xl opacity-20"
            style={{
              background: `radial-gradient(circle, ${section.accent}40, transparent 70%)`,
            }}
            animate={{
              scale: [1, 1.2, 1],
              x: [0, 50, 0],
              y: [0, -30, 0],
            }}
            transition={{
              duration: 8,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
          <motion.div
            className="absolute bottom-1/4 right-1/4 w-80 h-80 rounded-full blur-3xl opacity-15"
            style={{
              background: `radial-gradient(circle, ${section.accent}30, transparent 70%)`,
            }}
            animate={{
              scale: [1, 1.3, 1],
              x: [0, -40, 0],
              y: [0, 40, 0],
            }}
            transition={{
              duration: 10,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 1,
            }}
          />

          {/* Main Card - Modern glassmorphism design */}
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -15, scale: 0.98 }}
            transition={{
              duration: 0.5,
              ease: [0.16, 1, 0.3, 1],
            }}
            className={cn(
              "relative rounded-[2rem] p-12 shadow-2xl backdrop-blur-2xl",
              "max-w-2xl w-full mx-4 pointer-events-auto",
              "transform-gpu border border-white/20",
              "before:absolute before:inset-0 before:rounded-[2rem] before:p-[1px]",
              "before:bg-gradient-to-br before:from-white/40 before:via-transparent before:to-transparent",
              "before:-z-10 before:opacity-50"
            )}
            style={{
              background: `linear-gradient(135deg, rgba(255, 255, 255, 0.7), rgba(255, 255, 255, 0.4))`,
              boxShadow: `
                0 20px 60px -12px ${section.accent}15,
                0 0 0 1px rgba(255, 255, 255, 0.5) inset,
                0 1px 2px rgba(0, 0, 0, 0.05)
              `,
            }}
          >
            {/* Subtle animated border glow */}
            <motion.div
              className="absolute inset-0 rounded-[2rem] -z-10"
              animate={{
                opacity: [0.3, 0.5, 0.3],
              }}
              transition={{
                duration: 4,
                repeat: Infinity,
                ease: "easeInOut",
              }}
              style={{
                background: `radial-gradient(circle at 50% 0%, ${section.accent}20, transparent 70%)`,
              }}
            />

            {/* Minimal floating particles - more subtle */}
            {[...Array(4)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute rounded-full opacity-10 z-0"
                style={{
                  width: Math.random() * 40 + 15,
                  height: Math.random() * 40 + 15,
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                  background: `radial-gradient(circle, ${section.accent}60, transparent)`,
                  zIndex: 0,
                }}
                animate={{
                  y: [0, -20, 0],
                  x: [0, Math.random() * 15 - 7.5, 0],
                  scale: [1, 1.1, 1],
                  opacity: [0.1, 0.2, 0.1],
                }}
                transition={{
                  duration: 4 + Math.random() * 2,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: i * 0.4,
                }}
              />
            ))}

            {/* Content Container */}
            <div className="relative z-10">
              {/* Section Header - Modern minimal design */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
                className="flex items-center justify-between mb-8"
              >
                {/* Left side: Icon and Section Number */}
                <div className="flex items-center gap-3">
                  {/* Animated Icon - More subtle */}
                  {section.icon && (
                    <motion.div
                      initial={{ scale: 0, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{
                        type: "spring",
                        stiffness: 300,
                        damping: 20,
                        delay: 0.2,
                      }}
                      className="text-5xl relative"
                    >
                      <motion.div
                        animate={{
                          rotate: [0, 5, -5, 0],
                        }}
                        transition={{
                          duration: 3,
                          repeat: Infinity,
                          ease: "easeInOut",
                          delay: 0.5,
                        }}
                      >
                        {section.icon}
                      </motion.div>
                    </motion.div>
                  )}

                  {/* Section Number Badge - Modern pill design */}
                  <motion.div
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{
                      type: "spring",
                      stiffness: 300,
                      damping: 20,
                      delay: 0.3,
                    }}
                    className="relative"
                  >
                    <div
                      className="px-4 py-1.5 rounded-full font-semibold text-xs font-inter text-white/90 relative overflow-hidden"
                      style={{
                        background: `linear-gradient(135deg, ${section.accent}, ${section.accent}E6)`,
                        boxShadow: `0 4px 12px ${section.accent}30`,
                      }}
                    >
                      {/* Subtle shimmer */}
                      <motion.div
                        className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
                        animate={{
                          x: ['-100%', '200%'],
                        }}
                        transition={{
                          duration: 3,
                          repeat: Infinity,
                          ease: "linear",
                          delay: 0.8,
                        }}
                      />
                      <span className="relative z-10 tracking-wider">SECTION {sectionIndex}</span>
                    </div>
                  </motion.div>
                </div>
              </motion.div>

              {/* Section Name - Clean typography */}
              <motion.h2
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.4 }}
                className="text-4xl font-bold font-inter mb-6 leading-tight tracking-tight"
                style={{ 
                  color: section.accent,
                  background: `linear-gradient(135deg, ${section.accent}, ${section.accent}CC)`,
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                }}
              >
                {section.name}
              </motion.h2>

              {/* Questions Count Indicator - Modern minimal design */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ 
                  duration: 0.5,
                  delay: 0.6 
                }}
                className="mb-6 flex items-center gap-2"
              >
                <div
                  className="px-5 py-2 rounded-full font-semibold text-sm font-inter relative"
                  style={{
                    background: `linear-gradient(135deg, ${section.accent}15, ${section.accent}08)`,
                    color: section.accent,
                    border: `1px solid ${section.accent}25`,
                  }}
                >
                  <span className="text-xl font-bold mr-2">{questionsCount}</span>
                  <span className="text-sm">
                    {questionsCount === 1 ? 'question' : 'questions'}
                  </span>
                </div>
              </motion.div>

              {/* Section Description - Clean and readable */}
              {section.description && (
                <motion.p
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.7 }}
                  className="text-gray-600 text-base font-inter leading-relaxed mb-8"
                  style={{ lineHeight: '1.7' }}
                >
                  {section.description}
                </motion.p>
              )}

              {/* Modern Progress Line - Subtle and elegant */}
              <motion.div
                initial={{ width: 0, opacity: 0 }}
                animate={{ width: '100%', opacity: 1 }}
                transition={{ duration: 0.8, delay: 0.9, ease: [0.16, 1, 0.3, 1] }}
                className="relative h-1 rounded-full overflow-hidden"
                style={{
                  background: `linear-gradient(90deg, ${section.accent}10, ${section.accent}05)`,
                }}
              >
                <motion.div
                  className="h-full rounded-full relative"
                  style={{
                    background: `linear-gradient(90deg, ${section.accent}, ${section.accent}DD)`,
                    boxShadow: `0 0 12px ${section.accent}40`,
                  }}
                  initial={{ width: 0 }}
                  animate={{ width: '100%' }}
                  transition={{ duration: 1, delay: 1, ease: [0.16, 1, 0.3, 1] }}
                >
                  {/* Subtle shimmer */}
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
                    animate={{
                      x: ['-100%', '200%'],
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      ease: "linear",
                      delay: 1.5,
                    }}
                  />
                </motion.div>
              </motion.div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
