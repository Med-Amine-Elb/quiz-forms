"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { ArrowLeft } from "lucide-react";
import InteractiveChoiceList from "@/components/ui/InteractiveChoiceList";
import { QuestionChoice } from "@/data/questions";
import ContinueButton from "./ContinueButton";

interface ChoiceQuestionProps {
  choices: QuestionChoice[];
  onSelect: (choiceId: string) => void;
  selectedId?: string | null;
  onContinue: () => void;
  continueButtonText?: string;
  accentColor?: string;
  sectionColor?: string;
  onPrevious?: () => void;
  showPreviousButton?: boolean;
}

export default function ChoiceQuestion({
  choices,
  onSelect,
  selectedId,
  onContinue,
  continueButtonText = "Continuer",
  accentColor,
  sectionColor,
  onPrevious,
  showPreviousButton = false,
}: ChoiceQuestionProps) {
  // Ensure accentColor is always defined, use prop value if provided
  // If accentColor is not provided, fallback to a default, but prioritize the prop
  const finalAccentColor = accentColor || "#06b6d4";
  
  return (
    <>
      {/* Choices List */}
      <div className="w-full mb-8">
        <InteractiveChoiceList
          choices={choices}
          onSelect={onSelect}
          selectedId={selectedId}
          accentColor={finalAccentColor}
        />
      </div>

      {/* Continue Button */}
      <div className="w-full max-w-4xl mx-auto flex gap-4">
        {showPreviousButton && onPrevious && (
          <motion.button
            onClick={onPrevious}
            whileHover={{ scale: 1.02, x: -2 }}
            whileTap={{ scale: 0.98 }}
            className="flex items-center justify-center gap-2 px-6 py-4 rounded-2xl bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold text-base sm:text-lg transition-colors duration-200 font-inter flex-shrink-0"
            aria-label="Retour à la question précédente"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Précédent</span>
          </motion.button>
        )}
        <div className="flex-1">
          <ContinueButton
            onClick={onContinue}
            disabled={!selectedId}
            accentColor={finalAccentColor}
            sectionColor={sectionColor}
          >
            {continueButtonText}
          </ContinueButton>
        </div>
      </div>
    </>
  );
}

