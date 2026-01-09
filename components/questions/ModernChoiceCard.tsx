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
  emoji?: string;
  title?: string;
  description?: string;
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
  emoji,
  title,
  description,
}: ModernChoiceCardProps) {
  // Check if this is a two-line format (has title and description)
  const isTwoLineFormat = title && description;
  return (
    <motion.button
      onClick={onClick}
      initial={{ opacity: 0, y: 20, scale: 0.96 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{
        duration: 0.5,
        delay: index * 0.08,
        ease: [0.16, 1, 0.3, 1],
      }}
      whileHover={{ 
        scale: 1.02,
        y: -4,
        transition: { 
          duration: 0.25,
          ease: [0.16, 1, 0.3, 1],
        },
      }}
      whileTap={{ 
        scale: 0.98,
        transition: { duration: 0.15 },
      }}
      style={{
        willChange: 'transform, opacity',
      }}
      className={cn(
        "relative w-full rounded-2xl text-left transition-all duration-300",
        "border-2 font-inter font-semibold",
        "focus:outline-none focus:ring-4 focus:ring-offset-2",
        "group overflow-hidden",
        // Glassmorphism effect
        "backdrop-blur-xl",
        // Larger for first question or two-line format
        isFirstQuestion 
          ? "px-8 py-6 text-lg sm:text-xl"
          : isTwoLineFormat
          ? "px-7 py-6 text-base sm:text-lg"
          : "px-6 py-4 text-base sm:text-lg",
        // Bright theme with high contrast
        isSelected
          ? "bg-white border-current shadow-2xl text-gray-900"
          : "bg-white/80 border-gray-300 hover:bg-white hover:border-gray-400 text-gray-800 hover:shadow-2xl hover:-translate-y-1"
      )}
      style={{
        borderColor: isSelected ? accentColor : undefined,
        boxShadow: isSelected 
          ? `0 20px 60px ${accentColor}50, 0 0 0 2px ${accentColor}40, inset 0 1px 0 rgba(255,255,255,0.8)` 
          : '0 8px 32px rgba(0, 0, 0, 0.1)',
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
          {/* Emoji or Icon */}
          {emoji ? (
            <motion.div
              animate={isSelected ? { scale: [1, 1.2, 1], rotate: [0, 10, -10, 0] } : {}}
              transition={{ duration: 0.5 }}
              className={cn(
                "flex-shrink-0 leading-none",
                isFirstQuestion ? "text-4xl" : isTwoLineFormat ? "text-4xl" : "text-3xl"
              )}
            >
              {emoji}
            </motion.div>
          ) : Icon && (
            <motion.div
              animate={isSelected ? { scale: [1, 1.2, 1], rotate: [0, 10, -10, 0] } : {}}
              transition={{ duration: 0.5 }}
              className={cn(
                "flex-shrink-0",
                isFirstQuestion ? "w-8 h-8" : "w-6 h-6"
              )}
              style={{ color: isSelected ? accentColor : '#4B5563' }}
            >
              <Icon className="w-full h-full" />
            </motion.div>
          )}
          
          {/* Two-line format (title + description) or single line */}
          {isTwoLineFormat ? (
            <div className="flex-1 space-y-2">
              <div className={cn(
                "font-extrabold leading-tight",
                isFirstQuestion ? "text-xl sm:text-2xl" : "text-lg sm:text-xl",
                isSelected ? "text-gray-900" : "text-gray-800 group-hover:text-gray-900"
              )}>
                {title}
              </div>
              <div className={cn(
                "text-sm sm:text-base leading-relaxed font-medium",
                isSelected ? "text-gray-700" : "text-gray-600 group-hover:text-gray-700"
              )}>
                {description}
              </div>
            </div>
          ) : (
            <span className={cn(
              "flex-1",
              isFirstQuestion ? "text-lg sm:text-xl" : "text-base sm:text-lg",
              isSelected ? "text-gray-900 font-extrabold" : "text-gray-800 font-semibold group-hover:text-gray-900 group-hover:font-bold"
            )}>
              {label}
            </span>
          )}
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


