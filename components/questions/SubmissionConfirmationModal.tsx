"use client";

import { motion, AnimatePresence } from "framer-motion";
import { X, CheckCircle2, Edit2, Send } from "lucide-react";
import { QuestionAnswer } from "@/hooks/useQuestionNavigation";
import { questions } from "@/data/questions";
import { getSectionForQuestion } from "@/lib/questionSections";
import { cn } from "@/lib/utils";

interface SubmissionConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  answers: QuestionAnswer[];
  nom: string;
  prenom: string;
  email: string;
  isSubmitting?: boolean;
}

export default function SubmissionConfirmationModal({
  isOpen,
  onClose,
  onConfirm,
  answers,
  nom,
  prenom,
  email,
  isSubmitting = false,
}: SubmissionConfirmationModalProps) {
  // Group answers by section
  const answersBySection = answers.reduce((acc, answer) => {
    const question = questions.find((q) => q.id === answer.questionId);
    if (!question) return acc;

    const section = getSectionForQuestion(answer.questionId);
    if (!acc[section.id]) {
      acc[section.id] = {
        section,
        answers: [],
      };
    }

    // Get readable answer based on question type
    let readableAnswer: string;
    
    if (question.type === "choice" && question.choices) {
      // Single choice question
      const choice = question.choices.find((c) => c.id === String(answer.answer));
      readableAnswer = choice?.label || String(answer.answer);
    } else if (question.type === "multiple" && question.choices && Array.isArray(answer.answer)) {
      // Multiple choice question - array of IDs
      const selectedChoices = answer.answer
        .map((id: string) => {
          const choice = question.choices?.find((c) => c.id === id);
          return choice?.label || id;
        })
        .filter(Boolean);
      readableAnswer = selectedChoices.length > 0 
        ? selectedChoices.join(", ") 
        : "Aucune sélection";
    } else if (question.type === "satisfaction") {
      // Satisfaction question - convert ID to readable text
      const satisfactionLevels: Record<string, string> = {
        "satisfaction-0": "Très insatisfait (0-20%)",
        "satisfaction-1": "Insatisfait (21-40%)",
        "satisfaction-2": "Neutre (41-60%)",
        "satisfaction-3": "Satisfait (61-80%)",
        "satisfaction-4": "Très satisfait (81-100%)",
      };
      readableAnswer = satisfactionLevels[String(answer.answer)] || String(answer.answer);
    } else if (question.type === "text") {
      // Text question - show the text answer
      readableAnswer = String(answer.answer).trim() || "Aucune réponse";
    } else if (question.type === "rating") {
      // Rating question - show the rating value
      readableAnswer = `${answer.answer} / 5`;
    } else {
      // Fallback
      readableAnswer = String(answer.answer);
    }

    acc[section.id].answers.push({
      question,
      answer: readableAnswer,
    });

    return acc;
  }, {} as Record<string, { section: ReturnType<typeof getSectionForQuestion>; answers: Array<{ question: typeof questions[0]; answer: string }> }>);

  const totalQuestions = questions.length;
  const answeredQuestions = answers.length;
  const completionPercentage = Math.round((answeredQuestions / totalQuestions) * 100);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[200]"
            onClick={onClose}
          />

          {/* Modal */}
          <div className="fixed inset-0 z-[201] flex items-center justify-center p-4 pointer-events-none">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{
                duration: 0.4,
                ease: [0.16, 1, 0.3, 1],
              }}
              className="relative w-full max-w-4xl max-h-[90vh] bg-white rounded-2xl shadow-2xl overflow-hidden pointer-events-auto"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="sticky top-0 z-10 bg-gradient-to-r from-blue-600 to-purple-600 px-6 py-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
                    <CheckCircle2 className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-white">Confirmer la soumission</h2>
                    <p className="text-sm text-white/90">
                      {answeredQuestions} sur {totalQuestions} questions ({completionPercentage}%)
                    </p>
                  </div>
                </div>
                <button
                  onClick={onClose}
                  disabled={isSubmitting}
                  className="p-2 rounded-lg hover:bg-white/20 transition-colors disabled:opacity-50"
                  aria-label="Fermer"
                >
                  <X className="w-5 h-5 text-white" />
                </button>
              </div>

              {/* Content */}
              <div className="overflow-y-auto max-h-[calc(90vh-180px)] p-6">
                {/* User Info */}
                <div className="mb-6 p-4 bg-gray-50 rounded-xl">
                  <h3 className="font-semibold text-gray-900 mb-3">Informations personnelles</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-sm">
                    <div>
                      <span className="text-gray-600">Nom:</span>
                      <p className="font-medium text-gray-900">{nom || "Non renseigné"}</p>
                    </div>
                    <div>
                      <span className="text-gray-600">Prénom:</span>
                      <p className="font-medium text-gray-900">{prenom || "Non renseigné"}</p>
                    </div>
                    <div>
                      <span className="text-gray-600">Email:</span>
                      <p className="font-medium text-gray-900">{email || "Non renseigné"}</p>
                    </div>
                  </div>
                </div>

                {/* Answers by Section */}
                <div className="space-y-6">
                  {Object.entries(answersBySection).map(([sectionId, { section, answers: sectionAnswers }]) => (
                    <div key={sectionId} className="border border-gray-200 rounded-xl overflow-hidden">
                      {/* Section Header */}
                      <div
                        className="px-4 py-3 flex items-center gap-3"
                        style={{
                          background: `linear-gradient(135deg, ${section.accent}15, ${section.accent}05)`,
                          borderBottom: `2px solid ${section.accent}30`,
                        }}
                      >
                        <span className="text-2xl">{section.icon}</span>
                        <div>
                          <h3 className="font-bold text-gray-900" style={{ color: section.accent }}>
                            {section.name}
                          </h3>
                          <p className="text-xs text-gray-600">{sectionAnswers.length} réponses</p>
                        </div>
                      </div>

                      {/* Section Answers */}
                      <div className="divide-y divide-gray-100">
                        {sectionAnswers.map(({ question, answer }) => (
                          <div key={question.id} className="px-4 py-3 hover:bg-gray-50 transition-colors">
                            <div className="flex items-start gap-3">
                              <div
                                className="flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center text-sm font-bold text-white"
                                style={{ backgroundColor: section.accent }}
                              >
                                {question.id}
                              </div>
                              <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium text-gray-900 mb-2">
                                  {question.question}
                                </p>
                                <div className="text-sm text-gray-700 bg-gray-50 px-4 py-3 rounded-lg border border-gray-200">
                                  {answer.includes(", ") && answer.split(", ").length > 1 ? (
                                    <ul className="list-disc list-inside space-y-1.5">
                                      {answer.split(", ").map((item, idx) => (
                                        <li key={idx} className="text-gray-800">{item.trim()}</li>
                                      ))}
                                    </ul>
                                  ) : (
                                    <p className="whitespace-pre-wrap break-words leading-relaxed">
                                      {answer}
                                    </p>
                                  )}
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Warning if incomplete */}
                {answeredQuestions < totalQuestions && (
                  <div className="mt-6 p-4 bg-amber-50 border border-amber-200 rounded-xl">
                    <p className="text-sm text-amber-900">
                      ⚠️ Vous avez répondu à {answeredQuestions} questions sur {totalQuestions}. 
                      Vous pouvez continuer à répondre ou soumettre maintenant.
                    </p>
                  </div>
                )}
              </div>

              {/* Footer */}
              <div className="sticky bottom-0 bg-white border-t border-gray-200 px-6 py-4 flex items-center justify-end gap-3">
                <button
                  onClick={onClose}
                  disabled={isSubmitting}
                  className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors disabled:opacity-50 font-medium"
                >
                  Annuler
                </button>
                <motion.button
                  onClick={onConfirm}
                  disabled={isSubmitting}
                  whileHover={{ scale: isSubmitting ? 1 : 1.02 }}
                  whileTap={{ scale: isSubmitting ? 1 : 0.98 }}
                  className={cn(
                    "px-6 py-2.5 rounded-lg font-semibold text-white flex items-center gap-2 transition-all",
                    "bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700",
                    "disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
                  )}
                >
                  {isSubmitting ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      <span>Envoi en cours...</span>
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4" />
                      <span>Confirmer et envoyer</span>
                    </>
                  )}
                </motion.button>
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}

