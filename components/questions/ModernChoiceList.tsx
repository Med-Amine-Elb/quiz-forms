"use client";

import { motion } from "framer-motion";
import ModernChoiceCard from "./ModernChoiceCard";

interface Choice {
  id: string;
  label: string;
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
  return (
    <div className="w-full max-w-2xl mx-auto">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
        className="grid grid-cols-1 sm:grid-cols-2 gap-5"
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
          />
        ))}
      </motion.div>
    </div>
  );
}


