'use client';

import { useEffect, useState, useRef, useCallback } from 'react';
import { DotLottieReact } from '@lottiefiles/dotlottie-react';
import { motion, AnimatePresence } from 'framer-motion';
import { MousePointerClick } from 'lucide-react';
import { 
  getAnimationForSection, 
  getReactionType,
  specialAnimations,
  sectionAnimations,
  getRandomIdleAnimation,
  getRandomThinkingAnimation,
  IDLE_ANIMATIONS,
  THINKING_ANIMATIONS
} from '@/lib/lottieAnimations';
import { questionSections } from '@/lib/questionSections';
import { cn } from '@/lib/utils';

interface LottieCharacterProps {
  sectionId: string;
  questionId?: number;
  totalQuestions?: number;
  className?: string;
  // Interaction states
  isHovering?: boolean;
  lastAnswer?: string;
  lastAnswerEmoji?: string;
  // Special modes
  isWelcome?: boolean;
  isCompletion?: boolean;
  isMilestone?: boolean;
  // Animation control
  autoReact?: boolean;
  reactDuration?: number;
}

// 💬 Speech bubble messages per section - Expanded with more variety
const speechMessages: Record<string, string[]> = {
  informations: [
    'Bienvenue ! 👋',
    'Commençons cette aventure ensemble !',
    'Enchanté de faire votre connaissance ! 😊',
    'Prêt à commencer ? 🚀',
    'Salut ! Content de vous voir ici !',
    'Allons-y ! 💪',
    'C\'est parti ! ✨',
    'Bienvenue dans cette expérience !',
  ],
  support: [
    'Parlez-nous de votre expérience !',
    'Votre avis compte énormément ! 💪',
    'On vous écoute attentivement ! 👂',
    'Partagez avec nous vos impressions !',
    'Votre feedback est précieux ! 💎',
    'Dites-nous tout ! 🗣️',
    'Votre opinion nous intéresse !',
    'On veut tout savoir ! 📝',
    'N\'hésitez pas à être détaillé !',
    'Chaque détail compte ! ✨',
  ],
  innovation: [
    'Explorons ensemble de nouvelles idées ! 🚀',
    'L\'innovation, c\'est vous qui la créez !',
    'Partagez vos idées les plus créatives ! 💡',
    'Qu\'est-ce qui vous inspire ?',
    'Vos suggestions sont les bienvenues !',
    'Imaginons l\'avenir ensemble ! 🌟',
    'Quelles sont vos idées révolutionnaires ?',
    'L\'innovation commence ici ! 💫',
    'Partagez votre vision ! 👁️',
    'Créons quelque chose d\'extraordinaire !',
  ],
  securite: [
    'La sécurité d\'abord ! 🔒',
    'Restons vigilants ensemble !',
    'Ensemble, nous sommes plus forts ! 🛡️',
    'Votre sécurité est notre priorité !',
    'Protégeons-nous mutuellement !',
    'La vigilance est la clé ! 🔑',
    'Soyons tous responsables !',
    'Sécurité = Priorité absolue ! ⚡',
    'Ensemble pour un environnement sûr !',
    'Votre sécurité compte ! 💪',
  ],
  communication: [
    'Dernière ligne droite ! 🎯',
    'Presque terminé, continuez !',
    'Merci pour votre temps précieux ! 💬',
    'On y est presque !',
    'Derniers efforts ! 💪',
    'Vous y êtes presque !',
    'Félicitations pour votre persévérance ! 🎉',
    'Dernière étape, vous pouvez le faire !',
    'Presque au bout du tunnel !',
    'Merci de nous avoir accompagnés ! 🙏',
  ],
};

// 🎯 Milestone messages - Expanded
const milestoneMessages: Record<number, string[]> = {
  30: [
    'Super début ! Continue comme ça ! 🌟',
    'Excellent départ ! 💪',
    'Vous êtes sur la bonne voie ! ✨',
    'Bravo pour ce début ! 🎯',
  ],
  50: [
    'Mi-parcours ! Tu gères parfaitement ! 💪',
    'À mi-chemin, continuez ! 🌟',
    'Excellent progrès ! 🚀',
    'Vous êtes à mi-parcours, bravo !',
  ],
  75: [
    'Presque fini, vous y êtes ! 🎯',
    'Plus qu\'un petit effort ! 💪',
    'Dernière ligne droite ! 🚀',
    'Vous êtes presque au bout ! ✨',
  ],
  90: [
    'Dernière ligne droite ! 🚀',
    'Presque terminé, félicitations ! 🎉',
    'Derniers instants, vous y êtes !',
    'Bravo, vous avez presque tout fait ! 🌟',
  ],
};

// ⏱️ Idle messages - Expanded
const idleMessages = [
  'Je suis là si vous avez besoin ! 👋',
  'Prenez votre temps, pas de stress... ⏳',
  'N\'hésitez pas, je vous écoute ! 💭',
  'Je vous attends patiemment ! 😊',
  'Réfléchissez bien, c\'est important ! 🤔',
  'Pas de précipitation ! 🕐',
  'Je suis là pour vous ! 💬',
  'Prenez le temps qu\'il faut ! ⏰',
  'Réfléchissez à votre réponse ! 🧠',
  'Je patiente avec plaisir ! 😌',
];

export default function LottieCharacter({
  sectionId,
  questionId = 0,
  totalQuestions = 23,
  className = '',
  isHovering = false,
  lastAnswer,
  lastAnswerEmoji,
  isWelcome = false,
  isCompletion = false,
  isMilestone = false,
  autoReact = true,
  reactDuration = 2500,
}: LottieCharacterProps) {
  const [currentAnimationUrl, setCurrentAnimationUrl] = useState<string>('');
  const [currentState, setCurrentState] = useState<'idle' | 'happy' | 'thinking' | 'celebrate'>('idle');
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const reactionTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  
  // 🌊 Floating animation state
  const [floatY, setFloatY] = useState(0);
  
  // 💬 Speech bubble state
  const [showSpeechBubble, setShowSpeechBubble] = useState(false);
  const [speechMessage, setSpeechMessage] = useState('');
  const [bubbleVariant, setBubbleVariant] = useState<'rounded' | 'sharp' | 'pill'>(() => {
    // Random variant on mount
    const variants: ('rounded' | 'sharp' | 'pill')[] = ['rounded', 'sharp', 'pill'];
    return variants[Math.floor(Math.random() * variants.length)];
  });
  const [bubblePosition, setBubblePosition] = useState<'left' | 'center' | 'right'>('center');
  const speechTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const lastMessageIndexRef = useRef<number>(-1);
  
  // 🎯 Milestone celebration state
  const [showMilestone, setShowMilestone] = useState(false);
  const [milestoneMessage, setMilestoneMessage] = useState('');
  const lastMilestoneRef = useRef<number>(0);
  
  // ⏱️ Idle timer state
  const [isIdle, setIsIdle] = useState(false);
  const idleTimerRef = useRef<NodeJS.Timeout | null>(null);
  const lastActivityRef = useRef<number>(Date.now());
  
  // 🎪 Easter egg state
  const [clickCount, setClickCount] = useState(0);
  const [showEasterEgg, setShowEasterEgg] = useState(false);
  const clickTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  
  // 🌈 Get section color
  const getSectionColor = useCallback(() => {
    const section = questionSections.find(s => s.id === sectionId);
    return section?.accent || '#0EA5E9';
  }, [sectionId]);

  // 🌊 Floating animation effect
  useEffect(() => {
    let animationFrame: number;
    let startTime = Date.now();
    
    const animate = () => {
      const elapsed = Date.now() - startTime;
      // Gentle sine wave floating - 3 second cycle, 8px amplitude
      const newY = Math.sin(elapsed / 1500) * 8;
      setFloatY(newY);
      animationFrame = requestAnimationFrame(animate);
    };
    
    animate();
    
    return () => {
      if (animationFrame) {
        cancelAnimationFrame(animationFrame);
      }
    };
  }, []);

  // 💬 Show speech bubble on section change with variety
  useEffect(() => {
    const messages = speechMessages[sectionId] || speechMessages.informations;
    
    // Ensure we don't show the same message twice in a row
    let randomIndex;
    do {
      randomIndex = Math.floor(Math.random() * messages.length);
    } while (randomIndex === lastMessageIndexRef.current && messages.length > 1);
    
    lastMessageIndexRef.current = randomIndex;
    const randomMessage = messages[randomIndex];
    
    // Randomize bubble variant (always center position for better alignment)
    const variants: ('rounded' | 'sharp' | 'pill')[] = ['rounded', 'sharp', 'pill'];
    setBubbleVariant(variants[Math.floor(Math.random() * variants.length)]);
    // Always center to align with animation
    setBubblePosition('center');
    
    setSpeechMessage(randomMessage);
    setShowSpeechBubble(true);
    
    // Hide after 5 seconds (longer for better UX)
    if (speechTimeoutRef.current) {
      clearTimeout(speechTimeoutRef.current);
    }
    speechTimeoutRef.current = setTimeout(() => {
      setShowSpeechBubble(false);
    }, 5000);
    
    return () => {
      if (speechTimeoutRef.current) {
        clearTimeout(speechTimeoutRef.current);
      }
    };
  }, [sectionId]);

  // 🎯 Check for milestones
  useEffect(() => {
    const progress = Math.round((questionId / totalQuestions) * 100);
    
    // Check milestone thresholds
    const milestones = [30, 50, 75, 90];
    for (const milestone of milestones) {
      if (progress >= milestone && lastMilestoneRef.current < milestone) {
        lastMilestoneRef.current = milestone;
        const messages = milestoneMessages[milestone] || [milestoneMessages[30][0]];
        const randomMessage = messages[Math.floor(Math.random() * messages.length)];
        setMilestoneMessage(randomMessage);
        setShowMilestone(true);
        setCurrentState('celebrate');
        
        // Hide after 4 seconds
        setTimeout(() => {
          setShowMilestone(false);
          setCurrentState('idle');
        }, 4000);
        break;
      }
    }
  }, [questionId, totalQuestions]);

  // ⏱️ Idle detection - Show thinking animation after 10-15 seconds of inactivity
  useEffect(() => {
    const checkIdle = () => {
      const now = Date.now();
      const timeSinceActivity = now - lastActivityRef.current;
      
      // Random delay between 10-15 seconds for more natural feel
      const idleThreshold = 10000 + Math.random() * 5000; // 10-15 seconds
      
      if (timeSinceActivity > idleThreshold && currentState === 'idle' && !isIdle) {
        setIsIdle(true);
        // Switch to thinking animation (stays until next question)
        setCurrentState('thinking');
        
        // Show encouraging speech bubble with variety
        let randomIndex;
        do {
          randomIndex = Math.floor(Math.random() * idleMessages.length);
        } while (randomIndex === lastMessageIndexRef.current && idleMessages.length > 1);
        lastMessageIndexRef.current = randomIndex;
        const randomIdleMessage = idleMessages[randomIndex];
        
        // Randomize bubble variant (always center position)
        const variants: ('rounded' | 'sharp' | 'pill')[] = ['rounded', 'sharp', 'pill'];
        setBubbleVariant(variants[Math.floor(Math.random() * variants.length)]);
        // Always center to align with animation
        setBubblePosition('center');
        
        setSpeechMessage(randomIdleMessage);
        setShowSpeechBubble(true);
        
        // Hide bubble after 5 seconds, but keep thinking animation until next question
        setTimeout(() => {
          setShowSpeechBubble(false);
        }, 5000);
      }
    };
    
    idleTimerRef.current = setInterval(checkIdle, 1000); // Check every second
    
    return () => {
      if (idleTimerRef.current) {
        clearInterval(idleTimerRef.current);
      }
    };
  }, [isIdle, currentState]);

  // Reset on question change - return to idle and reset timer
  useEffect(() => {
    lastActivityRef.current = Date.now();
    setIsIdle(false);
    // Always return to idle when question changes
    setCurrentState('idle');
    setShowSpeechBubble(false);
  }, [questionId]);

  // 🎪 Easter egg - click counter
  const handleClick = useCallback(() => {
    setClickCount(prev => prev + 1);
    
    // Reset click count after 2 seconds of no clicks
    if (clickTimeoutRef.current) {
      clearTimeout(clickTimeoutRef.current);
    }
    clickTimeoutRef.current = setTimeout(() => {
      setClickCount(0);
    }, 2000);
    
    // Trigger easter egg after 5 rapid clicks
    if (clickCount >= 4) {
      setShowEasterEgg(true);
      setCurrentState('celebrate');
      
      // Randomize bubble variant (always center position)
      const variants: ('rounded' | 'sharp' | 'pill')[] = ['rounded', 'sharp', 'pill'];
      setBubbleVariant(variants[Math.floor(Math.random() * variants.length)]);
      // Always center to align with animation
      setBubblePosition('center');
      
      setSpeechMessage('Tu m\'as trouvé ! 🎉🎊');
      setShowSpeechBubble(true);
      
      setTimeout(() => {
        setShowEasterEgg(false);
        setShowSpeechBubble(false);
        setCurrentState('idle');
        setClickCount(0);
      }, 4000);
    }
  }, [clickCount]);

  // Determine which animation URL to load with random rotation
  const getAnimationUrl = useCallback(() => {
    if (isWelcome) return getRandomIdleAnimation(); // Random idle for welcome
    if (isCompletion) return specialAnimations.completion;
    if (isMilestone || showMilestone) return specialAnimations.milestone;
    
    // Use random rotation for idle and thinking states
    if (currentState === 'idle') {
      return getRandomIdleAnimation();
    }
    if (currentState === 'thinking') {
      return getRandomThinkingAnimation();
    }
    
    return getAnimationForSection(sectionId, currentState, false); // false = don't use random (already handled above)
  }, [sectionId, currentState, isWelcome, isCompletion, isMilestone, showMilestone]);

  // Helper to get animation index based on questionId (for rotation between 3 animations)
  const getAnimationIndex = useCallback((questionId: number, totalAnimations: number) => {
    // Use questionId to determine which animation to show (cycles through 3)
    return (questionId - 1) % totalAnimations;
  }, []);

  // Set initial animation on mount and when question changes
  useEffect(() => {
    // Set idle animation based on questionId (rotates between 3 idle animations)
    const idleIndex = getAnimationIndex(questionId, IDLE_ANIMATIONS.length);
    const idleUrl = IDLE_ANIMATIONS[idleIndex];
    setCurrentAnimationUrl(idleUrl);
    setIsLoading(false);
  }, [questionId, sectionId, getAnimationIndex]);
  
  // Switch animation when state changes (with smooth transitions and question-based rotation)
  useEffect(() => {
    let newAnimationUrl: string;
    
    // Use questionId to rotate between 3 animations for idle and thinking
    if (currentState === 'idle') {
      const idleIndex = getAnimationIndex(questionId, IDLE_ANIMATIONS.length);
      newAnimationUrl = IDLE_ANIMATIONS[idleIndex];
    } else if (currentState === 'thinking') {
      const thinkingIndex = getAnimationIndex(questionId, THINKING_ANIMATIONS.length);
      newAnimationUrl = THINKING_ANIMATIONS[thinkingIndex];
    } else {
      const section = sectionAnimations[sectionId] || sectionAnimations.informations;
      newAnimationUrl = section[currentState] || section.idle;
    }
    
    if (newAnimationUrl) {
      // Smooth transition: small delay for natural feel
      const transitionDelay = currentState === 'thinking' ? 200 : 100; // 200ms delay for thinking
      
      setTimeout(() => {
        setCurrentAnimationUrl(newAnimationUrl);
      }, transitionDelay);
    }
  }, [currentState, sectionId, questionId, getAnimationIndex]);

  // React to user answers with smooth timing (only happy/celebrate, not thinking)
  useEffect(() => {
    if (!autoReact || !lastAnswerEmoji) return;

    const reactionType = getReactionType(lastAnswerEmoji);
    
    // Only show happy for answers, but don't override thinking (thinking stays until next question)
    if (reactionType === 'happy') {
      // Don't override if thinking is currently showing
      if (currentState === 'thinking') {
        return; // Keep thinking animation until next question
      }
      
      // Small delay before switching (150ms for natural reaction feel)
      setTimeout(() => {
        console.log(`🎭 Animation switching to: ${reactionType} (emoji: ${lastAnswerEmoji})`);
        setCurrentState(reactionType);
        
        if (reactionTimeoutRef.current) {
          clearTimeout(reactionTimeoutRef.current);
        }
        
        // Return to idle after animation duration
        reactionTimeoutRef.current = setTimeout(() => {
          console.log('🎭 Animation returning to: idle');
          setCurrentState('idle');
        }, reactDuration);
      }, 150);
    }

    return () => {
      if (reactionTimeoutRef.current) {
        clearTimeout(reactionTimeoutRef.current);
      }
    };
  }, [lastAnswerEmoji, autoReact, reactDuration, currentState]);
  
  // Debug: Log state changes
  useEffect(() => {
    console.log(`🎭 Current animation state: ${currentState}`);
  }, [currentState]);

  // Note: DotLottieReact doesn't support speed control via ref, but hover effects are handled via CSS

  // Handle special states
  useEffect(() => {
    if (isCompletion || isMilestone) {
      setCurrentState('celebrate');
    }
  }, [isCompletion, isMilestone]);

  const sectionColor = getSectionColor();

  // Loading state
  if (isLoading) {
    return (
      <div className={`flex items-center justify-center ${className}`}>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex flex-col items-center gap-3"
        >
          <div 
            className="w-12 h-12 border-3 border-t-transparent rounded-full animate-spin"
            style={{ borderColor: `${sectionColor}40`, borderTopColor: sectionColor }}
          />
          <span className="text-gray-500 text-sm font-medium">Chargement...</span>
        </motion.div>
      </div>
    );
  }

  // Error state
  if (hasError) {
    return (
      <div className={`flex items-center justify-center ${className}`}>
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-gray-400 text-center p-4"
        >
          <div className="text-4xl mb-2">🎭</div>
          <p className="text-sm">Animation indisponible</p>
        </motion.div>
      </div>
    );
  }

  return (
    <motion.div
      className={`relative cursor-pointer flex items-center justify-center ${className}`}
      onClick={handleClick}
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ 
        opacity: 1, 
        scale: isHovering ? 1.08 : showEasterEgg ? 1.15 : 1,
        y: floatY + (isHovering ? -10 : 0),
        rotate: showEasterEgg ? [0, -5, 5, -5, 5, 0] : 0,
      }}
      transition={{ 
        type: 'spring', 
        stiffness: 300, 
        damping: 20,
        rotate: { duration: 0.5, repeat: showEasterEgg ? 2 : 0 }
      }}
      style={{ width: '1200px', height: '450px', minWidth: '1200px', minHeight: '450px' }}
    >
      {/* 🌈 Section Color Glow */}
      <div 
        className="absolute inset-0 rounded-full blur-3xl opacity-20 -z-10"
        style={{ 
          backgroundColor: sectionColor,
          transform: 'scale(1.2)',
        }}
      />

      {/* 💬 Enhanced Speech Bubble - Modern Design */}
      <AnimatePresence>
        {showSpeechBubble && (
          <motion.div
            initial={{ opacity: 0, scale: 0.7, y: 30, rotate: -5 }}
            animate={{ 
              opacity: 1, 
              scale: 1, 
              y: 0,
              rotate: 0,
            }}
            exit={{ 
              opacity: 0, 
              scale: 0.8, 
              y: -15,
              rotate: 2,
            }}
            transition={{ 
              type: 'spring', 
              stiffness: 400, 
              damping: 25,
              mass: 0.8,
            }}
            className="absolute -top-24 left-1/2 transform -translate-x-1/2 z-30 pointer-events-none"
            style={{ 
              minWidth: '220px', 
              maxWidth: '320px',
              // Ensure it's perfectly centered relative to the 1200px animation container
            }}
          >
            {/* Glassmorphism Container with Gradient */}
            <motion.div
              className={cn(
                "relative px-6 py-4 text-white font-semibold text-base text-center",
                "backdrop-blur-xl border border-white/20",
                "shadow-2xl overflow-hidden",
                bubbleVariant === 'rounded' && "rounded-2xl",
                bubbleVariant === 'sharp' && "rounded-xl",
                bubbleVariant === 'pill' && "rounded-full",
              )}
              style={{ 
                background: `linear-gradient(135deg, ${sectionColor}dd, ${sectionColor}bb)`,
                boxShadow: `0 20px 60px ${sectionColor}50, 0 0 0 1px ${sectionColor}30, inset 0 1px 0 rgba(255, 255, 255, 0.3)`,
              }}
            >
              {/* Subtle Shine Effect - Reduced frequency */}
              <motion.div
                className="absolute inset-0 z-0"
                style={{
                  background: 'linear-gradient(135deg, transparent 0%, rgba(255, 255, 255, 0.1) 50%, transparent 100%)',
                  width: '50%',
                  height: '100%',
                }}
                animate={{
                  x: ['-150%', '250%'],
                }}
                transition={{
                  duration: 6,
                  repeat: Infinity,
                  repeatDelay: 5,
                  ease: "easeInOut",
                }}
              />
              
              {/* Content - Simple and clean */}
              <span className="relative z-20 drop-shadow-md">
                {speechMessage}
              </span>
              
              {/* Speech bubble tail pointing down - Static, no animation */}
              <div 
                className="absolute -bottom-3 left-1/2 transform -translate-x-1/2 w-0 h-0"
                style={{
                  borderLeft: '12px solid transparent',
                  borderRight: '12px solid transparent',
                  borderTop: `12px solid ${sectionColor}dd`,
                  filter: `drop-shadow(0 4px 8px ${sectionColor}40)`,
                }}
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 🎯 Enhanced Milestone Celebration - Modern Design */}
      <AnimatePresence>
        {showMilestone && (
          <motion.div
            initial={{ opacity: 0, scale: 0.6, y: 40, rotate: -10 }}
            animate={{ 
              opacity: 1, 
              scale: 1, 
              y: 0,
              rotate: 0,
            }}
            exit={{ 
              opacity: 0, 
              scale: 0.8, 
              y: -20,
              rotate: 5,
            }}
            transition={{ 
              type: 'spring', 
              stiffness: 350, 
              damping: 22,
              mass: 0.9,
            }}
            className="absolute -top-36 left-1/2 transform -translate-x-1/2 z-40 pointer-events-none"
            style={{ minWidth: '280px', maxWidth: '380px' }}
          >
            {/* Glassmorphism Container with Animated Gradient */}
            <motion.div
              className="relative px-8 py-5 rounded-3xl backdrop-blur-xl border border-white/30 shadow-2xl text-white font-bold text-lg text-center overflow-hidden"
              style={{
                background: 'linear-gradient(135deg, rgba(251, 191, 36, 0.95), rgba(249, 115, 22, 0.95), rgba(236, 72, 153, 0.95))',
                boxShadow: '0 25px 80px rgba(251, 191, 36, 0.5), 0 0 0 1px rgba(255, 255, 255, 0.2), inset 0 1px 0 rgba(255, 255, 255, 0.4)',
              }}
              animate={{
                boxShadow: [
                  '0 25px 80px rgba(251, 191, 36, 0.5), 0 0 0 1px rgba(255, 255, 255, 0.2), inset 0 1px 0 rgba(255, 255, 255, 0.4)',
                  '0 30px 100px rgba(249, 115, 22, 0.6), 0 0 0 1px rgba(255, 255, 255, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.5)',
                  '0 25px 80px rgba(236, 72, 153, 0.5), 0 0 0 1px rgba(255, 255, 255, 0.2), inset 0 1px 0 rgba(255, 255, 255, 0.4)',
                ],
              }}
              transition={{
                duration: 4,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            >
              {/* Subtle Gradient Overlay - Reduced intensity */}
              <motion.div
                className="absolute inset-0"
                style={{
                  background: 'linear-gradient(135deg, transparent 0%, rgba(255, 255, 255, 0.08) 50%, transparent 100%)',
                  width: '50%',
                }}
                animate={{
                  x: ['-150%', '250%'],
                }}
                transition={{
                  duration: 6,
                  repeat: Infinity,
                  repeatDelay: 4,
                  ease: "easeInOut",
                }}
              />
              
              {/* Content */}
              <span className="relative z-10 drop-shadow-xl">
                {milestoneMessage}
              </span>
              
              {/* Animated Stars */}
              {[...Array(5)].map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute text-2xl"
                  style={{
                    left: `${15 + i * 18}%`,
                    top: i % 2 === 0 ? '10%' : '80%',
                  }}
                  animate={{
                    rotate: [0, 360],
                    scale: [1, 1.3, 1],
                    opacity: [0.7, 1, 0.7],
                  }}
                  transition={{
                    duration: 2 + i * 0.3,
                    repeat: Infinity,
                    delay: i * 0.2,
                    ease: "easeInOut",
                  }}
                >
                  {['⭐', '✨', '🌟', '💫', '⭐'][i]}
                </motion.div>
              ))}
              
              {/* Confetti particles */}
              {[...Array(8)].map((_, i) => (
                <motion.div
                  key={`confetti-${i}`}
                  className="absolute w-2 h-2 rounded-full"
                  style={{
                    left: `${10 + i * 12}%`,
                    top: '50%',
                    background: ['#FFD700', '#FF6B6B', '#4ECDC4', '#FFE66D'][i % 4],
                  }}
                  initial={{
                    y: 0,
                    opacity: 1,
                    scale: 1,
                  }}
                  animate={{
                    y: [-20, -60, -100],
                    x: [(Math.random() - 0.5) * 40],
                    opacity: [1, 0.8, 0],
                    scale: [1, 0.8, 0],
                    rotate: [0, 180, 360],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    delay: i * 0.15,
                    ease: "easeOut",
                  }}
                />
              ))}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Lottie Animation */}
      <AnimatePresence mode="wait">
        {currentAnimationUrl && (
          <motion.div
            key={`${sectionId}-${currentState}-${currentAnimationUrl}`}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
            className="w-[1200px] h-[450px] pointer-events-none"
            style={{
              filter: isHovering 
                ? `drop-shadow(0 20px 40px ${sectionColor}40)` 
                : showEasterEgg 
                  ? 'drop-shadow(0 0 30px gold)' 
                  : 'none',
            }}
          >
            <DotLottieReact
              src={currentAnimationUrl}
              loop
              autoplay
              style={{ 
                width: '100%', 
                height: '100%',
              }}
            />
          </motion.div>
        )}
      </AnimatePresence>


      {/* 🎪 Easter Egg Confetti */}
      <AnimatePresence>
        {showEasterEgg && (
          <>
            {[...Array(12)].map((_, i) => (
              <motion.div
                key={i}
                initial={{ 
                  opacity: 1, 
                  x: 0, 
                  y: 0,
                  scale: 1,
                }}
                animate={{ 
                  opacity: 0,
                  x: (Math.random() - 0.5) * 200,
                  y: -100 - Math.random() * 100,
                  scale: 0,
                  rotate: Math.random() * 360,
                }}
                transition={{ 
                  duration: 1.5,
                  delay: i * 0.05,
                  ease: 'easeOut',
                }}
                className="absolute top-1/2 left-1/2 text-2xl pointer-events-none"
              >
                {['🎉', '🎊', '⭐', '✨', '🌟', '💫'][i % 6]}
              </motion.div>
            ))}
          </>
        )}
      </AnimatePresence>

      {/* Subtle Interactive Hint */}
      {clickCount === 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 8, duration: 1 }}
          className="absolute bottom-4 left-1/2 transform -translate-x-1/2 z-10"
        >
          <motion.div
            animate={{
              scale: [1, 1.1, 1],
              opacity: [0.3, 0.6, 0.3]
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut"
            }}
            className="flex flex-col items-center gap-1"
          >
            <MousePointerClick 
              className="w-4 h-4 text-gray-400/60" 
              strokeWidth={2}
            />
            <motion.div
              animate={{
                width: [0, 20, 0],
                opacity: [0, 0.4, 0]
              }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                ease: "easeInOut",
                delay: 0.3
              }}
              className="h-0.5 bg-gray-400/40 rounded-full"
            />
          </motion.div>
        </motion.div>
      )}
    </motion.div>
  );
}

