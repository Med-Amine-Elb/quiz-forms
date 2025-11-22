"use client";

import { useState } from "react";
import { Star } from "lucide-react";

interface RatingQuestionProps {
  maxRating?: number;
  onContinue: (rating: number) => void;
  continueButtonText?: string;
  required?: boolean;
}

export default function RatingQuestion({
  maxRating = 5,
  onContinue,
  continueButtonText = "Continuer",
  required = false,
}: RatingQuestionProps) {
  const [rating, setRating] = useState<number | null>(null);
  const [hoveredRating, setHoveredRating] = useState<number | null>(null);

  const handleContinue = () => {
    if (rating !== null) {
      onContinue(rating);
    }
  };

  return (
    <>
      {/* Rating Stars */}
      <div className="w-full max-w-4xl mx-auto mb-8">
        <div className="flex justify-center items-center gap-2">
          {Array.from({ length: maxRating }, (_, i) => {
            const starValue = i + 1;
            const isFilled = starValue <= (hoveredRating || rating || 0);
            
            return (
              <button
                key={starValue}
                type="button"
                onClick={() => setRating(starValue)}
                onMouseEnter={() => setHoveredRating(starValue)}
                onMouseLeave={() => setHoveredRating(null)}
                className="transition-transform hover:scale-110 active:scale-95"
              >
                <Star
                  className={`w-12 h-12 ${
                    isFilled
                      ? "fill-cyan-400 text-cyan-400"
                      : "fill-gray-200 text-gray-200"
                  } transition-colors duration-200`}
                />
              </button>
            );
          })}
        </div>
        {rating && (
          <p className="text-center mt-4 text-gray-600 font-inter">
            Vous avez sélectionné {rating} sur {maxRating}
          </p>
        )}
      </div>

      {/* Continue Button */}
      <div className="w-full max-w-4xl mx-auto">
        <button
          onClick={handleContinue}
          disabled={required && rating === null}
          className="px-8 py-4 rounded-2xl bg-gradient-to-r from-cyan-400 to-cyan-500 text-gray-900 font-bold text-base sm:text-lg shadow-lg shadow-cyan-500/30 hover:shadow-cyan-400/50 transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 font-inter"
        >
          {continueButtonText}
        </button>
      </div>
    </>
  );
}

