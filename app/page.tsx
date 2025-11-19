'use client'

import { useEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import Avatar3D from '@/src/components/Avatar3D'

export default function SurveyLanding() {
  const containerRef = useRef(null)
  const characterRef = useRef(null)
  const headingRef = useRef(null)
  const ctaRef = useRef(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const buttonRef = useRef<HTMLButtonElement>(null)
  const [submitted, setSubmitted] = useState(false)

  useEffect(() => {
    const tl = gsap.timeline()

    // Character area fade in
    tl.fromTo(
      characterRef.current,
      { opacity: 0, x: -40 },
      { opacity: 1, x: 0, duration: 0.9, ease: 'power3.out' },
      0
    )

    // Heading group
    tl.fromTo(
      headingRef.current,
      { opacity: 0, y: 30 },
      { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out' },
      0.15
    )

    // CTA
    tl.fromTo(
      ctaRef.current,
      { opacity: 0, y: 20 },
      { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out' },
      0.35
    )
  }, [])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!inputRef.current?.value.trim()) return
    gsap.to(buttonRef.current, {
      scale: 0.95,
      duration: 0.15,
      yoyo: true,
      repeat: 1,
    })
    setSubmitted(true)
    setTimeout(() => setSubmitted(false), 2200)
  }

  return (
    <div
      ref={containerRef}
      className="w-full h-screen overflow-hidden flex"
      style={{
        background: '#ffffff',
        backgroundImage:
          'linear-gradient(216deg,rgba(255, 255, 255, 1) 16%, rgba(207, 246, 255, 1) 82%, rgba(143, 244, 255, 1) 100%)',
      }}
    >
      {/* Left Side - 3D Character Area */}
      <div
        ref={characterRef}
        className="hidden lg:flex lg:w-8/12 h-full items-center justify-center px-6 py-8 opacity-0"
      >
        <Avatar3D
          className="w-full h-full max-w-none"
          autoRotate={false}
          modelPath="/animation/691dbc778e7eb12743aabf09 (1).glb"
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
            <label className="block text-xs font-semibold tracking-[0.3em] uppercase text-gray-600">
              Nom complet
            </label>
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1 relative group">
                <input
                  ref={inputRef}
                  type="text"
                  placeholder="Entrez votre nom pour rejoindre l’expérience"
                  className="w-full px-5 py-4 rounded-2xl bg-white/80 border border-black/10 text-gray-900 placeholder-gray-500 focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/40 transition-all duration-300 font-inter"
                  required
                />
                <div className="absolute inset-0 rounded-2xl pointer-events-none group-focus-within:shadow-[0_0_25px_rgba(7,182,217,0.45)] transition-shadow" />
              </div>
              <button
                ref={buttonRef}
                type="submit"
                className="px-8 py-4 rounded-2xl bg-linear-to-r from-cyan-400 to-cyan-500 text-gray-900 font-bold text-base shadow-lg shadow-cyan-500/30 hover:shadow-cyan-400/50 transition-transform hover:scale-105 flex items-center justify-center"
              >
                {submitted ? '✓ Merci !' : 'Je participe'}
              </button>
            </div>
            <span className="text-gray-600 text-sm font-inter">
              Lancement officiel le 4 décembre 2024. Votre avatar 3D vous guidera pas à pas.
            </span>
          </form>
        </div>
      </div>
    </div>
  )
}
