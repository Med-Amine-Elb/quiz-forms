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
    startTransition(() => {
      const currentQ = questions[currentQuestionIndex];
      
      // Save the answer
      setAnswers((prevAnswers) => {
        const newAnswers = [
          ...prevAnswers,
          {
            questionId: currentQ.id,
            answer,
          },
        ];
        
        // If this is the last question, mark as completed
        if (currentQuestionIndex === questions.length - 1) {
          console.log("Survey completed!", newAnswers);
          setTimeout(() => setIsCompleted(true), 100);
        }
        
        return newAnswers;
      });

      // Small delay before moving to next question for smooth transition
      setTimeout(() => {
        if (currentQuestionIndex < questions.length - 1) {
          setCurrentQuestionIndex(currentQuestionIndex + 1);
        }
        // Reset processing flag after state update
        isProcessingRef.current = false;
      }, 220);
    });
  }, [currentQuestionIndex, startTransition]);

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

