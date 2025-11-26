"use client";

import { useState } from "react";
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
}

export default function ChoiceQuestion({
  choices,
  onSelect,
  selectedId,
  onContinue,
  continueButtonText = "Continuer",
  accentColor = "#06b6d4",
  sectionColor,
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
        <ContinueButton
          onClick={onContinue}
          disabled={!selectedId}
          accentColor={accentColor}
          sectionColor={sectionColor}
        >
          {continueButtonText}
        </ContinueButton>
      </div>
    </>
  );
}

