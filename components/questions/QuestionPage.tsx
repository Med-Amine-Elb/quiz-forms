"use client";

import React, { ReactNode, forwardRef, useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import gsap from "gsap";
import AnimatedQuestionCard from "./AnimatedQuestionCard";
import ProgressBar from "./ProgressBar";
import SectionIntro from "./SectionIntro";
import { getSectionForQuestion } from "@/lib/questionSections";
import { questions } from "@/data/questions";

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
  const previousSectionRef = useRef<string>(section.id);
  const [showSectionIntro, setShowSectionIntro] = useState(false);

  // Smooth gradient transition when section changes using crossfade
  useEffect(() => {
    if (previousSectionRef.current !== section.id) {
      // Show section intro when entering new section
      setShowSectionIntro(true);
      
      // Crossfade effect - fade out old, fade in new
      if (backgroundRef.current) {
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
      }
      previousSectionRef.current = section.id;
    } else {
      // Set initial gradient
      if (backgroundRef.current) {
        backgroundRef.current.style.backgroundImage = section.gradient;
        gsap.set(backgroundRef.current, { opacity: 1 });
      }
    }
  }, [section.id, section.gradient]);

  return (
      <div
        ref={ref}
        className="absolute inset-0 w-full h-full flex flex-col overflow-hidden"
        style={{
          zIndex: 1,
          willChange: 'transform, background-image',
          overflowX: 'hidden',
          transform: 'translateX(0)',
        }}
      >
      {/* Animated Background Layer with smooth gradient transition */}
      <div
        ref={backgroundRef}
        className="absolute inset-0 transition-opacity duration-700 ease-in-out"
        style={{
          background: '#ffffff',
          backgroundImage: section.gradient,
        }}
      />
      {/* Section Introduction Card */}
      {showSectionIntro && (
        <SectionIntro
          section={section}
          onClose={() => setShowSectionIntro(false)}
        />
      )}

      {/* Progress Bar */}
      <div className="relative z-10">
        <ProgressBar
          currentQuestionId={questionNumber}
          currentQuestionIndex={currentQuestionIndex}
          totalQuestions={totalQuestions}
        />
      </div>

      {/* Logo - Top Left */}
      <div className="absolute top-20 left-6 z-10">
        <img
          src="/societe-des-boissons-du-maroc--600-removebg-preview.png"
          alt="SBM Logo"
          className="h-16 w-auto object-contain"
        />
      </div>

      {/* Page Content */}
      <div className="w-full h-full relative flex items-center overflow-hidden pt-20 z-10">
        {/* Left Side - Content centered */}
        <div className="w-full lg:w-2/3 flex flex-col items-center justify-center px-6 py-8 overflow-y-auto overflow-x-hidden">
          {/* Animated Question Card */}
          <div ref={questionNumberRef}>
            <AnimatedQuestionCard
              key={questionNumber}
              questionNumber={questionNumber}
              questionText={questionText}
              accentColor={section.accent}
            />
          </div>

          {/* Question Content */}
          <div ref={questionTextRef}>
            {children}
          </div>
        </div>

        {/* Right Side - 3D Character positioned at max right */}
        {avatar && (
          <div className="hidden lg:flex absolute right-0 top-0 bottom-0 w-1/3 items-center justify-end z-10 overflow-hidden">
            {avatar}
          </div>
        )}
      </div>
    </div>
  );
});

QuestionPage.displayName = 'QuestionPage';

export default QuestionPage;

