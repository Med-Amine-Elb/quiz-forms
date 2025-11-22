"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";
import { getSectionForQuestion } from "@/lib/questionSections";
import { cn } from "@/lib/utils";

interface AnimatedQuestionCardProps {
  questionNumber: number;
  questionText: string;
  accentColor?: string;
}

export default function AnimatedQuestionCard({
  questionNumber,
  questionText,
  accentColor,
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
          className="w-full max-w-3xl mx-auto mb-6"
        >
          {/* Main Card - Compact & Professional */}
          <motion.div
            className={cn(
              "relative rounded-2xl p-5 sm:p-6 backdrop-blur-xl border overflow-hidden",
              "shadow-lg group"
            )}
            style={{
              background: `linear-gradient(135deg, rgba(255, 255, 255, 0.98), rgba(255, 255, 255, 0.95))`,
              borderColor: `${color}25`,
              boxShadow: `0 8px 32px ${color}10, 0 0 0 1px ${color}08, inset 0 1px 0 rgba(255, 255, 255, 0.8)`,
            }}
            whileHover={{
              boxShadow: `0 12px 40px ${color}15, 0 0 0 1px ${color}15, inset 0 1px 0 rgba(255, 255, 255, 0.9)`,
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
              {/* Question Number Badge & Text - Inline */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.1 }}
                className="flex items-center gap-3 mb-4"
              >
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{
                    type: "spring",
                    stiffness: 400,
                    damping: 25,
                    delay: 0.2,
                  }}
                  className="flex items-center justify-center w-9 h-9 rounded-lg font-semibold text-sm font-inter shrink-0"
                  style={{
                    background: `linear-gradient(135deg, ${color}, ${color}ee)`,
                    color: 'white',
                    boxShadow: `0 4px 12px ${color}35`,
                  }}
                >
                  {questionNumber}
                </motion.div>
                
                {/* Question Text - Compact */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.4, delay: 0.2 }}
                  className="flex-1 min-w-0"
                >
                  <h2 className="text-xl sm:text-2xl lg:text-2xl font-semibold text-gray-900 font-inter leading-tight">
                    {/* Text without question mark */}
                    <motion.span
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.3, delay: 0.3 }}
                      className="inline-block"
                    >
                      {textWithoutMark}
                    </motion.span>
                    
                    {/* Animated question mark */}
                    {hasQuestionMark && (
                      <motion.span
                        initial={{ opacity: 0, scale: 0 }}
                        animate={{ 
                          opacity: 1, 
                          scale: 1,
                        }}
                        transition={{
                          type: "spring",
                          stiffness: 400,
                          damping: 20,
                          delay: 0.4,
                        }}
                        className="inline-block ml-1.5"
                        style={{ color: color }}
                      >
                        ?
                      </motion.span>
                    )}
                  </h2>
                </motion.div>
              </motion.div>

              {/* Subtle decorative line - Thinner */}
              <motion.div
                initial={{ width: 0, opacity: 0 }}
                animate={{ width: '100%', opacity: 0.2 }}
                transition={{ duration: 0.6, delay: 0.4 }}
                className="h-[1px]"
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

