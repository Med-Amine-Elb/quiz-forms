'use client'

import { useEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import Avatar3D from '@/src/components/Avatar3D'

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
  const questionNumberRef = useRef(null)
  const questionTextRef = useRef(null)
  const nextPageAvatarRef = useRef(null)
  const loaderRef = useRef(null)
  const [submitted, setSubmitted] = useState(false)
  const [showError, setShowError] = useState(false)
  const [showNextPage, setShowNextPage] = useState(false)
  const [showLoader, setShowLoader] = useState(false)

  useEffect(() => {
    // Small delay to ensure refs are ready
    const timer = setTimeout(() => {
      const tl = gsap.timeline()

      // Logo and text fade in slowly together
      if (logoRef.current && headingRef.current) {
        tl.fromTo(
          [logoRef.current, headingRef.current],
          { opacity: 0, x: -40 },
          { opacity: 1, x: 0, duration: 1.8, ease: 'power2.out' },
          0
        )
      }
      // Character and form fade in together when input appears
      if (characterRef.current && ctaRef.current) {
        tl.fromTo(
          [characterRef.current, ctaRef.current],
          { opacity: 0, y: 20 },
          { opacity: 1, y: 0, duration: 1.2, ease: 'power2.out' },
          1.8 // after text finishes
        )
      }
    }, 100)

    return () => clearTimeout(timer)
  }, [])

  const handleSubmit = (e: React.FormEvent) => {
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
  }

  const slideToNextPage = () => {
    // Fade out current page smoothly first
    if (currentPageRef.current) {
      // Ensure current page is visible and positioned correctly
      gsap.set(currentPageRef.current, { opacity: 1, x: '0%', zIndex: 2 })
      
      // Create a smooth fade out timeline
      const fadeOutTimeline = gsap.timeline({
        onComplete: () => {
          // Move page off screen after fade completes
          gsap.set(currentPageRef.current, { x: '100%', zIndex: 1 })
          
          // Show loader
          setShowLoader(true)
          
          // Small delay to show loader
          setTimeout(() => {
            if (loaderRef.current) {
              gsap.fromTo(
                loaderRef.current,
                { opacity: 0 },
                { opacity: 1, duration: 0.6, ease: 'power2.out' }
              )
            }
            
            // After loader appears, show next page and start loading
            setTimeout(() => {
              setShowNextPage(true)
              
              // Small delay to ensure DOM is ready
              setTimeout(() => {
                if (nextPageRef.current && currentPageRef.current) {
                  // Set z-index: next page behind, current page on top
                  gsap.set(nextPageRef.current, { zIndex: 1, x: '0%', opacity: 0 })
                  
                  // Set initial states for question elements
                  if (questionNumberRef.current) {
                    gsap.set(questionNumberRef.current, { opacity: 0.6, y: 0 })
                  }
                  if (questionTextRef.current) {
                    gsap.set(questionTextRef.current, { opacity: 0, y: 20 })
                  }
                  if (nextPageAvatarRef.current) {
                    gsap.set(nextPageAvatarRef.current, { opacity: 0 })
                  }
                  
                  // Fade out loader
                  if (loaderRef.current) {
                    gsap.to(loaderRef.current, {
                      opacity: 0,
                      duration: 0.4,
                      ease: 'power2.in',
                      onComplete: () => {
                        setShowLoader(false)
                      }
                    })
                  }
                  
                  // Bring next page to front
                  gsap.set(nextPageRef.current, { zIndex: 2 })
                  
                  // Create animation timeline
                  const nextPageTimeline = gsap.timeline()
                  
                  // Fade in next page background
                  nextPageTimeline
                    .to(nextPageRef.current, {
                      opacity: 1,
                      duration: 0.6,
                      ease: 'power2.out',
                    })
                    // Fade in question number
                    .to(questionNumberRef.current, {
                      opacity: 0.6,
                      duration: 0.5,
                      ease: 'power2.out',
                    }, '-=0.3')
                    // Fade out question number and fade in question text
                    .to(questionNumberRef.current, {
                      opacity: 0,
                      y: -20,
                      duration: 1,
                      ease: 'power2.out',
                    }, '+=0.3')
                    .to(questionTextRef.current, {
                      opacity: 1,
                      y: 0,
                      duration: 1,
                      ease: 'power2.out',
                    }, '-=0.5')
                    // Fade in character after text
                    .to(nextPageAvatarRef.current, {
                      opacity: 1,
                      duration: 1,
                      ease: 'power2.out',
                    }, '-=0.3')
                }
              }, 100)
            }, 800) // Show loader for 800ms
          }, 100)
        }
      })
      
      // Add smooth fade out animation to timeline
      fadeOutTimeline.to(currentPageRef.current, {
        opacity: 0,
        duration: 0.8,
        ease: 'power3.out',
      })
    }
  }

  const handlePushComplete = () => {
    // Slide current page out to the right
    if (currentPageRef.current) {
      gsap.to(currentPageRef.current, {
        x: '100%',
        duration: 1,
        ease: 'power2.inOut',
        onComplete: () => {
          setShowNextPage(true)
          // Animate next page sliding in from left
          if (nextPageRef.current) {
            gsap.fromTo(
              nextPageRef.current,
              { x: '-100%' },
              {
                x: '0%',
                duration: 1,
                ease: 'power2.inOut',
              }
            )
          }
        }
      })
    }
  }

  return (
    <div className="w-full h-screen overflow-hidden relative">
      {/* Loader */}
      {showLoader && (
        <div
          ref={loaderRef}
          className="absolute inset-0 z-50 flex items-center justify-center"
          style={{
            background: '#ffffff',
            backgroundImage:
              'linear-gradient(216deg,rgba(255, 255, 255, 1) 16%, rgba(207, 246, 255, 1) 82%, rgba(143, 244, 255, 1) 100%)',
          }}
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
        className="absolute inset-0 w-full h-full flex"
        style={{
          background: '#ffffff',
          backgroundImage:
            'linear-gradient(216deg,rgba(255, 255, 255, 1) 16%, rgba(207, 246, 255, 1) 82%, rgba(143, 244, 255, 1) 100%)',
          zIndex: 2,
          willChange: 'transform',
        }}
      >
      {/* Logo - Top Left */}
      <div ref={logoRef} className="absolute top-6 left-6 z-10 opacity-0">
        <img
          src="/societe-des-boissons-du-maroc--600-removebg-preview.png"
          alt="SBM Logo"
          className="h-16 w-auto object-contain"
        />
      </div>

      {/* Left Side - 3D Character Area */}
      <div
        ref={characterRef}
        className="hidden lg:flex lg:w-8/12 h-full items-stretch opacity-0"
      >
        {/* @ts-ignore */}
        <Avatar3D
          ref={avatarRef}
          className="w-full h-full max-w-none"
          autoRotate={false}
          modelPath="/animation/691dbc778e7eb12743aabf09.glb"
          onPushComplete={handlePushComplete}
          enablePush={true}
          cameraPosition={[-1.1, 1, 2.3]}
          modelPosition={[0, -2, 0]}
          modelScale={1.9}
        />
      </div>

      {/* Right Side - Content */}
      <div className="w-full lg:w-5/12 flex flex-col justify-center px-6 sm:px-8 lg:px-16 xl:px-20 py-10 text-black lg:items-start">
        <div className="max-w-xl w-full mx-auto lg:mx-0 lg:text-left">
          {/* Hero copy */}
          <div ref={headingRef} className="opacity-0 space-y-5">
            <span className="inline-flex items-center gap-2 text-xs tracking-[0.3em] uppercase text-gray-600">
              SBM 2024 Survey
            </span>
            <h1
              className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight font-inter text-left"
              style={{
                textShadow: '0 0 20px rgba(143, 244, 255, 0.8)',
                color: '#0b1220',
              }}
            >
              Votre avis illumine 2025.
            </h1>
            <p className="text-base sm:text-lg text-gray-700 font-inter max-w-lg">
              Dites-nous ce qui fonctionne et ce qu’il faut transformer. Une poignée de réponses suffit
              pour dessiner des services numériques plus fluides pour toute l’équipe SBM.
            </p>
          </div>

          {/* CTA */}
          <form
            ref={ctaRef}
            onSubmit={handleSubmit}
            className="opacity-0 mt-10 w-full max-w-xl space-y-4"
          >
            <div className="space-y-4">
              <label className="block text-xs font-semibold tracking-[0.3em] uppercase text-gray-600">
                Nom et Prénom
              </label>
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex-1 relative group">
                  <input
                    ref={nomRef}
                    type="text"
                    placeholder="Nom"
                    className="w-full px-5 py-4 rounded-2xl bg-white/80 border border-black/10 text-gray-900 placeholder-gray-500 focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/40 transition-all duration-300 font-inter"
                    style={{ borderColor: 'rgba(0, 0, 0, 0.1)' }}
                  />
                  <div className="absolute inset-0 rounded-2xl pointer-events-none group-focus-within:shadow-[0_0_25px_rgba(7,182,217,0.45)] transition-shadow" />
                </div>
                <div className="flex-1 relative group">
                  <input
                    ref={prenomRef}
                    type="text"
                    placeholder="Prénom"
                    className="w-full px-5 py-4 rounded-2xl bg-white/80 border border-black/10 text-gray-900 placeholder-gray-500 focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/40 transition-all duration-300 font-inter"
                    style={{ borderColor: 'rgba(0, 0, 0, 0.1)' }}
                  />
                  <div className="absolute inset-0 rounded-2xl pointer-events-none group-focus-within:shadow-[0_0_25px_rgba(7,182,217,0.45)] transition-shadow" />
                </div>
              </div>
              {showError && (
                <div
                  ref={errorMessageRef}
                  className="flex items-center gap-2 px-4 py-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-sm font-inter"
                >
                  <svg
                    className="w-5 h-5 flex-shrink-0"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  <span>Veuillez remplir tous les champs pour continuer.</span>
                </div>
              )}
            </div>
            <button
              ref={buttonRef}
              type="submit"
              className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-linear-to-r from-cyan-400 to-cyan-500 text-gray-900 font-bold text-base shadow-lg shadow-cyan-500/30 hover:shadow-cyan-400/50 transition-transform hover:scale-105 flex items-center justify-center"
            >
              {submitted ? '✓ Merci !' : 'Je participe'}
            </button>
            <span className="text-gray-600 text-sm font-inter">
              Lancement officiel le 4 décembre 2024. Votre avatar 3D vous guidera pas à pas.
            </span>
          </form>
        </div>
      </div>
      </div>

      {/* Next Page */}
      {showNextPage && (
        <div
          ref={nextPageRef}
          className="absolute inset-0 w-full h-full flex"
          style={{
            background: '#ffffff',
            backgroundImage:
              'linear-gradient(216deg,rgba(255, 255, 255, 1) 16%, rgba(207, 246, 255, 1) 82%, rgba(143, 244, 255, 1) 100%)',
            zIndex: 1,
            willChange: 'transform',
          }}
        >
          {/* Logo - Top Left */}
          <div className="absolute top-6 left-6 z-10">
            <img
              src="/societe-des-boissons-du-maroc--600-removebg-preview.png"
              alt="SBM Logo"
              className="h-16 w-auto object-contain"
            />
          </div>

          {/* Next Page Content */}
          <div className="w-full h-full flex flex-col items-center justify-center px-6 py-8">
            {/* Question Number - Top, will fade out */}
            <div 
              ref={questionNumberRef}
              className="text-center mb-6"
            >
              <span className="text-6xl sm:text-7xl lg:text-8xl font-bold text-gray-300">
                1
              </span>
            </div>

            {/* Question Text - Below number */}
            <div 
              ref={questionTextRef}
              className="text-center mb-8 sm:mb-14 opacity-0"
            >
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 font-inter">
                A quelle direction êtes-vous rattaché(e) ?
              </h2>
            </div>

            {/* 3D Character - Middle of page, properly centered */}
            <div className="w-full flex-1 flex items-center justify-center">
              <div ref={nextPageAvatarRef} className="w-auto h-auto max-w-xs">
                {/* @ts-ignore */}
                <Avatar3D
                  className="w-full h-full max-w-none"
                  autoRotate={false}
                  modelPath="/animation/691dbc778e7eb12743aabf09.glb"
                  enableWaving={true}
                  cameraPosition={[0, 0.5, 4.5]}
                  cameraLookAt={[0, 0.3, 0]}
                  cameraFOV={47.5}
                  modelPosition={[0, -1.5, 0]}
                  modelScale={1.5}
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
