"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";
import { getSectionForQuestion } from "@/lib/questionSections";
import { cn } from "@/lib/utils";

interface AnimatedQuestionCardProps {
  questionNumber: number;
  questionText: string;
  accentColor?: string;
  isFirstQuestion?: boolean;
}

export default function AnimatedQuestionCard({
  questionNumber,
  questionText,
  accentColor,
  isFirstQuestion = false,
}: AnimatedQuestionCardProps) {
  const [isVisible, setIsVisible] = useState(false);
  const section = accentColor ? { accent: accentColor } : getSectionForQuestion(questionNumber);
  const color = section.accent;

  useEffect(() => {
    setIsVisible(false);
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 200);
    return () => clearTimeout(timer);
  }, [questionNumber]);

  // Split question text to separate the "?" if it exists
  const hasQuestionMark = questionText.endsWith('?');
  const textWithoutMark = hasQuestionMark ? questionText.slice(0, -1) : questionText;

  return (
    <AnimatePresence mode="wait">
      {isVisible && (
        <motion.div
          key={questionNumber}
          initial={{ opacity: 0, y: 20, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -10, scale: 0.98 }}
          transition={{
            duration: 0.4,
            ease: [0.25, 0.4, 0.25, 1],
          }}
            className="w-full max-w-3xl mx-auto mb-8"
        >
          {/* Main Card - Larger for first question */}
          <motion.div
            className={cn(
              "relative rounded-2xl backdrop-blur-xl border overflow-hidden",
              "shadow-lg group",
              isFirstQuestion ? "p-8 sm:p-10" : "p-5 sm:p-6"
            )}
            style={{
              background: `linear-gradient(135deg, rgba(255, 255, 255, 1), rgba(255, 255, 255, 0.98))`,
              borderColor: `${color}50`,
              boxShadow: `0 16px 48px rgba(0, 0, 0, 0.15), 0 0 0 2px ${color}30, inset 0 1px 0 rgba(255, 255, 255, 1)`,
            }}
            whileHover={{
              boxShadow: `0 20px 60px ${color}40, 0 0 0 3px ${color}50, inset 0 1px 0 rgba(255, 255, 255, 1)`,
            }}
            transition={{ duration: 0.2 }}
          >
            {/* Subtle gradient overlay */}
            <motion.div
              className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
              style={{
                background: `linear-gradient(135deg, ${color}05, transparent)`,
              }}
            />

            {/* Content - Compact Layout */}
            <div className="relative z-10">
              {/* Question Number Badge & Text - Enhanced Hierarchy */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.1 }}
                className="flex items-start gap-4 mb-6"
              >
                {/* Question Number - Larger, Bolder, Colored */}
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{
                    type: "spring",
                    stiffness: 400,
                    damping: 25,
                    delay: 0.2,
                  }}
                  className={cn(
                    "flex items-center justify-center rounded-xl font-bold font-inter shrink-0",
                    isFirstQuestion ? "w-16 h-16 text-2xl" : "w-12 h-12 text-lg"
                  )}
                  style={{
                    background: `linear-gradient(135deg, ${color}, ${color}ee)`,
                    color: 'white',
                    boxShadow: `0 6px 20px ${color}40`,
                  }}
                >
                  {questionNumber}
                </motion.div>
                
                {/* Question Text - Clear Hierarchy with Better Spacing */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.4, delay: 0.2 }}
                  className="flex-1 min-w-0 pt-1"
                >
                  <h2 className={cn(
                    "font-bold text-gray-900 font-inter leading-tight tracking-tight whitespace-normal",
                    isFirstQuestion ? "text-3xl sm:text-4xl lg:text-4xl" : "text-2xl sm:text-3xl lg:text-3xl"
                  )}>
                    {/* Text without question mark */}
                    <motion.span
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.3, delay: 0.3 }}
                      className="inline"
                    >
                      {textWithoutMark}
                    </motion.span>
                    
                    {/* Animated question mark with bouncing */}
                    {hasQuestionMark && (
                      <motion.span
                        initial={{ opacity: 0, scale: 0, y: -20 }}
                        animate={{ 
                          opacity: 1, 
                          scale: 1,
                          y: 0,
                        }}
                        transition={{
                          type: "spring",
                          stiffness: 400,
                          damping: 15,
                          delay: 0.4,
                        }}
                        className="inline ml-1 inline-block"
                        style={{ color: color }}
                      >
                        <motion.span
                          animate={{
                            y: [0, -8, 0],
                            rotate: [0, -5, 5, 0],
                          }}
                          transition={{
                            duration: 1.5,
                            repeat: Infinity,
                            ease: "easeInOut",
                            delay: 0.8,
                          }}
                          className="inline-block"
                        >
                          ?
                        </motion.span>
                      </motion.span>
                    )}
                  </h2>
                </motion.div>
              </motion.div>

              {/* Subtle decorative line - Better spacing */}
              <motion.div
                initial={{ width: 0, opacity: 0 }}
                animate={{ width: '100%', opacity: 0.2 }}
                transition={{ duration: 0.6, delay: 0.4 }}
                className="h-[1px] mt-2"
                style={{
                  background: `linear-gradient(to right, transparent, ${color}40, transparent)`,
                }}
              />
            </div>

            {/* Subtle corner accent - Smaller */}
            <motion.div
              initial={{ scale: 0, rotate: -45 }}
              animate={{ scale: 1, rotate: -45 }}
              transition={{ duration: 0.4, delay: 0.3 }}
              className="absolute -top-6 -right-6 w-16 h-16 rounded-full opacity-15 blur-lg"
              style={{ backgroundColor: color }}
            />
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

