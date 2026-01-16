// Question sections configuration
export interface QuestionSection {
  id: string;
  name: string;
  startQuestion: number;
  endQuestion: number;
  color: string;
  gradient: string;
  accent: string;
  description?: string;
  icon?: string;
}

// Section configuration - Total: 27 questions
// Section 1: Questions 1-2 (2 questions)
// Section 2: Questions 3-5 (3 questions)
// Section 3: Questions 6-9 (4 questions)
// Section 4: Questions 10-13 (4 questions)
// Section 5: Questions 14-16 (3 questions)
// Section 6: Questions 17-18 (2 questions)
// Section 7: Questions 19-24 (6 questions) - Connaissance & Perception de l'IA
// Section 8: Questions 25-27 (3 questions) - Communication IT
export const questionSections: QuestionSection[] = [
  {
    id: 'profil',
    name: 'Profil & Contexte Utilisateur',
    startQuestion: 1,
    endQuestion: 2, // Questions: 1, 2 (2 questions)
    color: '#094e86', // Dark Blue
    gradient: 'linear-gradient(216deg, rgba(219, 234, 254, 1) 16%, rgba(147, 197, 253, 1) 50%, rgba(59, 130, 246, 1) 82%, rgba(9, 78, 134, 1) 100%)',
    accent: '#094e86',
    description: 'Commençons par quelques informations sur votre profil',
    icon: '👤',
  },
  {
    id: 'experience',
    name: 'Expérience Utilisateur',
    startQuestion: 3,
    endQuestion: 5, // Questions: 3, 4, 5 (3 questions)
    color: '#10B981', // Emerald
    gradient: 'linear-gradient(216deg, rgba(209, 250, 229, 1) 16%, rgba(167, 243, 208, 1) 82%, rgba(110, 231, 183, 1) 100%)',
    accent: '#10B981',
    description: 'Partagez votre expérience avec notre équipe support IT',
    icon: '⭐',
  },
  {
    id: 'performance',
    name: 'Performance & Efficacité de la DSI',
    startQuestion: 6,
    endQuestion: 9, // Questions: 6, 7, 8, 9 (4 questions)
    color: '#264653', // Dark Teal
    gradient: 'linear-gradient(216deg, rgba(204, 251, 241, 1) 16%, rgba(153, 246, 228, 1) 50%, rgba(94, 234, 212, 1) 82%, rgba(38, 70, 83, 1) 100%)',
    accent: '#264653',
    description: 'Évaluez la performance et l\'efficacité de la DSI',
    icon: '⚡',
  },
  {
    id: 'outils',
    name: 'Outils & Expérience Digitale',
    startQuestion: 10,
    endQuestion: 13, // Questions: 10, 11, 12, 13 (4 questions)
    color: '#8B5CF6', // Violet
    gradient: 'linear-gradient(216deg, rgba(243, 232, 255, 1) 16%, rgba(233, 213, 255, 1) 82%, rgba(221, 214, 254, 1) 100%)',
    accent: '#8B5CF6',
    description: 'Explorons les outils et solutions digitales',
    icon: '🛠️',
  },
  {
    id: 'digitalisation',
    name: 'Digitalisation & Innovation',
    startQuestion: 14,
    endQuestion: 16, // Questions: 14, 15, 16 (3 questions)
    color: '#EC4899', // Pink
    gradient: 'linear-gradient(216deg, rgba(253, 244, 255, 1) 16%, rgba(250, 232, 255, 1) 82%, rgba(244, 114, 182, 1) 100%)',
    accent: '#EC4899',
    description: 'Votre vision de la digitalisation et de l\'innovation',
    icon: '🚀',
  },
  {
    id: 'securite',
    name: 'Sécurité & Cybersécurité',
    startQuestion: 17,
    endQuestion: 18, // Questions: 17, 18 (2 questions)
    color: '#F59E0B', // Amber
    gradient: 'linear-gradient(216deg, rgba(254, 243, 199, 1) 16%, rgba(253, 230, 138, 1) 82%, rgba(252, 211, 77, 1) 100%)',
    accent: '#F59E0B',
    description: 'Votre avis sur nos pratiques de sécurité et cybersécurité',
    icon: '🛡️',
  },
  {
    id: 'ia',
    name: 'Connaissance & Perception de l\'IA',
    startQuestion: 19,
    endQuestion: 24, // Questions: 19, 20, 21, 22, 23, 24 (6 questions)
    color: '#06B6D4', // Cyan - AI/Technology blue theme
    gradient: 'linear-gradient(216deg, rgba(207, 250, 254, 1) 16%, rgba(165, 243, 252, 1) 50%, rgba(103, 232, 249, 1) 82%, rgba(6, 182, 212, 1) 100%)',
    accent: '#06B6D4',
    description: 'Votre perception et attentes concernant l\'intelligence artificielle',
    icon: '🤖',
  },
  {
    id: 'communication',
    name: 'Communication IT',
    startQuestion: 25,
    endQuestion: 27, // Questions: 25, 26, 27 (3 questions)
    color: '#EF4444', // Red
    gradient: 'linear-gradient(216deg, rgba(254, 226, 226, 1) 16%, rgba(254, 202, 202, 1) 82%, rgba(252, 165, 165, 1) 100%)',
    accent: '#EF4444',
    description: 'Comment améliorer notre communication IT',
    icon: '💬',
  },
];

export function getSectionForQuestion(questionId: number): QuestionSection {
  return questionSections.find(
    (section) => questionId >= section.startQuestion && questionId <= section.endQuestion
  ) || questionSections[0];
}

export function getSectionIndex(questionId: number): number {
  return questionSections.findIndex(
    (section) => questionId >= section.startQuestion && questionId <= section.endQuestion
  );
}

// Helper function to get the number of questions in a section
export function getSectionQuestionCount(section: QuestionSection): number {
  return section.endQuestion - section.startQuestion + 1;
}

// Helper function to check if a question is the last in its section
export function isLastQuestionInSection(questionId: number): boolean {
  const section = getSectionForQuestion(questionId);
  return questionId === section.endQuestion;
}

