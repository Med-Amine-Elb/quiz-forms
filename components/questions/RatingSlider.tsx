"use client";

import { useState, useMemo, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Star } from "lucide-react";
import { cn } from "@/lib/utils";
import ContinueButton from "./ContinueButton";

interface RatingSliderProps {
  onContinue: (value: string) => void;
  required?: boolean;
  accentColor?: string;
  sectionColor?: string;
  min?: number;
  max?: number;
  labels?: string[];
  questionText?: string;
}

export default function RatingSlider({
  onContinue,
  required = true,
  accentColor = "#06b6d4",
  sectionColor,
  min = 1,
  max = 5,
  labels,
  questionText,
}: RatingSliderProps) {
  const [selectedValue, setSelectedValue] = useState<number | null>(null);
  const [hoveredValue, setHoveredValue] = useState<number | null>(null);

  const handleStarClick = useCallback((value: number) => {
    setSelectedValue(value);
  }, []);

  const handleContinue = useCallback(() => {
    if (selectedValue !== null) {
      onContinue(`support-rating-${selectedValue}`);
    }
  }, [selectedValue, onContinue]);

  const displayValue = hoveredValue || selectedValue || 0;
  
  // Use custom labels if provided, otherwise create default labels - memoized
  const displayLabels = useMemo(() => 
    labels && labels.length === max 
      ? labels 
      : Array.from({ length: max }, (_, i) => `Niveau ${i + 1}`),
    [labels, max]
  );

  return (
    <div className="w-full max-w-4xl mx-auto">
      {/* Star Rating */}
      <div className="flex flex-col items-center justify-center mb-8">
        {/* Stars - All in one line */}
        <div className="flex items-center justify-center gap-2 sm:gap-3 mb-4 relative">
          {Array.from({ length: max }, (_, i) => {
            const value = i + 1;
            const isFilled = value <= displayValue;
            const isActive = value === displayValue;
            const isSelected = selectedValue === value;

            return (
              <motion.button
                key={value}
                onClick={() => handleStarClick(value)}
                onMouseEnter={() => setHoveredValue(value)}
                onMouseLeave={() => setHoveredValue(null)}
                className="focus:outline-none relative"
                whileHover={{ 
                  scale: 1.15,
                  y: -3,
                }}
                whileTap={{ scale: 0.9 }}
                initial={{ 
                  opacity: 0, 
                  scale: 0,
                  rotate: -180,
                }}
                animate={{ 
                  opacity: 1, 
                  scale: 1,
                  rotate: 0,
                }}
                transition={{ 
                  delay: i * 0.1,
                  type: "spring",
                  stiffness: 300,
                  damping: 20,
                }}
                style={{ willChange: 'transform' }}
              >
                {/* Glow effect on hover/fill */}
                {isFilled && (
                  <motion.div
                    className="absolute inset-0 rounded-full pointer-events-none"
                    style={{
                      background: `radial-gradient(circle, ${accentColor}40, transparent 70%)`,
                      filter: 'blur(8px)',
                    }}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ 
                      opacity: isActive ? 0.6 : 0.3,
                      scale: 1.2,
                    }}
                    transition={{
                      duration: 0.3,
                      ease: "easeOut",
                    }}
                  />
                )}

                {/* Star with smooth fill animation */}
                <motion.div
                  animate={{
                    scale: isSelected ? [1, 1.2, 1] : 1,
                  }}
                  transition={{
                    duration: 0.4,
                    ease: "easeOut",
                  }}
                >
                  <Star
                    className={cn(
                      "w-12 h-12 sm:w-14 sm:h-14 transition-all duration-300 relative z-10",
                      isFilled ? "fill-current" : "fill-none"
                    )}
                    style={{
                      color: isFilled ? accentColor : "#E5E7EB",
                      filter: isFilled 
                        ? `drop-shadow(0 2px 8px ${accentColor}50)` 
                        : undefined,
                    }}
                  />
                </motion.div>

                {/* Pulse ring on selection */}
                {isSelected && (
                  <motion.div
                    className="absolute inset-0 rounded-full pointer-events-none"
                    style={{
                      border: `2px solid ${accentColor}`,
                      borderRadius: '50%',
                    }}
                    initial={{
                      scale: 1,
                      opacity: 0.8,
                    }}
                    animate={{
                      scale: [1, 1.5, 2],
                      opacity: [0.8, 0.4, 0],
                    }}
                    transition={{
                      duration: 0.6,
                      ease: "easeOut",
                    }}
                  />
                )}
              </motion.button>
            );
          })}
        </div>

        {/* Label Display - Shows when star is clicked */}
        <AnimatePresence mode="wait">
          {selectedValue !== null && (
            <motion.div
              key={selectedValue}
              initial={{ opacity: 0, y: -10, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.9 }}
              transition={{
                type: "spring",
                stiffness: 300,
                damping: 25,
              }}
              className="text-base sm:text-lg font-semibold text-center max-w-2xl px-4"
              style={{ 
                color: accentColor,
                willChange: 'transform, opacity',
              }}
            >
              {displayLabels[selectedValue - min]}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Continue Button */}
      <div className="w-full max-w-4xl mx-auto mt-8">
        <ContinueButton
          onClick={handleContinue}
          disabled={selectedValue === null && required}
          accentColor={accentColor}
          sectionColor={sectionColor}
        >
          Continuer
        </ContinueButton>
      </div>
    </div>
  );
}
