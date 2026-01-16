"use client";

import { motion } from "framer-motion";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";
import type { LucideIcon } from "lucide-react";
import { useState, useRef, useEffect, useCallback } from "react";
import AnswerHoverCard from "./AnswerHoverCard";

interface Choice {
  id: string;
  label: string;
  icon?: LucideIcon;
  emoji?: string;
  title?: string;
  description?: string;
}

interface InteractiveChoiceListProps {
  choices: Choice[];
  onSelect: (choiceId: string) => void;
  selectedId?: string | null;
  accentColor?: string;
}

// Individual choice item component that can use hooks
function ChoiceItem({
  choice,
  index,
  isSelected,
  accentColor,
  onSelect,
  onHover,
  onTruncationChange,
}: {
  choice: Choice;
  index: number;
  isSelected: boolean;
  accentColor: string;
  onSelect: () => void;
  onHover: (isHovered: boolean) => void;
  onTruncationChange: (isTruncated: boolean) => void;
}) {
  const textRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const checkTruncation = () => {
      if (textRef.current) {
        // Check if text is truncated by comparing scrollHeight with clientHeight
        // For line-clamp, scrollHeight > clientHeight means text is truncated
        const isOverflowing = textRef.current.scrollHeight > textRef.current.clientHeight;
        onTruncationChange(isOverflowing);
      }
    };

    // Check after a small delay to ensure DOM is ready
    const timer = setTimeout(checkTruncation, 100);
    // Recheck on resize
    window.addEventListener('resize', checkTruncation);
    
    return () => {
      clearTimeout(timer);
      window.removeEventListener('resize', checkTruncation);
    };
  }, [onTruncationChange]);

  const displayText = choice.label;

  return (
    <motion.button
      onClick={onSelect}
      onMouseEnter={() => onHover(true)}
      onMouseLeave={() => onHover(false)}
      initial={{ opacity: 0, y: 20, scale: 0.96 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{
        duration: 0.5,
        delay: index * 0.06,
        ease: [0.16, 1, 0.3, 1],
      }}
      whileHover={{ 
        scale: 1.05,
        y: -8,
        transition: { 
          duration: 0.3,
          ease: [0.16, 1, 0.3, 1],
        },
      }}
      whileTap={{ 
        scale: 0.95,
        transition: { duration: 0.15 },
      }}
      className={cn(
        "relative px-6 py-5 rounded-2xl text-left transition-all duration-300",
        "border-2 font-inter font-semibold",
        "focus:outline-none focus:ring-4 focus:ring-offset-2",
        "group overflow-hidden backdrop-blur-xl transform-gpu",
        isSelected
          ? "bg-white border-current shadow-2xl text-gray-900"
          : "bg-white/80 border-gray-300 hover:bg-white hover:border-gray-400 text-gray-800 hover:shadow-2xl"
      )}
      style={{
        borderColor: isSelected ? accentColor : undefined,
        boxShadow: isSelected 
          ? `0 20px 60px ${accentColor}50, 0 0 0 2px ${accentColor}40, inset 0 1px 0 rgba(255,255,255,0.8), 0 0 40px ${accentColor}30` 
          : '0 8px 32px rgba(0, 0, 0, 0.1)',
      }}
    >
      {/* Glassmorphism background */}
      <motion.div 
        className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100"
        style={{
          background: `linear-gradient(135deg, ${accentColor}20, ${accentColor}08)`,
        }}
        animate={isSelected ? {
          opacity: 1,
          background: [
            `linear-gradient(135deg, ${accentColor}20, ${accentColor}08)`,
            `linear-gradient(225deg, ${accentColor}25, ${accentColor}10)`,
            `linear-gradient(135deg, ${accentColor}20, ${accentColor}08)`,
          ],
        } : {}}
        transition={{
          duration: 3,
          repeat: isSelected ? Infinity : 0,
          ease: 'easeInOut',
        }}
      />
      
      {/* Selected state gradient */}
      {isSelected && (
        <motion.div
          layoutId={`selected-${choice.id}`}
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

      {/* Animated border glow */}
      {isSelected && (
        <motion.div
          className="absolute inset-0 rounded-2xl"
          style={{
            boxShadow: `0 0 0 2px ${accentColor}40, 0 0 20px ${accentColor}20`,
          }}
          animate={{
            boxShadow: [
              `0 0 0 2px ${accentColor}40, 0 0 20px ${accentColor}20`,
              `0 0 0 3px ${accentColor}50, 0 0 35px ${accentColor}25`,
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

      <div className="relative flex items-center justify-between gap-3 z-10">
        <div className="flex items-center gap-3 flex-1 min-w-0">
          {/* Icon or Emoji */}
          {choice.icon ? (
            <motion.div
              animate={isSelected ? { 
                scale: [1, 1.3, 1.1], 
                rotate: [0, 15, -15, 0],
                y: [0, -3, 0]
              } : {
                scale: 1,
                rotate: 0
              }}
              transition={{ 
                duration: 0.6,
                ease: [0.16, 1, 0.3, 1]
              }}
              whileHover={!isSelected ? {
                scale: 1.15,
                rotate: [0, 5, -5, 0],
                transition: { duration: 0.3 }
              } : {}}
              className="flex-shrink-0 w-7 h-7 sm:w-8 sm:h-8"
              style={{ color: isSelected ? accentColor : '#4B5563' }}
            >
              <choice.icon className="w-full h-full" strokeWidth={isSelected ? 2.5 : 2} />
            </motion.div>
          ) : choice.emoji ? (
            <motion.div
              animate={isSelected ? { 
                scale: [1, 1.3, 1.1], 
                rotate: [0, 15, -15, 0],
                y: [0, -5, 0]
              } : {
                scale: 1,
                rotate: 0
              }}
              transition={{ 
                duration: 0.6,
                ease: [0.16, 1, 0.3, 1]
              }}
              whileHover={!isSelected ? {
                scale: 1.2,
                rotate: [0, 5, -5, 0],
                transition: { duration: 0.3 }
              } : {}}
              className="flex-shrink-0 leading-none text-3xl sm:text-4xl"
            >
              {choice.emoji}
            </motion.div>
          ) : null}
          
          {/* Text - Show full text, allow wrapping for longer labels */}
          <span 
            ref={textRef}
            className={cn(
              "flex-1 font-extrabold text-base sm:text-lg leading-tight",
              isSelected ? "text-gray-900" : "text-gray-800 group-hover:text-gray-900",
              // Allow text to wrap if it's too long, but prefer single line
              "line-clamp-2"
            )}
          >
            {displayText}
          </span>
        </div>
        
        {/* Check icon */}
        {isSelected && (
          <motion.div
            initial={{ scale: 0, rotate: -180, opacity: 0 }}
            animate={{ 
              scale: 1, 
              rotate: 0,
              opacity: 1,
            }}
            transition={{
              type: "spring",
              stiffness: 600,
              damping: 20,
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

      {/* Shimmer effect */}
      <motion.div
        className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent"
        initial={{ x: '-100%' }}
        whileHover={{ x: '100%' }}
        transition={{
          duration: 0.8,
          ease: 'easeInOut',
        }}
      />
      
      {/* Pulse animation */}
      {isSelected && (
        <motion.div
          className="absolute inset-0 rounded-2xl"
          style={{
            background: `radial-gradient(circle at center, ${accentColor}20, transparent 70%)`,
          }}
          animate={{
            opacity: [0.6, 0.9, 0.6],
            scale: [1, 1.08, 1],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
      )}
    </motion.button>
  );
}

export default function InteractiveChoiceList({
  choices,
  onSelect,
  selectedId,
  accentColor = '#0EA5E9',
}: InteractiveChoiceListProps) {
  const [hoveredChoiceId, setHoveredChoiceId] = useState<string | null>(null);
  const [truncatedChoices, setTruncatedChoices] = useState<Set<string>>(new Set());
  const hoveredChoice = choices.find(c => c.id === hoveredChoiceId);
  
  // Check if hovered choice should show card (truncated or has description)
  const shouldShowCard = hoveredChoice && (
    truncatedChoices.has(hoveredChoice.id) || 
    (hoveredChoice.description && hoveredChoice.description.trim().length > 0)
  );

  const handleTruncationChange = useCallback((choiceId: string, isTruncated: boolean) => {
    setTruncatedChoices(prev => {
      const next = new Set(prev);
      if (isTruncated) {
        next.add(choiceId);
      } else {
        next.delete(choiceId);
      }
      return next;
    });
  }, []);

  return (
    <>
      {/* Hover Card - only show when text is actually truncated or has description */}
      {hoveredChoice && shouldShowCard && (
        <AnswerHoverCard
          key={hoveredChoice.id}
          label={hoveredChoice.label}
          description={hoveredChoice.description}
          icon={hoveredChoice.icon}
          emoji={hoveredChoice.emoji}
          accentColor={accentColor}
          isVisible={!!hoveredChoiceId}
        />
      )}

      <div className="w-full max-w-4xl mx-auto">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {choices.map((choice, index) => (
            <ChoiceItem
              key={choice.id}
              choice={choice}
              index={index}
              isSelected={selectedId === choice.id}
              accentColor={accentColor}
              onSelect={() => onSelect(choice.id)}
              onHover={(isHovered) => setHoveredChoiceId(isHovered ? choice.id : null)}
              onTruncationChange={(isTruncated) => handleTruncationChange(choice.id, isTruncated)}
            />
          ))}
        </div>
      </div>
    </>
  );
}
