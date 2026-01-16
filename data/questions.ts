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
  FileCheck,
  Sparkles,
  Briefcase,
  Target,
  Crown,
  CheckCircle2,
  ThumbsUp,
  Scale as Balance,
  AlertTriangle,
  XCircle,
  Star,
  Zap,
  Clock,
  Turtle,
  Smile,
  Frown,
  Meh,
  Timer,
  TrendingUp,
  Wrench,
  Monitor,
  Wallet,
  BarChart3,
  Globe,
  Ticket,
  Settings,
  BookOpen,
  CheckCircle,
  AlertCircle,
  X,
  Video,
  FileText,
  HelpCircle,
  Lock,
  Laptop as LaptopIcon,
  RefreshCw,
  Repeat,
  Lightbulb,
  FileText as FileTextIcon,
  Circle
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
  type: 'choice' | 'text' | 'rating' | 'multiple' | 'satisfaction' | 'slider';
  question: string;
  choices?: QuestionChoice[];
  placeholder?: string;
  required?: boolean;
  maxLength?: number;
  sliderConfig?: {
    min?: number;
    max?: number;
    labels?: string[];
  };
}

export const questions: Question[] = [
  // ============================================
  // SECTION 1: PROFIL & CONTEXTE UTILISATEUR
  // ============================================
  
  // Question 1 - Direction ou périmètre
  {
    id: 1,
    type: 'choice',
    question: 'Quelle est votre direction ou périmètre actuel ?',
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

  // Question 2 - Temps d'intégration
  {
    id: 2,
    type: 'choice',
    question: 'Depuis combien de temps avez-vous intégré l\'entreprise ?',
    choices: [
      { 
        id: 'time-1', 
        label: 'Moins de 1 an',
        emoji: '🌟',
        icon: Sparkles,
        title: 'Moins de 1 an',
        description: 'Nouveau collaborateur'
      },
      { 
        id: 'time-2', 
        label: 'Entre 1 an Et 5 ans',
        emoji: '💼',
        icon: Briefcase,
        title: 'Entre 1 an Et 5 ans',
        description: 'Collaborateur confirmé'
      },
      { 
        id: 'time-3', 
        label: 'Entre 5 ans Et 10 ans',
        emoji: '🎯',
        icon: Target,
        title: 'Entre 5 ans Et 10 ans',
        description: 'Collaborateur expérimenté'
      },
      { 
        id: 'time-4', 
        label: 'Plus de 10 ans',
        emoji: '👑',
        icon: Crown,
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
        icon: CheckCircle2,
        title: 'Répond pleinement',
        description: ''
      },
      { 
        id: 'castel-needs-2', 
        label: 'Le service couvre la majorité de mes attentes métiers',
        emoji: '👍',
        icon: ThumbsUp,
        title: 'Couvre la majorité',
        description: ''
      },
      { 
        id: 'castel-needs-3', 
        label: 'Le dispositif répond à certains besoins, mais des améliorations sont nécessaires',
        emoji: '⚖️',
        icon: Balance,
        title: 'Améliorations nécessaires',
        description: ''
      },
      { 
        id: 'castel-needs-4', 
        label: 'Le service répond faiblement à mes attentes opérationnelles',
        emoji: '⚠️',
        icon: AlertTriangle,
        title: 'Répond faiblement',
        description: ''
      },
      { 
        id: 'castel-needs-5', 
        label: 'Le dispositif ne répond pas à mes besoins quotidiens',
        emoji: '❌',
        icon: XCircle,
        title: 'Ne répond pas',
        description: ''
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
        icon: Star,
        title: 'Intuitif et fluide',
        description: ''
      },
      { 
        id: 'support-ease-2', 
        label: 'Utilisation globalement simple avec peu de contraintes',
        emoji: '👍',
        icon: ThumbsUp,
        title: 'Simple',
        description: ''
      },
      { 
        id: 'support-ease-3', 
        label: 'Acceptable mais quelques améliorations nécessaires',
        emoji: '⚖️',
        icon: Balance,
        title: 'Acceptable',
        description: ''
      },
      { 
        id: 'support-ease-4', 
        label: 'Accès ou suivi peu clairs, expérience complexe',
        emoji: '⚠️',
        icon: AlertTriangle,
        title: 'Complexe',
        description: ''
      },
      { 
        id: 'support-ease-5', 
        label: 'Parcours compliqué et manque de visibilité sur les demandes',
        emoji: '❌',
        icon: XCircle,
        title: 'Très compliqué',
        description: ''
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
        icon: Smile,
        title: 'Résolu rapidement',
        description: ''
      },
      { 
        id: 'support-feel-2', 
        label: 'Résolution correcte, mais quelques points à améliorer',
        emoji: '🙂',
        icon: CheckCircle,
        title: 'Correct',
        description: ''
      },
      { 
        id: 'support-feel-3', 
        label: 'Résolution moyenne, expérience mitigée',
        emoji: '😐',
        icon: Meh,
        title: 'Moyen',
        description: ''
      },
      { 
        id: 'support-feel-4', 
        label: 'Résolution lente ou insatisfaisante',
        emoji: '🙁',
        icon: Frown,
        title: 'Insatisfaisant',
        description: ''
      },
      { 
        id: 'support-feel-5', 
        label: 'Problème non résolu ou support inefficace',
        emoji: '😡',
        icon: XCircle,
        title: 'Non résolu',
        description: ''
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
        icon: Zap,
        title: 'Quasi immédiate',
        description: ''
      },
      { 
        id: 'resolve-time-2', 
        label: 'Délai correct et satisfaisant',
        emoji: '👍',
        icon: ThumbsUp,
        title: 'Correct',
        description: ''
      },
      { 
        id: 'resolve-time-3', 
        label: 'Délai raisonnable mais améliorable',
        emoji: '⏳',
        icon: Clock,
        title: 'Améliorable',
        description: ''
      },
      { 
        id: 'resolve-time-4', 
        label: 'Délai long, impactant l\'activité',
        emoji: '🐢',
        icon: Timer,
        title: 'Trop long',
        description: ''
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
        icon: Timer,
        title: 'Temps de réponse',
        description: ''
      },
      { 
        id: 'impact-2', 
        label: 'Qualité de la communication et suivi',
        emoji: '📞',
        icon: MessageSquare,
        title: 'Communication',
        description: ''
      },
      { 
        id: 'impact-3', 
        label: 'Efficacité des solutions apportées',
        emoji: '🛠️',
        icon: Wrench,
        title: 'Efficacité',
        description: ''
      },
      { 
        id: 'impact-4', 
        label: 'Disponibilité des ressources IT',
        emoji: '👥',
        icon: Users,
        title: 'Disponibilité',
        description: ''
      },
      { 
        id: 'impact-5', 
        label: 'Simplicité et ergonomie des outils',
        emoji: '⚙️',
        icon: Settings,
        title: 'Ergonomie',
        description: ''
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
        icon: Zap,
        title: 'Rapidité',
        description: ''
      },
      { 
        id: 'improve-2', 
        label: 'Solutions plus précises et efficaces',
        emoji: '🎯',
        icon: Target,
        title: 'Précision',
        description: ''
      },
      { 
        id: 'improve-3', 
        label: 'Plus d\'accessibilité aux agents IT',
        emoji: '👥',
        icon: Users,
        title: 'Accessibilité',
        description: ''
      },
      { 
        id: 'improve-4', 
        label: 'Interfaces et systèmes plus faciles à utiliser',
        emoji: '🖥️',
        icon: Monitor,
        title: 'Simplicité',
        description: ''
      },
      { 
        id: 'improve-5', 
        label: 'Renforcer les compétences des utilisateurs',
        emoji: '📚',
        icon: BookOpen,
        title: 'Formation',
        description: ''
      },
    ],
    required: true,
  },

  // Question 9 - Note globale support informatique
  {
    id: 9,
    type: 'slider',
    question: 'Globalement, quelle note attribueriez-vous au support informatique ?',
    required: true,
    sliderConfig: {
      min: 1,
      max: 5,
      labels: [
        'Insatisfaction totale, support inefficace',
        'Support limité, aspects à améliorer',
        'Expérience moyenne, quelques améliorations nécessaires',
        'Très bonne expérience globale',
        'Support très satisfaisant et efficace',
      ],
    },
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
        icon: Star,
        title: 'Très ergonomiques',
        description: ''
      },
      { 
        id: 'ergo-2', 
        label: 'Ergonomiques : Faciles à utiliser, mais quelques améliorations possibles',
        emoji: '👍',
        icon: ThumbsUp,
        title: 'Ergonomiques',
        description: ''
      },
      { 
        id: 'ergo-3', 
        label: 'Moyennement ergonomiques : Utilisation acceptable mais parfois complexe',
        emoji: '⚖️',
        icon: Balance,
        title: 'Moyennement ergonomiques',
        description: ''
      },
      { 
        id: 'ergo-4', 
        label: 'Peu ergonomiques : Navigation difficile, impact sur la productivité',
        emoji: '⚠️',
        icon: AlertTriangle,
        title: 'Peu ergonomiques',
        description: ''
      },
      { 
        id: 'ergo-5', 
        label: 'Pas ergonomiques du tout : Interfaces compliquées, expérience frustrante',
        emoji: '❌',
        icon: XCircle,
        title: 'Pas ergonomiques',
        description: ''
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
      { id: 'frustrating-1', label: 'SAP', emoji: '💼', icon: Briefcase },
      { id: 'frustrating-2', label: 'Caisse', emoji: '💰', icon: Wallet },
      { id: 'frustrating-3', label: 'Assabil', emoji: '📊', icon: BarChart3 },
      { id: 'frustrating-4', label: 'Cosmos', emoji: '🌌', icon: Globe },
      { id: 'frustrating-5', label: 'Agirh', emoji: '👤', icon: Users },
      { id: 'frustrating-6', label: 'Suite Microsoft', emoji: '🪟', icon: Monitor },
      { id: 'frustrating-7', label: 'Outil ticketing', emoji: '🎫', icon: Ticket },
      { id: 'frustrating-8', label: 'Autre (champ texte libre pour préciser)', emoji: '🔧', icon: Wrench },
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
        icon: Briefcase,
        title: 'SAP / ERP',
        description: ''
      },
      { 
        id: 'facilitate-2', 
        label: 'Dashboards plus interactifs et clairs',
        emoji: '📊',
        icon: BarChart3,
        title: 'Dashboards',
        description: ''
      },
      { 
        id: 'facilitate-3', 
        label: 'Outil de ticketing plus rapide et suivi transparent',
        emoji: '🎫',
        icon: Ticket,
        title: 'Outil ticketing',
        description: ''
      },
      { 
        id: 'facilitate-4', 
        label: 'Outils de caisse plus intuitifs',
        emoji: '💰',
        icon: Wallet,
        title: 'Outils de caisse',
        description: ''
      },
      { 
        id: 'facilitate-5', 
        label: 'Autre (champ texte libre)',
        emoji: '🔧',
        icon: Wrench,
        title: 'Autre',
        description: ''
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

  // Question 14 - Domaines de digitalisation prioritaires
  {
    id: 14,
    type: 'multiple',
    question: 'Quels domaines de digitalisation ou d\'innovation devraient être prioritaires pour la DSI selon vous ?',
    choices: [
      { 
        id: 'digital-priority-1', 
        label: 'Automatisation des processus',
        emoji: '🔄',
        icon: Repeat,
        title: 'Automatisation',
        description: ''
      },
      { 
        id: 'digital-priority-2', 
        label: 'Outils de reporting et dashboards améliorés',
        emoji: '📊',
        icon: BarChart3,
        title: 'Reporting & Dashboards',
        description: ''
      },
      { 
        id: 'digital-priority-3', 
        label: 'Modernisation des outils et logiciels',
        emoji: '💻',
        icon: Monitor,
        title: 'Modernisation',
        description: ''
      },
      { 
        id: 'digital-priority-4', 
        label: 'Support IT plus intelligent et proactif',
        emoji: '🤖',
        icon: Lightbulb,
        title: 'Support intelligent',
        description: ''
      },
      { 
        id: 'digital-priority-5', 
        label: 'RH / Paie / Congés',
        emoji: '👥',
        icon: Users,
        title: 'RH / Paie / Congés',
        description: ''
      },
      { 
        id: 'digital-priority-6', 
        label: 'Autre (champ texte libre)',
        emoji: '🔧',
        icon: Wrench,
        title: 'Autre',
        description: ''
      },
    ],
    required: true,
  },

  // Question 15 - Encouragement à l'innovation
  {
    id: 15,
    type: 'choice',
    question: 'Selon vous, la DSI encourage-t-elle suffisamment l\'innovation dans vos pratiques ?',
    choices: [
      { 
        id: 'innovation-encourage-1', 
        label: 'Des idées et solutions innovantes sont proposées régulièrement',
        emoji: '💡',
        icon: Lightbulb,
        title: 'Innovation régulière',
        description: ''
      },
      { 
        id: 'innovation-encourage-2', 
        label: 'Quelques initiatives sont visibles',
        emoji: '🙂',
        icon: Smile,
        title: 'Quelques initiatives',
        description: ''
      },
      { 
        id: 'innovation-encourage-3', 
        label: 'Innovation limitée dans les pratiques quotidiennes',
        emoji: '😐',
        icon: Meh,
        title: 'Innovation limitée',
        description: ''
      },
      { 
        id: 'innovation-encourage-4', 
        label: 'Pas d\'encouragement à l\'innovation',
        emoji: '❌',
        icon: XCircle,
        title: 'Pas d\'encouragement',
        description: ''
      },
    ],
    required: true,
  },

  // Question 16 - Communication DSI sur initiatives digitales
  {
    id: 16,
    type: 'choice',
    question: 'Comment jugez-vous la communication de la DSI sur ses initiatives digitales et innovantes ?',
    choices: [
      { 
        id: 'dsi-communication-1', 
        label: 'Très claire et transparente',
        emoji: '📢',
        icon: Megaphone,
        title: 'Très claire',
        description: ''
      },
      { 
        id: 'dsi-communication-2', 
        label: 'Clair pour la plupart',
        emoji: '🙂',
        icon: Smile,
        title: 'Clair',
        description: ''
      },
      { 
        id: 'dsi-communication-3', 
        label: 'Moyenne',
        emoji: '😐',
        icon: Meh,
        title: 'Moyenne',
        description: ''
      },
      { 
        id: 'dsi-communication-4', 
        label: 'Pas claire du tout',
        emoji: '❌',
        icon: XCircle,
        title: 'Pas claire',
        description: ''
      },
    ],
    required: true,
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
        icon: Shield,
        title: 'Expert',
        description: ''
      },
      { 
        id: 'cyber-skills-2', 
        label: 'Je connais les bases et peux gérer la majorité des situations',
        emoji: '👍',
        icon: ThumbsUp,
        title: 'Compétent',
        description: ''
      },
      { 
        id: 'cyber-skills-3', 
        label: 'Je connais quelques notions mais reste prudent(e)',
        emoji: '⚖️',
        icon: Balance,
        title: 'Prudent',
        description: ''
      },
      { 
        id: 'cyber-skills-4', 
        label: 'Je manque de connaissances pour agir efficacement',
        emoji: '⚠️',
        icon: AlertTriangle,
        title: 'Limité',
        description: ''
      },
      { 
        id: 'cyber-skills-5', 
        label: 'Je ne me sens pas capable de détecter ni gérer les risques',
        emoji: '❌',
        icon: XCircle,
        title: 'Incapable',
        description: ''
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
        icon: Lock,
        title: 'Protection données',
        description: ''
      },
      { 
        id: 'cyber-priority-2', 
        label: 'Sécuriser les postes et logiciels',
        emoji: '💻',
        icon: Laptop,
        title: 'Sécurisation postes',
        description: ''
      },
      { 
        id: 'cyber-priority-3', 
        label: 'Former et sensibiliser les utilisateurs régulièrement',
        emoji: '📚',
        icon: BookOpen,
        title: 'Formation',
        description: ''
      },
      { 
        id: 'cyber-priority-4', 
        label: 'Améliorer la communication et les alertes sécurité',
        emoji: '📢',
        icon: Megaphone,
        title: 'Communication',
        description: ''
      },
      { 
        id: 'cyber-priority-5', 
        label: 'Autre (champ texte libre)',
        emoji: '🔧',
        icon: Wrench,
        title: 'Autre',
        description: ''
      },
    ],
    required: true,
  },

  // ============================================
  // SECTION 7: CONNAISSANCE & PERCEPTION DE L'IA
  // ============================================

  // Question 19 - Ouverture aux outils IA
  {
    id: 19,
    type: 'choice',
    question: 'Seriez-vous ouvert(e) à l\'utilisation d\'outils IA dans votre travail si la DSI les mettait à disposition ?',
    choices: [
      { 
        id: 'ai-openness-1', 
        label: 'Oui, totalement',
        emoji: '😃',
        icon: Smile,
        title: 'Oui, totalement',
        description: ''
      },
      { 
        id: 'ai-openness-2', 
        label: 'Oui, sous certaines conditions',
        emoji: '🙂',
        icon: CheckCircle,
        title: 'Oui, sous conditions',
        description: ''
      },
      { 
        id: 'ai-openness-3', 
        label: 'Peut-être',
        emoji: '🤷',
        icon: HelpCircle,
        title: 'Peut-être',
        description: ''
      },
      { 
        id: 'ai-openness-4', 
        label: 'Peu',
        emoji: '😕',
        icon: Frown,
        title: 'Peu',
        description: ''
      },
    ],
    required: true,
  },

  // Question 20 - Rôle attendu du département IT concernant l'IA
  {
    id: 20,
    type: 'multiple',
    question: 'Quel rôle attendez-vous principalement du département IT concernant l\'IA ?',
    choices: [
      { 
        id: 'ai-role-1', 
        label: 'Conseil & orientation',
        emoji: '💡',
        icon: Lightbulb,
        title: 'Conseil & orientation',
        description: ''
      },
      { 
        id: 'ai-role-2', 
        label: 'Sécurité & conformité',
        emoji: '🛡️',
        icon: Shield,
        title: 'Sécurité & conformité',
        description: ''
      },
      { 
        id: 'ai-role-3', 
        label: 'Mise à disposition d\'outils',
        emoji: '🛠️',
        icon: Wrench,
        title: 'Mise à disposition',
        description: ''
      },
      { 
        id: 'ai-role-4', 
        label: 'Accompagnement des métiers',
        emoji: '👥',
        icon: Users,
        title: 'Accompagnement',
        description: ''
      },
      { 
        id: 'ai-role-5', 
        label: 'Définition des règles',
        emoji: '📋',
        icon: FileTextIcon,
        title: 'Définition règles',
        description: ''
      },
    ],
    required: true,
  },

  // Question 21 - Prêtesse de l'entreprise pour l'IA
  {
    id: 21,
    type: 'choice',
    question: 'Pensez-vous que l\'entreprise est aujourd\'hui prête à intégrer l\'IA ?',
    choices: [
      { 
        id: 'ai-readiness-1', 
        label: 'Oui',
        emoji: '🟢',
        icon: CheckCircle2,
        title: 'Oui',
        description: ''
      },
      { 
        id: 'ai-readiness-2', 
        label: 'Partiellement',
        emoji: '🟡',
        icon: AlertCircle,
        title: 'Partiellement',
        description: ''
      },
      { 
        id: 'ai-readiness-3', 
        label: 'Non',
        emoji: '🔴',
        icon: XCircle,
        title: 'Non',
        description: ''
      },
    ],
    required: true,
  },

  // Question 22 - Bénéfice principal de l'IA
  {
    id: 22,
    type: 'choice',
    question: 'Quel serait, selon vous, le principal bénéfice de l\'IA dans votre travail quotidien ?',
    choices: [
      { 
        id: 'ai-benefit-1', 
        label: 'Gain de temps',
        emoji: '⚡',
        icon: Zap,
        title: 'Gain de temps',
        description: ''
      },
      { 
        id: 'ai-benefit-2', 
        label: 'Simplification des tâches',
        emoji: '🔄',
        icon: RefreshCw,
        title: 'Simplification',
        description: ''
      },
      { 
        id: 'ai-benefit-3', 
        label: 'Aide à la décision',
        emoji: '🎯',
        icon: Target,
        title: 'Aide décision',
        description: ''
      },
      { 
        id: 'ai-benefit-4', 
        label: 'Réduction des erreurs',
        emoji: '🛡️',
        icon: Shield,
        title: 'Réduction erreurs',
        description: ''
      },
    ],
    required: true,
  },

  // Question 23 - Type de projet IA prioritaire
  {
    id: 23,
    type: 'choice',
    question: 'Quel type de projet IA devrait être lancé en premier selon vous ?',
    choices: [
      { 
        id: 'ai-project-1', 
        label: 'Pilote simple',
        emoji: '🧪',
        icon: FlaskConical,
        title: 'Pilote simple',
        description: ''
      },
      { 
        id: 'ai-project-2', 
        label: 'Analyse & reporting',
        emoji: '📊',
        icon: BarChart3,
        title: 'Analyse & reporting',
        description: ''
      },
      { 
        id: 'ai-project-3', 
        label: 'Support aux utilisateurs',
        emoji: '💻',
        icon: Laptop,
        title: 'Support utilisateurs',
        description: ''
      },
      { 
        id: 'ai-project-4', 
        label: 'Automatisation de tâches',
        emoji: '🔁',
        icon: Repeat,
        title: 'Automatisation',
        description: ''
      },
    ],
    required: true,
  },

  // Question 24 - Message libre sur l'IA
  {
    id: 24,
    type: 'text',
    question: 'Un message, une crainte ou une suggestion supplémentaire concernant l\'IA ?',
    placeholder: 'Votre message, crainte ou suggestion...',
    required: false,
  },

  // ============================================
  // SECTION 8: COMMUNICATION IT
  // ============================================

  // Question 25 - Supports interactifs IT
  {
    id: 25,
    type: 'choice',
    question: 'Souhaiteriez-vous plus de supports interactifs pour mieux comprendre les outils IT ?',
    choices: [
      { 
        id: 'support-interactive-comm-1', 
        label: 'Vidéos courtes et tutos',
        emoji: '🎥',
        icon: Video,
        title: 'Vidéos',
        description: ''
      },
      { 
        id: 'support-interactive-comm-2', 
        label: 'Guides et FAQ',
        emoji: '📝',
        icon: FileText,
        title: 'Guides',
        description: ''
      },
      { 
        id: 'support-interactive-comm-3', 
        label: 'Ateliers et démonstrations',
        emoji: '🗣️',
        icon: Users,
        title: 'Ateliers',
        description: ''
      },
      { 
        id: 'support-interactive-comm-4', 
        label: 'Je préfère l\'info actuelle',
        emoji: '❌',
        icon: XCircle,
        title: 'Info actuelle',
        description: ''
      },
    ],
    required: true,
  },

  // Question 26 - Information sur changements IT
  {
    id: 26,
    type: 'choice',
    question: 'Avez-vous l\'impression d\'être suffisamment informé(e) sur les changements IT impactant votre travail ?',
    choices: [
      { 
        id: 'info-changes-comm-1', 
        label: 'Je reçois toutes les infos nécessaires',
        emoji: '✅',
        icon: CheckCircle2,
        title: 'Bien informé',
        description: ''
      },
      { 
        id: 'info-changes-comm-2', 
        label: 'Quelques informations manquent parfois',
        emoji: '🙂',
        icon: Smile,
        title: 'Presque complet',
        description: ''
      },
      { 
        id: 'info-changes-comm-3', 
        label: 'Informations partielles ou tardives',
        emoji: '⚖️',
        icon: Balance,
        title: 'Partiel',
        description: ''
      },
      { 
        id: 'info-changes-comm-4', 
        label: 'Beaucoup d\'informations manquantes',
        emoji: '🙁',
        icon: Frown,
        title: 'Insuffisant',
        description: ''
      },
    ],
    required: true,
  },

  // Question 27 - Message libre pour l'équipe IT
  {
    id: 27,
    type: 'text',
    question: 'Un message libre ou suggestion pour l\'équipe IT ?',
    placeholder: 'Vos idées ou retours pour améliorer la communication...',
    required: false,
  },
];

