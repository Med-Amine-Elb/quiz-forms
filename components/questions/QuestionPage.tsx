"use client";

import { ReactNode, forwardRef } from "react";
import AnimatedQuestionHeader from "./AnimatedQuestionHeader";
import ProgressBar from "./ProgressBar";
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

  return (
      <div
        ref={ref}
        className="absolute inset-0 w-full h-full flex flex-col overflow-hidden"
        style={{
          background: '#ffffff',
          backgroundImage: section.gradient,
          zIndex: 1,
          willChange: 'transform',
          overflowX: 'hidden',
          transform: 'translateX(0)',
        }}
      >
      {/* Progress Bar */}
      <ProgressBar
        currentQuestionId={questionNumber}
        currentQuestionIndex={currentQuestionIndex}
        totalQuestions={totalQuestions}
      />

      {/* Logo - Top Left */}
      <div className="absolute top-20 left-6 z-10">
        <img
          src="/societe-des-boissons-du-maroc--600-removebg-preview.png"
          alt="SBM Logo"
          className="h-16 w-auto object-contain"
        />
      </div>

      {/* Page Content */}
      <div className="w-full h-full relative flex items-center overflow-hidden pt-20">
        {/* Left Side - Content centered */}
        <div className="w-full lg:w-2/3 flex flex-col items-center justify-center px-6 py-8 overflow-y-auto overflow-x-hidden">
          {/* Animated Question Header */}
          <div ref={questionNumberRef}>
            <AnimatedQuestionHeader
              key={questionNumber}
              questionNumber={questionNumber}
              questionText={questionText}
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

