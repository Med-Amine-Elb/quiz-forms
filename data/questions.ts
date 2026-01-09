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
  emoji?: string;
  title?: string;
  description?: string;
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
  // SECTION 1: PROFIL & CONTEXTE UTILISATEUR
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
    question: 'Depuis combien de temps avez-vous intégré l\'entreprise ?',
    choices: [
      { 
        id: 'time-1', 
        label: 'Moins d\'un an',
        emoji: '🌟',
        title: 'Moins d\'un an',
        description: 'Nouveau collaborateur'
      },
      { 
        id: 'time-2', 
        label: 'Entre 1 an et 5 ans',
        emoji: '💼',
        title: '1 à 5 ans',
        description: 'Collaborateur confirmé'
      },
      { 
        id: 'time-3', 
        label: 'Entre 5 ans et 10 ans',
        emoji: '🎯',
        title: '5 à 10 ans',
        description: 'Collaborateur expérimenté'
      },
      { 
        id: 'time-4', 
        label: 'Plus de 10 ans',
        emoji: '👑',
        title: 'Plus de 10 ans',
        description: 'Collaborateur senior'
      },
    ],
    required: true,
  },

  // ============================================
  // SECTION 2: EXPÉRIENCE UTILISATEUR
  // ============================================

  // Question 3 - Réponse aux besoins quotidiens Castel Connect
  {
    id: 3,
    type: 'choice',
    question: 'Dans quelle mesure le dispositif castel connect de support IT répond-il à vos besoins quotidiens ?',
    choices: [
      { 
        id: 'castel-needs-1', 
        label: 'Le dispositif répond pleinement à mes besoins quotidiens',
        emoji: '✅',
        title: 'Répond pleinement',
        description: 'Le dispositif répond pleinement à mes besoins quotidiens'
      },
      { 
        id: 'castel-needs-2', 
        label: 'Le service couvre la majorité de mes attentes métiers',
        emoji: '👍',
        title: 'Couvre la majorité',
        description: 'Le service couvre la majorité de mes attentes métiers'
      },
      { 
        id: 'castel-needs-3', 
        label: 'Le dispositif répond à certains besoins, mais des améliorations sont nécessaires',
        emoji: '⚖️',
        title: 'Améliorations nécessaires',
        description: 'Le dispositif répond à certains besoins, mais des améliorations sont nécessaires'
      },
      { 
        id: 'castel-needs-4', 
        label: 'Le service répond faiblement à mes attentes opérationnelles',
        emoji: '⚠️',
        title: 'Répond faiblement',
        description: 'Le service répond faiblement à mes attentes opérationnelles'
      },
      { 
        id: 'castel-needs-5', 
        label: 'Le dispositif ne répond pas à mes besoins quotidiens',
        emoji: '❌',
        title: 'Ne répond pas',
        description: 'Le dispositif ne répond pas à mes besoins quotidiens'
      },
    ],
    required: true,
  },

  // Question 4 - Facilité d'utilisation du canal de support IT
  {
    id: 4,
    type: 'choice',
    question: 'Comment évaluez-vous la facilité d\'utilisation du canal de support IT ?',
    choices: [
      { 
        id: 'support-ease-1', 
        label: 'Accès intuitif, démarches claires et suivi fluide des demandes',
        emoji: '🌟',
        title: 'Intuitif et fluide',
        description: 'Accès intuitif, démarches claires et suivi fluide des demandes'
      },
      { 
        id: 'support-ease-2', 
        label: 'Utilisation globalement simple avec peu de contraintes',
        emoji: '👍',
        title: 'Simple',
        description: 'Utilisation globalement simple avec peu de contraintes'
      },
      { 
        id: 'support-ease-3', 
        label: 'Acceptable mais quelques améliorations nécessaires',
        emoji: '⚖️',
        title: 'Acceptable',
        description: 'Acceptable mais quelques améliorations nécessaires'
      },
      { 
        id: 'support-ease-4', 
        label: 'Accès ou suivi peu clairs, expérience complexe',
        emoji: '⚠️',
        title: 'Complexe',
        description: 'Accès ou suivi peu clairs, expérience complexe'
      },
      { 
        id: 'support-ease-5', 
        label: 'Parcours compliqué et manque de visibilité sur les demandes',
        emoji: '❌',
        title: 'Très compliqué',
        description: 'Parcours compliqué et manque de visibilité sur les demandes'
      },
    ],
    required: true,
  },

  // Question 5 - Ressenti suite à une demande de support IT
  {
    id: 5,
    type: 'choice',
    question: 'Globalement, comment décririez-vous votre ressenti suite à une demande de support IT ?',
    choices: [
      { 
        id: 'support-feel-1', 
        label: 'Problème résolu rapidement et efficacement',
        emoji: '😄',
        title: 'Résolu rapidement',
        description: 'Problème résolu rapidement et efficacement'
      },
      { 
        id: 'support-feel-2', 
        label: 'Résolution correcte, mais quelques points à améliorer',
        emoji: '🙂',
        title: 'Correct',
        description: 'Résolution correcte, mais quelques points à améliorer'
      },
      { 
        id: 'support-feel-3', 
        label: 'Résolution moyenne, expérience mitigée',
        emoji: '😐',
        title: 'Moyen',
        description: 'Résolution moyenne, expérience mitigée'
      },
      { 
        id: 'support-feel-4', 
        label: 'Résolution lente ou insatisfaisante',
        emoji: '🙁',
        title: 'Insatisfaisant',
        description: 'Résolution lente ou insatisfaisante'
      },
      { 
        id: 'support-feel-5', 
        label: 'Problème non résolu ou support inefficace',
        emoji: '😡',
        title: 'Non résolu',
        description: 'Problème non résolu ou support inefficace'
      },
    ],
    required: true,
  },

  // Question 6 - Temps de résolution DSI
  {
    id: 6,
    type: 'choice',
    question: 'Comment jugez-vous le temps nécessaire à la DSI pour résoudre un problème informatique ?',
    choices: [
      { 
        id: 'resolve-time-1', 
        label: 'Résolution quasi immédiate',
        emoji: '⚡',
        title: 'Quasi immédiate',
        description: 'Résolution quasi immédiate'
      },
      { 
        id: 'resolve-time-2', 
        label: 'Délai correct et satisfaisant',
        emoji: '👍',
        title: 'Correct',
        description: 'Délai correct et satisfaisant'
      },
      { 
        id: 'resolve-time-3', 
        label: 'Délai raisonnable mais améliorable',
        emoji: '⏳',
        title: 'Améliorable',
        description: 'Délai raisonnable mais améliorable'
      },
      { 
        id: 'resolve-time-4', 
        label: 'Délai long, impactant l\'activité',
        emoji: '🐢',
        title: 'Trop long',
        description: 'Délai long, impactant l\'activité'
      },
    ],
    required: true,
  },

  // Question 7 - Aspects impactant l'activité
  {
    id: 7,
    type: 'multiple',
    question: 'Quels aspects de la performance de la DSI impactent le plus votre activité quotidienne ?',
    choices: [
      { 
        id: 'impact-1', 
        label: 'Temps de réponse aux demandes',
        emoji: '⏱️',
        title: 'Temps de réponse',
        description: 'Temps de réponse aux demandes'
      },
      { 
        id: 'impact-2', 
        label: 'Qualité de la communication et suivi',
        emoji: '📞',
        title: 'Communication',
        description: 'Qualité de la communication et suivi'
      },
      { 
        id: 'impact-3', 
        label: 'Efficacité des solutions apportées',
        emoji: '🛠️',
        title: 'Efficacité',
        description: 'Efficacité des solutions apportées'
      },
      { 
        id: 'impact-4', 
        label: 'Disponibilité des ressources IT',
        emoji: '👥',
        title: 'Disponibilité',
        description: 'Disponibilité des ressources IT'
      },
      { 
        id: 'impact-5', 
        label: 'Simplicité et ergonomie des outils',
        emoji: '⚙️',
        title: 'Ergonomie',
        description: 'Simplicité et ergonomie des outils'
      },
    ],
    required: true,
  },

  // Question 8 - Amélioration du support
  {
    id: 8,
    type: 'choice',
    question: 'Si la DSI devait améliorer un seul aspect de son support, lequel serait-ce ?',
    choices: [
      { 
        id: 'improve-1', 
        label: 'Résolution plus rapide des demandes',
        emoji: '⚡',
        title: 'Rapidité',
        description: 'Résolution plus rapide des demandes'
      },
      { 
        id: 'improve-2', 
        label: 'Solutions plus précises et efficaces',
        emoji: '🎯',
        title: 'Précision',
        description: 'Solutions plus précises et efficaces'
      },
      { 
        id: 'improve-3', 
        label: 'Plus d\'accessibilité aux agents IT',
        emoji: '👥',
        title: 'Accessibilité',
        description: 'Plus d\'accessibilité aux agents IT'
      },
      { 
        id: 'improve-4', 
        label: 'Interfaces et systèmes plus faciles à utiliser',
        emoji: '🖥️',
        title: 'Simplicité',
        description: 'Interfaces et systèmes plus faciles à utiliser'
      },
      { 
        id: 'improve-5', 
        label: 'Renforcer les compétences des utilisateurs',
        emoji: '📚',
        title: 'Formation',
        description: 'Renforcer les compétences des utilisateurs'
      },
    ],
    required: true,
  },

  // Question 9 - Note globale support informatique
  {
    id: 9,
    type: 'satisfaction',
    question: 'Globalement, quelle note attribueriez-vous au support informatique ?',
    required: true,
  },

  // ============================================
  // SECTION 3: PERFORMANCE & EFFICACITÉ DE LA DSI
  // ============================================
  // (Les questions 6-9 sont déjà dans cette section)

  // ============================================
  // SECTION 4: OUTILS & EXPÉRIENCE DIGITALE
  // ============================================

  // Question 10 - Ergonomie des outils
  {
    id: 10,
    type: 'choice',
    question: 'Que pensez-vous de l\'ergonomie des outils et logiciels fournis par la DSI ?',
    choices: [
      { 
        id: 'ergo-1', 
        label: 'Très ergonomiques : Interface intuitive, navigation fluide',
        emoji: '🌟',
        title: 'Très ergonomiques',
        description: 'Interface intuitive, navigation fluide'
      },
      { 
        id: 'ergo-2', 
        label: 'Ergonomiques : Faciles à utiliser, mais quelques améliorations possibles',
        emoji: '👍',
        title: 'Ergonomiques',
        description: 'Faciles à utiliser, mais quelques améliorations possibles'
      },
      { 
        id: 'ergo-3', 
        label: 'Moyennement ergonomiques : Utilisation acceptable mais parfois complexe',
        emoji: '⚖️',
        title: 'Moyennement ergonomiques',
        description: 'Utilisation acceptable mais parfois complexe'
      },
      { 
        id: 'ergo-4', 
        label: 'Peu ergonomiques : Navigation difficile, impact sur la productivité',
        emoji: '⚠️',
        title: 'Peu ergonomiques',
        description: 'Navigation difficile, impact sur la productivité'
      },
      { 
        id: 'ergo-5', 
        label: 'Pas ergonomiques du tout : Interfaces compliquées, expérience frustrante',
        emoji: '❌',
        title: 'Pas ergonomiques',
        description: 'Interfaces compliquées, expérience frustrante'
      },
    ],
    required: true,
  },

  // Question 11 - Outil le plus frustrant
  {
    id: 11,
    type: 'choice',
    question: 'Quel outil trouvez-vous le plus frustrant à utiliser ?',
    choices: [
      { id: 'frustrating-1', label: 'SAP', emoji: '💼' },
      { id: 'frustrating-2', label: 'Caisse', emoji: '💰' },
      { id: 'frustrating-3', label: 'Assabil', emoji: '📊' },
      { id: 'frustrating-4', label: 'Cosmos', emoji: '🌌' },
      { id: 'frustrating-5', label: 'Agirh', emoji: '👤' },
      { id: 'frustrating-6', label: 'Suite Microsoft', emoji: '🪟' },
      { id: 'frustrating-7', label: 'Outil ticketing', emoji: '🎫' },
      { id: 'frustrating-8', label: 'Autre', emoji: '🔧' },
    ],
    required: true,
  },

  // Question 12 - Outils ou fonctionnalités facilitant la vie
  {
    id: 12,
    type: 'choice',
    question: 'Quels outils ou fonctionnalités vous faciliteraient le plus la vie au quotidien ?',
    choices: [
      { 
        id: 'facilitate-1', 
        label: 'Amélioration de SAP / ERP',
        emoji: '💼',
        title: 'SAP / ERP',
        description: 'Amélioration de SAP / ERP'
      },
      { 
        id: 'facilitate-2', 
        label: 'Dashboards plus interactifs et clairs',
        emoji: '📊',
        title: 'Dashboards',
        description: 'Dashboards plus interactifs et clairs'
      },
      { 
        id: 'facilitate-3', 
        label: 'Outil de ticketing plus rapide et suivi transparent',
        emoji: '🎫',
        title: 'Outil ticketing',
        description: 'Outil de ticketing plus rapide et suivi transparent'
      },
      { 
        id: 'facilitate-4', 
        label: 'Outils de caisse plus intuitifs',
        emoji: '💰',
        title: 'Outils de caisse',
        description: 'Outils de caisse plus intuitifs'
      },
      { 
        id: 'facilitate-5', 
        label: 'Autre',
        emoji: '🔧',
        title: 'Autre',
        description: 'Autre'
      },
    ],
    required: true,
  },

  // Question 13 - Fonctionnalité manquante
  {
    id: 13,
    type: 'text',
    question: 'Quelle fonctionnalité manque-t-il cruellement à votre outil principal ?',
    placeholder: 'Décrivez la fonctionnalité ou amélioration souhaitée...',
    required: false,
  },

  // ============================================
  // SECTION 5: DIGITALISATION & INNOVATION
  // ============================================

  // Question 14 - Supports interactifs IT
  {
    id: 14,
    type: 'choice',
    question: 'Souhaiteriez-vous plus de supports interactifs pour mieux comprendre les outils IT ?',
    choices: [
      { 
        id: 'support-interactive-1', 
        label: 'Vidéos courtes et tutos',
        emoji: '🎥',
        title: 'Vidéos',
        description: 'Vidéos courtes et tutos'
      },
      { 
        id: 'support-interactive-2', 
        label: 'Guides et FAQ',
        emoji: '📝',
        title: 'Guides',
        description: 'Guides et FAQ'
      },
      { 
        id: 'support-interactive-3', 
        label: 'Ateliers et démonstrations',
        emoji: '🗣️',
        title: 'Ateliers',
        description: 'Ateliers et démonstrations'
      },
      { 
        id: 'support-interactive-4', 
        label: 'Je préfère l\'info actuelle',
        emoji: '❌',
        title: 'Info actuelle',
        description: 'Je préfère l\'info actuelle'
      },
    ],
    required: true,
  },

  // Question 15 - Information sur changements IT
  {
    id: 15,
    type: 'choice',
    question: 'Avez-vous l\'impression d\'être suffisamment informé(e) sur les changements IT impactant votre travail ?',
    choices: [
      { 
        id: 'info-changes-1', 
        label: 'Je reçois toutes les infos nécessaires',
        emoji: '✅',
        title: 'Bien informé',
        description: 'Je reçois toutes les infos nécessaires'
      },
      { 
        id: 'info-changes-2', 
        label: 'Quelques informations manquent parfois',
        emoji: '🙂',
        title: 'Presque complet',
        description: 'Quelques informations manquent parfois'
      },
      { 
        id: 'info-changes-3', 
        label: 'Informations partielles ou tardives',
        emoji: '⚖️',
        title: 'Partiel',
        description: 'Informations partielles ou tardives'
      },
      { 
        id: 'info-changes-4', 
        label: 'Beaucoup d\'informations manquantes',
        emoji: '🙁',
        title: 'Insuffisant',
        description: 'Beaucoup d\'informations manquantes'
      },
    ],
    required: true,
  },

  // Question 16 - Message libre pour l'équipe IT
  {
    id: 16,
    type: 'text',
    question: 'Un message libre ou suggestion pour l\'équipe IT ?',
    placeholder: 'Vos idées ou retours pour améliorer la communication...',
    required: false,
  },

  // ============================================
  // SECTION 6: SÉCURITÉ & CYBERSÉCURITÉ
  // ============================================

  // Question 17 - Compétences cybersécurité
  {
    id: 17,
    type: 'choice',
    question: 'Comment jugez-vous vos compétences pour identifier et réagir face aux risques de cybersécurité ?',
    choices: [
      { 
        id: 'cyber-skills-1', 
        label: 'Je détecte rapidement les risques et sais réagir efficacement',
        emoji: '🛡️',
        title: 'Expert',
        description: 'Je détecte rapidement les risques et sais réagir efficacement'
      },
      { 
        id: 'cyber-skills-2', 
        label: 'Je connais les bases et peux gérer la majorité des situations',
        emoji: '👍',
        title: 'Compétent',
        description: 'Je connais les bases et peux gérer la majorité des situations'
      },
      { 
        id: 'cyber-skills-3', 
        label: 'Je connais quelques notions mais reste prudent(e)',
        emoji: '⚖️',
        title: 'Prudent',
        description: 'Je connais quelques notions mais reste prudent(e)'
      },
      { 
        id: 'cyber-skills-4', 
        label: 'Je manque de connaissances pour agir efficacement',
        emoji: '⚠️',
        title: 'Limité',
        description: 'Je manque de connaissances pour agir efficacement'
      },
      { 
        id: 'cyber-skills-5', 
        label: 'Je ne me sens pas capable de détecter ni gérer les risques',
        emoji: '❌',
        title: 'Incapable',
        description: 'Je ne me sens pas capable de détecter ni gérer les risques'
      },
    ],
    required: true,
  },

  // Question 18 - Actions prioritaires cybersécurité
  {
    id: 18,
    type: 'choice',
    question: 'Selon vous, quelles actions devraient être priorisées pour renforcer la cybersécurité dans l\'entreprise ?',
    choices: [
      { 
        id: 'cyber-priority-1', 
        label: 'Renforcer la protection des données sensibles',
        emoji: '🔒',
        title: 'Protection données',
        description: 'Renforcer la protection des données sensibles'
      },
      { 
        id: 'cyber-priority-2', 
        label: 'Sécuriser les postes et logiciels',
        emoji: '💻',
        title: 'Sécurisation postes',
        description: 'Sécuriser les postes et logiciels'
      },
      { 
        id: 'cyber-priority-3', 
        label: 'Former et sensibiliser les utilisateurs régulièrement',
        emoji: '📚',
        title: 'Formation',
        description: 'Former et sensibiliser les utilisateurs régulièrement'
      },
      { 
        id: 'cyber-priority-4', 
        label: 'Améliorer la communication et les alertes sécurité',
        emoji: '📢',
        title: 'Communication',
        description: 'Améliorer la communication et les alertes sécurité'
      },
      { 
        id: 'cyber-priority-5', 
        label: 'Autre',
        emoji: '🔧',
        title: 'Autre',
        description: 'Autre'
      },
    ],
    required: true,
  },

  // ============================================
  // SECTION 7: COMMUNICATION IT
  // ============================================

  // Question 19 - Supports interactifs IT
  {
    id: 19,
    type: 'choice',
    question: 'Souhaiteriez-vous plus de supports interactifs pour mieux comprendre les outils IT ?',
    choices: [
      { 
        id: 'support-interactive-1', 
        label: 'Vidéos courtes et tutos',
        emoji: '🎥',
        title: 'Vidéos',
        description: 'Vidéos courtes et tutos'
      },
      { 
        id: 'support-interactive-2', 
        label: 'Guides et FAQ',
        emoji: '📝',
        title: 'Guides',
        description: 'Guides et FAQ'
      },
      { 
        id: 'support-interactive-3', 
        label: 'Ateliers et démonstrations',
        emoji: '🗣️',
        title: 'Ateliers',
        description: 'Ateliers et démonstrations'
      },
      { 
        id: 'support-interactive-4', 
        label: 'Je préfère l\'info actuelle',
        emoji: '❌',
        title: 'Info actuelle',
        description: 'Je préfère l\'info actuelle'
      },
    ],
    required: true,
  },

  // Question 20 - Information sur changements IT
  {
    id: 20,
    type: 'choice',
    question: 'Avez-vous l\'impression d\'être suffisamment informé(e) sur les changements IT impactant votre travail ?',
    choices: [
      { 
        id: 'info-changes-1', 
        label: 'Je reçois toutes les infos nécessaires',
        emoji: '✅',
        title: 'Bien informé',
        description: 'Je reçois toutes les infos nécessaires'
      },
      { 
        id: 'info-changes-2', 
        label: 'Quelques informations manquent parfois',
        emoji: '🙂',
        title: 'Presque complet',
        description: 'Quelques informations manquent parfois'
      },
      { 
        id: 'info-changes-3', 
        label: 'Informations partielles ou tardives',
        emoji: '⚖️',
        title: 'Partiel',
        description: 'Informations partielles ou tardives'
      },
      { 
        id: 'info-changes-4', 
        label: 'Beaucoup d\'informations manquantes',
        emoji: '🙁',
        title: 'Insuffisant',
        description: 'Beaucoup d\'informations manquantes'
      },
    ],
    required: true,
  },

  // Question 21 - Message libre pour l'équipe IT
  {
    id: 21,
    type: 'text',
    question: 'Un message libre ou suggestion pour l\'équipe IT ?',
    placeholder: 'Vos idées ou retours pour améliorer la communication...',
    required: false,
  },

  // ============================================
  // SECTION 8: CONNAISSANCE & PERCEPTION DE L'IA
  // ============================================

  // Question 22 - Ouverture aux outils IA
  {
    id: 22,
    type: 'choice',
    question: 'Seriez-vous ouvert(e) à l\'utilisation d\'outils IA dans votre travail si la DSI les mettait à disposition ?',
    choices: [
      { 
        id: 'ai-openness-1', 
        label: 'Oui, totalement',
        emoji: '😃',
        title: 'Oui, totalement',
        description: 'Oui, totalement'
      },
      { 
        id: 'ai-openness-2', 
        label: 'Oui, sous certaines conditions',
        emoji: '🙂',
        title: 'Oui, sous conditions',
        description: 'Oui, sous certaines conditions'
      },
      { 
        id: 'ai-openness-3', 
        label: 'Peut-être',
        emoji: '🤷',
        title: 'Peut-être',
        description: 'Peut-être'
      },
      { 
        id: 'ai-openness-4', 
        label: 'Peu',
        emoji: '😕',
        title: 'Peu',
        description: 'Peu'
      },
    ],
    required: true,
  },

  // Question 23 - Rôle attendu de la direction IT concernant l'IA
  {
    id: 23,
    type: 'multiple',
    question: 'Quel rôle attendez-vous principalement du la direction IT concernant l\'IA ?',
    choices: [
      { 
        id: 'ai-role-1', 
        label: 'Conseil & orientation',
        emoji: '💡',
        title: 'Conseil & orientation',
        description: 'Conseil & orientation'
      },
      { 
        id: 'ai-role-2', 
        label: 'Sécurité & conformité',
        emoji: '🛡️',
        title: 'Sécurité & conformité',
        description: 'Sécurité & conformité'
      },
      { 
        id: 'ai-role-3', 
        label: 'Mise à disposition d\'outils',
        emoji: '🛠️',
        title: 'Mise à disposition',
        description: 'Mise à disposition d\'outils'
      },
      { 
        id: 'ai-role-4', 
        label: 'Accompagnement des métiers',
        emoji: '👥',
        title: 'Accompagnement',
        description: 'Accompagnement des métiers'
      },
      { 
        id: 'ai-role-5', 
        label: 'Définition des règles',
        emoji: '📋',
        title: 'Définition règles',
        description: 'Définition des règles'
      },
    ],
    required: true,
  },

  // Question 24 - Prêtesse de l'entreprise pour l'IA
  {
    id: 24,
    type: 'choice',
    question: 'Pensez-vous que l\'entreprise est aujourd\'hui prête à intégrer l\'IA ?',
    choices: [
      { 
        id: 'ai-readiness-1', 
        label: 'Oui',
        emoji: '🟢',
        title: 'Oui',
        description: 'Oui'
      },
      { 
        id: 'ai-readiness-2', 
        label: 'Partiellement',
        emoji: '🟡',
        title: 'Partiellement',
        description: 'Partiellement'
      },
      { 
        id: 'ai-readiness-3', 
        label: 'Non',
        emoji: '🔴',
        title: 'Non',
        description: 'Non'
      },
    ],
    required: true,
  },

  // Question 25 - Bénéfice principal de l'IA
  {
    id: 25,
    type: 'choice',
    question: 'Quel serait, selon vous, le principal bénéfice de l\'IA dans votre travail quotidien ?',
    choices: [
      { 
        id: 'ai-benefit-1', 
        label: 'Gain de temps',
        emoji: '⚡',
        title: 'Gain de temps',
        description: 'Gain de temps'
      },
      { 
        id: 'ai-benefit-2', 
        label: 'Simplification des tâches',
        emoji: '🔄',
        title: 'Simplification',
        description: 'Simplification des tâches'
      },
      { 
        id: 'ai-benefit-3', 
        label: 'Aide à la décision',
        emoji: '🎯',
        title: 'Aide décision',
        description: 'Aide à la décision'
      },
      { 
        id: 'ai-benefit-4', 
        label: 'Réduction des erreurs',
        emoji: '🛡️',
        title: 'Réduction erreurs',
        description: 'Réduction des erreurs'
      },
    ],
    required: true,
  },

  // Question 26 - Type de projet IA prioritaire
  {
    id: 26,
    type: 'choice',
    question: 'Quel type de projet IA devrait être lancé en premier selon vous ?',
    choices: [
      { 
        id: 'ai-project-1', 
        label: 'Pilote simple',
        emoji: '🧪',
        title: 'Pilote simple',
        description: 'Pilote simple'
      },
      { 
        id: 'ai-project-2', 
        label: 'Analyse & reporting',
        emoji: '📊',
        title: 'Analyse & reporting',
        description: 'Analyse & reporting'
      },
      { 
        id: 'ai-project-3', 
        label: 'Support aux utilisateurs',
        emoji: '💻',
        title: 'Support utilisateurs',
        description: 'Support aux utilisateurs'
      },
      { 
        id: 'ai-project-4', 
        label: 'Automatisation de tâches',
        emoji: '🔁',
        title: 'Automatisation',
        description: 'Automatisation de tâches'
      },
    ],
    required: true,
  },

  // Question 27 - Message libre sur l'IA
  {
    id: 27,
    type: 'text',
    question: 'Un message, une crainte ou une suggestion supplémentaire concernant l\'IA ?',
    placeholder: 'Votre message, crainte ou suggestion...',
    required: false,
  },
];

