"use client";

import { motion } from "framer-motion";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";
import type { LucideIcon } from "lucide-react";

interface ModernChoiceCardProps {
  id: string;
  label: string;
  isSelected: boolean;
  onClick: () => void;
  index: number;
  accentColor?: string;
  icon?: LucideIcon;
  isFirstQuestion?: boolean;
}

export default function ModernChoiceCard({
  id,
  label,
  isSelected,
  onClick,
  index,
  accentColor = '#0EA5E9',
  icon: Icon,
  isFirstQuestion = false,
}: ModernChoiceCardProps) {
  return (
    <motion.button
      onClick={onClick}
      initial={{ opacity: 0, y: 30, scale: 0.9 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{
        duration: 0.5,
        delay: index * 0.1,
        ease: [0.25, 0.4, 0.25, 1],
      }}
      whileHover={{ 
        scale: 1.03,
        y: -6,
        transition: { duration: 0.2 },
      }}
      whileTap={{ scale: 0.97 }}
      className={cn(
        "relative w-full rounded-2xl text-left transition-all duration-300",
        "border-2 font-inter font-medium",
        "focus:outline-none focus:ring-4 focus:ring-offset-2 focus:ring-cyan-500/50",
        "group overflow-hidden",
        // Glassmorphism effect
        "backdrop-blur-md",
        // Larger for first question
        isFirstQuestion 
          ? "px-8 py-6 text-lg sm:text-xl"
          : "px-6 py-5 text-base sm:text-lg",
        // Consistent sizing and contrast
        isSelected
          ? "bg-white/90 border-current shadow-xl text-gray-900"
          : "bg-white/40 border-white/30 hover:bg-white/60 hover:border-white/50 text-gray-800"
      )}
      style={{
        borderColor: isSelected ? accentColor : undefined,
        boxShadow: isSelected 
          ? `0 10px 40px ${accentColor}30, 0 0 0 1px ${accentColor}20` 
          : '0 4px 20px rgba(0, 0, 0, 0.05)',
      }}
    >
      {/* Glassmorphism background with gradient */}
      <div 
        className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"
        style={{
          background: `linear-gradient(135deg, ${accentColor}15, ${accentColor}05)`,
        }}
      />
      
      {/* Selected state gradient */}
      {isSelected && (
        <motion.div
          layoutId={`selected-${id}`}
          className="absolute inset-0 rounded-2xl"
          style={{
            background: `linear-gradient(135deg, ${accentColor}20, ${accentColor}10)`,
          }}
          initial={false}
          transition={{
            type: "spring",
            stiffness: 500,
            damping: 30,
          }}
        />
      )}

      {/* Animated border glow on selection */}
      {isSelected && (
        <motion.div
          className="absolute inset-0 rounded-2xl"
          style={{
            boxShadow: `0 0 0 2px ${accentColor}40, 0 0 20px ${accentColor}20`,
          }}
          animate={{
            boxShadow: [
              `0 0 0 2px ${accentColor}40, 0 0 20px ${accentColor}20`,
              `0 0 0 3px ${accentColor}30, 0 0 30px ${accentColor}15`,
              `0 0 0 2px ${accentColor}40, 0 0 20px ${accentColor}20`,
            ],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
      )}

      {/* Content - Consistent Typography */}
      <div className="relative flex items-center justify-between gap-4 z-10">
        <div className="flex items-center gap-3 flex-1">
          {/* Icon - Larger and animated for first question */}
          {Icon && (
            <motion.div
              animate={isSelected ? { scale: [1, 1.2, 1], rotate: [0, 10, -10, 0] } : {}}
              transition={{ duration: 0.5 }}
              className={cn(
                "flex-shrink-0",
                isFirstQuestion ? "w-8 h-8" : "w-6 h-6"
              )}
              style={{ color: isSelected ? accentColor : '#6B7280' }}
            >
              <Icon className="w-full h-full" />
            </motion.div>
          )}
          <span className={cn(
            "flex-1",
            isFirstQuestion ? "text-lg sm:text-xl" : "text-base sm:text-lg",
            isSelected ? "text-gray-900 font-bold" : "text-gray-800 font-medium"
          )}>
            {label}
          </span>
        </div>
        
        {/* Check icon with section color */}
        {isSelected && (
          <motion.div
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{
              type: "spring",
              stiffness: 500,
              damping: 25,
            }}
            className="flex-shrink-0"
          >
            <div 
              className="w-7 h-7 rounded-full flex items-center justify-center shadow-lg"
              style={{
                backgroundColor: accentColor,
                boxShadow: `0 4px 20px ${accentColor}50`,
              }}
            >
              <Check className="w-4 h-4 text-white" strokeWidth={3} />
            </div>
          </motion.div>
        )}
      </div>

      {/* Shimmer effect on hover */}
      <motion.div
        className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
        initial={{ x: '-100%' }}
        whileHover={{ x: '100%' }}
        transition={{
          duration: 0.6,
          ease: 'easeInOut',
        }}
      />
    </motion.button>
  );
}


