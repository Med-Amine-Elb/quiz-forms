"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Star } from "lucide-react";
import ContinueButton from "./ContinueButton";

interface RatingQuestionProps {
  maxRating?: number;
  onContinue: (rating: number) => void;
  continueButtonText?: string;
  required?: boolean;
  accentColor?: string;
}

export default function RatingQuestion({
  maxRating = 5,
  onContinue,
  continueButtonText = "Continuer",
  required = false,
  accentColor = "#06b6d4",
}: RatingQuestionProps) {
  const [rating, setRating] = useState<number | null>(null);
  const [hoveredRating, setHoveredRating] = useState<number | null>(null);

  const handleContinue = () => {
    if (rating !== null) {
      onContinue(rating);
    }
  };

  return (
    <>
      {/* Rating Stars */}
      <div className="w-full max-w-4xl mx-auto mb-8">
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            duration: 0.5,
            ease: [0.16, 1, 0.3, 1],
          }}
          style={{
            willChange: 'transform, opacity',
          }}
          className="flex justify-center items-center gap-2"
        >
          {Array.from({ length: maxRating }, (_, i) => {
            const starValue = i + 1;
            const isFilled = starValue <= (hoveredRating || rating || 0);
            
            return (
              <motion.button
                key={starValue}
                type="button"
                initial={{ opacity: 0, scale: 0, rotate: -180 }}
                animate={{ opacity: 1, scale: 1, rotate: 0 }}
                transition={{
                  type: "spring",
                  stiffness: 500,
                  damping: 30,
                  delay: i * 0.1,
                }}
                onClick={() => setRating(starValue)}
                onMouseEnter={() => setHoveredRating(starValue)}
                onMouseLeave={() => setHoveredRating(null)}
                whileHover={{ 
                  scale: 1.15,
                  rotate: 5,
                  transition: { duration: 0.2 },
                }}
                whileTap={{ scale: 0.9 }}
                style={{
                  willChange: 'transform',
                }}
                className="focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-cyan-500/50 rounded-lg"
              >
                <Star
                  className={`w-12 h-12 transition-colors duration-300 ${
                    isFilled
                      ? "fill-cyan-400 text-cyan-400"
                      : "fill-gray-200 text-gray-200"
                  }`}
                />
              </motion.button>
            );
          })}
        </motion.div>
        <AnimatePresence>
          {rating && (
            <motion.p
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{
                duration: 0.3,
                ease: [0.16, 1, 0.3, 1],
              }}
              className="text-center mt-4 text-gray-600 font-inter"
            >
              Vous avez sélectionné {rating} sur {maxRating}
            </motion.p>
          )}
        </AnimatePresence>
      </div>

      {/* Continue Button */}
      <div className="w-full max-w-4xl mx-auto">
        <ContinueButton
          onClick={handleContinue}
          disabled={required && rating === null}
          accentColor={accentColor}
        >
          {continueButtonText}
        </ContinueButton>
      </div>
    </>
  );
}

