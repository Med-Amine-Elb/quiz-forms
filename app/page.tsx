'use client'

import { useEffect, useMemo, useRef, useState, useCallback, memo, Suspense } from 'react'
import dynamic from 'next/dynamic'
import { motion, AnimatePresence } from 'framer-motion'
import gsap from 'gsap'
import QuestionPage from '@/components/questions/QuestionPage'
import QuestionRenderer from '@/components/questions/QuestionRenderer'
import ProgressBar from '@/components/questions/ProgressBar'
import { useQuestionNavigation } from '@/hooks/useQuestionNavigation'
import AccessibilityMenu from '@/components/accessibility/AccessibilityMenu'
import SkipToContent from '@/components/accessibility/SkipToContent'
import { questions } from '@/data/questions'
import { preloadQuestionType } from '@/lib/preloadQuestionComponents'
import { getSectionForQuestion } from '@/lib/questionSections'

// Lazy load heavy components
const Avatar3D = dynamic(
  () => import('@/src/components/Avatar3D'),
  { 
    ssr: false, 
    loading: () => (
      <div className="flex items-center justify-center w-full h-full">
        <div className="animate-pulse text-white/20">Loading avatar...</div>
      </div>
    )
  }
)

const CompletionScreen = dynamic(
  () => import('@/components/questions/CompletionScreen'),
  { loading: () => null }
)

const QuestionNavigator = dynamic(
  () => import('@/components/dev/QuestionNavigator'),
  { ssr: false, loading: () => null }
)

const runOnIdle = (callback: () => void) => {
  if (typeof window !== 'undefined' && 'requestIdleCallback' in window) {
    ;(window as any).requestIdleCallback(callback)
    return
  }
  setTimeout(callback, 0)
}

export default function SurveyLanding() {
  const containerRef = useRef(null)
  const characterRef = useRef(null)
  const headingRef = useRef(null)
  const ctaRef = useRef(null)
  const logoRef = useRef(null)
  const nomRef = useRef<HTMLInputElement>(null)
  const prenomRef = useRef<HTMLInputElement>(null)
  const buttonRef = useRef<HTMLButtonElement>(null)
  const errorMessageRef = useRef<HTMLDivElement>(null)
  const avatarRef = useRef(null)
  const currentPageRef = useRef(null)
  const nextPageRef = useRef(null)
  const nextPageAvatarRef = useRef(null)
  const loaderRef = useRef(null)
  const [submitted, setSubmitted] = useState(false)
  const [showError, setShowError] = useState(false)
  const [showNextPage, setShowNextPage] = useState(false)
  const [showLoader, setShowLoader] = useState(false)
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false)
  const [currentSlide, setCurrentSlide] = useState(0)
  const [isAutoRotating, setIsAutoRotating] = useState(true)
  const slideTimerRef = useRef<NodeJS.Timeout | null>(null)
  
  // Question navigation hook
  const {
    currentQuestion,
    currentQuestionIndex,
    goToNextQuestion,
    goToPreviousQuestion,
    goToQuestion,
    isLastQuestion,
    isCompleted,
    resetSurvey,
    totalQuestions,
    answers,
  } = useQuestionNavigation()
  
  const currentSection = useMemo(
    () => (currentQuestion ? getSectionForQuestion(currentQuestion.id) : null),
    [currentQuestion]
  )
  
  // Track if submission has been done to prevent duplicates
  const hasSubmittedRef = useRef(false);
  
  // Submit answers to Power Automate when form is completed
  useEffect(() => {
    if (isCompleted && answers.length > 0 && nomRef.current?.value && prenomRef.current?.value && !hasSubmittedRef.current) {
      hasSubmittedRef.current = true; // Mark as submitted immediately
      
      const submitAnswers = async () => {
        try {
          // Enrich answers with question text and convert choice IDs to readable text
          const enrichedAnswers = answers.map(ans => {
            const question = questions.find(q => q.id === ans.questionId);
            
            // Convert answer to readable text
            let readableAnswer = ans.answer;
            
            // For choice questions, convert ID to label
            if (question?.type === 'choice' && question.choices && typeof ans.answer === 'string') {
              const selectedChoice = question.choices.find(c => c.id === ans.answer);
              if (selectedChoice) {
                readableAnswer = selectedChoice.label;
              }
            }
            
            // For multiple choice questions (array of IDs)
            if (question?.type === 'multiple' && question.choices && Array.isArray(ans.answer)) {
              readableAnswer = ans.answer.map(answerId => {
                const choice = question.choices?.find(c => c.id === answerId);
                return choice?.label || answerId;
              }).join(', ');
            }
            
            // For satisfaction questions (convert number to text)
            if (question?.type === 'satisfaction' && typeof ans.answer === 'string') {
              // The answer is already a satisfaction level ID, keep it or convert
              readableAnswer = ans.answer;
            }
            
            return {
              questionId: ans.questionId,
              questionText: question?.question || `Question ${ans.questionId}`,
              answer: String(readableAnswer),
            };
          });

          const response = await fetch('/api/submit', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              nom: nomRef.current?.value.trim() || '',
              prenom: prenomRef.current?.value.trim() || '',
              answers: enrichedAnswers,
            }),
          });

          if (!response.ok) {
            const error = await response.json();
            console.error('Failed to submit answers:', error);
            // You can show an error message to the user here if needed
          } else {
            const result = await response.json();
            console.log('Answers submitted successfully:', result);
          }
        } catch (error) {
          console.error('Error submitting answers:', error);
          // You can show an error message to the user here if needed
        }
      };

      submitAnswers();
    }
  }, [isCompleted, answers]);
  
  const questionContentRef = useRef<HTMLDivElement>(null)
  const lastSectionRef = useRef<string | null>(null)
  const memoizedQuestionAvatar = useMemo(
    () => (
      <Avatar3D
        className="w-full h-full max-w-none"
        autoRotate={false}
        modelPath="/animation/691dbc778e7eb12743aabf09.glb"
        enableWaving={true}
        cameraPosition={[0, 0.5, 4.5]}
        cameraLookAt={[0, 0.3, 0]}
        cameraFOV={30.5}
        modelPosition={[0.1, -1.5, 1.2]}
        modelScale={1.2}
      />
    ),
    []
  )

  useEffect(() => {
    if (typeof window === 'undefined') return
    const media = window.matchMedia('(prefers-reduced-motion: reduce)')
    const updatePreference = () => setPrefersReducedMotion(media.matches)
    updatePreference()
    media.addEventListener('change', updatePreference)
    return () => media.removeEventListener('change', updatePreference)
  }, [])

  // Auto-rotate slides every 5 seconds
  useEffect(() => {
    if (!isAutoRotating || showNextPage) return

    slideTimerRef.current = setInterval(() => {
      setCurrentSlide((prev) => (prev === 2 ? 0 : prev + 1))
    }, 5000)

    return () => {
      if (slideTimerRef.current) {
        clearInterval(slideTimerRef.current)
      }
    }
  }, [isAutoRotating, showNextPage])

  // Pause auto-rotation when user interacts
  const handleManualSlideChange = useCallback((newSlide: number) => {
    setIsAutoRotating(false)
    setCurrentSlide(newSlide)
    
    // Resume auto-rotation after 10 seconds
    if (slideTimerRef.current) {
      clearInterval(slideTimerRef.current)
    }
    
    setTimeout(() => {
      setIsAutoRotating(true)
    }, 10000)
  }, [])

  useEffect(() => {
    if (!currentQuestion) return
    preloadQuestionType(currentQuestion.type)
    const upcoming = questions[currentQuestionIndex + 1]
    if (upcoming) {
      runOnIdle(() => preloadQuestionType(upcoming.type))
    }
  }, [currentQuestion, currentQuestionIndex])

  useEffect(() => {
    // Optimized landing animation - reduced duration
    const timer = setTimeout(() => {
      const tl = gsap.timeline()

      // Logo and text fade in
      if (logoRef.current && headingRef.current) {
        gsap.set(logoRef.current, { opacity: 1 })
        tl.fromTo(
          [logoRef.current, headingRef.current],
          { opacity: 0, x: -40 },
          { opacity: 1, x: 0, duration: 1.2, ease: 'power2.out' },
          0
        )
      }
      // Character and form fade in
      if (characterRef.current && ctaRef.current) {
        tl.fromTo(
          [characterRef.current, ctaRef.current],
          { opacity: 0, y: 20 },
          { opacity: 1, y: 0, duration: 0.8, ease: 'power2.out' },
          1.0
        )
      }
    }, 100)

    return () => clearTimeout(timer)
  }, [])

  // Smooth transition between questions - optimized to prevent freezing
  useEffect(() => {
    if (!(showNextPage && currentQuestion && nextPageRef.current && currentSection)) {
      return
    }

    const currentSectionId = currentSection.id
    const isSectionChange = lastSectionRef.current !== currentSectionId
    const slideDuration = prefersReducedMotion ? 0.2 : 0.3
    const fadeDuration = prefersReducedMotion ? 0.2 : 0.35
    const contentDelay = prefersReducedMotion ? 0.05 : 0.15
    const avatarDelay = prefersReducedMotion ? 0.05 : 0.15

    gsap.killTweensOf(nextPageRef.current)
    gsap.killTweensOf(questionContentRef.current)
    gsap.killTweensOf(nextPageAvatarRef.current)

    requestAnimationFrame(() => {
      if (isSectionChange) {
        gsap.set(nextPageRef.current, {
          x: '100%',
          opacity: 0,
          zIndex: 2,
          clearProps: 'all',
        })
        if (questionContentRef.current) {
          gsap.set(questionContentRef.current, { opacity: 0, y: 20 })
        }
        if (nextPageAvatarRef.current) {
          gsap.set(nextPageAvatarRef.current, { opacity: 0 })
        }

        gsap.to(nextPageRef.current, {
          x: '0%',
          opacity: 1,
          duration: slideDuration,
          ease: 'power2.out',
          onComplete: () => {
            if (questionContentRef.current) {
              gsap.to(questionContentRef.current, {
                opacity: 1,
                y: 0,
                duration: fadeDuration,
                ease: 'power2.out',
                delay: contentDelay,
              })
            }
            if (nextPageAvatarRef.current) {
              gsap.to(nextPageAvatarRef.current, {
                opacity: 1,
                duration: fadeDuration,
                ease: 'power2.out',
                delay: avatarDelay,
              })
            }
          },
        })
      } else {
        // Keep page in place, only animate question content
        gsap.set(nextPageRef.current, {
          x: '0%',
          opacity: 1,
          clearProps: 'transform',
        })
        if (nextPageAvatarRef.current) {
          gsap.set(nextPageAvatarRef.current, { opacity: 1 })
        }
        if (questionContentRef.current) {
          gsap.fromTo(
            questionContentRef.current,
            { opacity: 0, y: 12 },
            {
              opacity: 1,
              y: 0,
              duration: fadeDuration,
              ease: 'power2.out',
            }
          )
        }
      }
    })

    lastSectionRef.current = currentSectionId
  }, [
    currentQuestion,
    currentSection,
    currentQuestionIndex,
    prefersReducedMotion,
    showNextPage,
  ])

  const slideToNextPage = useCallback(() => {
    // Optimized transition - reduced delays and simplified animation
    if (currentPageRef.current) {
      // Ensure current page is visible and positioned correctly
      gsap.set(currentPageRef.current, { opacity: 1, x: '0%', zIndex: 2 })
      
      // Show loader immediately
      setShowLoader(true)
      
      // Create a single optimized timeline
      const masterTimeline = gsap.timeline({
        onComplete: () => {
          // Clean up
          gsap.set(currentPageRef.current, { x: '100%', zIndex: 1 })
          setShowLoader(false)
        }
      })
      
      // Enhanced fade + slide combination
      // Prepare next page first
      masterTimeline.call(() => {
        setShowNextPage(true)
      })
      
      masterTimeline.call(() => {
        if (nextPageRef.current) {
          // Set initial states for next page
          gsap.set(nextPageRef.current, { 
            x: '100%', 
            opacity: 0, 
            zIndex: 2,
            willChange: 'transform, opacity'
          })
          
          // Set initial states for question elements
          if (questionContentRef.current) {
            gsap.set(questionContentRef.current, { opacity: 0, y: 20 })
          }
          if (nextPageAvatarRef.current) {
            gsap.set(nextPageAvatarRef.current, { opacity: 0 })
          }
        }
      })
      
      // Show loader
      masterTimeline.call(() => {
        if (loaderRef.current) {
          gsap.set(loaderRef.current, { opacity: 1 })
        }
      })
      
      // Fade out current page (with slight slide) - optimized
      masterTimeline.to(currentPageRef.current, {
        x: '-20%',
        opacity: 0,
        duration: 0.35,
        ease: 'power2.inOut',
      })
      
      // Fade out loader and slide in next page simultaneously
      masterTimeline.call(() => {
        if (loaderRef.current) {
          gsap.to(loaderRef.current, {
            opacity: 0,
            duration: 0.3,
            ease: 'power2.in',
          })
        }
      }, [], '-=0.2')
      
      // Slide in next page with fade (enhanced fade + slide combination)
      masterTimeline.call(() => {
        if (nextPageRef.current) {
          gsap.to(nextPageRef.current, {
            x: '0%',
            opacity: 1,
            duration: 0.4,
            ease: 'power2.out',
            onComplete: () => {
              // Fade in content after page is visible
              if (questionContentRef.current) {
                gsap.to(questionContentRef.current, {
                  opacity: 1,
                  y: 0,
                  duration: 0.35,
                  ease: 'power2.out',
                  delay: 0.15,
                })
              }
              
              // Fade in avatar
              if (nextPageAvatarRef.current) {
                gsap.to(nextPageAvatarRef.current, {
                  opacity: 1,
                  duration: 0.4,
                  ease: 'power2.out',
                  delay: 0.1,
                })
              }
            }
          })
        }
      }, [], '-=0.2')
    }
  }, [])

  const handleSubmit = useCallback((e: React.FormEvent) => {
    e.preventDefault()
    if (!nomRef.current?.value.trim() || !prenomRef.current?.value.trim()) {
      // Create a master timeline for all error animations
      const errorTimeline = gsap.timeline()
      
      // Show error message with dramatic animation
      setShowError(true)
      if (errorMessageRef.current) {
        errorTimeline.fromTo(
          errorMessageRef.current,
          { 
            opacity: 0, 
            y: -30, 
            scale: 0.8,
            rotation: -5,
          },
          {
            opacity: 1,
            y: 0,
            scale: 1,
            rotation: 0,
            duration: 0.6,
            ease: 'elastic.out(1, 0.5)',
          }
        )
        // Add a pulse effect after entrance
        errorTimeline.to(
          errorMessageRef.current,
          {
            scale: 1.05,
            duration: 0.2,
            yoyo: true,
            repeat: 1,
            ease: 'power2.inOut',
          },
          '-=0.3'
        )
      }
      
      // Animate empty input fields - shake and highlight
      const emptyFields = []
      if (!nomRef.current?.value.trim()) {
        emptyFields.push(nomRef.current)
      }
      if (!prenomRef.current?.value.trim()) {
        emptyFields.push(prenomRef.current)
      }
      
      emptyFields.forEach((field, index) => {
        if (field) {
          const fieldShake = gsap.timeline()
          fieldShake
            .to(field, { x: -8, duration: 0.08, ease: 'power2.out' })
            .to(field, { x: 8, duration: 0.08, ease: 'power2.out' })
            .to(field, { x: -8, duration: 0.08, ease: 'power2.out' })
            .to(field, { x: 8, duration: 0.08, ease: 'power2.out' })
            .to(field, { x: 0, duration: 0.08, ease: 'power2.out' })
          
          errorTimeline.add(fieldShake, index * 0.1)
          
          // Border color flash to red
          errorTimeline.to(
            field,
            {
              borderColor: '#ef4444',
              duration: 0.2,
              ease: 'power2.out',
            },
            index * 0.1
          )
          // Return border color
          errorTimeline.to(
            field,
            {
              borderColor: 'rgba(0, 0, 0, 0.1)',
              duration: 0.3,
              delay: 0.5,
              ease: 'power2.inOut',
            }
          )
        }
      })
      
      // Shake the button
      const buttonShake = gsap.timeline()
      buttonShake
        .to(buttonRef.current, { x: -12, duration: 0.1, ease: 'power2.out' })
        .to(buttonRef.current, { x: 12, duration: 0.1, ease: 'power2.out' })
        .to(buttonRef.current, { x: -12, duration: 0.1, ease: 'power2.out' })
        .to(buttonRef.current, { x: 12, duration: 0.1, ease: 'power2.out' })
        .to(buttonRef.current, { x: 0, duration: 0.1, ease: 'power2.out' })
      
      errorTimeline.add(buttonShake, '-=0.2')
      
      // Hide error after 5 seconds with fade out
      setTimeout(() => {
        if (errorMessageRef.current) {
          gsap.to(errorMessageRef.current, {
            opacity: 0,
            y: -15,
            scale: 0.95,
            duration: 0.4,
            ease: 'power2.in',
            onComplete: () => setShowError(false),
          })
        }
      }, 5000)
      return
    }
    setShowError(false)
    setSubmitted(true)
    
    // Trigger slide animation immediately when form is valid
    slideToNextPage()
  }, [slideToNextPage])

  // Removed handlePushComplete - no right-sliding pages
  // All transitions now use slideToNextPage which slides from right to left

  // Professional section-based background gradients with animation (matching section colors)
  const sectionBackgrounds: Record<string, string> = {
    informations: 'linear-gradient(135deg, #e0f2fe 0%, #bae6fd 25%, #7dd3fc 50%, #bae6fd 75%, #e0f2fe 100%)', // Sky Blue
    support: 'linear-gradient(135deg, #d1fae5 0%, #a7f3d0 25%, #6ee7b7 50%, #a7f3d0 75%, #d1fae5 100%)', // Emerald Green
    innovation: 'linear-gradient(135deg, #f3e8ff 0%, #e9d5ff 25%, #ddd6fe 50%, #e9d5ff 75%, #f3e8ff 100%)', // Violet Purple
    securite: 'linear-gradient(135deg, #fef3c7 0%, #fde68a 25%, #fcd34d 50%, #fde68a 75%, #fef3c7 100%)', // Amber Orange
    communication: 'linear-gradient(135deg, #fee2e2 0%, #fecaca 25%, #fca5a5 50%, #fecaca 75%, #fee2e2 100%)', // Soft Red
    landing: 'linear-gradient(to bottom right, #ffffff 0%, #f9fafb 50%, #f3f4f6 100%)', // Clean white
  };

  const currentBackground = showNextPage && currentSection 
    ? sectionBackgrounds[currentSection.id] || sectionBackgrounds.landing
    : sectionBackgrounds.landing;

  return (
    <div 
      className="w-full h-screen overflow-hidden relative" 
      style={{ 
        overflowX: 'hidden',
      }}
    >
      {/* Animated Background Layer */}
      <motion.div
        className="absolute inset-0 -z-10"
        style={{
          background: currentBackground,
          backgroundSize: '400% 400%',
        }}
        animate={showNextPage ? {
          backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'],
        } : {}}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: "linear",
        }}
      />
      {/* Subtle Dot Pattern Overlay for Depth (only on question pages) */}
      {showNextPage && (
        <div 
          className="absolute inset-0 opacity-[0.03] pointer-events-none"
          style={{
            backgroundImage: `radial-gradient(circle at 2px 2px, currentColor 1px, transparent 0)`,
            backgroundSize: '32px 32px',
          }}
        />
      )}
      
      {/* Fixed Navigation - Always visible on landing page */}
      {!showNextPage && (
        <nav ref={logoRef} className="fixed top-0 left-0 right-0 z-[100] px-6 md:px-12 py-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img
              src="/societe-des-boissons-du-maroc--600-removebg-preview.png"
              alt="Société des Boissons du Maroc"
              className="h-12 md:h-16 w-auto object-contain drop-shadow-lg"
            />
            <div className="h-12 md:h-16 w-px bg-gray-400/50"></div>
            <span className="text-xl md:text-2xl font-bold drop-shadow-md">
              <span className="text-blue-600">Enquête</span>
              <span className="text-purple-600"> IT</span>
            </span>
          </div>
        </nav>
      )}
      
      {/* Loader */}
      {showLoader && (
        <div
          ref={loaderRef}
          className="absolute inset-0 z-50 flex items-center justify-center"
        >
          <div className="text-center">
            <div className="mb-4">
              <span className="h-12 w-12 rounded-full border-4 border-cyan-400 border-t-transparent animate-spin inline-block" />
            </div>
            <p className="text-xl font-semibold text-gray-900 font-inter">
              Chargement de quiz...
            </p>
          </div>
        </div>
      )}

      {/* Current Page */}
      <div
        ref={currentPageRef}
        className="absolute inset-0 w-full h-full flex overflow-hidden"
        style={{
          zIndex: 2,
          willChange: 'transform',
          overflowX: 'hidden',
        }}
      >
      {/* Full Page Container - NO white background blocking shader */}
      <div className="absolute inset-0 overflow-hidden pt-24">
          
          {/* Content Grid */}
          <div className="h-full grid grid-cols-1 lg:grid-cols-2 gap-8 px-6 md:px-12 pb-12">
            
            {/* Left Side - Feedback Illustration */}
            <div ref={characterRef} className="flex items-center justify-center opacity-0 relative">
              <div className="relative w-full h-full flex items-center justify-center max-w-lg">
                
                {/* Background decorative circles */}
                <motion.div
                  className="absolute top-20 left-10 w-32 h-32 bg-purple-100 rounded-full opacity-60"
                  animate={{ scale: [1, 1.2, 1], opacity: [0.6, 0.8, 0.6] }}
                  transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                />
                <motion.div
                  className="absolute bottom-32 right-20 w-40 h-40 bg-blue-100 rounded-full opacity-50"
                  animate={{ scale: [1, 1.15, 1], opacity: [0.5, 0.7, 0.5] }}
                  transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                />
                
                {/* Floating decorative elements */}
                <motion.div
                  className="absolute top-24 right-16 text-blue-400 text-2xl"
                  animate={{ y: [0, -15, 0], rotate: [0, 10, 0] }}
                  transition={{ duration: 3, repeat: Infinity }}
                >
                  +
                </motion.div>
                <motion.div
                  className="absolute bottom-24 left-12 text-purple-400 text-2xl"
                  animate={{ y: [0, 15, 0], rotate: [0, -10, 0] }}
                  transition={{ duration: 3.5, repeat: Infinity, delay: 0.5 }}
                >
                  +
                </motion.div>
                <motion.div
                  className="absolute top-40 left-24 text-yellow-400 text-xl"
                  animate={{ scale: [1, 1.3, 1], rotate: [0, 180, 360] }}
                  transition={{ duration: 4, repeat: Infinity }}
                >
                  ○
                </motion.div>
                <motion.div
                  className="absolute bottom-40 right-32 text-purple-300 text-xl"
                  animate={{ scale: [1, 1.2, 1], rotate: [0, -180, -360] }}
                  transition={{ duration: 4.5, repeat: Infinity, delay: 1 }}
                >
                  ○
                </motion.div>
                
                {/* Main feedback card with stars */}
                <motion.div
                  className="relative z-10 w-80 h-48 bg-gradient-to-br from-purple-500 to-purple-600 rounded-3xl shadow-2xl"
                  animate={{ y: [0, -10, 0] }}
                  transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-purple-400 to-purple-500 rounded-3xl opacity-50"></div>
                  <div className="relative p-6 flex flex-col justify-center h-full">
                    <div className="flex justify-center gap-2 mb-4">
                      {[...Array(5)].map((_, i) => (
                        <motion.div
                          key={i}
                          initial={{ opacity: 0, scale: 0 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ delay: i * 0.1, duration: 0.5 }}
                        >
                          <span className="text-4xl">⭐</span>
                        </motion.div>
                      ))}
                    </div>
                    <motion.div
                      className="w-full h-3 bg-purple-400 rounded-full mb-2"
                      initial={{ scaleX: 0 }}
                      animate={{ scaleX: 1 }}
                      transition={{ delay: 0.8, duration: 0.8 }}
                    />
                    <motion.div
                      className="w-3/4 h-3 bg-purple-400 rounded-full"
                      initial={{ scaleX: 0 }}
                      animate={{ scaleX: 1 }}
                      transition={{ delay: 1, duration: 0.8 }}
                    />
                  </div>
                </motion.div>
                
                {/* Checkmark Circle - Top Left */}
                <motion.div
                  className="absolute top-32 left-16 w-20 h-20 bg-purple-50 border-4 border-purple-600 rounded-full flex items-center justify-center shadow-lg z-20"
                  animate={{ scale: [1, 1.1, 1], rotate: [0, 5, -5, 0] }}
                  transition={{ duration: 2.5, repeat: Infinity }}
                >
                  <svg className="w-10 h-10 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                  </svg>
                </motion.div>
                
                {/* Chat Bubble - Top Right */}
                <motion.div
                  className="absolute top-12 right-12 bg-gradient-to-br from-purple-500 to-pink-500 text-white p-4 rounded-2xl rounded-tr-none shadow-xl z-20"
                  animate={{ y: [0, -12, 0] }}
                  transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                >
                  <div className="flex flex-col gap-2">
                    <div className="w-10 h-2 bg-purple-300 rounded-full"></div>
                    <div className="w-16 h-2 bg-purple-300 rounded-full"></div>
                    <div className="w-12 h-2 bg-purple-300 rounded-full"></div>
                  </div>
                </motion.div>
                
                {/* Smiley Face - Bottom Right */}
                <motion.div
                  className="absolute bottom-28 right-12 w-24 h-24 bg-white border-4 border-purple-500 rounded-full flex items-center justify-center shadow-2xl z-20"
                  animate={{ scale: [1, 1.1, 1], rotate: [0, 8, -8, 0] }}
                  transition={{ duration: 3, repeat: Infinity, delay: 0.5 }}
                >
                  <div className="flex flex-col items-center">
                    <div className="flex gap-3 mb-2">
                      <div className="w-3 h-3 bg-purple-600 rounded-full"></div>
                      <div className="w-3 h-3 bg-purple-600 rounded-full"></div>
                    </div>
                    <div className="w-10 h-5 border-b-4 border-purple-600 rounded-b-full"></div>
                  </div>
                </motion.div>
                
                {/* Floating Stars */}
                <motion.div
                  className="absolute top-16 left-32"
                  animate={{ rotate: [0, 360], scale: [1, 1.3, 1], y: [0, -10, 0] }}
                  transition={{ duration: 4, repeat: Infinity }}
                >
                  <span className="text-5xl">⭐</span>
                </motion.div>
                <motion.div
                  className="absolute bottom-20 left-24"
                  animate={{ rotate: [0, -360], scale: [1, 1.2, 1], y: [0, 10, 0] }}
                  transition={{ duration: 5, repeat: Infinity, delay: 1 }}
                >
                  <span className="text-4xl">⭐</span>
                </motion.div>
                
                {/* Bottom shadow ellipse */}
                <motion.div
                  className="absolute bottom-8 left-1/2 transform -translate-x-1/2 w-64 h-8 bg-purple-200 rounded-full blur-xl opacity-40"
                  animate={{ scaleX: [1, 1.1, 1] }}
                  transition={{ duration: 4, repeat: Infinity }}
                />
              </div>
            </div>

            {/* Right Side - Content */}
            <div ref={ctaRef} className="flex flex-col justify-center opacity-0 space-y-6 md:space-y-8">
              
              {/* Slide Content */}
              <AnimatePresence mode="wait">
                {currentSlide === 0 && (
                  <motion.div
                    key="slide-0"
                    initial={{ opacity: 0, x: 30 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -30 }}
                    transition={{ duration: 0.8, ease: "easeInOut" }}
                    className="space-y-4"
                  >
                    <motion.div>
                      <span className="text-sm md:text-base font-bold text-blue-600 uppercase tracking-wider">
                        Enquête de Satisfaction 2025
                      </span>
                    </motion.div>
                    
                    <motion.h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold leading-tight">
                      <span className="text-purple-600">SERVICES IT</span>
                      <br />
                      <span className="text-gray-900">FIABLES</span>
                      <motion.div
                        className="h-2 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full mt-2"
                        initial={{ width: 0 }}
                        animate={{ width: "60%" }}
                        transition={{ delay: 0.5, duration: 1 }}
                      />
                    </motion.h1>
                    
                    <motion.p className="text-base md:text-lg text-gray-700 leading-relaxed max-w-md font-medium">
                      La DSI s'engage à vos côtés pour vous apporter des services informatiques fiables, performants et adaptés à vos besoins, tout en assurant la sécurité de vos systèmes et réseaux.
                    </motion.p>
                  </motion.div>
                )}

                {currentSlide === 1 && (
                  <motion.div
                    key="slide-1"
                    initial={{ opacity: 0, x: 30 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -30 }}
                    transition={{ duration: 0.8, ease: "easeInOut" }}
                    className="space-y-4"
                  >
                    <motion.div>
                      <span className="text-sm md:text-base font-bold text-purple-600 uppercase tracking-wider">
                        Pourquoi Participer?
                      </span>
                    </motion.div>
                    
                    <motion.h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold leading-tight">
                      <span className="text-blue-600">AMÉLIORATION</span>
                      <br />
                      <span className="text-gray-900">CONTINUE</span>
                      <motion.div
                        className="h-2 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full mt-2"
                        initial={{ width: 0 }}
                        animate={{ width: "70%" }}
                        transition={{ delay: 0.5, duration: 1 }}
                      />
                    </motion.h1>
                    
                    <motion.p className="text-base md:text-lg text-gray-700 leading-relaxed max-w-md font-medium">
                      Identifiez les points forts à renforcer, aidez-nous à mieux comprendre vos difficultés et garantir que nos services répondent à vos attentes pour 2026.
                    </motion.p>
                  </motion.div>
                )}

                {currentSlide === 2 && (
                  <motion.div
                    key="slide-2"
                    initial={{ opacity: 0, x: 30 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -30 }}
                    transition={{ duration: 0.8, ease: "easeInOut" }}
                    className="space-y-4"
                  >
                    <motion.div>
                      <span className="text-sm md:text-base font-bold text-pink-600 uppercase tracking-wider">
                        Votre Feedback est Essentiel
                      </span>
                    </motion.div>
                    
                    <motion.h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold leading-tight">
                      <span className="text-purple-600">VOS RÉPONSES</span>
                      <br />
                      <span className="text-gray-900">SONT PRÉCIEUSES</span>
                      <motion.div
                        className="h-2 bg-gradient-to-r from-pink-500 to-purple-500 rounded-full mt-2"
                        initial={{ width: 0 }}
                        animate={{ width: "65%" }}
                        transition={{ delay: 0.5, duration: 1 }}
                      />
                    </motion.h1>
                    
                    <motion.p className="text-base md:text-lg text-gray-700 leading-relaxed max-w-md font-medium">
                      Nous vous remercions par avance pour le temps consacré à partager vos impressions. Votre feedback améliore l'exécution de nos projets, du support et notre communication.
                    </motion.p>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Form */}
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-3">
                  <label className="block text-xs font-bold tracking-wider uppercase text-blue-700">
                    Vos informations
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="relative group">
                      <input
                        ref={nomRef}
                        type="text"
                        placeholder="Nom"
                        className="w-full px-4 py-3 rounded-xl bg-gray-50 border-2 border-gray-200 text-gray-900 placeholder-gray-500 focus:border-purple-500 focus:ring-4 focus:ring-purple-500/20 transition-all duration-300 font-inter font-medium"
                      />
                    </div>
                    <div className="relative group">
                      <input
                        ref={prenomRef}
                        type="text"
                        placeholder="Prénom"
                        className="w-full px-4 py-3 rounded-xl bg-gray-50 border-2 border-gray-200 text-gray-900 placeholder-gray-500 focus:border-purple-500 focus:ring-4 focus:ring-purple-500/20 transition-all duration-300 font-inter font-medium"
                      />
                    </div>
                  </div>
                  {showError && (
                    <motion.div
                      ref={errorMessageRef}
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="flex items-center gap-2 px-4 py-3 rounded-xl bg-red-50 border-2 border-red-200 text-red-700 text-sm font-medium"
                    >
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <span>Veuillez remplir tous les champs</span>
                    </motion.div>
                  )}
                </div>

                <button
                  ref={buttonRef}
                  type="submit"
                  className="group relative px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold text-base rounded-full shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105 overflow-hidden"
                >
                  <span className="relative z-10 flex items-center gap-2">
                    {submitted ? '✓ MERCI!' : 'COMMENCER'}
                    {!submitted && (
                      <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                      </svg>
                    )}
                  </span>
                  <div className="absolute inset-0 bg-gradient-to-r from-pink-600 to-purple-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </button>
              </form>

              {/* Pagination dots - Interactive (only dots visible) */}
              <div className="flex items-center justify-center gap-3 mt-4">
                {[0, 1, 2].map((index) => (
                  <button
                    key={index}
                    onClick={() => handleManualSlideChange(index)}
                    className={`transition-all duration-500 rounded-full ${
                      currentSlide === index
                        ? 'w-10 h-3 bg-purple-600'
                        : 'w-3 h-3 bg-gray-300 hover:bg-gray-400 hover:scale-110'
                    }`}
                    aria-label={`Aller à la slide ${index + 1}`}
                  />
                ))}
              </div>
            </div>
          </div>
      </div>
      </div>

      {/* Progress Bar - Fixed at top, persists across questions */}
      {showNextPage && currentQuestion && !isCompleted && (
        <div className="fixed top-0 left-0 right-0 z-50">
          <ProgressBar
            currentQuestionId={currentQuestion.id}
            currentQuestionIndex={currentQuestionIndex}
            totalQuestions={totalQuestions}
            onBack={goToPreviousQuestion}
            showBackButton={true}
          />
        </div>
      )}

      {/* Questions Pages */}
      {showNextPage && currentQuestion && !isCompleted && currentSection && (
        <QuestionPage
          key={`section-${currentSection.id}`}
          ref={nextPageRef}
          questionNumber={currentQuestion.id}
          questionText={currentQuestion.question}
          currentQuestionIndex={currentQuestionIndex}
          avatar={
            <div
              ref={nextPageAvatarRef}
              className="opacity-0"
              style={{ minHeight: '100%' }}
            >
              {memoizedQuestionAvatar}
            </div>
          }
        >
          <div 
            ref={questionContentRef}
            className="opacity-0 w-full"
            data-main-content
            tabIndex={-1}
            aria-label="Contenu principal de la question"
          >
            <QuestionRenderer
              question={currentQuestion}
              onAnswer={goToNextQuestion}
            />
          </div>
        </QuestionPage>
      )}

      {/* Completion Screen with smooth transition */}
      {isCompleted && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
          className="absolute inset-0 z-50"
        >
          <CompletionScreen
            onReturnToStart={() => {
              // Reload the page to fully reset the survey
              window.location.reload();
            }}
          />
        </motion.div>
      )}

      {/* Developer Navigation - Only show when questions are visible */}
      {showNextPage && !isCompleted && (
        <QuestionNavigator
          currentQuestionIndex={currentQuestionIndex}
          onNavigate={goToQuestion}
        />
      )}

      {/* Accessibility Features */}
      <AccessibilityMenu />
      <SkipToContent />
    </div>
  )
}
 