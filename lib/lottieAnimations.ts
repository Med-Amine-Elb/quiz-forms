// Lottie Animation Configuration for Quiz Sections
// You can easily swap animations by changing the URLs below

export interface SectionAnimation {
  idle: string;
  happy: string;
  thinking: string;
  celebrate: string;
}

export interface AnimationConfig {
  [key: string]: SectionAnimation;
}

// 🎨 DOTLOTTIE URLs (.lottie format - compressed and optimized)
// Using lottie.host URLs that work with DotLottieReact

// 🎭 IDLE ANIMATIONS - 3 options for random rotation (natural feeling, avoids loop)
export const IDLE_ANIMATIONS = [
  'https://lottie.host/33bf6a7c-c822-46b4-b02e-ffcbf109e32b/NI3Z798eoW.lottie', // Original idle
  'https://lottie.host/93822a2b-1387-4770-bc8c-b4da5be7f7b2/LgzYtoky7b.lottie', // Idle animation 2
  'https://lottie.host/7d3df4f4-9b51-46e1-a42d-5ee4ec022f9e/EvzQXjUyfs.lottie', // Idle animation 3
];

// 🤔 THINKING ANIMATIONS - 3 options for random rotation (natural feeling, avoids loop)
export const THINKING_ANIMATIONS = [
  'https://lottie.host/f55af313-e5c0-456f-89db-c69f9cc69cda/0PobA5XmsH.lottie', // Thinking animation 2 (original)
  'https://lottie.host/524c19d3-9032-4915-bbf7-56dfed530840/SvznB5Hfey.lottie', // Thinking animation 3
  'https://lottie.host/86566ed7-e38f-447a-b870-b32fdc6ed9ab/sJSwTV5ZYB.lottie', // Thinking animation 3
];

// 🎉 Celebrate animation - used after completing a section
const CELEBRATE_ANIMATION = 'https://lottie.host/581f4f96-c372-42e3-9367-f8acfea0251b/h1gIsT2zkd.lottie';

// Default animations (for backward compatibility)
const IDLE_ANIMATION = IDLE_ANIMATIONS[0]; // Default to first idle
const THINKING_ANIMATION = THINKING_ANIMATIONS[0]; // Default to first thinking

// For now, use IDLE for happy until you find a specific happy animation
const HAPPY_ANIMATION = IDLE_ANIMATION; // TODO: Find thumbs up animation

// 🎲 Helper function to get random animation from array
export function getRandomIdleAnimation(): string {
  return IDLE_ANIMATIONS[Math.floor(Math.random() * IDLE_ANIMATIONS.length)];
}

export function getRandomThinkingAnimation(): string {
  return THINKING_ANIMATIONS[Math.floor(Math.random() * THINKING_ANIMATIONS.length)];
}

// 🎨 MAIN ANIMATION CONFIG - Edit URLs here to change animations
export const sectionAnimations: AnimationConfig = {
  // 📋 Section 1: Informations Générales (Blue)
  informations: {
    idle: IDLE_ANIMATION,
    happy: HAPPY_ANIMATION,
    thinking: THINKING_ANIMATION,
    celebrate: CELEBRATE_ANIMATION,
  },

  // 🟢 Section 2: Support Utilisateur (Green)
  support: {
    idle: IDLE_ANIMATION,
    happy: HAPPY_ANIMATION,
    thinking: THINKING_ANIMATION,
    celebrate: CELEBRATE_ANIMATION,
  },

  // 💡 Section 3: Innovation et Transformation Digitale (Purple)
  innovation: {
    idle: IDLE_ANIMATION,
    happy: HAPPY_ANIMATION,
    thinking: THINKING_ANIMATION,
    celebrate: CELEBRATE_ANIMATION,
  },

  // 🔒 Section 4: Sécurité et Sensibilisation (Amber)
  securite: {
    idle: IDLE_ANIMATION,
    happy: HAPPY_ANIMATION,
    thinking: THINKING_ANIMATION,
    celebrate: CELEBRATE_ANIMATION,
  },

  // 💬 Section 5: Relation et Communication (Red)
  communication: {
    idle: IDLE_ANIMATION,
    happy: HAPPY_ANIMATION,
    thinking: THINKING_ANIMATION,
    celebrate: CELEBRATE_ANIMATION,
  },
};

// 🎊 Special animations for milestones and section completion
export const specialAnimations = {
  welcome: IDLE_ANIMATION,
  completion: CELEBRATE_ANIMATION, // Used when quiz is completed
  milestone: CELEBRATE_ANIMATION, // Used at progress milestones (30%, 50%, 75%, 90%)
  sectionComplete: CELEBRATE_ANIMATION, // Used after completing a section (after last question of section)
};

// Helper to get animation URL for a section with random rotation for idle/thinking
export function getAnimationForSection(
  sectionId: string,
  state: 'idle' | 'happy' | 'thinking' | 'celebrate' = 'idle',
  useRandomRotation: boolean = true
): string {
  const section = sectionAnimations[sectionId];
  if (!section) {
    // Default fallback with random rotation
    if (useRandomRotation && state === 'idle') {
      return getRandomIdleAnimation();
    }
    if (useRandomRotation && state === 'thinking') {
      return getRandomThinkingAnimation();
    }
    return sectionAnimations.informations.idle;
  }
  
  // Use random rotation for idle and thinking states
  if (useRandomRotation && state === 'idle') {
    return getRandomIdleAnimation();
  }
  if (useRandomRotation && state === 'thinking') {
    return getRandomThinkingAnimation();
  }
  
  return section[state];
}

// Emoji sentiment detection for reactions
export const positiveEmojis = ['😍', '⭐', '⚡', '🚀', '🏆', '✅', '✨', '👍', '👌', '🎓', '📚', '🛡️', '🔐'];
export const negativeEmojis = ['😕', '👎', '😔', '⚠️', '🤔', '❓', '🆘', '⏳'];

export function getReactionType(emoji?: string): 'happy' | 'thinking' | 'idle' {
  if (!emoji) return 'idle';
  if (positiveEmojis.some(e => emoji.includes(e))) return 'happy';
  if (negativeEmojis.some(e => emoji.includes(e))) return 'thinking';
  return 'idle';
}

