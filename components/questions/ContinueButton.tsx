"use client";

import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Check } from "lucide-react";
import LoadingSpinner from "@/components/ui/loading-spinner";
import { cn } from "@/lib/utils";

interface ContinueButtonProps {
  onClick: () => void;
  disabled?: boolean;
  accentColor?: string;
  sectionColor?: string;
  children: React.ReactNode;
  className?: string;
}

export default function ContinueButton({
  onClick,
  disabled = false,
  accentColor = "#06b6d4",
  sectionColor,
  children,
  className,
}: ContinueButtonProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [ripples, setRipples] = useState<Array<{ id: number; x: number; y: number }>>([]);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const rippleIdRef = useRef(0);

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (disabled || isLoading) return;

    // Create ripple effect
    if (buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const newRipple = { id: rippleIdRef.current++, x, y };
      setRipples((prev) => [...prev, newRipple]);
      setTimeout(() => {
        setRipples((prev) => prev.filter((r) => r.id !== newRipple.id));
      }, 600);
    }

    // Show loading state
    setIsLoading(true);

    // Show success checkmark after a short delay
    setTimeout(() => {
      setIsLoading(false);
      setShowSuccess(true);
      
      // Call the actual onClick after showing success
      setTimeout(() => {
        onClick();
        setShowSuccess(false);
      }, 500);
    }, 300);
  };

  return (
    <motion.button
      ref={buttonRef}
      onClick={handleClick}
      disabled={disabled || isLoading}
      className={cn(
        "relative w-full px-8 py-4 rounded-2xl text-white font-bold text-base sm:text-lg",
        "shadow-lg transition-all duration-300 overflow-hidden",
        "disabled:opacity-50 disabled:cursor-not-allowed font-inter",
        className
      )}
      style={{
        background: sectionColor
          ? `linear-gradient(135deg, ${accentColor}, ${sectionColor})`
          : `linear-gradient(135deg, ${accentColor}, ${accentColor}dd)`,
        boxShadow: disabled
          ? `0 10px 40px ${accentColor}20`
          : `0 15px 50px ${accentColor}40, inset 0 1px 0 rgba(255,255,255,0.3)`,
      }}
      whileHover={!disabled ? { scale: 1.03, y: -2 } : {}}
      whileTap={!disabled ? { scale: 0.98 } : {}}
      animate={
        !disabled && !isLoading && !showSuccess
          ? {
              boxShadow: [
                `0 10px 40px ${accentColor}40`,
                `0 12px 45px ${accentColor}50`,
                `0 10px 40px ${accentColor}40`,
              ],
            }
          : {}
      }
      transition={{
        boxShadow: {
          duration: 2,
          repeat: Infinity,
          ease: "easeInOut",
        },
      }}
      onMouseEnter={(e) => {
        if (!disabled) {
          e.currentTarget.style.boxShadow = `0 25px 70px ${accentColor}60, inset 0 1px 0 rgba(255,255,255,0.4)`;
        }
      }}
      onMouseLeave={(e) => {
        if (!disabled) {
          e.currentTarget.style.boxShadow = `0 15px 50px ${accentColor}40, inset 0 1px 0 rgba(255,255,255,0.3)`;
        }
      }}
    >
      {/* Ripple effects */}
      {ripples.map((ripple) => (
        <motion.span
          key={ripple.id}
          className="absolute rounded-full bg-white/30"
          style={{
            left: ripple.x,
            top: ripple.y,
            width: 0,
            height: 0,
            transform: "translate(-50%, -50%)",
          }}
          animate={{
            width: 300,
            height: 300,
            opacity: [0.5, 0],
          }}
          transition={{
            duration: 0.6,
            ease: "easeOut",
          }}
        />
      ))}

      {/* Content */}
      <span className="relative z-10 flex items-center justify-center gap-2">
        <AnimatePresence mode="wait">
          {isLoading ? (
            <motion.div
              key="loading"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ duration: 0.2 }}
              className="flex items-center gap-2"
            >
              <LoadingSpinner size="sm" color="currentColor" />
              <span>Chargement...</span>
            </motion.div>
          ) : showSuccess ? (
            <motion.div
              key="success"
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.5 }}
              transition={{
                type: "spring",
                stiffness: 500,
                damping: 25,
              }}
              className="flex items-center gap-2"
            >
              <motion.div
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{
                  type: "spring",
                  stiffness: 500,
                  damping: 25,
                }}
              >
                <Check className="w-5 h-5" />
              </motion.div>
              <span>Terminé!</span>
            </motion.div>
          ) : (
            <motion.span
              key="default"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              {children}
            </motion.span>
          )}
        </AnimatePresence>
      </span>
    </motion.button>
  );
}

