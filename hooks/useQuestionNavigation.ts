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
  // Include section boundaries in version to force cache clear when sections change
  // Updated version to force cache clear for design and section fixes
  // Version 5: Force cache clear - questions are correctly positioned (IA: 19-24, Communication: 25-27)
  const sectionHash = 'v5-questions-verified-correct';
  // Simple hash: combine all info
  return `${totalQuestions}-${questionIds.substring(0, 50)}-${questionTypes.substring(0, 30)}-${sectionHash}`;
}

// Check if questions have changed and clear cache if needed
function checkQuestionsVersion() {
  if (typeof window === 'undefined') return;
  
  try {
    const currentVersion = getQuestionsVersion();
    const savedVersion = localStorage.getItem(STORAGE_QUESTIONS_VERSION_KEY);
    
    // If version changed or doesn't exist, clear all survey data
    if (savedVersion !== currentVersion) {
      console.log('Questions have changed, clearing survey cache...', {
        old: savedVersion,
        new: currentVersion
      });
      // Clear all survey-related localStorage
      clearSavedProgress();
      // Also clear the version key to ensure fresh start
      localStorage.removeItem(STORAGE_QUESTIONS_VERSION_KEY);
      // Set new version
      localStorage.setItem(STORAGE_QUESTIONS_VERSION_KEY, currentVersion);
      // Force page reload to ensure fresh components (only in dev)
      if (process.env.NODE_ENV === 'development') {
        console.log('Development mode: Reloading page to apply changes...');
        setTimeout(() => {
          if (typeof window !== 'undefined') {
            window.location.reload();
          }
        }, 1000);
      }
    }
  } catch (error) {
    if (process.env.NODE_ENV !== 'production') {
      console.error('Error checking questions version:', error);
    }
  }
}

// Load saved progress from localStorage and optionally from server
// Note: Server sync allows cross-device resume
async function loadSavedProgress(): Promise<{ answers: QuestionAnswer[]; currentIndex: number; isCompleted: boolean }> {
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

  const verifiedEmail = localStorage.getItem('survey_verified_email');
  
  // Try to load from server first (for cross-device resume)
  if (verifiedEmail) {
    try {
      const response = await fetch(`/api/progress/load?email=${encodeURIComponent(verifiedEmail)}`);
      const data = await response.json();
      
      if (data.success && data.progress) {
        // Server has progress - use it and sync to localStorage
        const serverProgress = data.progress;
        localStorage.setItem(STORAGE_ANSWERS_KEY, JSON.stringify(serverProgress.answers));
        localStorage.setItem(STORAGE_INDEX_KEY, serverProgress.currentIndex.toString());
        localStorage.setItem(STORAGE_COMPLETED_KEY, serverProgress.isCompleted.toString());
        localStorage.setItem('survey_email_key', verifiedEmail);
        
        return {
          answers: serverProgress.answers,
          currentIndex: serverProgress.currentIndex,
          isCompleted: serverProgress.isCompleted,
        };
      }
    } catch (error) {
      // Server load failed - fall back to localStorage
      if (process.env.NODE_ENV !== 'production') {
        console.error('Error loading progress from server:', error);
      }
    }
  }

  // Fall back to localStorage (for same-device resume or if server fails)
  const savedEmailKey = localStorage.getItem('survey_email_key');
  
  // Only restore if email matches (same user on same device)
  if (verifiedEmail && savedEmailKey && verifiedEmail !== savedEmailKey) {
    // Different email - clear old progress
    clearSavedProgress();
    localStorage.setItem('survey_email_key', verifiedEmail);
    return { answers: [], currentIndex: 0, isCompleted: false };
  }

  try {
    const savedAnswers = localStorage.getItem(STORAGE_ANSWERS_KEY);
    const savedIndex = localStorage.getItem(STORAGE_INDEX_KEY);
    const savedCompleted = localStorage.getItem(STORAGE_COMPLETED_KEY);

    // Save email key for future checks
    if (verifiedEmail) {
      localStorage.setItem('survey_email_key', verifiedEmail);
    }

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

// Save progress to localStorage and server
async function saveProgress(answers: QuestionAnswer[], currentIndex: number, isCompleted: boolean, email?: string) {
  if (typeof window === 'undefined') return;

  try {
    // Save to localStorage (for offline support and faster access)
    localStorage.setItem(STORAGE_ANSWERS_KEY, JSON.stringify(answers));
    localStorage.setItem(STORAGE_INDEX_KEY, currentIndex.toString());
    localStorage.setItem(STORAGE_COMPLETED_KEY, isCompleted.toString());
    
    // Save to server (for cross-device resume) - only if email is verified
    if (email) {
      // Save asynchronously - don't block UI
      fetch('/api/progress/save', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email,
          answers,
          currentIndex,
          isCompleted,
        }),
      }).catch(error => {
        // Silently fail - localStorage backup is sufficient
        if (process.env.NODE_ENV !== 'production') {
          console.error('Error saving progress to server:', error);
        }
      });
    }
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
  // Load saved progress on mount (start with empty, will load async)
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<QuestionAnswer[]>([]);
  const [isCompleted, setIsCompleted] = useState(false);
  const [isLoadingProgress, setIsLoadingProgress] = useState(true);
  const isProcessingRef = useRef(false);
  const [, startTransition] = useTransition();
  const isInitializedRef = useRef(false);

  // Load progress from server/localStorage on mount
  useEffect(() => {
    loadSavedProgress().then(progress => {
      setCurrentQuestionIndex(progress.currentIndex);
      setAnswers(progress.answers);
      setIsCompleted(progress.isCompleted);
      setIsLoadingProgress(false);
      isInitializedRef.current = true;
    });
  }, []);

  // Reload progress when verified email changes (for cross-device resume)
  // Use a polling approach to detect email verification
  useEffect(() => {
    if (typeof window === 'undefined' || isLoadingProgress) return;
    
    let lastVerifiedEmail = localStorage.getItem('survey_verified_email');
    
    const checkEmailChange = () => {
      const currentVerifiedEmail = localStorage.getItem('survey_verified_email');
      if (currentVerifiedEmail && currentVerifiedEmail !== lastVerifiedEmail) {
        lastVerifiedEmail = currentVerifiedEmail;
        // Email was just verified - reload progress from server
        loadSavedProgress().then(progress => {
          // Only update if we have progress from server
          if (progress.answers.length > 0 || progress.currentIndex > 0) {
            setCurrentQuestionIndex(progress.currentIndex);
            setAnswers(progress.answers);
            setIsCompleted(progress.isCompleted);
          }
        });
      }
    };
    
    // Check every 500ms for email verification
    const interval = setInterval(checkEmailChange, 500);
    
    return () => clearInterval(interval);
  }, [isLoadingProgress]);

  // Save progress whenever answers, index, or completion status changes
  useEffect(() => {
    // Skip saving on initial load
    if (!isInitializedRef.current || isLoadingProgress) {
      return;
    }
    
    // Get verified email for server sync
    const verifiedEmail = typeof window !== 'undefined' 
      ? localStorage.getItem('survey_verified_email') 
      : null;
    
    saveProgress(answers, currentQuestionIndex, isCompleted, verifiedEmail || undefined);
  }, [answers, currentQuestionIndex, isCompleted, isLoadingProgress]);

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
      
      // Save the answer - update if exists, otherwise add new
      setAnswers((prevAnswers) => {
        // Check if an answer for this question already exists
        const existingAnswerIndex = prevAnswers.findIndex(
          (ans) => ans.questionId === currentQ.id
        );
        
        let newAnswers: QuestionAnswer[];
        
        if (existingAnswerIndex >= 0) {
          // Update existing answer
          newAnswers = [...prevAnswers];
          newAnswers[existingAnswerIndex] = {
            questionId: currentQ.id,
            answer,
          };
        } else {
          // Add new answer
          newAnswers = [
            ...prevAnswers,
            {
              questionId: currentQ.id,
              answer,
            },
          ];
        }
        
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
        // Don't remove answers when going back - keep them so users can review/change
        // Answers will be updated if user changes their response
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

  const reloadProgress = useCallback(async () => {
    setIsLoadingProgress(true);
    const progress = await loadSavedProgress();
    setCurrentQuestionIndex(progress.currentIndex);
    setAnswers(progress.answers);
    setIsCompleted(progress.isCompleted);
    setIsLoadingProgress(false);
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
    reloadProgress,
    isLoadingProgress,
    totalQuestions: questions.length,
  };
}

