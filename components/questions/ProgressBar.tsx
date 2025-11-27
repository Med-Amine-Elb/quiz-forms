"use client";

import { motion } from "framer-motion";
import { ArrowLeft } from "lucide-react";
import { getSectionForQuestion } from "@/lib/questionSections";

interface ProgressBarProps {
  currentQuestionId: number;
  currentQuestionIndex: number;
  totalQuestions: number;
  onBack?: () => void;
  showBackButton?: boolean;
}

export default function ProgressBar({
  currentQuestionId,
  currentQuestionIndex,
  totalQuestions,
  onBack,
  showBackButton = true,
}: ProgressBarProps) {
  const progress = ((currentQuestionIndex + 1) / totalQuestions) * 100;
  const section = getSectionForQuestion(currentQuestionId);

  return (
    <div className="w-full px-6 sm:px-8 py-4 bg-white/80 backdrop-blur-sm border-b border-gray-100 relative">
      {/* Back Button - Positioned at absolute max left */}
      {showBackButton && onBack && currentQuestionIndex > 0 && (
        <motion.button
          onClick={onBack}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          className="absolute left-0 top-1/2 -translate-y-1/2 p-2 rounded-lg hover:bg-gray-100 transition-colors duration-200 z-10 ml-2"
          aria-label="Retour à la question précédente"
        >
          <ArrowLeft className="w-5 h-5 text-gray-700" />
        </motion.button>
      )}
      
      <div className="max-w-7xl mx-auto" style={{ paddingLeft: showBackButton && onBack && currentQuestionIndex > 0 ? '48px' : '0' }}>
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

