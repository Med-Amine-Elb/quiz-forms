"use client"

import { useMemo } from 'react'
import { motion } from 'framer-motion'
import { getSectionForQuestion } from '@/lib/questionSections'

interface EnhancedQuestionBackgroundProps {
  questionNumber: number
  showNextPage?: boolean
  prefersReducedMotion?: boolean
}

/**
 * Enhanced Background Component for Questions
 * 
 * Features:
 * - Animated gradient base
 * - Glassmorphism effects (blurred shapes)
 * - Floating particles
 * - Improved dot pattern
 * - Smooth transitions between sections
 */
export default function EnhancedQuestionBackground({
  questionNumber,
  showNextPage = false,
  prefersReducedMotion = false,
}: EnhancedQuestionBackgroundProps) {
  const section = getSectionForQuestion(questionNumber)

  // Enhanced gradient backgrounds with richer colors
  const sectionBackgrounds = useMemo(() => ({
    profil: 'linear-gradient(135deg, #dbeafe 0%, #93c5fd 25%, #60a5fa 50%, #3b82f6 75%, #094e86 100%)',
    experience: 'linear-gradient(135deg, #d1fae5 0%, #6ee7b7 25%, #34d399 50%, #10b981 75%, #059669 100%)',
    performance: 'linear-gradient(135deg, #ccfbf1 0%, #99f6e4 25%, #5eead4 50%, #2dd4bf 75%, #264653 100%)',
    outils: 'linear-gradient(135deg, #f3e8ff 0%, #e9d5ff 25%, #ddd6fe 50%, #c4b5fd 75%, #a78bfa 100%)',
    digitalisation: 'linear-gradient(135deg, #fdf2f8 0%, #fce7f3 25%, #fbcfe8 50%, #f9a8d4 75%, #ec4899 100%)',
    securite: 'linear-gradient(135deg, #fef3c7 0%, #fde68a 25%, #fcd34d 50%, #fbbf24 75%, #f59e0b 100%)',
    ia: 'linear-gradient(135deg, #cffafe 0%, #a5f3fc 25%, #67e8f9 50%, #22d3ee 75%, #06b6d4 100%)',
    communication: 'linear-gradient(135deg, #fee2e2 0%, #fecaca 25%, #fca5a5 50%, #f87171 75%, #ef4444 100%)',
    informations: 'linear-gradient(135deg, #dbeafe 0%, #93c5fd 25%, #60a5fa 50%, #3b82f6 75%, #2563eb 100%)',
    support: 'linear-gradient(135deg, #d1fae5 0%, #6ee7b7 25%, #34d399 50%, #10b981 75%, #059669 100%)',
    innovation: 'linear-gradient(135deg, #f3e8ff 0%, #e9d5ff 25%, #ddd6fe 50%, #c4b5fd 75%, #a78bfa 100%)',
    landing: 'linear-gradient(to bottom right, #ffffff 0%, #f9fafb 50%, #f3f4f6 100%)',
  }), [])

  // Glassmorphism colors (with opacity)
  const glassmorphismColors = useMemo(() => ({
    profil: ['#094e8640', '#3b82f640', '#60a5fa40'],
    experience: ['#10b98140', '#34d39940', '#6ee7b740'],
    performance: ['#26465340', '#2dd4bf40', '#5eead440'],
    outils: ['#a78bfa40', '#c4b5fd40', '#ddd6fe40'],
    digitalisation: ['#ec489940', '#f472b640', '#f9a8d440'],
    securite: ['#f59e0b40', '#fbbf2440', '#fcd34d40'],
    ia: ['#06b6d440', '#22d3ee40', '#67e8f940'],
    communication: ['#ef444440', '#f8717140', '#fca5a540'],
    informations: ['#3b82f640', '#60a5fa40', '#93c5fd40'],
    support: ['#10b98140', '#34d39940', '#6ee7b740'],
    innovation: ['#a78bfa40', '#c4b5fd40', '#ddd6fe40'],
    landing: ['#ffffff20', '#f9fafb20', '#f3f4f620'],
  }), [])

  // Particle colors
  const particleColors = useMemo(() => ({
    profil: ['#094e86', '#3b82f6', '#60a5fa'],
    experience: ['#10b981', '#34d399', '#6ee7b7'],
    performance: ['#264653', '#2dd4bf', '#5eead4'],
    outils: ['#a78bfa', '#c4b5fd', '#ddd6fe'],
    digitalisation: ['#ec4899', '#f472b6', '#f9a8d4'],
    securite: ['#f59e0b', '#fbbf24', '#fcd34d'],
    ia: ['#06b6d4', '#22d3ee', '#67e8f9'],
    communication: ['#ef4444', '#f87171', '#fca5a5'],
    informations: ['#3b82f6', '#60a5fa', '#93c5fd'],
    support: ['#10b981', '#34d399', '#6ee7b7'],
    innovation: ['#a78bfa', '#c4b5fd', '#ddd6fe'],
    landing: ['#6b7280', '#9ca3af', '#d1d5db'],
  }), [])

  const currentBackground = showNextPage && section
    ? sectionBackgrounds[section.id as keyof typeof sectionBackgrounds] || sectionBackgrounds.landing
    : sectionBackgrounds.landing

  const currentGlassColors = showNextPage && section
    ? glassmorphismColors[section.id as keyof typeof glassmorphismColors] || glassmorphismColors.landing
    : glassmorphismColors.landing

  const currentParticleColors = showNextPage && section
    ? particleColors[section.id as keyof typeof particleColors] || particleColors.landing
    : particleColors.landing

  // Generate particles (10 particles for optimal performance)
  const particles = useMemo(() => {
    return Array.from({ length: 10 }, (_, i) => ({
      id: i,
      size: Math.random() * 80 + 40, // 40-120px
      left: Math.random() * 100,
      top: Math.random() * 100,
      color: currentParticleColors[Math.floor(Math.random() * currentParticleColors.length)],
      duration: 3 + Math.random() * 3, // 3-6 seconds
      delay: Math.random() * 2,
      xOffset: (Math.random() - 0.5) * 40, // -20 to 20
      yOffset: (Math.random() - 0.5) * 40,
    }))
  }, [currentParticleColors])

  // Glassmorphism shapes (2-3 shapes)
  const glassmorphismShapes = useMemo(() => [
    {
      width: 600,
      height: 600,
      left: '10%',
      top: '20%',
      color: currentGlassColors[0],
      duration: 8,
      delay: 0,
      xOffset: 50,
      yOffset: -30,
    },
    {
      width: 400,
      height: 400,
      right: '15%',
      bottom: '30%',
      color: currentGlassColors[1],
      duration: 10,
      delay: 1,
      xOffset: -40,
      yOffset: 40,
    },
    {
      width: 300,
      height: 300,
      left: '50%',
      top: '60%',
      color: currentGlassColors[2] || currentGlassColors[0],
      duration: 12,
      delay: 2,
      xOffset: 30,
      yOffset: -20,
    },
  ], [currentGlassColors])

  if (prefersReducedMotion) {
    // Simplified version for accessibility
    return (
      <div className="absolute inset-0 -z-10">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: currentBackground,
            backgroundSize: 'cover',
          }}
        />
        <div
          className="absolute inset-0 opacity-[0.05] pointer-events-none"
          style={{
            backgroundImage: `radial-gradient(circle at 2px 2px, currentColor 1px, transparent 0)`,
            backgroundSize: '32px 32px',
          }}
        />
      </div>
    )
  }

  return (
    <div className="absolute inset-0 -z-10 overflow-hidden">
      {/* Base Animated Gradient */}
      <motion.div
        className="absolute inset-0"
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

      {/* Glassmorphism Shapes */}
      {showNextPage && glassmorphismShapes.map((shape, index) => (
        <motion.div
          key={`glass-${index}`}
          className="absolute rounded-full blur-3xl opacity-30"
          style={{
            width: `${shape.width}px`,
            height: `${shape.height}px`,
            background: `radial-gradient(circle, ${shape.color}, transparent)`,
            ...(shape.left && { left: shape.left }),
            ...(shape.right && { right: shape.right }),
            ...(shape.top && { top: shape.top }),
            ...(shape.bottom && { bottom: shape.bottom }),
          }}
          animate={{
            scale: [1, 1.2, 1],
            x: [0, shape.xOffset || (index % 2 === 0 ? 50 : -50), 0],
            y: [0, shape.yOffset || (index % 2 === 0 ? -30 : 30), 0],
          }}
          transition={{
            duration: shape.duration,
            repeat: Infinity,
            ease: "easeInOut",
            delay: shape.delay,
          }}
        />
      ))}

      {/* Floating Particles */}
      {showNextPage && particles.map((particle) => (
        <motion.div
          key={`particle-${particle.id}`}
          className="absolute rounded-full pointer-events-none"
          style={{
            width: `${particle.size}px`,
            height: `${particle.size}px`,
            left: `${particle.left}%`,
            top: `${particle.top}%`,
            background: `radial-gradient(circle, ${particle.color}40, transparent)`,
            filter: 'blur(1px)',
          }}
          animate={{
            y: [0, -30, 0],
            x: [0, particle.xOffset, 0],
            scale: [1, 1.2, 1],
            opacity: [0.2, 0.4, 0.2],
          }}
          transition={{
            duration: particle.duration,
            repeat: Infinity,
            ease: "easeInOut",
            delay: particle.delay,
          }}
        />
      ))}

      {/* Enhanced Dot Pattern */}
      {showNextPage && (
        <div
          className="absolute inset-0 opacity-[0.04] pointer-events-none"
          style={{
            backgroundImage: `radial-gradient(circle at 2px 2px, currentColor 1px, transparent 0)`,
            backgroundSize: '32px 32px',
            maskImage: 'radial-gradient(ellipse at center, black 40%, transparent 70%)',
            WebkitMaskImage: 'radial-gradient(ellipse at center, black 40%, transparent 70%)',
          }}
        />
      )}
    </div>
  )
}

