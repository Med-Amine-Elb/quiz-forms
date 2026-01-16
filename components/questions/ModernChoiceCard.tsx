"use client";

import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";
import type { LucideIcon } from "lucide-react";
import { useState, useRef, useEffect } from "react";

interface ModernChoiceCardProps {
  id: string;
  label: string;
  isSelected: boolean;
  onClick: () => void;
  onHoverChange?: (isHovered: boolean) => void;
  onTruncationChange?: (isTruncated: boolean) => void;
  index: number;
  accentColor?: string;
  icon?: LucideIcon;
  isFirstQuestion?: boolean;
  emoji?: string;
  title?: string;
  description?: string;
  disableAnimations?: boolean;
  questionId?: number;
}

export default function ModernChoiceCard({
  id,
  label,
  isSelected,
  onClick,
  onHoverChange,
  onTruncationChange,
  index,
  accentColor = '#0EA5E9',
  icon: Icon,
  isFirstQuestion = false,
  emoji,
  title,
  description,
  disableAnimations = false,
  questionId,
}: ModernChoiceCardProps) {
  // Only show rotating gradient and particles for questions 14, 15, 16
  const showSpecialAnimations = questionId === 14 || questionId === 15 || questionId === 16;
  // Show full label instead of truncated title
  const displayText = label;
  
  const buttonRef = useRef<HTMLButtonElement>(null);
  const textRef = useRef<HTMLDivElement>(null);
  const [ripples, setRipples] = useState<Array<{ x: number; y: number; id: number }>>([]);

  // Magnetic hover effect
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const springConfig = { damping: 25, stiffness: 300 };
  const xSpring = useSpring(x, springConfig);
  const ySpring = useSpring(y, springConfig);
  
  const handleMouseMove = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (!buttonRef.current || isSelected || disableAnimations) return;
    const rect = buttonRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    const distanceX = (e.clientX - centerX) * 0.15;
    const distanceY = (e.clientY - centerY) * 0.15;
    x.set(distanceX);
    y.set(distanceY);
  };
  
  const handleMouseLeave = () => {
    if (disableAnimations) return;
    x.set(0);
    y.set(0);
  };

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!buttonRef.current) return;
    
    // Create simple ripple effect
    if (!disableAnimations) {
      const rect = buttonRef.current.getBoundingClientRect();
      const clickX = e.clientX - rect.left;
      const clickY = e.clientY - rect.top;
      const newRipple = { x: clickX, y: clickY, id: Date.now() };
      setRipples((prev) => [...prev, newRipple]);
      setTimeout(() => {
        setRipples((prev) => prev.filter((r) => r.id !== newRipple.id));
      }, 600);
    }
    
    // Call onClick
    onClick();
  };

  // Check for text truncation
  useEffect(() => {
    const checkTruncation = () => {
      if (textRef.current && onTruncationChange) {
        // Check if text is truncated by comparing scrollHeight with clientHeight
        // For line-clamp, scrollHeight > clientHeight means text is truncated
        const isOverflowing = textRef.current.scrollHeight > textRef.current.clientHeight;
        onTruncationChange(isOverflowing);
      }
    };

    // Check after a small delay to ensure DOM is ready
    const timer = setTimeout(checkTruncation, 100);
    // Recheck on resize
    window.addEventListener('resize', checkTruncation);
    
    return () => {
      clearTimeout(timer);
      window.removeEventListener('resize', checkTruncation);
    };
  }, [onTruncationChange, label]);
  
  const buttonContent = (
    <>
      {/* Simple ripple effect on click */}
      {!disableAnimations && ripples.map((ripple) => (
        <motion.div
          key={ripple.id}
          className="absolute rounded-full pointer-events-none"
          style={{
            left: ripple.x,
            top: ripple.y,
            width: 20,
            height: 20,
            background: `radial-gradient(circle, ${accentColor}40, transparent 70%)`,
            transform: 'translate(-50%, -50%)',
          }}
          initial={{ scale: 0, opacity: 0.8 }}
          animate={{ scale: 8, opacity: 0 }}
          transition={{
            duration: 0.6,
            ease: 'easeOut',
          }}
        />
      ))}

      {/* Glassmorphism background - simplified to prevent blocking */}
      {isSelected && (
        <div 
          className="absolute inset-0 rounded-2xl pointer-events-none"
          style={{
            background: `linear-gradient(135deg, ${accentColor}20, ${accentColor}08)`,
            opacity: 1,
          }}
        />
      )}
      
      {/* Selected state gradient with animated rotating gradient */}
      {isSelected && (
        <>
          <div
            className="absolute inset-0 rounded-2xl pointer-events-none"
            style={{
              background: `linear-gradient(135deg, ${accentColor}20, ${accentColor}10)`,
            }}
          />
          {/* Rotating gradient animation - appears on all questions */}
          {!disableAnimations && (
            <motion.div
              className="absolute inset-0 rounded-2xl pointer-events-none"
              style={{
                background: `conic-gradient(from 0deg, transparent, ${accentColor}25, ${accentColor}15, transparent)`,
                opacity: 0.6,
              }}
              animate={{
                rotate: [0, 360],
              }}
              transition={{
                duration: 8,
                repeat: Infinity,
                ease: 'linear',
              }}
            />
          )}
        </>
      )}

      {/* Animated border glow - static when animations disabled */}
      {isSelected && (
        <>
          {disableAnimations ? (
            <div
              className="absolute inset-0 rounded-2xl pointer-events-none"
              style={{
                boxShadow: `0 0 0 2px ${accentColor}40, 0 0 20px ${accentColor}20`,
              }}
            />
          ) : (
            <motion.div
              className="absolute inset-0 rounded-2xl pointer-events-none"
              style={{
                boxShadow: `0 0 0 2px ${accentColor}40, 0 0 20px ${accentColor}20`,
              }}
              animate={{
                boxShadow: [
                  `0 0 0 2px ${accentColor}40, 0 0 20px ${accentColor}20`,
                  `0 0 0 2px ${accentColor}50, 0 0 25px ${accentColor}30`,
                  `0 0 0 2px ${accentColor}40, 0 0 20px ${accentColor}20`,
                ],
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
            />
          )}
        </>
      )}

      {/* Content - Consistent Typography */}
      <div className="relative flex items-center justify-between gap-4 z-10">
        <div className="flex items-center gap-3 flex-1">
          {/* Icon (prioritized) or Emoji with enhanced reactive animations */}
          {Icon ? (
            disableAnimations ? (
              <div
                className={cn(
                  "flex-shrink-0 relative",
                  "w-7 h-7 sm:w-8 sm:h-8"
                )}
                style={{ color: isSelected ? accentColor : '#4B5563' }}
              >
                <Icon className="w-full h-full" strokeWidth={isSelected ? 2.5 : 2} />
              </div>
            ) : (
              <motion.div
                className={cn(
                  "flex-shrink-0 relative",
                  "w-7 h-7 sm:w-8 sm:h-8"
                )}
                style={{ color: isSelected ? accentColor : '#4B5563' }}
                animate={isSelected ? { scale: 1.1 } : { scale: 1 }}
                whileHover={!isSelected ? { scale: 1.15 } : { scale: 1.1 }}
                transition={{ duration: 0.2, ease: 'easeOut' }}
              >
                <Icon className="w-full h-full" strokeWidth={isSelected ? 2.5 : 2} />
              </motion.div>
            )
          ) : emoji ? (
            disableAnimations ? (
              <div
                className={cn(
                  "flex-shrink-0 leading-none relative",
                  "text-3xl sm:text-4xl"
                )}
              >
                {emoji}
              </div>
            ) : (
              <motion.div
                className={cn(
                  "flex-shrink-0 leading-none relative",
                  "text-3xl sm:text-4xl"
                )}
                animate={isSelected ? { scale: 1.15 } : { scale: 1 }}
                whileHover={!isSelected ? { scale: 1.2 } : { scale: 1.15 }}
                transition={{ duration: 0.2, ease: 'easeOut' }}
              >
                {emoji}
              </motion.div>
            )
          ) : null}

          {/* Text Content */}
          <div ref={textRef} className="flex-1 min-w-0">
            <div
              className={cn(
                "font-semibold text-base sm:text-lg leading-tight",
                "line-clamp-2"
              )}
              style={{
                color: isSelected ? '#111827' : '#1F2937',
              }}
            >
              {displayText}
            </div>
          </div>
        </div>

        {/* Selection Indicator */}
        {isSelected && (
          <div className="flex-shrink-0 relative">
            {disableAnimations ? (
              <div
                className="w-7 h-7 rounded-full flex items-center justify-center shadow-lg relative z-10"
                style={{
                  backgroundColor: accentColor,
                  boxShadow: `0 4px 20px ${accentColor}50`,
                }}
              >
                <Check className="w-4 h-4 text-white" strokeWidth={3} />
              </div>
            ) : (
              <motion.div 
                className="flex-shrink-0 relative"
                initial={false}
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ 
                  duration: 0.5,
                  ease: 'easeOut',
                  repeat: 1,
                  repeatDelay: 1
                }}
              >
                <motion.div 
                  className="w-7 h-7 rounded-full flex items-center justify-center shadow-lg relative z-10"
                  style={{
                    backgroundColor: accentColor,
                    boxShadow: `0 4px 20px ${accentColor}50`,
                  }}
                  whileHover={{ scale: 1.1 }}
                  transition={{ duration: 0.2 }}
                >
                  <Check className="w-4 h-4 text-white" strokeWidth={3} />
                </motion.div>
              </motion.div>
            )}
          </div>
        )}
      </div>

      {/* Shimmer effect on hover - single pass only */}
      {!disableAnimations && (
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-transparent via-white/50 to-transparent pointer-events-none"
          initial={{ x: '-100%' }}
          whileHover={{ x: '200%' }}
          transition={{
            duration: 0.6,
            ease: 'easeInOut',
          }}
          style={{ pointerEvents: 'none' }}
        />
      )}
    </>
  );

  if (disableAnimations) {
    return (
      <button
        ref={buttonRef}
        onClick={handleClick}
        onMouseEnter={() => {
          onHoverChange?.(true);
        }}
      onMouseLeave={() => {
        onHoverChange?.(false);
      }}
      style={{
        willChange: 'transform, opacity',
        borderColor: isSelected ? accentColor : undefined,
        boxShadow: isSelected 
          ? `0 25px 60px ${accentColor}50, 0 8px 24px rgba(0,0,0,0.12), 0 0 0 2px ${accentColor}40, inset 0 1px 0 rgba(255,255,255,0.9), 0 0 40px ${accentColor}30` 
          : '0 10px 32px rgba(0, 0, 0, 0.08), 0 4px 12px rgba(0,0,0,0.06)',
        position: 'relative',
        zIndex: 10,
        pointerEvents: 'auto',
      }}
      className={cn(
        "relative w-full rounded-2xl text-left transition-all duration-300",
        "border-2 font-inter font-semibold",
        "focus:outline-none focus:ring-4 focus:ring-offset-2",
        "group overflow-hidden cursor-pointer",
        // Glassmorphism effect
        "backdrop-blur-xl",
        // 3D transform perspective
        "transform-gpu",
        // Unified sizing
        "px-6 py-5 text-base sm:text-lg",
        // Bright theme with high contrast
        isSelected
          ? "bg-white border-current text-gray-900"
          : "bg-white/90 border-gray-300 hover:bg-white hover:border-gray-400 text-gray-800"
      )}
    >
      
      {/* Glassmorphism background - simplified to prevent blocking */}
      {isSelected && (
        <div 
          className="absolute inset-0 rounded-2xl pointer-events-none"
          style={{
            background: `linear-gradient(135deg, ${accentColor}20, ${accentColor}08)`,
            opacity: 1,
          }}
        />
      )}
      
      {/* Selected state gradient - removed layoutId animation that was blocking */}
      {isSelected && (
        <div
          className="absolute inset-0 rounded-2xl pointer-events-none"
          style={{
            background: `linear-gradient(135deg, ${accentColor}20, ${accentColor}10)`,
          }}
        />
      )}

      {/* Static border glow on selection - removed animations that were blocking */}
      {isSelected && (
        <div
          className="absolute inset-0 rounded-2xl pointer-events-none"
          style={{
            boxShadow: `0 0 0 2px ${accentColor}40, 0 0 20px ${accentColor}20`,
          }}
        />
      )}

      {/* Content - Consistent Typography */}
      <div className="relative flex items-center justify-between gap-4 z-10">
        <div className="flex items-center gap-3 flex-1">
          {/* Icon (prioritized) or Emoji with enhanced reactive animations */}
          {Icon ? (
            <motion.div
              animate={isSelected ? { 
                scale: [1, 1.4, 1.15], 
                rotate: [0, 20, -20, 0],
                y: [0, -5, 0],
                x: [0, 2, -2, 0],
              } : {
                scale: 1,
                rotate: 0,
                y: 0,
                x: 0,
              }}
              transition={{ 
                duration: 0.8,
                ease: [0.16, 1, 0.3, 1],
                repeat: isSelected ? Infinity : 0,
                repeatDelay: 2,
              }}
              whileHover={!isSelected ? {
                scale: 1.2,
                rotate: [0, 8, -8, 0],
                y: -2,
                transition: { 
                  duration: 0.4,
                  ease: [0.16, 1, 0.3, 1]
                }
              } : {
                scale: 1.15,
                rotate: [0, 10, -10, 0],
                transition: { 
                  duration: 0.3,
                  ease: [0.16, 1, 0.3, 1]
                }
              }}
              className={cn(
                "flex-shrink-0 relative",
                "w-7 h-7 sm:w-8 sm:h-8"
              )}
              style={{ color: isSelected ? accentColor : '#4B5563' }}
            >
              <Icon className="w-full h-full" strokeWidth={isSelected ? 2.5 : 2} />
              {isSelected && (
                <motion.div
                  className="absolute inset-0 rounded-full"
                  style={{
                    background: `radial-gradient(circle, ${accentColor}20, transparent 70%)`,
                  }}
                  animate={{
                    scale: [1, 1.5, 1],
                    opacity: [0.5, 0.8, 0.5],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: 'easeInOut',
                  }}
                />
              )}
            </motion.div>
          ) : emoji ? (
            <motion.div
              animate={isSelected ? { 
                scale: [1, 1.4, 1.15], 
                rotate: [0, 20, -20, 0],
                y: [0, -8, 0],
                x: [0, 3, -3, 0],
              } : {
                scale: 1,
                rotate: 0,
                y: 0,
                x: 0,
              }}
              transition={{ 
                duration: 0.8,
                ease: [0.16, 1, 0.3, 1],
                repeat: isSelected ? Infinity : 0,
                repeatDelay: 2,
              }}
              whileHover={!isSelected ? {
                scale: 1.25,
                rotate: [0, 10, -10, 0],
                y: -3,
                transition: { 
                  duration: 0.4,
                  ease: [0.16, 1, 0.3, 1]
                }
              } : {
                scale: 1.2,
                rotate: [0, 12, -12, 0],
                transition: { 
                  duration: 0.3,
                  ease: [0.16, 1, 0.3, 1]
                }
              }}
              className={cn(
                "flex-shrink-0 leading-none relative",
                "text-3xl sm:text-4xl"
              )}
            >
              {emoji}
              {isSelected && (
                <motion.div
                  className="absolute inset-0 rounded-full -z-10"
                  style={{
                    background: `radial-gradient(circle, ${accentColor}15, transparent 70%)`,
                  }}
                  animate={{
                    scale: [1, 1.8, 1],
                    opacity: [0.4, 0.7, 0.4],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: 'easeInOut',
                  }}
                />
              )}
            </motion.div>
          ) : null}
          
          {/* Full text display - allow wrapping for longer labels */}
          <motion.div 
            className="flex-1 min-w-0"
            animate={isSelected ? {
              x: [0, 3, -3, 0],
            } : {}}
            transition={{
              duration: 0.6,
              ease: [0.16, 1, 0.3, 1],
            }}
          >
            <motion.div 
              ref={textRef}
              className={cn(
                "font-extrabold leading-tight",
                "text-base sm:text-lg",
                isSelected ? "text-gray-900" : "text-gray-800 group-hover:text-gray-900",
                // Allow text to wrap if it's too long, but prefer single line
                "line-clamp-2"
              )}
              animate={isSelected ? {
                scale: [1, 1.02, 1],
              } : {}}
              transition={{
                duration: 0.5,
                ease: [0.16, 1, 0.3, 1],
              }}
            >
              {displayText}
            </motion.div>
          </motion.div>
        </div>
        
        {/* Check icon with enhanced reactive animations */}
        {isSelected && (
          <motion.div
            initial={{ scale: 0, rotate: -180, opacity: 0 }}
            animate={{ 
              scale: 1, 
              rotate: 0,
              opacity: 1,
            }}
            transition={{
              type: "spring",
              stiffness: 700,
              damping: 18,
            }}
            whileHover={{
              scale: 1.15,
              rotate: [0, 10, -10, 0],
              transition: {
                duration: 0.4,
                ease: [0.16, 1, 0.3, 1],
              }
            }}
            className="flex-shrink-0 relative"
          >
            <motion.div 
              className="w-7 h-7 rounded-full flex items-center justify-center shadow-lg relative z-10"
              style={{
                backgroundColor: accentColor,
                boxShadow: `0 4px 20px ${accentColor}50`,
              }}
              animate={{
                boxShadow: [
                  `0 4px 20px ${accentColor}50`,
                  `0 6px 30px ${accentColor}70`,
                  `0 4px 20px ${accentColor}50`,
                ],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
            >
              <motion.div
                animate={{
                  scale: [1, 1.2, 1],
                  rotate: [0, 5, -5, 0],
                }}
                transition={{
                  duration: 1.5,
                  repeat: Infinity,
                  ease: 'easeInOut',
                }}
              >
                <Check className="w-4 h-4 text-white" strokeWidth={3} />
              </motion.div>
            </motion.div>
            <motion.div
              className="absolute inset-0 rounded-full pointer-events-none"
              style={{
                background: `radial-gradient(circle, ${accentColor}40, transparent 70%)`,
              }}
              animate={{
                scale: [1, 1.8, 1],
                opacity: [0.6, 0, 0.6],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: 'easeOut',
              }}
            />
          </motion.div>
        )}
      </div>

      {/* Enhanced shimmer effect on hover with multiple passes */}
      <motion.div
        className="absolute inset-0 bg-gradient-to-r from-transparent via-white/60 to-transparent pointer-events-none"
        initial={{ x: '-100%' }}
        whileHover={{ x: '100%' }}
        transition={{
          duration: 0.6,
          ease: 'easeInOut',
        }}
      />
      {!isSelected && (
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent pointer-events-none"
          animate={{
            x: ['-100%', '200%'],
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            repeatDelay: 1,
            ease: 'easeInOut',
          }}
        />
      )}
      
      {/* Glow effect on hover */}
      <motion.div
        className="absolute inset-0 rounded-2xl pointer-events-none opacity-0"
        style={{
          background: `radial-gradient(circle at center, ${accentColor}15, transparent 70%)`,
        }}
        whileHover={{
          opacity: 1,
        }}
        transition={{
          duration: 0.3,
        }}
      />
      
      {/* Enhanced pulse animation on selection with multiple layers */}
      {isSelected && (
        <>
          <motion.div
            className="absolute inset-0 rounded-2xl"
            style={{
              background: `radial-gradient(circle at center, ${accentColor}20, transparent 70%)`,
            }}
            animate={{
              opacity: [0.6, 0.9, 0.6],
              scale: [1, 1.08, 1],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          />
          <motion.div
            className="absolute inset-0 rounded-2xl"
            style={{
              background: `radial-gradient(circle at 30% 30%, ${accentColor}15, transparent 50%)`,
            }}
            animate={{
              opacity: [0.4, 0.7, 0.4],
              scale: [1, 1.12, 1],
            }}
            transition={{
              duration: 2.5,
              repeat: Infinity,
              ease: 'easeInOut',
              delay: 0.5,
            }}
          />
        </>
      )}
      
      {/* Animated particles on selection - only for Q14, Q15, Q16 */}
      {isSelected && !disableAnimations && showSpecialAnimations && (
        <>
          {/* Floating particles */}
          {[...Array(6)].map((_, i) => (
            <motion.div
              key={`particle-${i}`}
              className="absolute rounded-full"
              style={{
                width: 6,
                height: 6,
                background: accentColor,
                left: `${15 + (i % 3) * 35}%`,
                top: `${15 + Math.floor(i / 3) * 40}%`,
              }}
              animate={{
                y: [0, -30, -60],
                x: [(i % 2) * 10 - 5, (i % 2) * 20 - 10, (i % 2) * 15 - 7.5],
                opacity: [0, 1, 0.8, 0],
                scale: [0, 1.2, 0.8, 0],
              }}
              transition={{
                duration: 2.5,
                repeat: Infinity,
                delay: i * 0.2,
                ease: 'easeOut',
              }}
            />
          ))}
          
          {/* Celebration burst removed - was causing blocking */}
          {false && (
            <>
              {[...Array(12)].map((_, i) => (
                <motion.div
                  key={`burst-${i}`}
                  className="absolute rounded-full"
                  style={{
                    width: 8,
                    height: 8,
                    background: accentColor,
                    left: '50%',
                    top: '50%',
                  }}
                  initial={{
                    x: 0,
                    y: 0,
                    scale: 0,
                    opacity: 1,
                  }}
                  animate={{
                    x: Math.cos((i * 30) * Math.PI / 180) * 60,
                    y: Math.sin((i * 30) * Math.PI / 180) * 60,
                    scale: [0, 1, 0],
                    opacity: [1, 1, 0],
                  }}
                  transition={{
                    duration: 0.8,
                    ease: "easeOut",
                  }}
                />
              ))}
            </>
          )}
        </>
      )}
      </button>
    );
  }

  return (
    <motion.button
      ref={buttonRef}
      onClick={handleClick}
      onMouseEnter={() => {
        onHoverChange?.(true);
      }}
      onMouseMove={handleMouseMove}
      onMouseLeave={() => {
        onHoverChange?.(false);
        handleMouseLeave();
      }}
      initial={{ opacity: 0, y: 10 }}
      animate={{ 
        opacity: 1, 
        y: 0,
      }}
      transition={{
        duration: 0.3,
        delay: index * 0.03,
        ease: [0.16, 1, 0.3, 1],
      }}
      whileHover={{ 
        scale: 1.02,
        y: -4,
        transition: { 
          duration: 0.2,
          ease: [0.16, 1, 0.3, 1],
        },
      }}
      whileTap={{ 
        scale: 0.98,
        transition: { 
          duration: 0.1,
        },
      }}
      style={{
        willChange: 'transform, opacity',
        borderColor: isSelected ? accentColor : undefined,
        boxShadow: isSelected 
          ? `0 25px 60px ${accentColor}50, 0 8px 24px rgba(0,0,0,0.12), 0 0 0 2px ${accentColor}40, inset 0 1px 0 rgba(255,255,255,0.9), 0 0 40px ${accentColor}30` 
          : '0 10px 32px rgba(0, 0, 0, 0.08), 0 4px 12px rgba(0,0,0,0.06)',
        position: 'relative',
        zIndex: 10,
        pointerEvents: 'auto',
        x: disableAnimations ? undefined : xSpring,
        y: disableAnimations ? undefined : ySpring,
      }}
      className={cn(
        "relative w-full rounded-2xl text-left transition-all duration-300",
        "border-2 font-inter font-semibold",
        "focus:outline-none focus:ring-4 focus:ring-offset-2",
        "group overflow-hidden cursor-pointer",
        "backdrop-blur-xl",
        "transform-gpu",
        "px-6 py-5 text-base sm:text-lg",
        isSelected
          ? "bg-white border-current text-gray-900"
          : "bg-white/90 border-gray-300 hover:bg-white hover:border-gray-400 text-gray-800"
      )}
    >
      {buttonContent}
    </motion.button>
  );
}


