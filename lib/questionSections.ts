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

export const questionSections: QuestionSection[] = [
  {
    id: 'profil',
    name: 'Profil & Contexte Utilisateur',
    startQuestion: 1,
    endQuestion: 2,
    color: '#0EA5E9', // Sky Blue
    gradient: 'linear-gradient(216deg, rgba(224, 242, 254, 1) 16%, rgba(186, 230, 253, 1) 82%, rgba(125, 211, 252, 1) 100%)',
    accent: '#0EA5E9',
    description: 'Commençons par quelques informations sur votre profil',
    icon: '👤',
  },
  {
    id: 'experience',
    name: 'Expérience Utilisateur',
    startQuestion: 3,
    endQuestion: 5,
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
    endQuestion: 9,
    color: '#3B82F6', // Blue
    gradient: 'linear-gradient(216deg, rgba(219, 234, 254, 1) 16%, rgba(191, 219, 254, 1) 82%, rgba(147, 197, 253, 1) 100%)',
    accent: '#3B82F6',
    description: 'Évaluez la performance et l\'efficacité de la DSI',
    icon: '⚡',
  },
  {
    id: 'outils',
    name: 'Outils & Expérience Digitale',
    startQuestion: 10,
    endQuestion: 13,
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
    endQuestion: 16,
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
    endQuestion: 18,
    color: '#F59E0B', // Amber
    gradient: 'linear-gradient(216deg, rgba(254, 243, 199, 1) 16%, rgba(253, 230, 138, 1) 82%, rgba(252, 211, 77, 1) 100%)',
    accent: '#F59E0B',
    description: 'Votre avis sur nos pratiques de sécurité et cybersécurité',
    icon: '🛡️',
  },
  {
    id: 'communication',
    name: 'Communication IT',
    startQuestion: 19,
    endQuestion: 21,
    color: '#EF4444', // Red
    gradient: 'linear-gradient(216deg, rgba(254, 226, 226, 1) 16%, rgba(254, 202, 202, 1) 82%, rgba(252, 165, 165, 1) 100%)',
    accent: '#EF4444',
    description: 'Comment améliorer notre communication IT',
    icon: '💬',
  },
  {
    id: 'ia',
    name: 'Connaissance & Perception de l\'IA',
    startQuestion: 22,
    endQuestion: 27,
    color: '#06B6D4', // Cyan
    gradient: 'linear-gradient(216deg, rgba(207, 250, 254, 1) 16%, rgba(165, 243, 252, 1) 82%, rgba(103, 232, 249, 1) 100%)',
    accent: '#06B6D4',
    description: 'Votre perception et attentes concernant l\'intelligence artificielle',
    icon: '🤖',
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

