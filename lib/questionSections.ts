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
    id: 'informations',
    name: 'Informations Générales',
    startQuestion: 1,
    endQuestion: 2,
    color: '#0EA5E9', // Sky Blue
    gradient: 'linear-gradient(216deg, rgba(224, 242, 254, 1) 16%, rgba(186, 230, 253, 1) 82%, rgba(125, 211, 252, 1) 100%)',
    accent: '#0EA5E9',
    description: 'Commençons par quelques informations de base',
    icon: '📋',
  },
  {
    id: 'support',
    name: 'Réactivité et Support Utilisateur',
    startQuestion: 3,
    endQuestion: 7,
    color: '#10B981', // Emerald
    gradient: 'linear-gradient(216deg, rgba(209, 250, 229, 1) 16%, rgba(167, 243, 208, 1) 82%, rgba(110, 231, 183, 1) 100%)',
    accent: '#10B981',
    description: 'Partagez votre expérience avec notre équipe support IT',
    icon: '🟢',
  },
  {
    id: 'innovation',
    name: 'Innovation et Transformation Digitale',
    startQuestion: 8,
    endQuestion: 17,
    color: '#8B5CF6', // Violet
    gradient: 'linear-gradient(216deg, rgba(243, 232, 255, 1) 16%, rgba(233, 213, 255, 1) 82%, rgba(221, 214, 254, 1) 100%)',
    accent: '#8B5CF6',
    description: 'Explorons les outils et solutions digitales',
    icon: '💡',
  },
  {
    id: 'securite',
    name: 'Sécurité et Sensibilisation',
    startQuestion: 18,
    endQuestion: 21,
    color: '#F59E0B', // Amber
    gradient: 'linear-gradient(216deg, rgba(254, 243, 199, 1) 16%, rgba(253, 230, 138, 1) 82%, rgba(252, 211, 77, 1) 100%)',
    accent: '#F59E0B',
    description: 'Votre avis sur nos pratiques de sécurité',
    icon: '🔒',
  },
  {
    id: 'communication',
    name: 'Relation et Communication',
    startQuestion: 22,
    endQuestion: 23,
    color: '#EF4444', // Red
    gradient: 'linear-gradient(216deg, rgba(254, 226, 226, 1) 16%, rgba(254, 202, 202, 1) 82%, rgba(252, 165, 165, 1) 100%)',
    accent: '#EF4444',
    description: 'Comment améliorer notre communication',
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

