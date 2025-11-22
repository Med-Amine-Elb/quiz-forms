"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";

interface AnimatedQuestionHeaderProps {
  questionNumber: number;
  questionText: string;
  onNumberComplete?: () => void;
  onTextComplete?: () => void;
}

export default function AnimatedQuestionHeader({
  questionNumber,
  questionText,
  onNumberComplete,
  onTextComplete,
}: AnimatedQuestionHeaderProps) {
  const [showText, setShowText] = useState(false);

  useEffect(() => {
    // Reset text visibility when question changes
    setShowText(false);
    
    // Show text after header animation completes
    const timer = setTimeout(() => {
      setShowText(true);
      if (onTextComplete) {
        setTimeout(onTextComplete, 1200);
      }
    }, 800);

    return () => clearTimeout(timer);
  }, [questionNumber, onTextComplete]);

  // Split question text to separate the "?" if it exists
  const hasQuestionMark = questionText.endsWith('?');
  const textWithoutMark = hasQuestionMark ? questionText.slice(0, -1) : questionText;

  return (
    <div className="text-center mb-8 sm:mb-10">
      {/* Question Label and Number - Professional style */}
      <motion.div
        key={questionNumber}
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{
          duration: 0.6,
          ease: [0.25, 0.4, 0.25, 1],
        }}
        onAnimationComplete={onNumberComplete}
        className="mb-6"
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{
            duration: 0.5,
            delay: 0.2,
            ease: [0.25, 0.4, 0.25, 1],
          }}
          className="inline-block"
        >
          <span className="text-sm sm:text-base font-semibold text-gray-500 uppercase tracking-wider font-inter">
            Question
          </span>
          <motion.span
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{
              duration: 0.4,
              delay: 0.4,
              ease: 'easeOut',
            }}
            className="ml-2 text-2xl sm:text-3xl font-bold text-gray-700 font-inter"
          >
            {questionNumber}
          </motion.span>
        </motion.div>
      </motion.div>

      {/* Question Text - Professional fade in with animated question mark */}
      {showText && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
          className="max-w-4xl mx-auto"
        >
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-semibold text-gray-900 font-inter leading-relaxed">
            {/* Text without question mark */}
            <motion.span
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: 0.6,
                ease: [0.25, 0.4, 0.25, 1],
              }}
              className="inline-block"
            >
              {textWithoutMark}
            </motion.span>
            
            {/* Animated question mark */}
            {hasQuestionMark && (
              <motion.span
                initial={{ opacity: 0, scale: 0, rotate: -180 }}
                animate={{ 
                  opacity: 1, 
                  scale: 1, 
                  rotate: 0,
                  y: [0, -8, 0],
                }}
                transition={{
                  opacity: { duration: 0.4, delay: 0.3 },
                  scale: { 
                    duration: 0.5, 
                    delay: 0.3,
                    ease: [0.34, 1.56, 0.64, 1],
                  },
                  rotate: { 
                    duration: 0.6, 
                    delay: 0.3,
                    ease: [0.34, 1.56, 0.64, 1],
                  },
                  y: {
                    duration: 1.5,
                    delay: 0.8,
                    repeat: Infinity,
                    ease: 'easeInOut',
                  },
                }}
                className="inline-block ml-1 text-cyan-500"
                style={{
                  display: 'inline-block',
                  transformOrigin: 'bottom center',
                }}
              >
                ?
              </motion.span>
            )}
          </h2>
          
          {/* Subtle decorative line */}
          <motion.div
            initial={{ width: 0, opacity: 0 }}
            animate={{ width: '60%', opacity: 0.3 }}
            transition={{
              duration: 0.8,
              delay: 0.6,
              ease: [0.25, 0.4, 0.25, 1],
            }}
            className="h-px bg-gradient-to-r from-transparent via-gray-300 to-transparent mt-6 mx-auto"
          />
        </motion.div>
      )}
    </div>
  );
}

