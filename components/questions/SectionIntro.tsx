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

  useEffect(() => {
    // Auto-hide after 2.5 seconds
    const timer = setTimeout(() => {
      setIsVisible(false);
      setTimeout(onClose, 600); // Wait for fade out
    }, 2500);

    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="fixed inset-0 flex items-center justify-center z-[100] pointer-events-none"
        >
          {/* Animated Background Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 backdrop-blur-md"
            style={{
              background: `radial-gradient(circle at center, ${section.accent}15 0%, transparent 70%)`,
            }}
          />

          {/* Main Card */}
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.8, rotateX: -15 }}
            animate={{ opacity: 1, y: 0, scale: 1, rotateX: 0 }}
            exit={{ opacity: 0, y: -30, scale: 0.95, rotateX: 10 }}
            transition={{
              duration: 0.8,
              ease: [0.25, 0.4, 0.25, 1],
              type: "spring",
              stiffness: 100,
              damping: 15,
            }}
            className={cn(
              "relative rounded-3xl p-10 shadow-2xl backdrop-blur-2xl border-2",
              "max-w-lg w-full mx-4 pointer-events-auto",
              "transform-gpu"
            )}
            style={{
              background: `linear-gradient(135deg, rgba(255, 255, 255, 0.95), rgba(255, 255, 255, 0.85))`,
              borderColor: `${section.accent}30`,
              boxShadow: `0 25px 80px ${section.accent}25, 0 0 0 1px ${section.accent}15, inset 0 1px 0 rgba(255, 255, 255, 0.9)`,
            }}
          >
            {/* Animated Gradient Border Glow */}
            <motion.div
              className="absolute inset-0 rounded-3xl -z-10"
              animate={{
                boxShadow: [
                  `0 0 40px ${section.accent}20`,
                  `0 0 60px ${section.accent}30`,
                  `0 0 40px ${section.accent}20`,
                ],
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            />

            {/* Floating Particles Background */}
            {[...Array(6)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute rounded-full opacity-20"
                style={{
                  width: Math.random() * 60 + 20,
                  height: Math.random() * 60 + 20,
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                  background: `radial-gradient(circle, ${section.accent}, transparent)`,
                }}
                animate={{
                  y: [0, -30, 0],
                  x: [0, Math.random() * 20 - 10, 0],
                  scale: [1, 1.2, 1],
                  opacity: [0.2, 0.4, 0.2],
                }}
                transition={{
                  duration: 3 + Math.random() * 2,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: i * 0.3,
                }}
              />
            ))}

            {/* Content Container */}
            <div className="relative z-10">
              {/* Section Header with Icon and Badge */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="flex items-center gap-4 mb-6"
              >
                {/* Animated Icon */}
                {section.icon && (
                  <motion.div
                    initial={{ scale: 0, rotate: -180 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{
                      type: "spring",
                      stiffness: 500,
                      damping: 25,
                      delay: 0.3,
                    }}
                    className="text-4xl relative"
                  >
                    <motion.div
                      animate={{
                        rotate: [0, 10, -10, 0],
                        scale: [1, 1.1, 1],
                      }}
                      transition={{
                        duration: 2,
                        repeat: Infinity,
                        ease: "easeInOut",
                        delay: 0.5,
                      }}
                    >
                      {section.icon}
                    </motion.div>
                    {/* Icon Glow */}
                    <motion.div
                      className="absolute inset-0 blur-xl"
                      style={{ color: section.accent }}
                      animate={{
                        opacity: [0.3, 0.6, 0.3],
                        scale: [1, 1.2, 1],
                      }}
                      transition={{
                        duration: 2,
                        repeat: Infinity,
                        ease: "easeInOut",
                      }}
                    >
                      {section.icon}
                    </motion.div>
                  </motion.div>
                )}

                {/* Section Number Badge with Pulse */}
                <motion.div
                  initial={{ scale: 0, rotate: -90 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{
                    type: "spring",
                    stiffness: 400,
                    damping: 20,
                    delay: 0.4,
                  }}
                  className="relative"
                >
                  <motion.div
                    className="px-4 py-2 rounded-xl font-bold text-sm font-inter text-white relative overflow-hidden"
                    style={{
                      background: `linear-gradient(135deg, ${section.accent}, ${section.accent}dd)`,
                      boxShadow: `0 8px 24px ${section.accent}40`,
                    }}
                    animate={{
                      boxShadow: [
                        `0 8px 24px ${section.accent}40`,
                        `0 12px 32px ${section.accent}50`,
                        `0 8px 24px ${section.accent}40`,
                      ],
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      ease: "easeInOut",
                    }}
                  >
                    {/* Shimmer Effect */}
                    <motion.div
                      className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
                      animate={{
                        x: ['-100%', '100%'],
                      }}
                      transition={{
                        duration: 2,
                        repeat: Infinity,
                        ease: "linear",
                        delay: 0.5,
                      }}
                    />
                    <span className="relative z-10">SECTION {sectionIndex}</span>
                  </motion.div>
                </motion.div>
              </motion.div>

              {/* Section Name with Staggered Letters */}
              <motion.h3
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.5 }}
                className="text-3xl font-bold font-inter mb-5 leading-tight"
                style={{ color: section.accent }}
              >
                {section.name.split(' ').map((word, wordIndex) => (
                  <motion.span
                    key={wordIndex}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{
                      duration: 0.4,
                      delay: 0.6 + wordIndex * 0.1,
                    }}
                    className="inline-block mr-2"
                  >
                    {word}
                  </motion.span>
                ))}
              </motion.h3>

              {/* Section Description */}
              {section.description && (
                <motion.p
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.8 }}
                  className="text-gray-700 text-lg font-inter leading-relaxed mb-6"
                >
                  {section.description}
                </motion.p>
              )}

              {/* Animated Progress Line */}
              <motion.div
                initial={{ width: 0, opacity: 0 }}
                animate={{ width: '100%', opacity: 1 }}
                transition={{ duration: 1, delay: 1, ease: 'easeOut' }}
                className="relative h-1.5 rounded-full overflow-hidden bg-gray-200"
              >
                <motion.div
                  className="h-full rounded-full"
                  style={{
                    background: `linear-gradient(90deg, ${section.accent}, ${section.accent}80, ${section.accent})`,
                  }}
                  initial={{ width: 0 }}
                  animate={{ width: '100%' }}
                  transition={{ duration: 1, delay: 1.2, ease: 'easeOut' }}
                />
                {/* Shimmer on progress bar */}
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-transparent via-white/50 to-transparent"
                  animate={{
                    x: ['-100%', '100%'],
                  }}
                  transition={{
                    duration: 1.5,
                    repeat: Infinity,
                    ease: "linear",
                    delay: 1.5,
                  }}
                />
              </motion.div>

              {/* Decorative Corner Accents */}
              <motion.div
                className="absolute -top-4 -right-4 w-24 h-24 rounded-full opacity-20 blur-2xl"
                style={{ backgroundColor: section.accent }}
                animate={{
                  scale: [1, 1.2, 1],
                  opacity: [0.2, 0.3, 0.2],
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              />
              <motion.div
                className="absolute -bottom-4 -left-4 w-32 h-32 rounded-full opacity-15 blur-3xl"
                style={{ backgroundColor: section.accent }}
                animate={{
                  scale: [1, 1.3, 1],
                  opacity: [0.15, 0.25, 0.15],
                }}
                transition={{
                  duration: 4,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: 0.5,
                }}
              />
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
