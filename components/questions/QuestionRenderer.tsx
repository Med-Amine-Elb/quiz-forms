"use client";

import { useState } from "react";
import { Question } from "@/data/questions";
import ChoiceQuestion from "./ChoiceQuestion";
import TextQuestion from "./TextQuestion";
import RatingQuestion from "./RatingQuestion";
import ModernChoiceList from "./ModernChoiceList";
import SatisfactionRating from "./SatisfactionRating";
import { getSectionForQuestion } from "@/lib/questionSections";

interface QuestionRendererProps {
  question: Question;
  onAnswer: (answer: string | number | string[]) => void;
}

export default function QuestionRenderer({
  question,
  onAnswer,
}: QuestionRendererProps) {
  const [selectedChoice, setSelectedChoice] = useState<string | null>(null);
  const section = getSectionForQuestion(question.id);
  const accentColor = section.accent;

  const handleContinue = () => {
    if (question.type === 'choice' && selectedChoice) {
      onAnswer(selectedChoice);
    }
  };

  // Use modern design for questions with 4 or fewer choices
  const useModernDesign = question.type === 'choice' && question.choices && question.choices.length <= 4;

  switch (question.type) {
    case 'choice':
      if (useModernDesign) {
        return (
          <>
            <div className="w-full mb-8">
              <ModernChoiceList
                choices={question.choices || []}
                onSelect={setSelectedChoice}
                selectedId={selectedChoice}
                accentColor={accentColor}
              />
            </div>
            <div className="w-full max-w-2xl mx-auto">
              <button
                onClick={handleContinue}
                disabled={!selectedChoice}
                className="w-full px-8 py-4 rounded-2xl text-white font-bold text-base sm:text-lg shadow-lg transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 font-inter"
                style={{
                  background: `linear-gradient(to right, ${accentColor}, ${section.color})`,
                  boxShadow: `0 10px 40px ${accentColor}40`,
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.boxShadow = `0 15px 50px ${accentColor}60`;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.boxShadow = `0 10px 40px ${accentColor}40`;
                }}
              >
                Continuer
              </button>
            </div>
          </>
        );
      }
      return (
        <ChoiceQuestion
          choices={question.choices || []}
          onSelect={setSelectedChoice}
          selectedId={selectedChoice}
          onContinue={handleContinue}
        />
      );

    case 'text':
      return (
        <TextQuestion
          placeholder={question.placeholder}
          onContinue={onAnswer}
          required={question.required}
        />
      );

    case 'rating':
      return (
        <RatingQuestion
          onContinue={onAnswer}
          required={question.required}
        />
      );

    case 'satisfaction':
      return (
        <SatisfactionRating
          onSelect={(value) => {
            setSelectedChoice(value);
          }}
          onSubmit={(value) => {
            onAnswer(value);
          }}
          selectedId={selectedChoice}
        />
      );

    default:
      return <div>Type de question non supporté</div>;
  }
}

