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

interface ModernChoiceListProps {
  choices: Choice[];
  onSelect: (choiceId: string) => void;
  selectedId?: string | null;
  accentColor?: string;
  isFirstQuestion?: boolean;
}

export default function ModernChoiceList({
  choices,
  onSelect,
  selectedId,
  accentColor,
  isFirstQuestion = false,
}: ModernChoiceListProps) {
  // Stack vertically for 3 or fewer choices
  const isVerticalLayout = choices.length <= 3;
  
  return (
    <div className={`w-full mx-auto ${isVerticalLayout ? 'max-w-3xl' : 'max-w-2xl'}`}>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
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
            isSelected={selectedId === choice.id}
            onClick={() => onSelect(choice.id)}
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


