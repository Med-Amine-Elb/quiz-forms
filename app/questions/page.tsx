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

    // Reset states with smooth fade out
    if (questionContentRef.current) {
      gsap.to(questionContentRef.current, {
        opacity: 0,
        y: 10,
        duration: 0.3,
        ease: 'power2.in',
        onComplete: () => {
          gsap.set(questionContentRef.current, { opacity: 0, y: 20 });
        }
      });
    }
    if (avatarRef.current) {
      gsap.to(avatarRef.current, {
        opacity: 0,
        duration: 0.3,
        ease: 'power2.in',
        onComplete: () => {
          gsap.set(avatarRef.current, { opacity: 0 });
        }
      });
    }

    // Animate content and avatar after question header animation completes
    // Wait for section intro to fade out (0.5s) + small delay for smooth transition
    const timer = setTimeout(() => {
      const tl = gsap.timeline({ 
        defaults: { 
          ease: 'power2.out',
        } 
      });
      
      // Animate question content (answers) with smooth fade and slide
      if (questionContentRef.current) {
        tl.fromTo(questionContentRef.current, 
          { opacity: 0, y: 20 },
          {
            opacity: 1,
            y: 0,
            duration: 0.6,
            ease: 'power2.out',
          }, 
          0
        );
      }
      
      // Animate avatar with slight delay for staggered effect
      if (avatarRef.current) {
        tl.fromTo(avatarRef.current,
          { opacity: 0 },
          {
            opacity: 1,
            duration: 0.8,
            ease: 'power2.out',
          }, 
          0.15
        );
      }
    }, 600); // Optimized delay for better synchronization

    return () => {
      clearTimeout(timer);
      // Kill any running animations
      if (questionContentRef.current) {
        gsap.killTweensOf(questionContentRef.current);
      }
      if (avatarRef.current) {
        gsap.killTweensOf(avatarRef.current);
      }
    };
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

