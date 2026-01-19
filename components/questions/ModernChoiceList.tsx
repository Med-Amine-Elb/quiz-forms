"use client";

import { motion } from "framer-motion";
import ModernChoiceCard from "./ModernChoiceCard";

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
  // Ensure accentColor is always defined
  const finalAccentColor = accentColor || '#0EA5E9';
  
  return (
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
        className="flex flex-col gap-4"
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
            className="transform-gpu w-full"
          >
            <ModernChoiceCard
              id={choice.id}
              label={choice.label}
              isSelected={selectedId === choice.id}
              onClick={() => onSelect(choice.id)}
              index={0} // Set to 0 since we're handling stagger in parent
              accentColor={finalAccentColor}
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
  );
}


