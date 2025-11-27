import { 
  Building2, 
  DollarSign, 
  ShoppingCart, 
  Megaphone, 
  Users, 
  Factory, 
  Truck, 
  Award, 
  Laptop, 
  Scale, 
  MessageSquare, 
  FlaskConical,
  Shield,
  ShoppingBag,
  FileCheck
} from 'lucide-react';

export interface QuestionChoice {
  id: string;
  label: string;
  icon?: typeof Building2;
}

export interface Question {
  id: number;
  type: 'choice' | 'text' | 'rating' | 'multiple' | 'satisfaction';
  question: string;
  choices?: QuestionChoice[];
  placeholder?: string;
  required?: boolean;
  maxLength?: number;
}

export const questions: Question[] = [
  // ============================================
  // SECTION 1: INFORMATIONS GÉNÉRALES
  // ============================================
  
  // Question 1 - Direction
  {
    id: 1,
    type: 'choice',
    question: 'A quelle direction êtes-vous rattaché(e) ?',
    choices: [
      { id: 'direction-1', label: 'Direction Générale', icon: Building2 },
      { id: 'direction-2', label: 'Direction des Ressources Humaines', icon: Users },
      { id: 'direction-3', label: 'Direction Financière et SI', icon: DollarSign },
      { id: 'direction-4', label: 'Direction Commerciale et Marketing', icon: ShoppingCart },
      { id: 'direction-5', label: 'Direction Industrielle', icon: Factory },
      { id: 'direction-6', label: 'Direction Juridique et RSE', icon: Scale },
      { id: 'direction-7', label: 'Direction Audit interne', icon: FileCheck },
      { id: 'direction-8', label: 'Direction Sureté', icon: Shield },
      { id: 'direction-9', label: 'Direction Logistique', icon: Truck },
      { id: 'direction-10', label: 'Direction Qualité', icon: Award },
      { id: 'direction-11', label: 'Direction des Achats', icon: ShoppingBag },
      { id: 'direction-12', label: 'Direction CDC', icon: Building2 },
    ],
    required: true,
  },

  // Question 2 - Temps d'intégration GBM
  {
    id: 2,
    type: 'choice',
    question: 'Depuis combien de temps avez-vous intégré GBM ?',
    choices: [
      { id: 'time-1', label: 'Moins d\'un an' },
      { id: 'time-2', label: 'Entre 1 an et 5 ans' },
      { id: 'time-3', label: 'Entre 5 ans et 10 ans' },
      { id: 'time-4', label: 'Plus de 10 ans' },
    ],
    required: true,
  },

  // ============================================
  // SECTION 2: RÉACTIVITÉ ET SUPPORT UTILISATEUR
  // ============================================

  // Question 3 - Transition Castel Connect
  {
    id: 3,
    type: 'choice',
    question: 'Avez-vous apprécié la transition du support utilisateur vers Castel Connect ?',
    choices: [
      { id: 'castel-1', label: 'J\'ai adoré, Castel Connect a grandement simplifié mon travail. Merci la team !' },
      { id: 'castel-2', label: 'J\'ai apprécié le changement et reconnais que la digitalisation a amélioré les process' },
      { id: 'castel-3', label: 'Je n\'ai pas trop apprécié, je trouve que Castel Connect a trop complexifié les choses' },
      { id: 'castel-4', label: 'Je n\'ai pas du tout apprécié, je veux revenir à l\'ancienne méthode' },
    ],
    required: true,
  },

  // Question 4 - Ressenti après demande support
  {
    id: 4,
    type: 'choice',
    question: 'Globalement, comment décririez-vous au mieux votre ressenti suite à une demande de support IT ?',
    choices: [
      { id: 'support-feel-1', label: 'Le besoin est toujours bien compris par la team support et la résolution répond tout à fait aux attentes' },
      { id: 'support-feel-2', label: 'Le besoin est compris mais la résolution ne répond pas toujours aux attentes' },
      { id: 'support-feel-3', label: 'L\'équipe support ne comprend pas toujours mon besoin' },
    ],
    required: true,
  },

  // Question 5 - Temps de résolution
  {
    id: 5,
    type: 'choice',
    question: 'Comment jugez-vous le temps nécessaire que met la DSI pour résoudre un problème informatique ?',
    choices: [
      { id: 'resolve-time-1', label: 'Super satisfaisant, bravo la team' },
      { id: 'resolve-time-2', label: 'Assez satisfaisant, je dois relancer plusieurs fois' },
      { id: 'resolve-time-3', label: 'Trop peu satisfaisant, le process doit être amélioré' },
    ],
    required: true,
  },

  // Question 6 - Amélioration du support
  {
    id: 6,
    type: 'text',
    question: 'Si la DSI devait améliorer un seul aspect de son support, lequel serait-ce ?',
    placeholder: 'Votre suggestion d\'amélioration...',
    required: false,
  },

  // Question 7 - Note globale support (satisfaction slider)
  {
    id: 7,
    type: 'satisfaction',
    question: 'Globalement, quelle note attribueriez-vous au support informatique GBM ?',
    required: true,
  },

  // ============================================
  // SECTION 3: INNOVATION ET TRANSFORMATION DIGITALE
  // ============================================

  // Question 8 - Priorité digitalisation
  {
    id: 8,
    type: 'choice',
    question: 'La digitalisation vous semble-t-elle être la priorité de votre DSI ?',
    choices: [
      { id: 'digital-priority-1', label: 'Oui, je sens qu\'il y a une réelle volonté à digitaliser les process et les nouveautés s\'enchaînent à pleine vitesse' },
      { id: 'digital-priority-2', label: 'J\'ai l\'impression qu\'il y a une volonté notable mais j\'encourage la DSI à faire davantage' },
      { id: 'digital-priority-3', label: 'Non, j\'ai l\'impression que la DSI se concentre sur des sujets qui lui sont propres plutôt que sur la digitalisation des process' },
    ],
    required: true,
  },

  // Question 9 - Niveau d'innovation
  {
    id: 9,
    type: 'choice',
    question: 'En terme d\'Innovation, si la DSI était une équipe de sport, à quel niveau la placeriez-vous ?',
    choices: [
      { id: 'innovation-1', label: 'Championne du monde' },
      { id: 'innovation-2', label: 'Ligue professionnelle' },
      { id: 'innovation-3', label: 'Amateur en progrès' },
      { id: 'innovation-4', label: 'Débutant en rodage' },
    ],
    required: true,
  },

  // Question 10 - Processus à digitaliser
  {
    id: 10,
    type: 'text',
    question: 'Quel processus métier devrait être digitalisé ou automatisé en priorité, selon vous ?',
    placeholder: 'Décrivez le processus...',
    required: false,
  },

  // Question 11 - Innovation personnalisée
  {
    id: 11,
    type: 'text',
    question: 'Si la DSI pouvait créer une innovation rien que pour vous, que demanderiez-vous ?',
    placeholder: 'Votre idée d\'innovation...',
    required: false,
  },

  // Question 12 - Ergonomie des outils
  {
    id: 12,
    type: 'choice',
    question: 'Que pensez-vous de l\'ergonomie des outils et logiciels fournis par la DSI ?',
    choices: [
      { id: 'ergo-1', label: 'Intuitifs' },
      { id: 'ergo-2', label: 'Moyennement pratiques' },
      { id: 'ergo-3', label: 'Complexes' },
    ],
    required: true,
  },

  // Question 13 - Outil trop complexe
  {
    id: 13,
    type: 'text',
    question: 'Quel est l\'outil que vous jugez trop complexe ?',
    placeholder: 'Nom de l\'outil...',
    required: false,
  },

  // Question 14 - Outil le plus frustrant
  {
    id: 14,
    type: 'choice',
    question: 'Quel outil trouvez-vous le plus frustrant à utiliser ?',
    choices: [
      { id: 'frustrating-1', label: 'SAP' },
      { id: 'frustrating-2', label: 'Assabil' },
      { id: 'frustrating-3', label: 'AGIRH' },
      { id: 'frustrating-4', label: 'Castel Connect' },
      { id: 'frustrating-5', label: 'Suite Microsoft' },
      { id: 'frustrating-6', label: 'Aucun' },
      { id: 'frustrating-7', label: 'Autre' },
    ],
    required: true,
  },

  // Question 15 - Suggestion d'amélioration outil
  {
    id: 15,
    type: 'text',
    question: 'Que suggéreriez-vous pour améliorer cet outil ?',
    placeholder: 'Vos suggestions d\'amélioration...',
    required: false,
  },

  // Question 16 - Fréquence des solutions de contournement
  {
    id: 16,
    type: 'choice',
    question: 'À quelle fréquence avez-vous recours à des solutions de contournement parce que les outils fournis ne répondent pas totalement à vos besoins ?',
    choices: [
      { id: 'workaround-1', label: 'Jamais' },
      { id: 'workaround-2', label: 'Rarement' },
      { id: 'workaround-3', label: 'Souvent' },
      { id: 'workaround-4', label: 'Tout le temps' },
    ],
    required: true,
  },

  // Question 17 - Fonctionnalité manquante
  {
    id: 17,
    type: 'text',
    question: 'Quelle fonctionnalité manque-t-il cruellement à votre outil principal ?',
    placeholder: 'Décrivez la fonctionnalité...',
    required: false,
  },

  // ============================================
  // SECTION 4: SÉCURITÉ ET SENSIBILISATION
  // ============================================

  // Question 18 - Implication protection données
  {
    id: 18,
    type: 'choice',
    question: 'Dans quelle mesure vous sentez-vous impliqué(e) dans la protection des données de l\'entreprise ?',
    choices: [
      { id: 'data-protection-1', label: 'Beaucoup' },
      { id: 'data-protection-2', label: 'Un peu' },
      { id: 'data-protection-3', label: 'Pas du tout' },
    ],
    required: true,
  },

  // Question 19 - Hésitation sécurité
  {
    id: 19,
    type: 'choice',
    question: 'Avez-vous déjà rencontré une situation où vous avez hésité sur la démarche à suivre en matière de sécurité informatique ?',
    choices: [
      { id: 'security-hesitation-1', label: 'Oui' },
      { id: 'security-hesitation-2', label: 'Non' },
    ],
    required: true,
  },

  // Question 20 - Expérience sécurité
  {
    id: 20,
    type: 'text',
    question: 'Pouvez-vous décrire brièvement l\'expérience ?',
    placeholder: 'Décrivez votre expérience...',
    required: false,
  },

  // Question 21 - Niveau cybersécurité
  {
    id: 21,
    type: 'choice',
    question: 'Comment jugeriez-vous de votre niveau à évaluer des risques de cybersécurité ?',
    choices: [
      { id: 'cyber-level-1', label: 'Je suis très bien formé et devrais être le référent du Groupe à ce sujet' },
      { id: 'cyber-level-2', label: 'J\'ai suivi toutes les formations de cybersécurité et pense être à jour' },
      { id: 'cyber-level-3', label: 'Je tâtonne et pense qu\'on doit me former à ce sujet' },
    ],
    required: true,
  },

  // ============================================
  // SECTION 5: RELATION ET COMMUNICATION
  // ============================================

  // Question 22 - Préférence communication
  {
    id: 22,
    type: 'choice',
    question: 'Comment préférez-vous être informé(e) des nouveautés et des changements IT ?',
    choices: [
      { id: 'communication-1', label: 'Email' },
      { id: 'communication-2', label: 'Réunion' },
      { id: 'communication-3', label: 'Vidéo explicative' },
      { id: 'communication-4', label: 'Autre' },
    ],
    required: true,
  },

  // Question 23 - Message libre
  {
    id: 23,
    type: 'text',
    question: 'Un message libre pour l\'équipe IT ?',
    placeholder: 'Votre message...',
    required: false,
  },
];

