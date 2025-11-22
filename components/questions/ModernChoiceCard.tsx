"use client";

import { motion } from "framer-motion";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

interface ModernChoiceCardProps {
  id: string;
  label: string;
  isSelected: boolean;
  onClick: () => void;
  index: number;
  accentColor?: string;
}

export default function ModernChoiceCard({
  id,
  label,
  isSelected,
  onClick,
  index,
  accentColor = '#0EA5E9',
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
        "relative w-full px-6 py-5 rounded-2xl text-left transition-all duration-300",
        "border-2 font-inter text-base sm:text-lg font-medium",
        "focus:outline-none focus:ring-2 focus:ring-offset-2",
        "group overflow-hidden",
        // Glassmorphism effect
        "backdrop-blur-md",
        isSelected
          ? "bg-white/90 border-current shadow-xl"
          : "bg-white/40 border-white/30 hover:bg-white/60 hover:border-white/50"
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

      {/* Content */}
      <div className="relative flex items-center justify-between gap-4 z-10">
        <span className={cn(
          "flex-1",
          isSelected ? "text-gray-900 font-semibold" : "text-gray-700"
        )}>
          {label}
        </span>
        
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


