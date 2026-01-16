"use client";

import { motion } from "framer-motion";
import { useState, useCallback } from "react";
import ModernChoiceCard from "./ModernChoiceCard";
import AnswerHoverCard from "@/components/ui/AnswerHoverCard";

interface Choice {
  id: string;
  label: string;
  emoji?: string;
  title?: string;
  description?: string;
  icon?: any;
}

interface ModernChoiceListProps {
  choices: Choice[];
  onSelect: (choiceId: string) => void;
  selectedId?: string | null;
  accentColor?: string;
  isFirstQuestion?: boolean;
  questionId?: number;
}

export default function ModernChoiceList({
  choices,
  onSelect,
  selectedId,
  accentColor,
  isFirstQuestion = false,
  questionId,
}: ModernChoiceListProps) {
  // Stack vertically for 3 or fewer choices
  const isVerticalLayout = choices.length <= 3;
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

      <div className={`w-full mx-auto max-w-4xl`}>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ 
          duration: 0.4,
          ease: [0.16, 1, 0.3, 1],
        }}
        style={{
          willChange: 'opacity',
        }}
        className={`grid gap-5 ${
          isVerticalLayout 
            ? 'grid-cols-1' 
            : 'grid-cols-1 sm:grid-cols-2'
        }`}
      >
        {choices.map((choice, index) => (
          <motion.div
            key={choice.id}
            initial={{ opacity: 0, y: 30, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{
              duration: 0.5,
              delay: index * 0.08, // Stagger delay
              ease: [0.16, 1, 0.3, 1],
            }}
            whileHover={{
              transition: { duration: 0.2 },
            }}
            style={{ willChange: 'transform, opacity' }}
            className="transform-gpu"
          >
            <ModernChoiceCard
              id={choice.id}
              label={choice.label}
              isSelected={selectedId === choice.id}
              onClick={() => onSelect(choice.id)}
              onHoverChange={(isHovered: boolean) => {
                setHoveredChoiceId(isHovered ? choice.id : null);
              }}
              onTruncationChange={(isTruncated: boolean) => {
                handleTruncationChange(choice.id, isTruncated);
              }}
              index={0} // Set to 0 since we're handling stagger in parent
              accentColor={accentColor}
              icon={(choice as any).icon}
              isFirstQuestion={isFirstQuestion}
              emoji={choice.emoji}
              title={choice.title}
              description={choice.description}
              questionId={questionId}
            />
          </motion.div>
        ))}
      </motion.div>
    </div>
    </>
  );
}


