"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Settings, Type, X } from "lucide-react";
import { useAccessibility } from "@/hooks/useAccessibility";
import { cn } from "@/lib/utils";

export default function AccessibilityMenu() {
  const [isOpen, setIsOpen] = useState(false);
  const { settings, setFontSize } = useAccessibility();

  return (
    <>
      {/* Toggle Button */}
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        className="fixed bottom-6 right-6 z-50 p-3 rounded-full bg-white shadow-lg border border-gray-200 hover:bg-gray-50 transition-colors"
        aria-label="Ouvrir les options d'accessibilité"
        aria-expanded={isOpen}
      >
        <Settings className="w-5 h-5 text-gray-700" />
      </motion.button>

      {/* Menu Panel */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40"
            />

            {/* Menu */}
            <motion.div
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 20, scale: 0.95 }}
              transition={{ duration: 0.2 }}
              className="fixed bottom-24 right-6 z-50 w-80 bg-white rounded-2xl shadow-2xl border border-gray-200 p-6"
            >
              {/* Header */}
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-bold text-gray-900 font-inter">
                  Accessibilité
                </h3>
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-1 rounded-lg hover:bg-gray-100 transition-colors"
                  aria-label="Fermer"
                >
                  <X className="w-5 h-5 text-gray-600" />
                </button>
              </div>

              {/* Options */}
              <div className="space-y-4">
                {/* Font Size */}
                <div className="space-y-2">
                  <div className="flex items-center gap-3">
                    <Type className="w-5 h-5 text-gray-600" />
                    <span className="text-sm font-medium text-gray-700 font-inter">
                      Taille du texte
                    </span>
                  </div>
                  <div className="flex gap-2 ml-8">
                    {(['normal', 'large', 'xlarge'] as const).map((size) => (
                      <button
                        key={size}
                        onClick={() => setFontSize(size)}
                        className={cn(
                          "px-3 py-1.5 rounded-lg text-xs font-medium transition-colors font-inter",
                          settings.fontSize === size
                            ? "bg-cyan-500 text-white"
                            : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                        )}
                        aria-label={`Taille ${size}`}
                      >
                        {size === 'normal' ? 'Normal' : size === 'large' ? 'Grand' : 'Très grand'}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}

