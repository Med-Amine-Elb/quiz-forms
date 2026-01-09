"use client";

import { motion } from "framer-motion";
import ModernChoiceCard from "./ModernChoiceCard";

interface Choice {
  id: string;
  label: string;
  emoji?: string;
  title?: string;
  description?: string;
}

interface MultipleChoiceListProps {
  choices: Choice[];
  onSelect: (choiceIds: string[]) => void;
  selectedIds?: string[];
  accentColor?: string;
  isFirstQuestion?: boolean;
}

export default function MultipleChoiceList({
  choices,
  onSelect,
  selectedIds = [],
  accentColor,
  isFirstQuestion = false,
}: MultipleChoiceListProps) {
  const handleToggle = (choiceId: string) => {
    const newSelectedIds = selectedIds.includes(choiceId)
      ? selectedIds.filter(id => id !== choiceId)
      : [...selectedIds, choiceId];
    onSelect(newSelectedIds);
  };

  // Stack vertically for 3 or fewer choices
  const isVerticalLayout = choices.length <= 3;
  
  return (
    <div className={`w-full mx-auto max-w-4xl`}>
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
        className={`grid gap-5 ${
          isVerticalLayout 
            ? 'grid-cols-1' 
            : 'grid-cols-1 sm:grid-cols-2'
        }`}
      >
        {choices.map((choice, index) => (
          <ModernChoiceCard
            key={choice.id}
            id={choice.id}
            label={choice.label}
            isSelected={selectedIds.includes(choice.id)}
            onClick={() => handleToggle(choice.id)}
            index={index}
            accentColor={accentColor}
            icon={(choice as any).icon}
            isFirstQuestion={isFirstQuestion}
            emoji={choice.emoji}
            title={choice.title}
            description={choice.description}
          />
        ))}
      </motion.div>
    </div>
  );
}




