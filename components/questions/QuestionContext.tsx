"use client";

import { createContext, useContext } from "react";
import { getSectionForQuestion } from "@/lib/questionSections";

interface QuestionContextType {
  sectionColor: string;
  sectionAccent: string;
}

const QuestionContext = createContext<QuestionContextType>({
  sectionColor: '#0EA5E9',
  sectionAccent: '#0EA5E9',
});

export function useQuestionContext() {
  return useContext(QuestionContext);
}

export function QuestionContextProvider({
  questionId,
  children,
}: {
  questionId: number;
  children: React.ReactNode;
}) {
  const section = getSectionForQuestion(questionId);
  
  return (
    <QuestionContext.Provider
      value={{
        sectionColor: section.color,
        sectionAccent: section.accent,
      }}
    >
      {children}
    </QuestionContext.Provider>
  );
}

