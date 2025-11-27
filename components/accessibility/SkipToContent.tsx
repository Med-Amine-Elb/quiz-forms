"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function SkipToContent() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Show skip button when user presses Tab
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Tab' && !e.shiftKey) {
        setIsVisible(true);
      }
    };

    const handleClick = () => {
      setIsVisible(false);
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('click', handleClick);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('click', handleClick);
    };
  }, []);

  const handleSkip = () => {
    const mainContent = document.querySelector('[data-main-content]');
    if (mainContent) {
      (mainContent as HTMLElement).focus();
      (mainContent as HTMLElement).scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.button
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          onClick={handleSkip}
          className="fixed top-4 left-1/2 -translate-x-1/2 z-[100] px-6 py-3 bg-cyan-500 text-white font-semibold rounded-lg shadow-lg focus:outline-none focus:ring-4 focus:ring-cyan-500/50 font-inter"
          aria-label="Aller au contenu principal"
        >
          Aller au contenu
        </motion.button>
      )}
    </AnimatePresence>
  );
}

