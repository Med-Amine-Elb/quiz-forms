"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect, useRef } from "react";
import { cn } from "@/lib/utils";
import { Slider } from "@/components/ui/slider";

interface SatisfactionLevel {
  value: number;
  label: string;
  emoji: string;
  color: string;
  gradient: string;
  description: string;
}

const satisfactionLevels: SatisfactionLevel[] = [
  {
    value: 0,
    label: 'Très insatisfait(e)',
    emoji: '😞',
    color: '#EF4444',
    gradient: 'from-red-500 to-red-600',
    description: 'Très insatisfait',
  },
  {
    value: 25,
    label: 'Insatisfait(e)',
    emoji: '😕',
    color: '#F97316',
    gradient: 'from-orange-500 to-orange-600',
    description: 'Insatisfait',
  },
  {
    value: 50,
    label: 'Neutre',
    emoji: '😐',
    color: '#FBBF24',
    gradient: 'from-amber-500 to-amber-600',
    description: 'Ni satisfait ni insatisfait',
  },
  {
    value: 75,
    label: 'Satisfait(e)',
    emoji: '😊',
    color: '#10B981',
    gradient: 'from-emerald-500 to-emerald-600',
    description: 'Satisfait',
  },
  {
    value: 100,
    label: 'Très satisfait(e)',
    emoji: '😍',
    color: '#06B6D4',
    gradient: 'from-cyan-500 to-cyan-600',
    description: 'Très satisfait',
  },
];

interface SatisfactionRatingProps {
  onSelect: (value: string) => void;
  onSubmit?: (value: string) => void;
  selectedId?: string | null;
}

export default function SatisfactionRating({
  onSelect,
  selectedId,
  onSubmit,
}: SatisfactionRatingProps) {
  const [value, setValue] = useState<number[]>([50]);
  const [isDragging, setIsDragging] = useState(false);
  const [showFeedback, setShowFeedback] = useState(false);
  const sliderRef = useRef<HTMLDivElement>(null);

  // Get current satisfaction level based on value
  const getCurrentLevel = (val: number): SatisfactionLevel => {
    if (val <= 12.5) return satisfactionLevels[0];
    if (val <= 37.5) return satisfactionLevels[1];
    if (val <= 62.5) return satisfactionLevels[2];
    if (val <= 87.5) return satisfactionLevels[3];
    return satisfactionLevels[4];
  };

  const currentLevel = getCurrentLevel(value[0]);

  // Convert value to satisfaction ID (matching original 4-level system)
  // Original: satisfaction-1 = Très satisfait, satisfaction-2 = Satisfait, satisfaction-3 = Neutre, satisfaction-4 = Insatisfait
  const getSatisfactionId = (val: number): string => {
    if (val >= 87.5) return 'satisfaction-1'; // Très satisfait
    if (val >= 62.5) return 'satisfaction-2'; // Satisfait
    if (val >= 37.5) return 'satisfaction-3'; // Neutre
    if (val >= 12.5) return 'satisfaction-4'; // Insatisfait
    return 'satisfaction-4'; // Très insatisfait maps to insatisfait
  };

  useEffect(() => {
    if (selectedId) {
      // Map selectedId back to value (original 4-level system)
      const idToValue: Record<string, number> = {
        'satisfaction-1': 100, // Très satisfait
        'satisfaction-2': 75,  // Satisfait
        'satisfaction-3': 50,  // Neutre
        'satisfaction-4': 25,  // Insatisfait
      };
      const mappedValue = idToValue[selectedId] ?? 50;
      setValue([mappedValue]);
    }
  }, [selectedId]);

  const handleValueChange = (newValue: number[]) => {
    setValue(newValue);
    setIsDragging(true);
    const satisfactionId = getSatisfactionId(newValue[0]);
    onSelect(satisfactionId);
    setShowFeedback(true);
  };

  const handleValueCommit = () => {
    setIsDragging(false);
    const satisfactionId = getSatisfactionId(value[0]);
    onSelect(satisfactionId);
  };

  // Update slider thumb color dynamically
  useEffect(() => {
    if (sliderRef.current) {
      const thumb = sliderRef.current.querySelector('[data-radix-slider-thumb]') as HTMLElement;
      if (thumb) {
        thumb.style.borderColor = currentLevel.color;
        thumb.style.boxShadow = isDragging
          ? `0 8px 40px ${currentLevel.color}80, 0 0 0 16px ${currentLevel.color}25`
          : `0 4px 20px ${currentLevel.color}40, 0 0 0 8px ${currentLevel.color}15`;
      }
    }
  }, [currentLevel.color, isDragging]);

  const handleContinue = () => {
    const satisfactionId = getSatisfactionId(value[0]);
    if (onSubmit) {
      onSubmit(satisfactionId);
    } else {
      onSelect(satisfactionId);
    }
  };

  return (
    <div className="w-full max-w-5xl mx-auto space-y-10 py-8">
      {/* Main Slider Container */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative bg-white/60 backdrop-blur-md rounded-3xl p-8 sm:p-12 shadow-xl border border-gray-100"
      >
        {/* Current Level Display */}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentLevel.value}
            initial={{ opacity: 0, scale: 0.9, y: -10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 10 }}
            transition={{ duration: 0.3 }}
            className="mb-10 text-center"
          >
            <motion.div
              animate={{
                scale: isDragging ? 1.1 : 1,
              }}
              transition={{ duration: 0.2 }}
              className="inline-block"
            >
              <div className={cn(
                "text-8xl sm:text-9xl mb-4 transition-all duration-300",
                isDragging && "drop-shadow-2xl"
              )}>
                {currentLevel.emoji}
              </div>
            </motion.div>
            <motion.h3
              key={`label-${currentLevel.value}`}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className={cn(
                "text-2xl sm:text-3xl font-bold mb-2 font-inter transition-colors duration-300",
                `text-[${currentLevel.color}]`
              )}
              style={{ color: currentLevel.color }}
            >
              {currentLevel.label}
            </motion.h3>
            <motion.p
              key={`desc-${currentLevel.value}`}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-gray-600 text-base sm:text-lg font-inter"
            >
              {currentLevel.description}
            </motion.p>
          </motion.div>
        </AnimatePresence>

        {/* Interactive Slider */}
        <div className="relative px-2 sm:px-4">
          {/* Slider Track with Gradient */}
          <div className="relative mb-6" ref={sliderRef}>
            <div className="relative w-full">
              <Slider
                value={value}
                onValueChange={handleValueChange}
                onValueCommit={handleValueCommit}
                min={0}
                max={100}
                step={1}
                variant="satisfaction"
                className="w-full"
              />
            </div>
          </div>

          {/* Level Markers */}
          <div className="flex justify-between mt-6 px-2">
            {satisfactionLevels.map((level, index) => (
              <motion.button
                key={level.value}
                onClick={() => {
                  setValue([level.value]);
                  const satisfactionId = getSatisfactionId(level.value);
                  onSelect(satisfactionId);
                  setShowFeedback(true);
                }}
                whileHover={{ scale: 1.1, y: -4 }}
                whileTap={{ scale: 0.95 }}
                className={cn(
                  "flex flex-col items-center gap-2 transition-all duration-300",
                  "focus:outline-none focus:ring-2 focus:ring-offset-2 rounded-lg p-2",
                  Math.abs(value[0] - level.value) <= 12.5
                    ? "opacity-100 scale-100"
                    : "opacity-40 hover:opacity-70"
                )}
                style={{
                  focusRingColor: level.color,
                }}
              >
                <motion.div
                  animate={{
                    scale: Math.abs(value[0] - level.value) <= 12.5 ? 1.2 : 1,
                  }}
                  className="text-2xl sm:text-3xl"
                >
                  {level.emoji}
                </motion.div>
                <span className={cn(
                  "text-xs sm:text-sm font-medium font-inter whitespace-nowrap",
                  Math.abs(value[0] - level.value) <= 12.5
                    ? "font-bold"
                    : "font-normal"
                )}>
                  {level.label.split(' ')[0]}
                </span>
              </motion.button>
            ))}
          </div>
        </div>

        {/* Value Display */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: showFeedback ? 1 : 0, scale: showFeedback ? 1 : 0.9 }}
          transition={{ duration: 0.3 }}
          className="mt-8 text-center"
        >
          <div 
            className="inline-flex items-center gap-3 px-6 py-3 rounded-full backdrop-blur-sm border-2 shadow-lg transition-all duration-300"
            style={{
              backgroundColor: `${currentLevel.color}15`,
              borderColor: currentLevel.color,
            }}
          >
            <span className="text-sm font-semibold text-gray-700 font-inter">
              Niveau de satisfaction:
            </span>
            <span
              className="text-xl font-bold font-inter"
              style={{ color: currentLevel.color }}
            >
              {value[0]}%
            </span>
          </div>
        </motion.div>
      </motion.div>

      {/* Continue Button */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.2 }}
        className="flex justify-center pt-4"
      >
        <motion.button
          onClick={handleContinue}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className={cn(
            "px-10 py-4 rounded-2xl font-bold text-lg shadow-lg",
            "transition-all duration-300 font-inter",
            "bg-gradient-to-r from-cyan-400 to-cyan-500",
            "text-gray-900 hover:shadow-cyan-500/50",
            "focus:outline-none focus:ring-4 focus:ring-cyan-400/50"
          )}
        >
          Continuer
        </motion.button>
      </motion.div>
    </div>
  );
}
