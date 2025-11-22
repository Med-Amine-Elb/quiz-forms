"use client";

import { useState, useEffect } from "react";
import { X, ChevronLeft, ChevronRight, List } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { questions } from "@/data/questions";
import { cn } from "@/lib/utils";

interface QuestionNavigatorProps {
  currentQuestionIndex: number;
  onNavigate: (index: number) => void;
}

export default function QuestionNavigator({
  currentQuestionIndex,
  onNavigate,
}: QuestionNavigatorProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  // Toggle with keyboard shortcut (Ctrl/Cmd + K)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === "k") {
        e.preventDefault();
        setIsOpen((prev) => !prev);
      }
      // Close with Escape
      if (e.key === "Escape" && isOpen) {
        setIsOpen(false);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen]);

  const filteredQuestions = questions.filter((q, index) =>
    q.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
    q.id.toString().includes(searchTerm) ||
    q.type.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getQuestionTypeColor = (type: string) => {
    switch (type) {
      case "choice":
        return "bg-blue-100 text-blue-700 border-blue-300";
      case "text":
        return "bg-green-100 text-green-700 border-green-300";
      case "satisfaction":
        return "bg-purple-100 text-purple-700 border-purple-300";
      case "rating":
        return "bg-yellow-100 text-yellow-700 border-yellow-300";
      default:
        return "bg-gray-100 text-gray-700 border-gray-300";
    }
  };

  const getQuestionTypeLabel = (type: string) => {
    switch (type) {
      case "choice":
        return "Choice";
      case "text":
        return "Text";
      case "satisfaction":
        return "Slider";
      case "rating":
        return "Rating";
      default:
        return type;
    }
  };

  return (
    <>
      {/* Toggle Button - Fixed position */}
      <motion.button
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 z-50 flex items-center gap-2 px-4 py-3 bg-cyan-500 hover:bg-cyan-600 text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-200 font-inter font-semibold"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <List className="w-5 h-5" />
        <span className="hidden sm:inline">Navigation</span>
        <span className="text-xs bg-white/20 px-2 py-0.5 rounded-full">
          {currentQuestionIndex + 1}/{questions.length}
        </span>
      </motion.button>

      {/* Navigation Panel */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
            />

            {/* Panel */}
            <motion.div
              initial={{ opacity: 0, x: 400 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 400 }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed right-0 top-0 bottom-0 w-full sm:w-96 bg-white shadow-2xl z-50 flex flex-col overflow-hidden"
            >
              {/* Header */}
              <div className="flex items-center justify-between p-4 border-b bg-gradient-to-r from-cyan-500 to-cyan-600 text-white">
                <div>
                  <h2 className="text-xl font-bold font-inter">Question Navigator</h2>
                  <p className="text-sm text-cyan-100">
                    Press <kbd className="px-1.5 py-0.5 bg-white/20 rounded text-xs">Ctrl+K</kbd> to toggle
                  </p>
                </div>
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-2 hover:bg-white/20 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Search */}
              <div className="p-4 border-b">
                <input
                  type="text"
                  placeholder="Search questions..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 font-inter"
                  autoFocus
                />
              </div>

              {/* Current Question Info */}
              <div className="p-4 bg-cyan-50 border-b">
                <div className="text-sm font-semibold text-gray-700 font-inter">
                  Current: Question {currentQuestionIndex + 1}
                </div>
                <div className="text-xs text-gray-600 mt-1 font-inter">
                  {questions[currentQuestionIndex]?.question.substring(0, 60)}...
                </div>
              </div>

              {/* Navigation Buttons */}
              <div className="flex gap-2 p-4 border-b bg-gray-50">
                <button
                  onClick={() => {
                    if (currentQuestionIndex > 0) {
                      onNavigate(currentQuestionIndex - 1);
                    }
                  }}
                  disabled={currentQuestionIndex === 0}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-inter"
                >
                  <ChevronLeft className="w-4 h-4" />
                  Previous
                </button>
                <button
                  onClick={() => {
                    if (currentQuestionIndex < questions.length - 1) {
                      onNavigate(currentQuestionIndex + 1);
                    }
                  }}
                  disabled={currentQuestionIndex === questions.length - 1}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-inter"
                >
                  Next
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>

              {/* Questions List */}
              <div className="flex-1 overflow-y-auto">
                <div className="p-2">
                  <div className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2 px-2 font-inter">
                    All Questions ({filteredQuestions.length})
                  </div>
                  <div className="space-y-1">
                    {filteredQuestions.map((question, index) => {
                      const questionIndex = questions.findIndex((q) => q.id === question.id);
                      const isActive = questionIndex === currentQuestionIndex;

                      return (
                        <motion.button
                          key={question.id}
                          onClick={() => {
                            onNavigate(questionIndex);
                            setIsOpen(false);
                          }}
                          whileHover={{ x: 4 }}
                          className={cn(
                            "w-full text-left p-3 rounded-lg border transition-all duration-200 font-inter",
                            isActive
                              ? "bg-cyan-500 text-white border-cyan-600 shadow-md"
                              : "bg-white hover:bg-gray-50 border-gray-200 text-gray-700"
                          )}
                        >
                          <div className="flex items-start justify-between gap-2">
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2 mb-1">
                                <span
                                  className={cn(
                                    "text-sm font-bold",
                                    isActive ? "text-white" : "text-cyan-600"
                                  )}
                                >
                                  Q{question.id}
                                </span>
                                <span
                                  className={cn(
                                    "text-xs px-2 py-0.5 rounded border font-medium",
                                    isActive
                                      ? "bg-white/20 text-white border-white/30"
                                      : getQuestionTypeColor(question.type)
                                  )}
                                >
                                  {getQuestionTypeLabel(question.type)}
                                </span>
                              </div>
                              <div
                                className={cn(
                                  "text-sm line-clamp-2",
                                  isActive ? "text-white/90" : "text-gray-700"
                                )}
                              >
                                {question.question}
                              </div>
                            </div>
                            {isActive && (
                              <motion.div
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                className="w-2 h-2 bg-white rounded-full"
                              />
                            )}
                          </div>
                        </motion.button>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Footer */}
              <div className="p-4 border-t bg-gray-50 text-xs text-gray-600 font-inter">
                <div className="flex items-center justify-between">
                  <span>Total: {questions.length} questions</span>
                  <span>Current: {currentQuestionIndex + 1}</span>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}

