"use client";

import { useState } from "react";
import { Question } from "@/data/questions";
import ChoiceQuestion from "./ChoiceQuestion";
import TextQuestion from "./TextQuestion";
import RatingQuestion from "./RatingQuestion";
import ModernChoiceList from "./ModernChoiceList";
import SatisfactionRating from "./SatisfactionRating";
import ContinueButton from "./ContinueButton";
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
  const isFirstQuestion = question.id === 1;
  const isLastQuestion = question.id === 23; // Total questions = 23

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
            <div className="w-full mb-10">
              <ModernChoiceList
                choices={question.choices || []}
                onSelect={setSelectedChoice}
                selectedId={selectedChoice}
                accentColor={accentColor}
                isFirstQuestion={isFirstQuestion}
              />
            </div>
            <div className="w-full max-w-2xl mx-auto mt-8">
              <ContinueButton
                onClick={handleContinue}
                disabled={!selectedChoice}
                accentColor={accentColor}
                sectionColor={section.color}
              >
                Continuer
              </ContinueButton>
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
          accentColor={accentColor}
          sectionColor={section.color}
        />
      );

    case 'text':
      return (
        <TextQuestion
          placeholder={question.placeholder}
          onContinue={onAnswer}
          required={question.required}
          accentColor={accentColor}
          maxLength={question.maxLength}
          isLastQuestion={isLastQuestion}
          autoFocus={true}
        />
      );

    case 'rating':
      return (
        <RatingQuestion
          onContinue={onAnswer}
          required={question.required}
          accentColor={accentColor}
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
          accentColor={accentColor}
          sectionColor={section.color}
        />
      );

    default:
      return <div>Type de question non supporté</div>;
  }
}

