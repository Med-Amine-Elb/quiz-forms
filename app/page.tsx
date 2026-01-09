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
import SubmissionConfirmationModal from '@/components/questions/SubmissionConfirmationModal'
import { useToast, toastSuccess, toastError, toastInfo } from '@/hooks/useToast'
import { questions } from '@/data/questions'
import { preloadQuestionType } from '@/lib/preloadQuestionComponents'
import { getSectionForQuestion } from '@/lib/questionSections'

// Lazy load heavy components
// const Avatar3D = dynamic(
//   () => import('@/src/components/Avatar3D'),
//   { 
//     ssr: false, 
//     loading: () => (
//       <div className="flex items-center justify-center w-full h-full">
//         <div className="animate-pulse text-white/20">Loading avatar...</div>
//       </div>
//     )
//   }
// )

// Lottie Character - Much lighter than 3D Avatar!
const LottieCharacter = dynamic(
  () => import('@/components/animations/LottieCharacter'),
  { 
    ssr: false, 
    loading: () => (
      <div className="flex items-center justify-center w-full h-full">
        <div className="w-12 h-12 border-3 border-white/20 border-t-white/60 rounded-full animate-spin" />
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
  const emailRef = useRef<HTMLInputElement>(null)
  const codeRef = useRef<HTMLInputElement>(null)
  const buttonRef = useRef<HTMLButtonElement>(null)
  const errorMessageRef = useRef<HTMLDivElement>(null)
  // const avatarRef = useRef(null)
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
  
  // Email verification state
  const [emailVerified, setEmailVerified] = useState(() => {
    if (typeof window !== 'undefined') {
      const savedEmail = localStorage.getItem('survey_email');
      const verifiedEmail = localStorage.getItem('survey_verified_email');
      // Only restore verified state if emails match
      return localStorage.getItem('survey_email_verified') === 'true' && 
             savedEmail === verifiedEmail;
    }
    return false;
  })
  const [codeSent, setCodeSent] = useState(false)
  const [isRequestingCode, setIsRequestingCode] = useState(false)
  const [isVerifyingCode, setIsVerifyingCode] = useState(false)
  const [emailError, setEmailError] = useState('')
  const [codeError, setCodeError] = useState('')
  const [codeSuccess, setCodeSuccess] = useState('')
  const [showResendCode, setShowResendCode] = useState(false)
  const [showConfirmationModal, setShowConfirmationModal] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Load saved form data on mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      // Don't restore if already submitted
      const isSubmitted = localStorage.getItem('survey_submitted') === 'true';
      if (isSubmitted) {
        return;
      }

      const savedEmail = localStorage.getItem('survey_email');
      const savedNom = localStorage.getItem('survey_nom');
      const savedPrenom = localStorage.getItem('survey_prenom');
      
      if (savedEmail && emailRef.current) {
        emailRef.current.value = savedEmail;
      }
      if (savedNom && nomRef.current) {
        nomRef.current.value = savedNom;
      }
      if (savedPrenom && prenomRef.current) {
        prenomRef.current.value = savedPrenom;
      }
    }
  }, []);

  // Save form data to localStorage when it changes
  useEffect(() => {
    if (typeof window !== 'undefined') {
      if (emailRef.current?.value) {
        localStorage.setItem('survey_email', emailRef.current.value);
      }
      if (nomRef.current?.value) {
        localStorage.setItem('survey_nom', nomRef.current.value);
      }
      if (prenomRef.current?.value) {
        localStorage.setItem('survey_prenom', prenomRef.current.value);
      }
      localStorage.setItem('survey_email_verified', emailVerified.toString());
    }
  }, [emailVerified]);

  // Save form data on input change (debounced)
  useEffect(() => {
    const handleInputChange = () => {
      if (typeof window !== 'undefined') {
        if (emailRef.current?.value) {
          localStorage.setItem('survey_email', emailRef.current.value);
        }
        if (nomRef.current?.value) {
          localStorage.setItem('survey_nom', nomRef.current.value);
        }
        if (prenomRef.current?.value) {
          localStorage.setItem('survey_prenom', prenomRef.current.value);
        }
      }
    };

    const emailInput = emailRef.current;
    const nomInput = nomRef.current;
    const prenomInput = prenomRef.current;

    if (emailInput) {
      emailInput.addEventListener('input', handleInputChange);
    }
    if (nomInput) {
      nomInput.addEventListener('input', handleInputChange);
    }
    if (prenomInput) {
      prenomInput.addEventListener('input', handleInputChange);
    }

    return () => {
      if (emailInput) {
        emailInput.removeEventListener('input', handleInputChange);
      }
      if (nomInput) {
        nomInput.removeEventListener('input', handleInputChange);
      }
      if (prenomInput) {
        prenomInput.removeEventListener('input', handleInputChange);
      }
    };
  }, []);
  
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
  
  // Submit answers function - reusable
  const submitAnswers = useCallback(async () => {
    setIsSubmitting(true);
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

      // Get browser fingerprint for duplicate prevention
      const { getOrCreateFingerprint } = await import('@/lib/browserFingerprint');
      const fingerprint = getOrCreateFingerprint();

      toastInfo('Envoi en cours...', 'Votre formulaire est en cours de soumission.');

      const response = await fetch('/api/submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-browser-fingerprint': fingerprint,
        },
        body: JSON.stringify({
          nom: nomRef.current?.value.trim() || '',
          prenom: prenomRef.current?.value.trim() || '',
          email: emailRef.current?.value.trim() || '',
          answers: enrichedAnswers,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        if (process.env.NODE_ENV !== 'production') {
          console.error('Failed to submit answers:', error);
        }
        
        // Handle duplicate submission error
        if (response.status === 409 && error.code === 'DUPLICATE_SUBMISSION') {
          const errorMsg = 'Vous avez déjà soumis ce formulaire. Merci de votre participation!';
          toastError('Déjà soumis', errorMsg);
          hasSubmittedRef.current = true; // Prevent retry
        } else {
          const errorMsg = error.error || 'Erreur lors de la soumission. Veuillez réessayer.';
          toastError('Erreur de soumission', errorMsg);
        }
        setIsSubmitting(false);
        return;
      }

      const result = await response.json();
      if (process.env.NODE_ENV !== 'production') {
        console.log('Answers submitted successfully:', result);
      }
      
      toastSuccess('Formulaire soumis!', 'Merci pour votre participation. Vos réponses ont été enregistrées avec succès.');
      
      // Store submission in localStorage as backup
      if (typeof window !== 'undefined') {
        localStorage.setItem('survey_submitted', 'true');
        localStorage.setItem('survey_submitted_at', Date.now().toString());
        
        // Clear survey progress after successful submission
        localStorage.removeItem('survey_answers');
        localStorage.removeItem('survey_current_index');
        localStorage.removeItem('survey_completed');
        localStorage.removeItem('survey_email');
        localStorage.removeItem('survey_nom');
        localStorage.removeItem('survey_prenom');
        localStorage.removeItem('survey_email_verified');
      }
      
      setIsSubmitting(false);
      setSubmitted(true);
      setShowConfirmationModal(false);
    } catch (error) {
      if (process.env.NODE_ENV !== 'production') {
        console.error('Error submitting answers:', error);
      }
      toastError('Erreur', 'Une erreur est survenue lors de la soumission. Veuillez réessayer.');
      setIsSubmitting(false);
    }
  }, [answers]);

  // Submit answers to Power Automate when form is completed
  useEffect(() => {
    if (isCompleted && answers.length > 0 && nomRef.current?.value && prenomRef.current?.value && !hasSubmittedRef.current) {
      hasSubmittedRef.current = true; // Mark as submitted immediately
      
      // Show confirmation modal instead of submitting directly
      setShowConfirmationModal(true);
    }
  }, [isCompleted, answers]);

  // Handle confirmation from modal
  const handleConfirmSubmission = useCallback(async () => {
    await submitAnswers();
  }, [submitAnswers]);
  
  const questionContentRef = useRef<HTMLDivElement>(null)
  const lastSectionRef = useRef<string | null>(null)
  // Track last answer emoji for Lottie reactions
  const [lastAnswerEmoji, setLastAnswerEmoji] = useState<string | undefined>(undefined);
  const [isAvatarHovering, setIsAvatarHovering] = useState(false);
  
  // Use Lottie or 3D Avatar - Set to true for Lottie, false for 3D
  // const USE_LOTTIE_AVATAR = true;

  // const memoizedQuestionAvatar = useMemo(
  //   () => (
  //     <Avatar3D
  //       className="w-full h-full max-w-none"
  //       autoRotate={false}
  //       modelPath="/animation/691dbc778e7eb12743aabf09.glb"
  //       enableWaving={true}
  //       cameraPosition={[0, 0.5, 4.5]}
  //       cameraLookAt={[0, 0.3, 0]}
  //       cameraFOV={30.5}
  //       modelPosition={[0.1, -1.5, 1.2]}
  //       modelScale={1.2}
  //     />
  //   ),
  //   []
  // )

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
          // if (nextPageAvatarRef.current) {
          //   gsap.set(nextPageAvatarRef.current, { opacity: 0 })
          // }
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
              // if (nextPageAvatarRef.current) {
              //   gsap.to(nextPageAvatarRef.current, {
              //     opacity: 1,
              //     duration: 0.4,
              //     ease: 'power2.out',
              //     delay: 0.1,
              //   })
              // }
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
    // Check email verification before proceeding
    if (!emailVerified) {
      setEmailError('Veuillez vérifier votre email avant de continuer')
      return
    }
    
    // Verify that the verified email matches the current email
    const currentEmail = emailRef.current?.value.trim().toLowerCase();
    const verifiedEmail = typeof window !== 'undefined' 
      ? localStorage.getItem('survey_verified_email')?.toLowerCase()
      : null;
    
    if (currentEmail !== verifiedEmail) {
      setEmailError('L\'email vérifié ne correspond pas à l\'email saisi. Veuillez vérifier à nouveau.')
      setEmailVerified(false)
      if (typeof window !== 'undefined') {
        localStorage.removeItem('survey_verified_email')
        localStorage.setItem('survey_email_verified', 'false')
      }
      return
    }
    
    setShowError(false)
    setSubmitted(true)
    
    // Trigger slide animation immediately when form is valid
    slideToNextPage()
  }, [slideToNextPage, emailVerified])

  // Request verification code
  const handleRequestCode = useCallback(async () => {
    const email = emailRef.current?.value.trim()
    
    if (!email) {
      setEmailError('Veuillez entrer votre email')
      return
    }
    
    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      setEmailError('Format d\'email invalide')
      return
    }
    
    setIsRequestingCode(true)
    setEmailError('')
    setCodeError('')
    setShowResendCode(false)
    
    try {
      // Add timeout to prevent hanging
      // Increased to 20s to handle Next.js dev mode compilation (first request)
      // In production, routes are pre-compiled so this won't be needed
      const controller = new AbortController()
      const timeoutId = setTimeout(() => controller.abort(), 20000) // 20 second timeout
      
      const response = await fetch('/api/auth/request-code', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
        signal: controller.signal,
      })
      
      clearTimeout(timeoutId)
      const data = await response.json()
      
      if (!response.ok) {
        const errorMsg = data.error || 'Erreur lors de l\'envoi du code'
        setEmailError(errorMsg)
        toastError('Erreur', errorMsg)
        return
      }
      
      setCodeSent(true)
      setCodeSuccess('Code envoyé! Vérifiez votre boîte email.')
      setShowResendCode(false)
      // Clear the code input field
      if (codeRef.current) {
        codeRef.current.value = ''
      }
      toastSuccess('Code envoyé!', 'Vérifiez votre boîte email pour recevoir le code de vérification.')
      // Clear success message after 3 seconds
      setTimeout(() => setCodeSuccess(''), 3000)
    } catch (error: any) {
      if (error.name === 'AbortError') {
        const errorMsg = 'La requête a pris trop de temps. Veuillez réessayer.'
        setEmailError(errorMsg)
        toastError('Timeout', errorMsg)
      } else {
        if (process.env.NODE_ENV !== 'production') {
          console.error('Error requesting code:', error);
        }
        const errorMsg = 'Erreur de connexion. Veuillez réessayer.'
        setEmailError(errorMsg)
        toastError('Erreur de connexion', errorMsg)
      }
    } finally {
      setIsRequestingCode(false)
    }
  }, [])

  // Verify code
  const handleVerifyCode = useCallback(async () => {
    const email = emailRef.current?.value.trim()
    const code = codeRef.current?.value.trim()
    
    // Debug logging (only in development)
    if (process.env.NODE_ENV !== 'production') {
      console.log('[Frontend] Verifying code for email:', email);
      console.log('[Frontend] Code:', code);
      console.log('[Frontend] Code length:', code?.length);
    }
    
    if (!email || !code) {
      setCodeError('Veuillez entrer le code reçu')
      return
    }
    
    if (code.length !== 6) {
      setCodeError('Le code doit contenir 6 chiffres')
      return
    }
    
    setIsVerifyingCode(true)
    setCodeError('')
    setShowResendCode(false)
    
    try {
      // Add timeout to prevent hanging
      // Increased to 20s to handle Next.js dev mode compilation (first request)
      // In production, routes are pre-compiled so this won't be needed
      const controller = new AbortController()
      const timeoutId = setTimeout(() => controller.abort(), 20000) // 20 second timeout
      
      const requestBody = { email, code }
      console.log('[Frontend] Request body:', requestBody);
      console.log('[Frontend] JSON stringified:', JSON.stringify(requestBody));
      
      const response = await fetch('/api/auth/verify-code', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(requestBody),
        signal: controller.signal,
      })
      
      clearTimeout(timeoutId)
      const data = await response.json()
      
      if (!response.ok) {
        let errorMsg = '';
        let shouldShowResend = false;
        
        if (response.status === 429) {
          errorMsg = 'Trop de tentatives. Veuillez demander un nouveau code.'
          toastError('Trop de tentatives', errorMsg)
          shouldShowResend = true;
        } else if (response.status === 410) {
          errorMsg = 'Code expiré. Veuillez demander un nouveau code.'
          toastError('Code expiré', errorMsg)
          shouldShowResend = true;
        } else if (response.status === 404 && data.reason === 'not_found') {
          errorMsg = 'Code non trouvé. Veuillez demander un nouveau code.'
          toastError('Code non trouvé', errorMsg)
          shouldShowResend = true;
        } else {
          errorMsg = data.error || 'Code invalide'
          toastError('Code invalide', errorMsg)
          // Show resend button if it's an invalid code with no attempts left
          if (data.reason === 'invalid' && (!data.attemptsLeft || data.attemptsLeft === 0)) {
            shouldShowResend = true;
          }
        }
        
        setCodeError(errorMsg)
        setShowResendCode(shouldShowResend)
        return
      }
      
      if (data.verified) {
        setEmailVerified(true)
        setCodeSuccess('Email vérifié avec succès!')
        toastSuccess('Email vérifié!', 'Vous pouvez maintenant continuer avec le formulaire.')
        
        // Save verified email to localStorage
        if (typeof window !== 'undefined' && data.email) {
          localStorage.setItem('survey_verified_email', data.email)
        }
        
        setTimeout(() => setCodeSuccess(''), 3000)
      }
    } catch (error: any) {
      if (error.name === 'AbortError') {
        const errorMsg = 'La requête a pris trop de temps. Veuillez réessayer.'
        setCodeError(errorMsg)
        toastError('Timeout', errorMsg)
      } else {
        if (process.env.NODE_ENV !== 'production') {
          console.error('Error verifying code:', error);
        }
        const errorMsg = 'Erreur de connexion. Veuillez réessayer.'
        setCodeError(errorMsg)
        toastError('Erreur de connexion', errorMsg)
      }
    } finally {
      setIsVerifyingCode(false)
    }
  }, [])

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
          backgroundImage: currentBackground,
          backgroundSize: '400% 400%',
          backgroundRepeat: 'no-repeat',
          backgroundPosition: '0% 50%',
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
                  
                  {/* Email Verification Section */}
                  <div className="space-y-3 pt-2">
                    <label className="block text-xs font-bold tracking-wider uppercase text-blue-700">
                      Vérification Email
                    </label>
                    <div className="relative group">
                      <input
                        ref={emailRef}
                        type="email"
                        placeholder="votre.email@castel-afrique.com"
                        disabled={emailVerified || codeSent}
                        className={`w-full px-4 py-3 rounded-xl bg-gray-50 border-2 ${
                          emailVerified 
                            ? 'border-green-500 bg-green-50' 
                            : emailError 
                            ? 'border-red-500 bg-red-50' 
                            : 'border-gray-200'
                        } text-gray-900 placeholder-gray-500 focus:border-purple-500 focus:ring-4 focus:ring-purple-500/20 transition-all duration-300 font-inter font-medium disabled:opacity-60 disabled:cursor-not-allowed`}
                      />
                      {emailVerified && (
                        <div className="absolute right-3 top-1/2 -translate-y-1/2">
                          <svg className="w-6 h-6 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                        </div>
                      )}
                    </div>
                    
                    {emailError && (
                      <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="flex items-center gap-2 px-4 py-2 rounded-xl bg-red-50 border-2 border-red-200 text-red-700 text-sm font-medium"
                      >
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <span>{emailError}</span>
                      </motion.div>
                    )}
                    
                    {!emailVerified && !codeSent && (
                      <button
                        type="button"
                        onClick={handleRequestCode}
                        disabled={isRequestingCode}
                        className="w-full px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                      >
                        {isRequestingCode ? (
                          <>
                            <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                            <span>Envoi en cours...</span>
                          </>
                        ) : (
                          <>
                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                            </svg>
                            <span>Envoyer le code de vérification</span>
                          </>
                        )}
                      </button>
                    )}
                    
                    {codeSent && !emailVerified && (
                      <div className="space-y-2">
                        <div className="relative group">
                          <input
                            ref={codeRef}
                            type="text"
                            inputMode="numeric"
                            maxLength={6}
                            placeholder="Code à 6 chiffres"
                            className="w-full px-4 py-3 rounded-xl bg-gray-50 border-2 border-gray-200 text-gray-900 placeholder-gray-500 focus:border-purple-500 focus:ring-4 focus:ring-purple-500/20 transition-all duration-300 font-inter font-medium text-center text-2xl tracking-widest"
                            onChange={(e) => {
                              // Only allow numbers
                              const value = e.target.value.replace(/\D/g, '')
                              e.target.value = value
                            }}
                          />
                        </div>
                        
                        {codeSuccess && (
                          <motion.div
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-green-50 border-2 border-green-200 text-green-700 text-sm font-medium"
                          >
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                            <span>{codeSuccess}</span>
                          </motion.div>
                        )}
                        
                        {codeError && (
                          <motion.div
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="space-y-2"
                          >
                            <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-red-50 border-2 border-red-200 text-red-700 text-sm font-medium">
                              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                              </svg>
                              <span>{codeError}</span>
                            </div>
                            
                            {showResendCode && (
                              <motion.button
                                initial={{ opacity: 0, y: -5 }}
                                animate={{ opacity: 1, y: 0 }}
                                type="button"
                                onClick={handleRequestCode}
                                disabled={isRequestingCode}
                                className="w-full px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                              >
                                {isRequestingCode ? (
                                  <>
                                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                    <span>Envoi en cours...</span>
                                  </>
                                ) : (
                                  <>
                                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                                    </svg>
                                    <span>Renvoyer un nouveau code</span>
                                  </>
                                )}
                              </motion.button>
                            )}
                          </motion.div>
                        )}
                        
                        <div className="flex gap-2">
                          <button
                            type="button"
                            onClick={handleVerifyCode}
                            disabled={isVerifyingCode}
                            className="flex-1 px-4 py-2.5 bg-purple-600 hover:bg-purple-700 text-white font-semibold rounded-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                          >
                            {isVerifyingCode ? (
                              <>
                                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                <span>Vérification...</span>
                              </>
                            ) : (
                              <>
                                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                <span>Vérifier le code</span>
                              </>
                            )}
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              setCodeSent(false)
                              setCodeError('')
                              setCodeSuccess('')
                              if (codeRef.current) codeRef.current.value = ''
                            }}
                            className="px-4 py-2.5 bg-gray-200 hover:bg-gray-300 text-gray-700 font-semibold rounded-xl transition-all duration-300"
                          >
                            Annuler
                          </button>
                        </div>
                      </div>
                    )}
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
                      <span>Veuillez remplir tous les champs et vérifier votre email</span>
                    </motion.div>
                  )}
                </div>

                <button
                  ref={buttonRef}
                  type="submit"
                  disabled={!emailVerified}
                  className={`group relative px-8 py-4 ${
                    emailVerified 
                      ? 'bg-gradient-to-r from-purple-600 to-pink-600 hover:shadow-2xl hover:scale-105' 
                      : 'bg-gray-400 cursor-not-allowed'
                  } text-white font-bold text-base rounded-full shadow-xl transition-all duration-300 overflow-hidden`}
                >
                  <span className="relative z-10 flex items-center gap-2">
                    {submitted ? '✓ MERCI!' : emailVerified ? 'COMMENCER' : 'Vérifiez votre email d\'abord'}
                    {!submitted && emailVerified && (
                      <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                      </svg>
                    )}
                  </span>
                  {emailVerified && (
                    <div className="absolute inset-0 bg-gradient-to-r from-pink-600 to-purple-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  )}
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
              className="opacity-0 w-full h-full flex items-center justify-center"
              onMouseEnter={() => setIsAvatarHovering(true)}
              onMouseLeave={() => setIsAvatarHovering(false)}
            >
              <LottieCharacter
                sectionId={currentSection.id}
                questionId={currentQuestion.id}
                totalQuestions={totalQuestions}
                className="w-[1200px] h-[450px]"
                isHovering={isAvatarHovering}
                lastAnswerEmoji={lastAnswerEmoji}
              />
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
              onAnswer={(answer) => {
                // Capture emoji for Lottie reaction with smooth delay
                if (currentQuestion.choices) {
                  const selectedChoice = currentQuestion.choices.find(c => c.id === answer);
                  if (selectedChoice?.emoji) {
                    // Small delay before showing reaction (200ms for natural feel)
                    setTimeout(() => {
                      setLastAnswerEmoji(selectedChoice.emoji);
                      // Clear emoji after animation completes (2.5s + 200ms delay)
                      setTimeout(() => setLastAnswerEmoji(undefined), 2700);
                    }, 200);
                  }
                }
                goToNextQuestion(answer);
              }}
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

      {/* Submission Confirmation Modal */}
      <SubmissionConfirmationModal
        isOpen={showConfirmationModal}
        onClose={() => {
          if (!isSubmitting) {
            setShowConfirmationModal(false);
          }
        }}
        onConfirm={handleConfirmSubmission}
        answers={answers}
        nom={nomRef.current?.value.trim() || ''}
        prenom={prenomRef.current?.value.trim() || ''}
        email={emailRef.current?.value.trim() || ''}
        isSubmitting={isSubmitting}
      />

      {/* Accessibility Features */}
      <AccessibilityMenu />
      <SkipToContent />
    </div>
  )
}
 