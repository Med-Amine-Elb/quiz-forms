"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft } from "lucide-react";
import dynamic from "next/dynamic";
import { Question, questions } from "@/data/questions";
import ContinueButton from "./ContinueButton";
import { getSectionForQuestion } from "@/lib/questionSections";
import { preloadQuestionType } from "@/lib/preloadQuestionComponents";

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

const RatingSlider = dynamic(() => import("./RatingSlider"), {
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
  const [autreText, setAutreText] = useState<string>(""); // Text input for "Autre" option
  const [showAutreInput, setShowAutreInput] = useState<boolean>(false); // Track if we're in "Autre" input mode
  const section = getSectionForQuestion(question.id);
  const accentColor = section.accent;
  const isFirstQuestion = question.id === 1;
  const isLastQuestion = question.id === questions.length;

  // Helper function to check if a choice is an "Autre" option
  const isAutreChoice = (choiceId: string): boolean => {
    const choice = question.choices?.find(c => c.id === choiceId);
    return choice ? /autre/i.test(choice.label) : false;
  };

  // Reset selected choice when question changes
  useEffect(() => {
    setSelectedChoice(null);
    setSelectedMultipleChoices([]);
    setAutreText(""); // Reset "Autre" text when question changes
    setShowAutreInput(false); // Reset "Autre" input mode
    
    // Preload the next question's component type for instant loading
    const currentIndex = questions.findIndex(q => q.id === question.id);
    if (currentIndex >= 0 && currentIndex < questions.length - 1) {
      const nextQuestion = questions[currentIndex + 1];
      preloadQuestionType(nextQuestion.type);
    }
    
    // Also preload current question type if not already loaded
    preloadQuestionType(question.type);
  }, [question.id]);

  // Handle "Autre" selection - show input mode
  useEffect(() => {
    if (selectedChoice && isAutreChoice(selectedChoice)) {
      setShowAutreInput(true);
    } else if (selectedChoice && !isAutreChoice(selectedChoice)) {
      setShowAutreInput(false);
      setAutreText("");
    }
  }, [selectedChoice]);

  // Handler for when "Autre" is selected
  const handleAutreSelect = (choiceId: string) => {
    setSelectedChoice(choiceId);
    setShowAutreInput(true);
  };

  // Handler for back button - return to choices
  const handleBackToChoices = () => {
    setShowAutreInput(false);
    // Keep the selection but hide the input mode
  };

  const handleContinue = () => {
    if (question.type === 'choice' && selectedChoice) {
      // If "Autre" is selected, combine choice ID with text
      if (isAutreChoice(selectedChoice)) {
        const combinedAnswer = autreText.trim() 
          ? `${selectedChoice}|${autreText.trim()}` 
          : selectedChoice;
        onAnswer(combinedAnswer);
      } else {
        onAnswer(selectedChoice);
      }
    } else if (question.type === 'multiple' && selectedMultipleChoices.length > 0) {
      onAnswer(selectedMultipleChoices);
    }
  };

  // Check if continue button should be disabled
  const isContinueDisabled = () => {
    if (question.type === 'choice') {
      if (!selectedChoice) return true;
      // If "Autre" is selected, require text input
      if (isAutreChoice(selectedChoice)) {
        return !autreText.trim();
      }
      return false;
    }
    if (question.type === 'multiple') {
      return selectedMultipleChoices.length === 0;
    }
    return true;
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
                    <AnimatePresence mode="wait">
                      {!showAutreInput ? (
                        // Show choice list
                        <motion.div
                          key="choices"
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: 20 }}
                          transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                          className="w-full mb-10"
                          style={{ willChange: 'transform, opacity' }}
                        >
                          <ModernChoiceList
                            choices={question.choices || []}
                            onSelect={(choiceId) => {
                              if (isAutreChoice(choiceId)) {
                                handleAutreSelect(choiceId);
                              } else {
                                setSelectedChoice(choiceId);
                              }
                            }}
                            selectedId={selectedChoice}
                            accentColor={accentColor}
                            isFirstQuestion={isFirstQuestion}
                          />
                        </motion.div>
                      ) : (
                        // Show "Autre" text input with back button
                        <motion.div
                          key="autre-input"
                          initial={{ opacity: 0, x: 20 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: -20 }}
                          transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                          className="w-full max-w-2xl mx-auto mb-10"
                          style={{ willChange: 'transform, opacity' }}
                        >
                          {/* Back Button */}
                          <motion.button
                            onClick={handleBackToChoices}
                            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 font-inter font-semibold mb-6 transition-colors duration-200 group"
                            whileHover={{ x: -4 }}
                            whileTap={{ scale: 0.95 }}
                          >
                            <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
                            <span>Retour aux options</span>
                          </motion.button>

                          {/* Text Input */}
                          <div className="relative">
                            <motion.div
                              className="relative rounded-2xl backdrop-blur-xl border-2 overflow-hidden transition-all duration-300 bg-white/90"
                              style={{
                                borderColor: accentColor,
                                boxShadow: `0 10px 40px ${accentColor}20, 0 4px 12px rgba(0,0,0,0.08)`,
                              }}
                            >
                              <label
                                htmlFor="autre-input"
                                className="absolute left-5 top-4 pointer-events-none font-inter font-semibold text-sm flex items-center gap-2"
                                style={{ color: accentColor }}
                              >
                                <span>✍️</span>
                                Précisez votre réponse
                              </label>
                              <textarea
                                id="autre-input"
                                value={autreText}
                                onChange={(e) => {
                                  setAutreText(e.target.value);
                                  // Auto-resize
                                  e.target.style.height = 'auto';
                                  e.target.style.height = `${Math.min(e.target.scrollHeight, 200)}px`;
                                }}
                                placeholder="Décrivez votre réponse..."
                                className="w-full rounded-2xl px-5 pt-10 pb-8 border-none focus:ring-0 text-gray-900 resize-none bg-transparent focus:outline-none leading-relaxed text-base font-inter"
                                style={{ minHeight: '120px', maxHeight: '200px', overflowY: 'auto' }}
                                autoFocus
                                rows={3}
                                maxLength={500}
                              />
                              <div className="absolute bottom-3 right-5 text-xs text-gray-400 font-inter">
                                {autreText.length}/500
                              </div>
                            </motion.div>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                    
                    <div className="w-full max-w-2xl mx-auto mt-8">
                      <ContinueButton
                        onClick={handleContinue}
                        disabled={isContinueDisabled()}
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
                <>
                  <AnimatePresence mode="wait">
                    {!showAutreInput ? (
                      // Show choice list
                      <motion.div
                        key="choices"
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 20 }}
                        transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                        style={{ willChange: 'transform, opacity' }}
                      >
                        <ChoiceQuestion
                          choices={question.choices || []}
                          onSelect={(choiceId) => {
                            if (isAutreChoice(choiceId)) {
                              handleAutreSelect(choiceId);
                            } else {
                              setSelectedChoice(choiceId);
                            }
                          }}
                          selectedId={selectedChoice}
                          onContinue={handleContinue}
                          accentColor={accentColor}
                          sectionColor={section.color}
                          disabled={isContinueDisabled()}
                        />
                      </motion.div>
                    ) : (
                      // Show "Autre" text input with back button
                      <motion.div
                        key="autre-input"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                        className="w-full max-w-4xl mx-auto mb-6"
                        style={{ willChange: 'transform, opacity' }}
                      >
                        {/* Back Button */}
                        <motion.button
                          onClick={handleBackToChoices}
                          className="flex items-center gap-2 text-gray-600 hover:text-gray-900 font-inter font-semibold mb-6 transition-colors duration-200 group"
                          whileHover={{ x: -4 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
                          <span>Retour aux options</span>
                        </motion.button>

                        {/* Text Input */}
                        <div className="relative">
                          <motion.div
                            className="relative rounded-2xl backdrop-blur-xl border-2 overflow-hidden transition-all duration-300 bg-white/90"
                            style={{
                              borderColor: accentColor,
                              boxShadow: `0 10px 40px ${accentColor}20, 0 4px 12px rgba(0,0,0,0.08)`,
                            }}
                          >
                            <label
                              htmlFor="autre-input-legacy"
                              className="absolute left-5 top-4 pointer-events-none font-inter font-semibold text-sm flex items-center gap-2"
                              style={{ color: accentColor }}
                            >
                              <span>✍️</span>
                              Précisez votre réponse
                            </label>
                            <textarea
                              id="autre-input-legacy"
                              value={autreText}
                              onChange={(e) => {
                                setAutreText(e.target.value);
                                // Auto-resize
                                e.target.style.height = 'auto';
                                e.target.style.height = `${Math.min(e.target.scrollHeight, 200)}px`;
                              }}
                              placeholder="Décrivez votre réponse..."
                              className="w-full rounded-2xl px-5 pt-10 pb-8 border-none focus:ring-0 text-gray-900 resize-none bg-transparent focus:outline-none leading-relaxed text-base font-inter"
                              style={{ minHeight: '120px', maxHeight: '200px', overflowY: 'auto' }}
                              autoFocus
                              rows={3}
                              maxLength={500}
                            />
                            <div className="absolute bottom-3 right-5 text-xs text-gray-400 font-inter">
                              {autreText.length}/500
                            </div>
                          </motion.div>
                        </div>
                        
                        {/* Continue Button */}
                        <div className="w-full max-w-4xl mx-auto mt-8">
                          <ContinueButton
                            onClick={handleContinue}
                            disabled={isContinueDisabled()}
                            accentColor={accentColor}
                            sectionColor={section.color}
                          >
                            Continuer
                          </ContinueButton>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </>
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
                      questionId={question.id}
                    />
                  </div>
                  <div className="w-full max-w-2xl mx-auto mt-8">
                    <ContinueButton
                      onClick={handleContinue}
                      disabled={selectedMultipleChoices.length === 0}
                      accentColor={accentColor}
                      sectionColor={section.color}
                    >
                      {selectedMultipleChoices.length > 0 
                        ? `Continuer avec ${selectedMultipleChoices.length} ${selectedMultipleChoices.length === 1 ? 'sélection' : 'sélections'}`
                        : 'Sélectionnez au moins une option'
                      }
                    </ContinueButton>
                  </div>
                </>
              );

            case 'slider':
              return (
                <RatingSlider
                  onContinue={onAnswer}
                  required={question.required}
                  accentColor={accentColor}
                  sectionColor={section.color}
                  min={question.sliderConfig?.min}
                  max={question.sliderConfig?.max}
                  labels={question.sliderConfig?.labels}
                />
              );

            default:
              return <div>Type de question non supporté</div>;
          }
        })()}
      </motion.div>
    </AnimatePresence>
  );
}

