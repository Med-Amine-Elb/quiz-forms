import { useState, useCallback, useRef } from "react";
import { questions } from "@/data/questions";

export interface QuestionAnswer {
  questionId: number;
  answer: string | number | string[];
}

export function useQuestionNavigation() {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<QuestionAnswer[]>([]);
  const isProcessingRef = useRef(false);

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
            return finalAnswers;
          });
        }
        // Reset processing flag after state update
        isProcessingRef.current = false;
      }, 300);

      return prevIndex; // Return current index (don't change it yet)
    });
  }, []);

  const goToPreviousQuestion = useCallback(() => {
    if (!isFirstQuestion) {
      setCurrentQuestionIndex((prev) => prev - 1);
      // Remove last answer when going back
      setAnswers((prev) => prev.slice(0, -1));
    }
  }, [isFirstQuestion]);

  const resetSurvey = useCallback(() => {
    setCurrentQuestionIndex(0);
    setAnswers([]);
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
    goToNextQuestion,
    goToPreviousQuestion,
    goToQuestion,
    resetSurvey,
    totalQuestions: questions.length,
  };
}

