"use client";

import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, Sparkles, TrendingUp } from "lucide-react";
import { getSectionForQuestion } from "@/lib/questionSections";
import { useEffect, useState, useRef } from "react";

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
  // Calculate progress and ensure it never exceeds 100%
  const progress = Math.min(((currentQuestionIndex + 1) / totalQuestions) * 100, 100);
  const section = getSectionForQuestion(currentQuestionId);
  const [showMilestone, setShowMilestone] = useState(false);
  const [milestoneMessage, setMilestoneMessage] = useState("");
  const previousProgressRef = useRef(0);
  const hasCelebratedRef = useRef<Set<number>>(new Set());

  // Check for milestone achievements
  useEffect(() => {
    const milestones = [25, 50, 75, 100];
    const currentMilestone = milestones.find(
      (m) => progress >= m && !hasCelebratedRef.current.has(m)
    );

    if (currentMilestone && previousProgressRef.current < currentMilestone) {
      hasCelebratedRef.current.add(currentMilestone);
      const messages = {
        25: "🎯 25% complété! Vous êtes sur la bonne voie!",
        50: "🎉 50% complété! À mi-chemin!",
        75: "🚀 75% complété! Presque terminé!",
        100: "⭐ 100% complété! Excellent travail!",
      };
      setMilestoneMessage(messages[currentMilestone as keyof typeof messages]);
      setShowMilestone(true);
      
      setTimeout(() => {
        setShowMilestone(false);
      }, 3000);
    }

    previousProgressRef.current = progress;
  }, [progress]);

  return (
    <div className="w-full px-6 sm:px-8 py-4 bg-white/80 backdrop-blur-sm border-b border-gray-100 relative">
      {/* Milestone Celebration Toast */}
      <AnimatePresence>
        {showMilestone && (
          <motion.div
            initial={{ opacity: 0, y: -50, scale: 0.8 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -30, scale: 0.9 }}
            className="absolute top-full left-1/2 -translate-x-1/2 mt-2 z-50"
            style={{ willChange: 'transform, opacity' }}
          >
            <motion.div
              className="bg-white rounded-2xl shadow-2xl px-6 py-4 border-2 flex items-center gap-3"
              style={{
                borderColor: section.color,
                boxShadow: `0 20px 60px ${section.color}30`,
              }}
              animate={{
                boxShadow: [
                  `0 20px 60px ${section.color}30`,
                  `0 25px 70px ${section.color}40`,
                  `0 20px 60px ${section.color}30`,
                ],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            >
              <motion.div
                animate={{
                  rotate: [0, 15, -15, 0],
                  scale: [1, 1.2, 1],
                }}
                transition={{
                  duration: 0.5,
                  repeat: 2,
                  ease: "easeInOut",
                }}
              >
                <Sparkles className="w-6 h-6" style={{ color: section.color }} />
              </motion.div>
              <span className="font-bold text-gray-900 font-inter whitespace-nowrap">
                {milestoneMessage}
              </span>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Back Button - Positioned at absolute max left */}
      {showBackButton && onBack && currentQuestionIndex > 0 && (
        <motion.button
          onClick={onBack}
          whileHover={{ scale: 1.1, x: -2 }}
          whileTap={{ scale: 0.9 }}
          className="absolute left-0 top-1/2 -translate-y-1/2 p-2 rounded-lg hover:bg-gray-100 transition-colors duration-200 z-10 ml-2"
          aria-label="Retour à la question précédente"
        >
          <motion.div
            animate={{
              x: [0, -3, 0],
            }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          >
            <ArrowLeft className="w-5 h-5 text-gray-700" />
          </motion.div>
        </motion.button>
      )}
      
      <div className="max-w-7xl mx-auto" style={{ paddingLeft: showBackButton && onBack && currentQuestionIndex > 0 ? '48px' : '0' }}>
        {/* Progress Info */}
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-3">
            <motion.span
              key={currentQuestionId}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              className="text-sm font-semibold text-gray-700 font-inter"
            >
              Question {currentQuestionId} sur {totalQuestions}
            </motion.span>
            <motion.span
              key={`${section.id}-${currentQuestionIndex}`}
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
              className="text-xs font-medium px-2 py-1 rounded-full text-white font-inter"
              style={{ backgroundColor: section.color }}
              whileHover={{ scale: 1.05 }}
            >
              {section.name}
            </motion.span>
          </div>
          <motion.span
            key={Math.round(progress)}
            initial={{ scale: 1.2, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", stiffness: 400, damping: 15 }}
            className="text-sm font-semibold font-inter flex items-center gap-1"
            style={{ color: section.color }}
          >
            <TrendingUp className="w-4 h-4" />
            {Math.round(progress)}%
          </motion.span>
        </div>

        {/* Progress Bar */}
        <div className="relative h-2 bg-gray-200 rounded-full overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${Math.min(progress, 100)}%` }}
            transition={{ 
              duration: 0.5, 
              ease: 'easeOut',
            }}
            className="h-full rounded-full relative"
            style={{
              background: `linear-gradient(to right, ${section.color}, ${section.accent})`,
              boxShadow: showMilestone 
                ? `0 0 20px ${section.color}60` 
                : `0 0 10px ${section.color}40`,
            }}
          >
            {/* Pulse effect on milestone */}
            {showMilestone && (
              <motion.div
                className="absolute inset-0 rounded-full"
                style={{
                  background: `linear-gradient(to right, ${section.color}, ${section.accent})`,
                }}
                animate={{
                  opacity: [0.5, 0.8, 0.5],
                  scale: [1, 1.05, 1],
                }}
                transition={{
                  duration: 1,
                  repeat: 3,
                  ease: "easeInOut",
                }}
              />
            )}
          </motion.div>
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
            className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent pointer-events-none"
          />
          {/* Milestone markers */}
          {[25, 50, 75, 100].map((milestone) => {
            const isReached = progress >= milestone;
            return (
              <motion.div
                key={milestone}
                className="absolute top-1/2 -translate-y-1/2 w-3 h-3 rounded-full border-2 bg-white"
                style={{
                  left: `${milestone}%`,
                  transform: 'translate(-50%, -50%)',
                  borderColor: isReached ? section.color : '#E5E7EB',
                  backgroundColor: isReached ? section.color : '#FFFFFF',
                }}
                animate={isReached && !hasCelebratedRef.current.has(milestone) ? {
                  scale: [1, 1.5, 1],
                  boxShadow: [
                    `0 0 0 0 ${section.color}40`,
                    `0 0 0 8px ${section.color}00`,
                  ],
                } : {}}
                transition={{
                  duration: 0.6,
                  ease: "easeOut",
                }}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
}

