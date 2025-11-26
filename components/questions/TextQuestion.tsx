"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CornerRightDown } from "lucide-react";
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
  maxLength,
  isLastQuestion = false,
  autoFocus = true,
}: TextQuestionProps) {
  const [inputValue, setInputValue] = useState("");
  const [isFocused, setIsFocused] = useState(false);
  const [placeholderOpacity, setPlaceholderOpacity] = useState(1);
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

  // Placeholder animation
  useEffect(() => {
    if (!isFocused && !inputValue) {
      const interval = setInterval(() => {
        setPlaceholderOpacity((prev) => (prev === 1 ? 0.5 : 1));
      }, 2000);
      return () => clearInterval(interval);
    } else {
      setPlaceholderOpacity(1);
    }
  }, [isFocused, inputValue]);

  const remainingChars = maxLength ? maxLength - inputValue.length : null;

  const handleSubmit = () => {
    if (inputValue.trim()) {
      onContinue(inputValue);
      setInputValue("");
      adjustHeight(true);
    }
  };

  const hasValue = inputValue.length > 0;

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
            className="inline-block text-4xl mb-2"
          >
            ❤️
          </motion.div>
          <motion.h3
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-2xl font-bold font-inter mb-2"
            style={{ color: accentColor }}
          >
            Merci!
          </motion.h3>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="text-gray-600 font-inter"
          >
            Partagez un dernier message avec l'équipe IT
          </motion.p>
        </motion.div>
      )}

      {/* Text Input Container - Matching Question Card Size */}
      <div className={cn("w-full mx-auto mb-8", isLastQuestion ? "max-w-4xl" : "max-w-3xl")}>
        <div className="relative">
          {/* Textarea Container - Matching Question Card Style */}
          <motion.div
            className={cn(
              "relative rounded-2xl backdrop-blur-xl border overflow-hidden",
              "shadow-lg group"
            )}
            style={{
              background: `linear-gradient(135deg, rgba(255, 255, 255, 0.98), rgba(255, 255, 255, 0.95))`,
              borderColor: isFocused ? `${accentColor}40` : `${accentColor}25`,
              boxShadow: isFocused
                ? `0 12px 40px ${accentColor}15, 0 0 0 1px ${accentColor}15, inset 0 1px 0 rgba(255, 255, 255, 0.9)`
                : `0 8px 32px ${accentColor}10, 0 0 0 1px ${accentColor}08, inset 0 1px 0 rgba(255, 255, 255, 0.8)`,
            }}
            whileHover={{
              boxShadow: `0 12px 40px ${accentColor}15, 0 0 0 1px ${accentColor}15, inset 0 1px 0 rgba(255, 255, 255, 0.9)`,
            }}
            transition={{ duration: 0.2 }}
          >
            {/* Subtle gradient overlay */}
            <motion.div
              className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
              style={{
                background: `linear-gradient(135deg, ${accentColor}05, transparent)`,
              }}
            />

            <div className="flex flex-col relative z-10">
              <div
                className="overflow-y-auto"
                style={{ maxHeight: `${maxHeight - 48}px` }}
              >
                <textarea
                  ref={textareaRef}
                  placeholder={placeholder}
                  className={cn(
                    "w-full rounded-2xl pr-10 pt-4 pb-4 px-5",
                    "placeholder:text-sm border-none focus:ring-0",
                    "text-gray-900 resize-none text-wrap bg-transparent",
                    "focus-visible:ring-0 focus-visible:ring-offset-0",
                    "leading-relaxed text-base font-inter",
                    "focus:outline-none"
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
                {/* Character counter */}
                {maxLength && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="absolute bottom-3 right-3 text-xs font-inter"
                    style={{
                      color: remainingChars && remainingChars < 20 ? '#EF4444' : '#6B7280',
                    }}
                  >
                    {remainingChars} caractères restants
                  </motion.div>
                )}
              </div>

            </div>

            <CornerRightDown
              className={cn(
                "absolute right-3 top-3 w-4 h-4 transition-all duration-200",
                inputValue
                  ? "opacity-60 scale-100 text-gray-500"
                  : "opacity-20 scale-95 text-gray-400"
              )}
            />
          </motion.div>
        </div>

      </div>

      {/* Continue Button - Special for last question */}
      <div className={cn("w-full mx-auto", isLastQuestion ? "max-w-4xl" : "max-w-3xl")}>
        <ContinueButton
          onClick={handleSubmit}
          disabled={required && !inputValue.trim()}
          accentColor={accentColor}
        >
          {isLastQuestion ? "Envoyer mon message ❤️" : continueButtonText}
        </ContinueButton>
      </div>
    </>
  );
}

