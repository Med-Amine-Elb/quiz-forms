"use client";

import { useRef } from "react";

interface TextQuestionProps {
  placeholder?: string;
  onContinue: (value: string) => void;
  continueButtonText?: string;
  required?: boolean;
}

export default function TextQuestion({
  placeholder = "Votre réponse...",
  onContinue,
  continueButtonText = "Continuer",
  required = false,
}: TextQuestionProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleContinue = () => {
    const value = textareaRef.current?.value || "";
    if (!required || value.trim()) {
      onContinue(value);
    }
  };

  return (
    <>
      {/* Text Input */}
      <div className="w-full max-w-4xl mx-auto mb-8">
        <textarea
          ref={textareaRef}
          placeholder={placeholder}
          className="w-full px-5 py-4 rounded-2xl bg-white/80 border-2 border-gray-200 text-gray-900 placeholder-gray-500 focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/40 transition-all duration-300 font-inter resize-none min-h-[150px]"
          rows={6}
          required={required}
        />
      </div>

      {/* Continue Button */}
      <div className="w-full max-w-4xl mx-auto">
        <button
          onClick={handleContinue}
          disabled={required && !textareaRef.current?.value?.trim()}
          className="px-8 py-4 rounded-2xl bg-gradient-to-r from-cyan-400 to-cyan-500 text-gray-900 font-bold text-base sm:text-lg shadow-lg shadow-cyan-500/30 hover:shadow-cyan-400/50 transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 font-inter"
        >
          {continueButtonText}
        </button>
      </div>
    </>
  );
}

