"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MessageSquare, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";
import ContinueButton from "./ContinueButton";

interface TextQuestionProps {
  placeholder?: string;
  onContinue: (value: string) => void;
  continueButtonText?: string;
  required?: boolean;
  minHeight?: number;
  maxHeight?: number;
  accentColor?: string;
  maxLength?: number;
  isLastQuestion?: boolean;
  autoFocus?: boolean;
}

export default function TextQuestion({
  placeholder = "Votre réponse...",
  onContinue,
  continueButtonText = "Continuer",
  required = false,
  minHeight = 150,
  maxHeight = 400,
  accentColor = "#06b6d4",
  maxLength = 500,
  isLastQuestion = false,
  autoFocus = true,
}: TextQuestionProps) {
  const [inputValue, setInputValue] = useState("");
  const [isFocused, setIsFocused] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const adjustHeight = (reset = false) => {
    if (textareaRef.current) {
      if (reset) {
        textareaRef.current.style.height = `${minHeight}px`;
      } else {
        textareaRef.current.style.height = `${minHeight}px`;
        const scrollHeight = textareaRef.current.scrollHeight;
        const newHeight = Math.min(Math.max(scrollHeight, minHeight), maxHeight);
        textareaRef.current.style.height = `${newHeight}px`;
      }
    }
  };

  useEffect(() => {
    adjustHeight();
  }, [minHeight, maxHeight]);

  // Auto-focus on mount
  useEffect(() => {
    if (autoFocus && textareaRef.current) {
      const timer = setTimeout(() => {
        textareaRef.current?.focus();
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [autoFocus]);

  // Calculate word count
  const wordCount = inputValue.trim() === "" 
    ? 0 
    : inputValue.trim().split(/\s+/).length;
  
  const charCount = inputValue.length;
  const remainingChars = maxLength ? maxLength - charCount : null;

  const handleSubmit = () => {
    if (inputValue.trim()) {
      onContinue(inputValue);
      setInputValue("");
      adjustHeight(true);
    }
  };

  // Tips based on word count
  const getTip = () => {
    if (wordCount === 0) {
      return "💡 Soyez spécifique et détaillé";
    } else if (wordCount < 10) {
      return "✍️ Continuez, partagez plus de détails";
    } else if (wordCount < 30) {
      return "👍 Très bien, continuez!";
    } else {
      return "⭐ Excellent niveau de détail!";
    }
  };

  const hasValue = inputValue.length > 0;
  const isLabelFloating = isFocused || hasValue;

  return (
    <>
      {/* Special message for last question */}
      {isLastQuestion && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-3xl mx-auto mb-6 text-center"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 400, damping: 20 }}
            className="inline-block text-5xl mb-3"
          >
            💬
          </motion.div>
          <motion.h3
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-2xl font-bold font-inter mb-2"
            style={{ color: accentColor }}
          >
            Un dernier message
          </motion.h3>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="text-gray-700 font-inter"
          >
            Partagez vos impressions avec l'équipe DSI
          </motion.p>
        </motion.div>
      )}

      {/* Text Input Container - Modern Floating Label Design */}
      <div className={cn("w-full mx-auto mb-8", isLastQuestion ? "max-w-4xl" : "max-w-3xl")}>
        <div className="relative">
          {/* Modern Card Container */}
          <motion.div
            className={cn(
              "relative rounded-2xl backdrop-blur-xl border-2 overflow-hidden transition-all duration-300",
              "shadow-lg group bg-white/90"
            )}
            style={{
              borderColor: isFocused ? `${accentColor}` : 'rgba(209, 213, 219, 0.6)',
              boxShadow: isFocused
                ? `0 20px 60px ${accentColor}30, 0 0 0 3px ${accentColor}20`
                : '0 10px 40px rgba(0, 0, 0, 0.08)',
            }}
            whileHover={{
              boxShadow: isFocused 
                ? `0 20px 60px ${accentColor}30, 0 0 0 3px ${accentColor}20`
                : `0 15px 50px rgba(0, 0, 0, 0.12)`,
            }}
            transition={{ duration: 0.2 }}
          >
            {/* Floating Label */}
            <motion.label
              htmlFor="text-input"
              className={cn(
                "absolute left-5 pointer-events-none font-inter font-semibold transition-all duration-300",
                "flex items-center gap-2"
              )}
              animate={{
                top: isLabelFloating ? '12px' : '24px',
                fontSize: isLabelFloating ? '0.75rem' : '1rem',
                color: isFocused ? accentColor : '#6B7280',
              }}
            >
              <MessageSquare className={cn(
                "transition-all duration-300",
                isLabelFloating ? "w-3 h-3" : "w-4 h-4"
              )} />
              {placeholder}
            </motion.label>

            {/* Gradient overlay on focus */}
            <motion.div
              className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
              style={{
                background: `linear-gradient(135deg, ${accentColor}05, transparent)`,
              }}
            />

            <div className="flex flex-col relative z-10 pt-8">
              <div
                className="overflow-y-auto"
                style={{ maxHeight: `${maxHeight - 48}px` }}
              >
                <textarea
                  id="text-input"
                  ref={textareaRef}
                  placeholder=""
                  aria-label={placeholder}
                  aria-required={required}
                  className={cn(
                    "w-full rounded-2xl pr-4 pb-4 px-5 pt-2",
                    "border-none focus:ring-0",
                    "text-gray-900 resize-none text-wrap bg-transparent",
                    "focus:outline-none",
                    "leading-relaxed text-base font-inter placeholder:text-transparent"
                  )}
                  style={{
                    minHeight: `${isLastQuestion ? minHeight + 50 : minHeight}px`,
                  }}
                  value={inputValue}
                  maxLength={maxLength}
                  onChange={(e) => {
                    setInputValue(e.target.value);
                    adjustHeight();
                  }}
                  onFocus={() => setIsFocused(true)}
                  onBlur={() => setIsFocused(false)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && e.ctrlKey) {
                      e.preventDefault();
                      handleSubmit();
                    }
                  }}
                  required={required}
                />
              </div>
            </div>

            {/* Bottom Info Bar */}
            <AnimatePresence>
              {hasValue && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="border-t border-gray-200 bg-gray-50/80 backdrop-blur-sm px-5 py-3"
                >
                  <div className="flex items-center justify-between text-sm">
                    {/* Tip with icon */}
                    <motion.div 
                      key={getTip()}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      className="flex items-center gap-2 text-gray-600 font-medium"
                    >
                      <Sparkles className="w-4 h-4" style={{ color: accentColor }} />
                      <span>{getTip()}</span>
                    </motion.div>

                    {/* Word and Character count */}
                    <div className="flex items-center gap-4 font-inter font-semibold">
                      <span className="text-gray-700">
                        <span style={{ color: accentColor }}>{wordCount}</span> mots
                      </span>
                      <span className="text-gray-400">•</span>
                      <span 
                        className={cn(
                          "transition-colors",
                          remainingChars && remainingChars < 50 ? 'text-orange-500' : 'text-gray-700'
                        )}
                      >
                        {charCount}/{maxLength}
                      </span>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>

        </div>
      </div>

      {/* Continue Button */}
      <div className={cn("w-full mx-auto", isLastQuestion ? "max-w-4xl" : "max-w-3xl")}>
        <ContinueButton
          onClick={handleSubmit}
          disabled={required && !inputValue.trim()}
          accentColor={accentColor}
        >
          {isLastQuestion ? "Terminer l'enquête →" : continueButtonText}
        </ContinueButton>
      </div>
    </>
  );
}
