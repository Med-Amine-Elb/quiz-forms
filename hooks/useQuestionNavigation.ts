import { useState, useCallback, useRef, useTransition } from "react";
import { questions } from "@/data/questions";

export interface QuestionAnswer {
  questionId: number;
  answer: string | number | string[];
}

export function useQuestionNavigation() {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<QuestionAnswer[]>([]);
  const [isCompleted, setIsCompleted] = useState(false);
  const isProcessingRef = useRef(false);
  const [, startTransition] = useTransition();

  const currentQuestion = questions[currentQuestionIndex];
  const isLastQuestion = currentQuestionIndex === questions.length - 1;
  const isFirstQuestion = currentQuestionIndex === 0;

  const goToNextQuestion = useCallback((answer: string | number | string[]) => {
    // Prevent multiple rapid calls
    if (isProcessingRef.current) {
      return;
    }
    
    isProcessingRef.current = true;
    
    // Save current answer and move to next question
    // Use functional updates to avoid stale closure issues
    startTransition(() => {
      setCurrentQuestionIndex((prevIndex) => {
        const currentQ = questions[prevIndex];
        
        // Save the answer immediately
        setAnswers((prevAnswers) => [
          ...prevAnswers,
          {
            questionId: currentQ.id,
            answer,
          },
        ]);

        // Small delay before moving to next question for smooth transition
        setTimeout(() => {
          // Move to next question if not last
          // Use prevIndex directly to avoid closure issues
          if (prevIndex < questions.length - 1) {
            setCurrentQuestionIndex(prevIndex + 1);
          } else {
            // Handle survey completion
            setAnswers((finalAnswers) => {
              console.log("Survey completed!", finalAnswers);
              setIsCompleted(true);
              return finalAnswers;
            });
          }
          // Reset processing flag after state update
          isProcessingRef.current = false;
        }, 220);

        return prevIndex; // Return current index (don't change it yet)
      });
    });
  }, [startTransition]);

  const goToPreviousQuestion = useCallback(() => {
    if (!isFirstQuestion) {
      startTransition(() => {
        setCurrentQuestionIndex((prev) => prev - 1);
        // Remove last answer when going back
        setAnswers((prev) => prev.slice(0, -1));
      });
    }
  }, [isFirstQuestion, startTransition]);

  const resetSurvey = useCallback(() => {
    setCurrentQuestionIndex(0);
    setAnswers([]);
    setIsCompleted(false);
  }, []);

  const goToQuestion = useCallback((questionIndex: number) => {
    if (questionIndex >= 0 && questionIndex < questions.length) {
      setCurrentQuestionIndex(questionIndex);
      // Don't modify answers when jumping - this is for dev navigation only
    }
  }, []);

  return {
    currentQuestion,
    currentQuestionIndex,
    answers,
    isLastQuestion,
    isFirstQuestion,
    isCompleted,
    goToNextQuestion,
    goToPreviousQuestion,
    goToQuestion,
    resetSurvey,
    totalQuestions: questions.length,
  };
}

