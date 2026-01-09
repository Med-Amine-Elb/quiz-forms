import { useState, useCallback, useRef, useTransition, useEffect } from "react";
import { questions } from "@/data/questions";

export interface QuestionAnswer {
  questionId: number;
  answer: string | number | string[];
}

const STORAGE_KEY = 'survey_progress';
const STORAGE_ANSWERS_KEY = 'survey_answers';
const STORAGE_INDEX_KEY = 'survey_current_index';
const STORAGE_COMPLETED_KEY = 'survey_completed';
const STORAGE_QUESTIONS_VERSION_KEY = 'survey_questions_version';

// Generate a version hash based on questions structure
function getQuestionsVersion(): string {
  // Create a simple hash based on number of questions and their IDs
  const questionIds = questions.map(q => q.id).join(',');
  const questionTypes = questions.map(q => q.type).join(',');
  const totalQuestions = questions.length;
  // Simple hash: combine all info
  return `${totalQuestions}-${questionIds.substring(0, 50)}-${questionTypes.substring(0, 30)}`;
}

// Check if questions have changed and clear cache if needed
function checkQuestionsVersion() {
  if (typeof window === 'undefined') return;
  
  try {
    const currentVersion = getQuestionsVersion();
    const savedVersion = localStorage.getItem(STORAGE_QUESTIONS_VERSION_KEY);
    
    // If version changed or doesn't exist, clear all survey data
    if (savedVersion !== currentVersion) {
      console.log('Questions have changed, clearing survey cache...');
      clearSavedProgress();
      localStorage.setItem(STORAGE_QUESTIONS_VERSION_KEY, currentVersion);
    }
  } catch (error) {
    if (process.env.NODE_ENV !== 'production') {
      console.error('Error checking questions version:', error);
    }
  }
}

// Load saved progress from localStorage
function loadSavedProgress() {
  if (typeof window === 'undefined') {
    return { answers: [], currentIndex: 0, isCompleted: false };
  }

  // Check if questions have changed first
  checkQuestionsVersion();

  // Don't restore if already submitted
  const isSubmitted = localStorage.getItem('survey_submitted') === 'true';
  if (isSubmitted) {
    return { answers: [], currentIndex: 0, isCompleted: false };
  }

  try {
    const savedAnswers = localStorage.getItem(STORAGE_ANSWERS_KEY);
    const savedIndex = localStorage.getItem(STORAGE_INDEX_KEY);
    const savedCompleted = localStorage.getItem(STORAGE_COMPLETED_KEY);

    return {
      answers: savedAnswers ? JSON.parse(savedAnswers) : [],
      currentIndex: savedIndex ? parseInt(savedIndex, 10) : 0,
      isCompleted: savedCompleted === 'true',
    };
  } catch (error) {
    if (process.env.NODE_ENV !== 'production') {
      console.error('Error loading saved progress:', error);
    }
    return { answers: [], currentIndex: 0, isCompleted: false };
  }
}

// Save progress to localStorage
function saveProgress(answers: QuestionAnswer[], currentIndex: number, isCompleted: boolean) {
  if (typeof window === 'undefined') return;

  try {
    localStorage.setItem(STORAGE_ANSWERS_KEY, JSON.stringify(answers));
    localStorage.setItem(STORAGE_INDEX_KEY, currentIndex.toString());
    localStorage.setItem(STORAGE_COMPLETED_KEY, isCompleted.toString());
  } catch (error) {
    if (process.env.NODE_ENV !== 'production') {
      console.error('Error saving progress:', error);
    }
  }
}

// Clear saved progress
function clearSavedProgress() {
  if (typeof window === 'undefined') return;

  try {
    localStorage.removeItem(STORAGE_ANSWERS_KEY);
    localStorage.removeItem(STORAGE_INDEX_KEY);
    localStorage.removeItem(STORAGE_COMPLETED_KEY);
    // Note: We keep STORAGE_QUESTIONS_VERSION_KEY to track version
  } catch (error) {
    if (process.env.NODE_ENV !== 'production') {
      console.error('Error clearing saved progress:', error);
    }
  }
}

export function useQuestionNavigation() {
  // Load saved progress on mount
  const savedProgress = loadSavedProgress();
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(savedProgress.currentIndex);
  const [answers, setAnswers] = useState<QuestionAnswer[]>(savedProgress.answers);
  const [isCompleted, setIsCompleted] = useState(savedProgress.isCompleted);
  const isProcessingRef = useRef(false);
  const [, startTransition] = useTransition();
  const isInitializedRef = useRef(false);

  // Save progress whenever answers, index, or completion status changes
  useEffect(() => {
    // Skip saving on initial load
    if (!isInitializedRef.current) {
      isInitializedRef.current = true;
      return;
    }
    
    saveProgress(answers, currentQuestionIndex, isCompleted);
  }, [answers, currentQuestionIndex, isCompleted]);

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
          if (process.env.NODE_ENV !== 'production') {
            console.log("Survey completed!", newAnswers);
          }
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
    clearSavedProgress(); // Clear saved progress from localStorage
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

