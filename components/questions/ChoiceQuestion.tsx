"use client";

import { useState } from "react";
import InteractiveChoiceList from "@/components/ui/InteractiveChoiceList";
import { QuestionChoice } from "@/data/questions";

interface ChoiceQuestionProps {
  choices: QuestionChoice[];
  onSelect: (choiceId: string) => void;
  selectedId?: string | null;
  onContinue: () => void;
  continueButtonText?: string;
}

export default function ChoiceQuestion({
  choices,
  onSelect,
  selectedId,
  onContinue,
  continueButtonText = "Continuer",
}: ChoiceQuestionProps) {
  return (
    <>
      {/* Choices List */}
      <div className="w-full mb-8">
        <InteractiveChoiceList
          choices={choices}
          onSelect={onSelect}
          selectedId={selectedId}
        />
      </div>

      {/* Continue Button */}
      <div className="w-full max-w-4xl mx-auto">
        <button
          onClick={onContinue}
          disabled={!selectedId}
          className="px-8 py-4 rounded-2xl bg-gradient-to-r from-cyan-400 to-cyan-500 text-gray-900 font-bold text-base sm:text-lg shadow-lg shadow-cyan-500/30 hover:shadow-cyan-400/50 transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 font-inter"
        >
          {continueButtonText}
        </button>
      </div>
    </>
  );
}

