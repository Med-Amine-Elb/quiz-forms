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
  const backgroundRef = useRef<HTMLDivElement>(null);
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

  // Smooth gradient transition when section changes using crossfade
  useEffect(() => {
    const isFirstQuestionOfSection = questionNumber === section.startQuestion;
    const isNewSection = previousSectionRef.current !== section.id;
    
    // Only show section intro on the FIRST question of a NEW section
    if (isNewSection && isFirstQuestionOfSection) {
      setShowSectionIntro(true);
      
      // Crossfade effect - fade out old, fade in new
      if (backgroundRef.current && previousSectionRef.current !== null) {
        gsap.to(backgroundRef.current, {
          opacity: 0,
          duration: 0.6,
          ease: 'power2.inOut',
          onComplete: () => {
            // Update gradient
            if (backgroundRef.current) {
              backgroundRef.current.style.backgroundImage = section.gradient;
              gsap.to(backgroundRef.current, {
                opacity: 1,
                duration: 0.8,
                ease: 'power2.inOut',
              });
            }
          },
        });
      } else {
        // Set initial gradient for first load
        if (backgroundRef.current) {
          backgroundRef.current.style.backgroundImage = section.gradient;
          gsap.set(backgroundRef.current, { opacity: 1 });
        }
      }
      previousSectionRef.current = section.id;
    } else {
      // Hide section intro if not on first question of section
      if (!isFirstQuestionOfSection) {
        setShowSectionIntro(false);
      }
      
      // Set gradient for same section
      if (backgroundRef.current) {
        backgroundRef.current.style.backgroundImage = section.gradient;
        gsap.set(backgroundRef.current, { opacity: 1 });
      }
      
      // Update previous section ref even if not showing intro
      if (isNewSection) {
        previousSectionRef.current = section.id;
      }
    }
  }, [section.id, section.gradient, questionNumber, section.startQuestion]);

  return (
      <div
        ref={ref}
        className="absolute inset-0 w-full h-full flex flex-col overflow-hidden"
        style={{
          zIndex: 2,
          willChange: 'transform',
          overflowX: 'hidden',
          backfaceVisibility: 'hidden',
          WebkitBackfaceVisibility: 'hidden',
        }}
      >
      {/* Animated Background Layer - no transition to prevent freezing */}
      <div
        ref={backgroundRef}
        className="absolute inset-0"
        style={{
          background: '#ffffff',
          backgroundImage: section.gradient,
          opacity: 1,
          zIndex: 0,
          pointerEvents: 'none',
        }}
      />
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
        className="w-full h-full relative flex items-center overflow-hidden pt-24 z-10"
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
        }}
      >
        {/* Left Side - Content centered with Better Spacing */}
        <div className="w-full lg:w-2/3 flex flex-col items-center justify-center px-6 py-8 overflow-y-auto overflow-x-hidden">
          {/* Animated Question Card - Larger for first question */}
          <div ref={questionNumberRef} className={cn("w-full mb-8", isFirstQuestion && "max-w-4xl")}>
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

        {/* Right Side - 3D Character positioned at max right */}
        {avatar && (
          <div className="hidden lg:flex absolute right-0 top-0 bottom-0 w-1/3 items-center justify-end z-10 overflow-hidden">
            {avatar}
          </div>
        )}
      </motion.div>
    </div>
  );
});

QuestionPage.displayName = 'QuestionPage';

export default QuestionPage;

