"use client";

import { motion } from "framer-motion";
import { getSectionForQuestion } from "@/lib/questionSections";

interface ProgressBarProps {
  currentQuestionId: number;
  currentQuestionIndex: number;
  totalQuestions: number;
}

export default function ProgressBar({
  currentQuestionId,
  currentQuestionIndex,
  totalQuestions,
}: ProgressBarProps) {
  const progress = ((currentQuestionIndex + 1) / totalQuestions) * 100;
  const section = getSectionForQuestion(currentQuestionId);

  return (
    <div className="w-full px-6 sm:px-8 py-4 bg-white/80 backdrop-blur-sm border-b border-gray-100">
      <div className="max-w-7xl mx-auto">
        {/* Progress Info */}
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-3">
            <span className="text-sm font-semibold text-gray-700 font-inter">
              Question {currentQuestionId} sur {totalQuestions}
            </span>
            <span 
              className="text-xs font-medium px-2 py-1 rounded-full text-white font-inter"
              style={{ backgroundColor: section.color }}
            >
              {section.name}
            </span>
          </div>
          <span className="text-sm font-semibold font-inter" style={{ color: section.color }}>
            {Math.round(progress)}%
          </span>
        </div>

        {/* Progress Bar */}
        <div className="relative h-2 bg-gray-200 rounded-full overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
            className="h-full rounded-full"
            style={{
              background: `linear-gradient(to right, ${section.color}, ${section.accent})`,
              boxShadow: `0 0 10px ${section.color}40`,
            }}
          />
          {/* Shimmer effect */}
          <motion.div
            animate={{
              x: ['-100%', '100%'],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: 'linear',
            }}
            className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
          />
        </div>
      </div>
    </div>
  );
}

