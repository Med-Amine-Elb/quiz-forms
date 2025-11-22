"use client";

import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import { QuestionSection } from "@/lib/questionSections";
import { useEffect, useState } from "react";

interface SectionIntroProps {
  section: QuestionSection;
  onClose: () => void;
}

export default function SectionIntro({ section, onClose }: SectionIntroProps) {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    // Auto-hide after 3 seconds
    const timer = setTimeout(() => {
      setIsVisible(false);
      setTimeout(onClose, 500); // Wait for fade out
    }, 3000);

    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: -20, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -20, scale: 0.95 }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
          className="fixed top-24 left-1/2 transform -translate-x-1/2 z-50 max-w-2xl w-full mx-4"
        >
          <div
            className="relative rounded-2xl p-6 shadow-2xl backdrop-blur-md border-2"
            style={{
              background: `linear-gradient(135deg, ${section.color}15, ${section.color}05)`,
              borderColor: `${section.color}40`,
              boxShadow: `0 20px 60px ${section.color}30`,
            }}
          >
            {/* Close button */}
            <button
              onClick={() => {
                setIsVisible(false);
                setTimeout(onClose, 500);
              }}
              className="absolute top-4 right-4 p-1 rounded-full hover:bg-white/20 transition-colors"
              style={{ color: section.color }}
            >
              <X className="w-5 h-5" />
            </button>

            {/* Section info */}
            <div className="pr-8">
              <div className="flex items-center gap-3 mb-2">
                <div
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: section.color }}
                />
                <h3
                  className="text-xl font-bold font-inter"
                  style={{ color: section.color }}
                >
                  {section.name}
                </h3>
              </div>
              <p className="text-gray-700 text-sm font-inter">
                Questions {section.startQuestion} à {section.endQuestion}
              </p>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

