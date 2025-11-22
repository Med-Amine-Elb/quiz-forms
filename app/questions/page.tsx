"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import QuestionPage from "@/components/questions/QuestionPage";
import QuestionRenderer from "@/components/questions/QuestionRenderer";
import Avatar3D from "@/src/components/Avatar3D";
import { useQuestionNavigation } from "@/hooks/useQuestionNavigation";

export default function QuestionsPage() {
  const {
    currentQuestion,
    currentQuestionIndex,
    goToNextQuestion,
    totalQuestions,
  } = useQuestionNavigation();

  const pageRef = useRef<HTMLDivElement>(null);
  const questionNumberRef = useRef<HTMLDivElement>(null);
  const questionTextRef = useRef<HTMLDivElement>(null);
  const questionContentRef = useRef<HTMLDivElement>(null);
  const avatarRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!currentQuestion || !pageRef.current) return;

    // Reset states
    if (questionContentRef.current) {
      gsap.set(questionContentRef.current, { opacity: 0, y: 30 });
    }
    if (avatarRef.current) {
      gsap.set(avatarRef.current, { opacity: 0 });
    }

    // Animate content and avatar after question header animation completes
    const timer = setTimeout(() => {
      const tl = gsap.timeline();
      
      tl.to(questionContentRef.current, {
        opacity: 1,
        y: 0,
        duration: 0.8,
        ease: 'power2.out',
      })
        .to(avatarRef.current, {
          opacity: 1,
          duration: 1,
          ease: 'power2.out',
        }, '-=0.3');
    }, 2000); // Wait for question header animation to complete

    return () => clearTimeout(timer);
  }, [currentQuestionIndex]);

  if (!currentQuestion) {
    return <div>Chargement...</div>;
  }

  return (
    <QuestionPage
      ref={pageRef}
      questionNumber={currentQuestion.id}
      questionText={currentQuestion.question}
      questionNumberRef={questionNumberRef}
      questionTextRef={questionTextRef}
      avatar={
        <div ref={avatarRef} className="opacity-0">
          <Avatar3D
            className="w-full h-full max-w-none"
            autoRotate={false}
            modelPath="/animation/691dbc778e7eb12743aabf09.glb"
            enableWaving={true}
            cameraPosition={[0, 0.5, 4.5]}
            cameraLookAt={[0, 0.3, 0]}
            cameraFOV={30.5}
            modelPosition={[0, -1.5, 1.4]}
            modelScale={1.2}
          />
        </div>
      }
    >
      <div ref={questionContentRef} className="opacity-0 w-full">
        <QuestionRenderer
          question={currentQuestion}
          onAnswer={goToNextQuestion}
        />
      </div>
    </QuestionPage>
  );
}

