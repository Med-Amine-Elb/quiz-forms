"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect, useRef } from "react";
import { cn } from "@/lib/utils";
import { Slider } from "@/components/ui/slider";
import ContinueButton from "./ContinueButton";

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
  accentColor?: string;
  sectionColor?: string;
}

export default function SatisfactionRating({
  onSelect,
  selectedId,
  onSubmit,
  accentColor = "#06b6d4",
  sectionColor,
}: SatisfactionRatingProps) {
  const [value, setValue] = useState<number[]>([50]);
  const [isDragging, setIsDragging] = useState(false);
  const [showFeedback, setShowFeedback] = useState(false);
  const [showCelebration, setShowCelebration] = useState(false);
  const sliderRef = useRef<HTMLDivElement>(null);
  const prevValueRef = useRef<number>(50);

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
    const newVal = newValue[0];
    setValue(newValue);
    setIsDragging(true);
    const satisfactionId = getSatisfactionId(newVal);
    onSelect(satisfactionId);
    setShowFeedback(true);

    // Celebration at max satisfaction (100)
    if (newVal === 100 && prevValueRef.current !== 100) {
      setShowCelebration(true);
      setTimeout(() => setShowCelebration(false), 2000);
    }
    prevValueRef.current = newVal;
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
    <div className="w-full max-w-5xl mx-auto space-y-6 py-6">
      {/* Celebration Effect */}
      <AnimatePresence>
        {showCelebration && (
          <motion.div
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0 }}
            className="fixed inset-0 flex items-center justify-center z-[100] pointer-events-none"
          >
            <motion.div
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: [1, 1.2, 1], rotate: 0 }}
              transition={{ type: "spring", stiffness: 200, damping: 10 }}
              className="text-8xl"
            >
              🎉
            </motion.div>
            {[...Array(20)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute text-4xl"
                initial={{
                  x: 0,
                  y: 0,
                  opacity: 1,
                  scale: 1,
                }}
                animate={{
                  x: (Math.random() - 0.5) * 800,
                  y: (Math.random() - 0.5) * 800,
                  opacity: 0,
                  scale: 0,
                }}
                transition={{
                  duration: 1.5,
                  delay: i * 0.05,
                  ease: "easeOut",
                }}
              >
                {['🎉', '✨', '🌟', '💫'][Math.floor(Math.random() * 4)]}
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Slider Container */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative bg-white/60 backdrop-blur-md rounded-2xl p-6 sm:p-8 shadow-xl border border-gray-100"
      >
        {/* Current Level Display */}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentLevel.value}
            initial={{ opacity: 0, scale: 0.9, y: -10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 10 }}
            transition={{ duration: 0.3 }}
            className="mb-4 text-center"
          >
            <motion.div
              animate={{
                scale: isDragging ? 1.1 : 1,
              }}
              transition={{ duration: 0.2 }}
              className="inline-block"
            >
              <div className={cn(
                "text-6xl sm:text-7xl mb-3 transition-all duration-300",
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
        <div className="relative px-4 sm:px-6">
          {/* Slider Track with Gradient */}
          <div className="relative mb-4" ref={sliderRef}>
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
          <div className="flex justify-between mt-4 px-2">
            {satisfactionLevels.map((level, index) => {
              const isSelected = Math.abs(value[0] - level.value) <= 12.5;
              return (
                <motion.button
                  key={level.value}
                  onClick={() => {
                    setValue([level.value]);
                    const satisfactionId = getSatisfactionId(level.value);
                    onSelect(satisfactionId);
                    setShowFeedback(true);
                  }}
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  className={cn(
                    "flex flex-col items-center gap-2 transition-all duration-300",
                    "focus:outline-none rounded-lg p-3",
                    isSelected
                      ? "opacity-100"
                      : "opacity-40 hover:opacity-70"
                  )}
                >
                  <motion.div
                    animate={{
                      scale: isSelected ? 1.2 : 1,
                    }}
                    className={cn(
                      "text-2xl sm:text-3xl w-12 h-12 flex items-center justify-center rounded-lg transition-all duration-300",
                      isSelected && "border-2"
                    )}
                    style={{
                      borderColor: isSelected ? level.color : 'transparent',
                    }}
                  >
                    {level.emoji}
                  </motion.div>
                  <span className={cn(
                    "text-sm font-medium font-inter whitespace-nowrap",
                    isSelected
                      ? "font-bold"
                      : "font-normal"
                  )}>
                    {level.label.split(' ')[0]}
                  </span>
                </motion.button>
              );
            })}
          </div>
        </div>

        {/* Value Display */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: showFeedback ? 1 : 0, scale: showFeedback ? 1 : 0.9 }}
          transition={{ duration: 0.3 }}
          className="mt-4 text-center"
        >
          <div 
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full backdrop-blur-sm border-2 shadow-lg transition-all duration-300"
            style={{
              backgroundColor: `${currentLevel.color}15`,
              borderColor: currentLevel.color,
            }}
          >
            <span className="text-xs font-semibold text-gray-700 font-inter">
              Satisfaction:
            </span>
            <span
              className="text-base font-bold font-inter"
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
        <ContinueButton
          onClick={handleContinue}
          accentColor={accentColor}
          sectionColor={sectionColor}
        >
          Continuer
        </ContinueButton>
      </motion.div>
    </div>
  );
}
