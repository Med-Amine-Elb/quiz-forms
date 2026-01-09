"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import dynamic from "next/dynamic";
import { Question, questions } from "@/data/questions";
import ContinueButton from "./ContinueButton";
import { getSectionForQuestion } from "@/lib/questionSections";

import Skeleton from "@/components/ui/skeleton";

const QuestionSkeleton = () => (
  <div className="w-full max-w-3xl mx-auto space-y-4">
    <Skeleton variant="rectangular" width="100%" height={60} />
    <Skeleton variant="rectangular" width="100%" height={200} />
    <Skeleton variant="rectangular" width="200px" height={50} />
  </div>
);

const ChoiceQuestion = dynamic(() => import("./ChoiceQuestion"), {
  loading: () => <QuestionSkeleton />,
});

const TextQuestion = dynamic(() => import("./TextQuestion"), {
  loading: () => <QuestionSkeleton />,
});

const RatingQuestion = dynamic(() => import("./RatingQuestion"), {
  loading: () => <QuestionSkeleton />,
});

const SatisfactionRating = dynamic(() => import("./SatisfactionRating"), {
  loading: () => <QuestionSkeleton />,
});

const ModernChoiceList = dynamic(() => import("./ModernChoiceList"), {
  loading: () => <QuestionSkeleton />,
});

const MultipleChoiceList = dynamic(() => import("./MultipleChoiceList"), {
  loading: () => <QuestionSkeleton />,
});

interface QuestionRendererProps {
  question: Question;
  onAnswer: (answer: string | number | string[]) => void;
}

export default function QuestionRenderer({
  question,
  onAnswer,
}: QuestionRendererProps) {
  const [selectedChoice, setSelectedChoice] = useState<string | null>(null);
  const [selectedMultipleChoices, setSelectedMultipleChoices] = useState<string[]>([]);
  const section = getSectionForQuestion(question.id);
  const accentColor = section.accent;
  const isFirstQuestion = question.id === 1;
  const isLastQuestion = question.id === questions.length;

  // Reset selected choice when question changes
  useEffect(() => {
    setSelectedChoice(null);
    setSelectedMultipleChoices([]);
  }, [question.id]);

  const handleContinue = () => {
    if (question.type === 'choice' && selectedChoice) {
      onAnswer(selectedChoice);
    } else if (question.type === 'multiple' && selectedMultipleChoices.length > 0) {
      onAnswer(selectedMultipleChoices);
    }
  };

  const handleMultipleSelect = (choiceIds: string[]) => {
    setSelectedMultipleChoices(choiceIds);
  };

  // Use modern design for questions with 4 or fewer choices
  const useModernDesign = question.type === 'choice' && question.choices && question.choices.length <= 4;

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={question.id}
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -15 }}
        transition={{
          duration: 0.4,
          ease: [0.16, 1, 0.3, 1],
        }}
        style={{
          willChange: 'transform, opacity',
        }}
      >
        {(() => {
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

            case 'multiple':
              return (
                <>
                  <div className="w-full mb-10">
                    <MultipleChoiceList
                      choices={question.choices || []}
                      onSelect={handleMultipleSelect}
                      selectedIds={selectedMultipleChoices}
                      accentColor={accentColor}
                      isFirstQuestion={isFirstQuestion}
                    />
                  </div>
                  <div className="w-full max-w-2xl mx-auto mt-8">
                    <ContinueButton
                      onClick={handleContinue}
                      disabled={selectedMultipleChoices.length === 0}
                      accentColor={accentColor}
                      sectionColor={section.color}
                    >
                      Continuer
                    </ContinueButton>
                  </div>
                </>
              );

            default:
              return <div>Type de question non supporté</div>;
          }
        })()}
      </motion.div>
    </AnimatePresence>
  );
}

