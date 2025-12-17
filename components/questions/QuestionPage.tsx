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
  const isFirstQuestion = questionNumber === 1;

  // Show welcome message for first question
  useEffect(() => {
    if (isFirstQuestion) {
      setShowWelcome(true);
    }
  }, [isFirstQuestion]);

  // Show section intro on first question of new section
  useEffect(() => {
    const isFirstQuestionOfSection = questionNumber === section.startQuestion;
    const isNewSection = previousSectionRef.current !== section.id;
    
    // Only show section intro on the FIRST question of a NEW section
    if (isNewSection && isFirstQuestionOfSection) {
      setShowSectionIntro(true);
      previousSectionRef.current = section.id;
    } else {
      // Hide section intro if not on first question of section
      if (!isFirstQuestionOfSection) {
        setShowSectionIntro(false);
      }
      
      // Update previous section ref even if not showing intro
      if (isNewSection) {
        previousSectionRef.current = section.id;
      }
    }
  }, [section.id, questionNumber, section.startQuestion]);

  return (
      <div
        ref={ref}
        className="absolute inset-0 w-full h-full flex flex-col overflow-hidden bg-transparent"
        style={{
          zIndex: 2,
          willChange: 'transform',
          overflowX: 'hidden',
          backfaceVisibility: 'hidden',
          WebkitBackfaceVisibility: 'hidden',
          backgroundColor: 'transparent',
        }}
      >
      {/* Welcome Message for First Question */}
      {showWelcome && isFirstQuestion && (
        <WelcomeMessage onComplete={() => setShowWelcome(false)} />
      )}

      {/* Section Introduction Card */}
      {showSectionIntro && (
        <SectionIntro
          section={section}
          onClose={() => setShowSectionIntro(false)}
        />
      )}

      {/* Logo - Top Left - Adjusted for fixed progress bar */}
      <div className="absolute top-24 left-6 z-10">
        <img
          src="/societe-des-boissons-du-maroc--600-removebg-preview.png"
          alt="SBM Logo"
          className="h-16 w-auto object-contain"
        />
      </div>

      {/* Page Content - Adjusted for fixed progress bar - Hidden when section intro is showing */}
      <motion.div 
        className="w-full h-full relative flex flex-col lg:flex-row items-stretch px-4 lg:px-8 overflow-hidden pt-24 z-10 bg-transparent"
        initial={false}
        animate={{
          opacity: showSectionIntro ? 0 : 1,
        }}
        transition={{
          duration: 0.5,
          ease: 'easeOut',
        }}
        style={{
          pointerEvents: showSectionIntro ? 'none' : 'auto',
          backgroundColor: 'transparent',
        }}
      >
        {/* Left Side - Content */}
        <div className={cn(
          "w-full lg:w-2/3 flex flex-col items-center lg:items-start justify-start px-2 lg:px-4 py-4 lg:py-6 relative z-20",
          // Only allow scroll for specific questions that need it, not question 7
          questionNumber === 7 ? "overflow-hidden" : "overflow-y-auto overflow-x-hidden"
        )}>
          {/* Animated Question Card - Conditional sizing based on question number */}
          <div ref={questionNumberRef} className={cn(
            "w-full mt-6 mb-6 lg:mt-16 lg:mb-8",
            // Only apply max-w-4xl to first question, not all questions
            isFirstQuestion && "max-w-4xl"
          )}>
            <AnimatedQuestionCard
              key={questionNumber}
              questionNumber={questionNumber}
              questionText={questionText}
              accentColor={section.accent}
              isFirstQuestion={isFirstQuestion}
            />
          </div>

          {/* Question Content - Grouped with Breathing Room */}
          <div ref={questionTextRef} className="w-full">
            {children}
          </div>
        </div>

        {/* Right Side - Lottie/3D Character */}
        {avatar && (
          <div className="w-full lg:w-1/3 hidden lg:flex items-center justify-center z-0 pointer-events-none">
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

