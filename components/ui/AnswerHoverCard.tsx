"use client";

import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import type { LucideIcon } from "lucide-react";
import { useEffect, useState } from "react";

interface AnswerHoverCardProps {
  label: string;
  description?: string;
  icon?: LucideIcon;
  emoji?: string;
  accentColor?: string;
  isVisible: boolean;
}

export default function AnswerHoverCard({
  label,
  description,
  icon: Icon,
  emoji,
  accentColor = '#0EA5E9',
  isVisible,
}: AnswerHoverCardProps) {
  const [delayedVisible, setDelayedVisible] = useState(false);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    
    if (isVisible) {
      // Small delay to prevent noise when quickly moving between answers
      timer = setTimeout(() => {
        setDelayedVisible(true);
      }, 150);
    } else {
      // Hide immediately when not visible for smoother transitions
      setDelayedVisible(false);
    }
    
    return () => {
      if (timer) clearTimeout(timer);
    };
  }, [isVisible, label, description]); // Include label/description to update when switching between answers

  return (
    <AnimatePresence>
      {delayedVisible && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{
            duration: 0.3,
            ease: [0.16, 1, 0.3, 1],
          }}
          className="fixed inset-0 z-40 flex items-center justify-center pointer-events-none"
          style={{ willChange: 'opacity' }}
        >
          {/* Clean, minimal backdrop - no blur, just subtle overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2, ease: 'easeOut' }}
            className="absolute inset-0 bg-gray-900/10"
          />
          
          {/* Card */}
          <motion.div
            className={cn(
              "relative max-w-lg w-full mx-4 rounded-2xl",
              "bg-white",
              "border-2 shadow-xl",
              "px-8 py-6",
              "transform-gpu"
            )}
            style={{
              borderColor: accentColor,
              boxShadow: `0 10px 40px rgba(0,0,0,0.12), 0 0 0 1px ${accentColor}30`,
              willChange: 'transform, opacity',
            }}
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            transition={{
              duration: 0.25,
              ease: [0.16, 1, 0.3, 1],
            }}
          >

            {/* Content */}
            <div className="relative z-10">
              {/* Icon/Emoji */}
              {(Icon || emoji) && (
                <motion.div
                  initial={{ scale: 0, rotate: -180 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{
                    type: "spring",
                    stiffness: 300,
                    damping: 20,
                    delay: 0.1,
                  }}
                  className="flex justify-center mb-4"
                >
                  {Icon ? (
                    <div
                      className="w-16 h-16 rounded-2xl flex items-center justify-center"
                      style={{
                        backgroundColor: `${accentColor}20`,
                        color: accentColor,
                      }}
                    >
                      <Icon className="w-8 h-8" strokeWidth={2.5} />
                    </div>
                  ) : (
                    <div className="text-6xl leading-none">{emoji}</div>
                  )}
                </motion.div>
              )}

              {/* Label */}
              <motion.h3
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.15, duration: 0.3 }}
                className={cn(
                  "text-xl sm:text-2xl font-extrabold text-gray-900",
                  "text-center leading-tight mb-3"
                )}
              >
                {label}
              </motion.h3>

              {/* Description */}
              {description && (
                <motion.p
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2, duration: 0.3 }}
                  className="text-sm sm:text-base text-gray-600 text-center leading-relaxed"
                >
                  {description}
                </motion.p>
              )}
            </div>


          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

