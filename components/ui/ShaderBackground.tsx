"use client"

import type React from "react"

import { useEffect, useRef, useMemo, memo } from "react"
import { MeshGradient } from "@paper-design/shaders-react"

interface ShaderBackgroundProps {
  children: React.ReactNode
  sectionId?: string // Optional section ID to match colors
}

// Slightly darker gradient backgrounds for better shader visibility
const sectionGradients: Record<string, string> = {
  landing: 'radial-gradient(circle at 30% 40%, rgba(6, 182, 212, 0.15) 0%, transparent 50%), radial-gradient(circle at 70% 70%, rgba(139, 92, 246, 0.12) 0%, transparent 60%), linear-gradient(135deg, #e0f2fe 0%, #dbeafe 40%, #e0e7ff 70%, #ede9fe 100%)',
  informations: 'radial-gradient(circle at 20% 50%, rgba(14, 165, 233, 0.3) 0%, transparent 50%), radial-gradient(circle at 80% 80%, rgba(56, 189, 248, 0.2) 0%, transparent 50%), linear-gradient(135deg, #dbeafe 0%, #bfdbfe 50%, #93c5fd 100%)',
  support: 'radial-gradient(circle at 20% 50%, rgba(16, 185, 129, 0.3) 0%, transparent 50%), radial-gradient(circle at 80% 80%, rgba(52, 211, 153, 0.2) 0%, transparent 50%), linear-gradient(135deg, #dcfce7 0%, #bbf7d0 50%, #86efac 100%)',
  innovation: 'radial-gradient(circle at 20% 50%, rgba(139, 92, 246, 0.3) 0%, transparent 50%), radial-gradient(circle at 80% 80%, rgba(167, 139, 250, 0.2) 0%, transparent 50%), linear-gradient(135deg, #f3e8ff 0%, #e9d5ff 50%, #d8b4fe 100%)',
  securite: 'radial-gradient(circle at 20% 50%, rgba(245, 158, 11, 0.3) 0%, transparent 50%), radial-gradient(circle at 80% 80%, rgba(251, 191, 36, 0.2) 0%, transparent 50%), linear-gradient(135deg, #fef3c7 0%, #fde68a 50%, #fcd34d 100%)',
  communication: 'radial-gradient(circle at 20% 50%, rgba(239, 68, 68, 0.3) 0%, transparent 50%), radial-gradient(circle at 80% 80%, rgba(248, 113, 113, 0.2) 0%, transparent 50%), linear-gradient(135deg, #fee2e2 0%, #fecaca 50%, #fca5a5 100%)',
}

// Bright, vibrant color palettes for shader (3 colors for performance)
const sectionColorPalettes: Record<string, string[]> = {
  landing: ["#7dd3fc", "#60a5fa", "#a78bfa"],
  informations: ["#ffffff", "#38bdf8", "#7dd3fc"],
  support: ["#ffffff", "#34d399", "#6ee7b7"],
  innovation: ["#ffffff", "#a78bfa", "#c4b5fd"],
  securite: ["#ffffff", "#fbbf24", "#fcd34d"],
  communication: ["#ffffff", "#f87171", "#fca5a5"],
}

const ShaderBackground = memo(({ children, sectionId = 'landing' }: ShaderBackgroundProps) => {
  const containerRef = useRef<HTMLDivElement>(null)

  // Memoize colors to prevent recalculation
  const currentColors = useMemo(() => 
    sectionColorPalettes[sectionId] || sectionColorPalettes.landing,
    [sectionId]
  )

  const currentGradient = useMemo(() =>
    sectionGradients[sectionId] || sectionGradients.landing,
    [sectionId]
  )

  return (
    <div ref={containerRef} className="min-h-screen bg-white relative overflow-hidden">
      {/* Lightweight CSS gradient fallback - always visible */}
      <div 
        className="absolute inset-0 z-0 transition-opacity duration-1000"
        style={{
          background: currentGradient,
          willChange: 'opacity'
        }}
      />

      {/* Single optimized MeshGradient overlay - reduced complexity */}
      <MeshGradient
        key={`gradient-${sectionId}`}
        className="absolute inset-0 w-full h-full opacity-45 mix-blend-multiply z-0"
        colors={currentColors}
        speed={0.25}
        backgroundColor="transparent"
        style={{
          willChange: 'opacity',
        }}
      />

      {/* Content */}
      <div className="relative z-30">
        {children}
      </div>
    </div>
  )
})

ShaderBackground.displayName = 'ShaderBackground'

export default ShaderBackground

