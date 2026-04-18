/**
 * Service Formation - Parcours pédagogique obligatoire pour nouveaux promeneurs
 * Quiz de validation avec score minimum requis
 */

export interface TrainingModule {
  id: string;
  title: string;
  description: string;
  content: string; // HTML ou Markdown
  videoUrl?: string;
  duration: number; // en minutes
  order: number;
}

export interface QuizQuestion {
  id: string;
  moduleId: string;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
}

export interface TrainingProgress {
  userId: string;
  moduleId: string;
  completed: boolean;
  completedAt?: Date;
  score?: number;
}

export interface QuizResult {
  userId: string;
  moduleId: string;
  score: number;
  maxScore: number;
  passed: boolean;
  completedAt: Date;
}

// Modules de formation par défaut
export const DEFAULT_TRAINING_MODULES: TrainingModule[] = [
  {
    id: 'module-1',
    title: 'Sécurité et bien-être des chiens',
    description: 'Apprenez les principes fondamentaux de la sécurité et du bien-être des chiens',
    content: `
      <h2>Sécurité et bien-être des chiens</h2>
      <p>Cette formation couvre les aspects essentiels de la sécurité et du bien-être des chiens:</p>
      <ul>
        <li>Reconnaître les signes de stress chez le chien</li>
        <li>Techniques de manipulation sécurisée</li>
        <li>Gestion des situations d'urgence</li>
        <li>Premiers secours canins</li>
      </ul>
    `,
    videoUrl: 'https://example.com/video-1',
    duration: 15,
    order: 1,
  },
  {
    id: 'module-2',
    title: 'Communication avec les Propriétaires',
    description: 'Maîtrisez la communication professionnelle avec les Propriétaires',
    content: `
      <h2>Communication avec les Propriétaires</h2>
      <p>Apprenez à communiquer efficacement avec les Propriétaires:</p>
      <ul>
        <li>Rapports de mission clairs et détaillés</li>
        <li>Gestion des attentes</li>
        <li>Résolution de conflits</li>
        <li>Feedback constructif</li>
      </ul>
    `,
    videoUrl: 'https://example.com/video-2',
    duration: 10,
    order: 2,
  },
  {
    id: 'module-3',
    title: 'Responsabilités légales',
    description: 'Comprenez vos responsabilités légales en tant que promeneur',
    content: `
      <h2>Responsabilités légales</h2>
      <p>Informations essentielles sur vos responsabilités légales:</p>
      <ul>
        <li>Protection professionnelle</li>
        <li>Obligations légales</li>
        <li>Gestion des incidents</li>
        <li>Confidentialité et données personnelles</li>
      </ul>
    `,
    videoUrl: 'https://example.com/video-3',
    duration: 12,
    order: 3,
  },
];

// Questions de quiz par défaut
export const DEFAULT_QUIZ_QUESTIONS: QuizQuestion[] = [
  {
    id: 'q1',
    moduleId: 'module-1',
    question: 'Quel est le premier signe de stress chez un chien?',
    options: [
      'Queue qui remue',
      'Oreilles en arrière',
      'Halètement excessif',
      'Aboiements joyeux',
    ],
    correctAnswer: 2,
    explanation: 'Le halètement excessif est souvent un signe de stress ou d\'anxiété chez le chien.',
  },
  {
    id: 'q2',
    moduleId: 'module-1',
    question: 'Que faire en cas d\'urgence médicale pendant une promenade?',
    options: [
      'Continuer la promenade',
      'Contacter immédiatement le Propriétaire et un vétérinaire',
      'Attendre que le chien se sente mieux',
      'Rentrer à la maison',
    ],
    correctAnswer: 1,
    explanation: 'Il est crucial de contacter immédiatement le Propriétaire et un vétérinaire en cas d\'urgence.',
  },
  {
    id: 'q3',
    moduleId: 'module-2',
    question: 'Quel est l\'élément clé d\'un rapport de mission?',
    options: [
      'Votre opinion personnelle',
      'Détails objectifs sur le comportement et l\'activité du chien',
      'Critiques du Propriétaire',
      'Demande de pourboire',
    ],
    correctAnswer: 1,
    explanation: 'Un rapport de mission doit contenir des détails objectifs et factuels.',
  },
  {
    id: 'q4',
    moduleId: 'module-3',
    question: 'Quelle protection est essentielle pour un Accompagnateur ?',
    options: [
      'Protection automobile',
      'Protection professionnelle',
      'Justificatif professionnel',
      'Protection santé',
    ],
    correctAnswer: 1,
    explanation: 'L\'protection professionnelle est essentielle pour couvrir les dommages potentiels.',
  },
];

// Score minimum requis pour passer le quiz (en pourcentage)
export const MINIMUM_PASSING_SCORE = 75;

/**
 * Calculer le score du quiz
 */
export function calculateQuizScore(answers: number[], questions: QuizQuestion[]): QuizResult {
  let correctAnswers = 0;
  
  answers.forEach((answer, index) => {
    if (questions[index] && answer === questions[index].correctAnswer) {
      correctAnswers++;
    }
  });

  const score = (correctAnswers / questions.length) * 100;
  const passed = score >= MINIMUM_PASSING_SCORE;

  return {
    userId: '',
    moduleId: questions[0]?.moduleId || '',
    score: Math.round(score),
    maxScore: 100,
    passed,
    completedAt: new Date(),
  };
}

/**
 * Vérifier si un utilisateur a complété toute la formation
 */
export function isTrainingComplete(progress: TrainingProgress[]): boolean {
  const requiredModules = DEFAULT_TRAINING_MODULES.length;
  const completedModules = progress.filter(p => p.completed).length;
  
  return completedModules === requiredModules;
}

/**
 * Obtenir le pourcentage de progression
 */
export function getProgressPercentage(progress: TrainingProgress[]): number {
  const requiredModules = DEFAULT_TRAINING_MODULES.length;
  const completedModules = progress.filter(p => p.completed).length;
  
  return (completedModules / requiredModules) * 100;
}

export default {
  DEFAULT_TRAINING_MODULES,
  DEFAULT_QUIZ_QUESTIONS,
  MINIMUM_PASSING_SCORE,
  calculateQuizScore,
  isTrainingComplete,
  getProgressPercentage,
};
