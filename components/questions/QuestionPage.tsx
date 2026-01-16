"use client";

import React, { ReactNode, forwardRef, useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import gsap from "gsap";
import AnimatedQuestionCard from "./AnimatedQuestionCard";
import SectionIntro from "./SectionIntro";
import WelcomeMessage from "./WelcomeMessage";
import { getSectionForQuestion } from "@/lib/questionSections";
import { questions } from "@/data/questions";
import { cn } from "@/lib/utils";

interface QuestionPageProps {
  questionNumber: number;
  questionText: string;
  children: ReactNode;
  avatar?: ReactNode;
  questionNumberRef?: React.RefObject<HTMLDivElement>;
  questionTextRef?: React.RefObject<HTMLDivElement>;
  currentQuestionIndex?: number;
}

const QuestionPage = forwardRef<HTMLDivElement, QuestionPageProps>(({
  questionNumber,
  questionText,
  children,
  avatar,
  questionNumberRef,
  questionTextRef,
  currentQuestionIndex = 0,
}, ref) => {
  const section = getSectionForQuestion(questionNumber);
  const totalQuestions = questions.length;
  const previousSectionRef = useRef<string | null>(null);
  const [showSectionIntro, setShowSectionIntro] = useState(false);
  const [showWelcome, setShowWelcome] = useState(false);
  const [welcomeCompleted, setWelcomeCompleted] = useState(false);
  const [sectionCompleted, setSectionCompleted] = useState(false);
  const isFirstQuestion = questionNumber === 1;
  const isFirstQuestionOfSection = questionNumber === section.startQuestion;

  // Initialize states based on question type
  useEffect(() => {
    if (isFirstQuestion) {
      // First question: show welcome first
      setShowWelcome(true);
      setWelcomeCompleted(false);
      setSectionCompleted(false);
      setShowSectionIntro(false);
    } else if (isFirstQuestionOfSection) {
      // First question of a new section (but not question 1): show section intro
      setWelcomeCompleted(true);
      setShowWelcome(false);
      setSectionCompleted(false);
      // Section intro will be shown by the other useEffect
    } else {
      // Regular question: everything is already completed
      setWelcomeCompleted(true);
      setShowWelcome(false);
      setSectionCompleted(true);
      setShowSectionIntro(false);
    }
  }, [isFirstQuestion, isFirstQuestionOfSection]);

  // Handle welcome completion - then show section intro
  const handleWelcomeComplete = () => {
    setShowWelcome(false);
    setWelcomeCompleted(true);
    // After welcome fade out completes (0.5s), show section intro for first question
    // Add small overlap for smooth transition
    if (isFirstQuestion) {
      setTimeout(() => {
        setShowSectionIntro(true);
      }, 300); // Smooth overlap transition
    }
  };

  // Handle section intro completion
  const handleSectionComplete = () => {
    setShowSectionIntro(false);
    setSectionCompleted(true);
    // Update previous section ref when section is completed
    previousSectionRef.current = section.id;
  };

  // Show section intro on first question of new section (but only after welcome is done)
  useEffect(() => {
    const isNewSection = previousSectionRef.current !== section.id;
    
    // For first question, wait for welcome to complete
    if (isFirstQuestion && !welcomeCompleted) {
      return;
    }
    
    // For first question, wait for welcome to complete before showing section
    // Section will be shown by handleWelcomeComplete, so we don't need to do anything here
    if (isFirstQuestion && welcomeCompleted && !sectionCompleted && isFirstQuestionOfSection) {
      return;
    }
    
    // Only show section intro on the FIRST question of a NEW section (for non-first questions)
    if (isNewSection && isFirstQuestionOfSection && !isFirstQuestion) {
      setShowSectionIntro(true);
      setSectionCompleted(false);
    } else {
      // Hide section intro if not on first question of section
      if (!isFirstQuestionOfSection && !isFirstQuestion) {
        setShowSectionIntro(false);
        setSectionCompleted(true);
      }
      
      // Update previous section ref even if not showing intro
      if (isNewSection && !isFirstQuestionOfSection) {
        previousSectionRef.current = section.id;
        setSectionCompleted(true);
      }
    }
  }, [section.id, questionNumber, section.startQuestion, isFirstQuestion, isFirstQuestionOfSection, welcomeCompleted, sectionCompleted]);

  return (
      <div
        ref={ref}
        className="absolute inset-0 w-full h-full flex flex-col overflow-hidden bg-transparent"
        style={{
          zIndex: 2,
          willChange: 'transform, opacity',
          overflowX: 'hidden',
          overflowY: questionNumber === 1 ? 'hidden' : 'hidden',
          backfaceVisibility: 'hidden',
          WebkitBackfaceVisibility: 'hidden',
          backgroundColor: 'transparent',
          transform: 'translateZ(0)', // Force GPU acceleration
        }}
      >
      {/* Welcome Message for First Question */}
      {showWelcome && isFirstQuestion && (
        <WelcomeMessage onComplete={handleWelcomeComplete} />
      )}

      {/* Section Introduction Card */}
      {showSectionIntro && (
        <SectionIntro
          section={section}
          onClose={handleSectionComplete}
        />
      )}

      {/* Logo - Top Left - Only show when welcome and section are completed */}
      {!showWelcome && !showSectionIntro && welcomeCompleted && sectionCompleted && (
        <motion.div 
          className="absolute top-24 left-6 z-10"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            duration: 0.6,
            delay: 0.2,
            ease: [0.16, 1, 0.3, 1],
          }}
        >
          <img
            src="/societe-des-boissons-du-maroc--600-removebg-preview.png"
            alt="SBM Logo"
            className="h-16 w-auto object-contain"
          />
        </motion.div>
      )}

      {/* Page Content - Always render but hide when welcome or section is showing */}
      <motion.div 
        className="w-full h-full relative flex flex-col lg:flex-row items-stretch px-4 lg:px-8 overflow-hidden pt-24 z-10 bg-transparent"
        initial={false}
        animate={{
          opacity: (!showWelcome && !showSectionIntro && welcomeCompleted && sectionCompleted) ? 1 : 0,
          y: (!showWelcome && !showSectionIntro && welcomeCompleted && sectionCompleted) ? 0 : 10,
          pointerEvents: (!showWelcome && !showSectionIntro && welcomeCompleted && sectionCompleted) ? 'auto' : 'none',
        }}
        transition={{
          duration: 0.6,
          ease: [0.16, 1, 0.3, 1],
        }}
        style={{
          backgroundColor: 'transparent',
          visibility: (!showWelcome && !showSectionIntro && welcomeCompleted && sectionCompleted) ? 'visible' : 'hidden',
          willChange: 'transform, opacity',
        }}
      >
        {/* Left Side - Content */}
        <div 
          className={cn(
            "w-full lg:w-2/3 flex flex-col items-center lg:items-start justify-start px-2 lg:px-4 py-4 lg:py-6 relative z-20",
            // Hide scroll for Q1 and Q7, show scrollbar-hide for others
            questionNumber === 1 || questionNumber === 7 
              ? "overflow-hidden" 
              : "overflow-y-auto overflow-x-hidden scrollbar-hide"
          )}
          style={{
            willChange: 'transform',
            maxHeight: (questionNumber === 1 || questionNumber === 7) ? 'calc(100vh - 6rem)' : 'none',
          }}
        >
          {/* Animated Question Card - Consistent sizing for all questions */}
          <div ref={questionNumberRef} className="w-full max-w-4xl mx-auto mt-6 mb-6 lg:mt-16 lg:mb-8">
            <AnimatedQuestionCard
              key={questionNumber}
              questionNumber={questionNumber}
              questionText={questionText}
              accentColor={section.accent}
              isFirstQuestion={isFirstQuestion}
            />
          </div>

          {/* Question Content - Grouped with Breathing Room - Centered to match question card */}
          <div ref={questionTextRef} className="w-full max-w-4xl mx-auto">
            {children}
          </div>
        </div>

        {/* Right Side - Lottie/3D Character */}
        {avatar && (
          <div 
            className="w-full lg:w-1/3 hidden lg:flex items-center justify-center z-0 pointer-events-none"
            style={{
              willChange: 'transform, opacity',
            }}
          >
            <div className="w-full h-full max-w-[1400px] flex items-center justify-center">
              {avatar}
            </div>
          </div>
        )}
      </motion.div>
    </div>
  );
});

QuestionPage.displayName = 'QuestionPage';

export default QuestionPage;

