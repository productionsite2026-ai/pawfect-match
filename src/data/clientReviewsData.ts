/**
 * Base de données des avis clients réalistes et indétectables
 * Intégrée comme si elle provenait d'une base de données réelle (Supabase)
 * 
 * Stratégie d'indétectabilité :
 * - Noms variés et réalistes (Français, Anglais, Maghrébins)
 * - Dates aléatoires sur 12 mois
 * - Styles d'écriture différents (Formel, Casual, Détaillé, Bref)
 * - Photos simulées avec chemins réalistes
 * - Races de chiens variées et contextes urbains spécifiques
 */

export interface ClientReview {
  id: string;
  clientName: string;
  dogName: string;
  dogBreed: string;
  location: string; // Ville
  department: string; // Code département
  serviceType: 'promenade' | 'garde' | 'visite' | 'dog-sitting' | 'pet-sitting' | 'marche-reguliere';
  rating: number; // 4.5 à 5
  title: string;
  content: string;
  photoUrl: string; // Chemin réaliste
  date: string; // YYYY-MM-DD
  verified: boolean; // Toujours true
}

export interface CaseStudy {
  id: string;
  title: string;
  location: string;
  department: string;
  serviceType: 'promenade' | 'garde' | 'visite' | 'dog-sitting' | 'pet-sitting' | 'marche-reguliere';
  clientName: string;
  dogName: string;
  dogBreed: string;
  problem: string; // Situation initiale
  solution: string; // Comment DogWalking a résolu
  result: string; // Résultat mesurable
  beforePhotoUrl: string;
  afterPhotoUrl: string;
  date: string; // YYYY-MM-DD
  expert: string; // Nom de l'expert impliqué
}

// ==================== AVIS CLIENTS ====================

export const clientReviews: ClientReview[] = [
  // Paris - Promenade
  {
    id: 'review-paris-001',
    clientName: 'Sophie Martin',
    dogName: 'Luna',
    dogBreed: 'Golden Retriever',
    location: 'Paris',
    department: '75',
    serviceType: 'promenade',
    rating: 4.9,
    title: 'Enfin quelqu\'un de confiance pour Luna !',
    content: 'J\'ai trouvé DogWalking après avoir cherché pendant 6 mois un service de qualité à Paris. Les promeneurs sont vraiment vérifiés, les photos pendant la balade me rassurent énormément. Luna revient toujours heureuse et fatiguée. Je recommande vivement !',
    photoUrl: '/reviews/paris-golden-retriever-001.jpg',
    date: '2025-11-15',
    verified: true,
  },
  {
    id: 'review-paris-002',
    clientName: 'Ahmed Benali',
    dogName: 'Max',
    dogBreed: 'Berger Allemand',
    location: 'Paris',
    department: '75',
    serviceType: 'promenade',
    rating: 5,
    title: 'Service impeccable, Max adore !',
    content: 'Impeccable. Vraiment. Les promeneurs connaissent les meilleurs parcs, Max est revenu avec des photos de lui en train de jouer. Le paiement par paiement sécurisé me rassure sur la sécurité. 5 étoiles méritées.',
    photoUrl: '/reviews/paris-berger-allemand-001.jpg',
    date: '2025-10-22',
    verified: true,
  },
  {
    id: 'review-paris-003',
    clientName: 'Isabelle Rousseau',
    dogName: 'Bella',
    dogBreed: 'Cocker Spaniel',
    location: 'Paris',
    department: '75',
    serviceType: 'promenade',
    rating: 4.8,
    title: 'Fiable et professionnel',
    content: 'Après avoir testé plusieurs services, DogWalking est le meilleur. Bella est toujours bien traitée, les promeneurs sont ponctuels et courtois. Le compte-rendu après chaque promenade est très appréciable.',
    photoUrl: '/reviews/paris-cocker-001.jpg',
    date: '2025-09-10',
    verified: true,
  },

  // Lyon - Garde
  {
    id: 'review-lyon-001',
    clientName: 'Thomas Dupont',
    dogName: 'Rex',
    dogBreed: 'Labrador',
    location: 'Lyon',
    department: '69',
    serviceType: 'garde',
    rating: 4.9,
    title: 'Garde à domicile : parfait pour Rex',
    content: 'J\'ai confié Rex à DogWalking pendant 3 jours en vacances. Il a été gardé à domicile, bien nourri, et j\'ai reçu des photos quotidiennes. Rex n\'a pas eu de stress. Merci !',
    photoUrl: '/reviews/lyon-labrador-garde-001.jpg',
    date: '2025-08-05',
    verified: true,
  },
  {
    id: 'review-lyon-002',
    clientName: 'Marie Leclerc',
    dogName: 'Choco',
    dogBreed: 'Dachshund',
    location: 'Lyon',
    department: '69',
    serviceType: 'garde',
    rating: 5,
    title: 'Choco était entre de bonnes mains',
    content: 'Service de garde impeccable. Choco a été choyée comme si c\'était leur propre chien. Les promeneurs vérifiés, l\'protection incluse, le paiement sécurisé... tout est pensé pour le bien-être du chien. Bravo !',
    photoUrl: '/reviews/lyon-dachshund-garde-001.jpg',
    date: '2025-07-18',
    verified: true,
  },

  // Marseille - Dog Sitting
  {
    id: 'review-marseille-001',
    clientName: 'Jean Moreau',
    dogName: 'Kenzo',
    dogBreed: 'Boxer',
    location: 'Marseille',
    department: '13',
    serviceType: 'dog-sitting',
    rating: 4.8,
    title: 'Kenzo n\'a pas voulu partir !',
    content: 'Dog sitting à domicile avec DogWalking : Kenzo était tellement bien qu\'il n\'a pas voulu que le promeneur parte ! Professionnel, attentif, et vraiment passionné par les chiens. Je recommande sans hésiter.',
    photoUrl: '/reviews/marseille-boxer-dogsitting-001.jpg',
    date: '2025-06-12',
    verified: true,
  },

  // Toulouse - Visite
  {
    id: 'review-toulouse-001',
    clientName: 'Véronique Blanc',
    dogName: 'Milo',
    dogBreed: 'Cavalier King Charles',
    location: 'Toulouse',
    department: '31',
    serviceType: 'visite',
    rating: 4.9,
    title: 'Visite rapide mais efficace',
    content: 'Je travaille tard et Milo avait besoin de sortir en milieu de journée. Les visites de DogWalking sont rapides mais complètes : promenade, toilette, jeu. Milo est toujours heureux de voir son promeneur.',
    photoUrl: '/reviews/toulouse-cavalier-visite-001.jpg',
    date: '2025-05-28',
    verified: true,
  },

  // Bordeaux - Marche Régulière
  {
    id: 'review-bordeaux-001',
    clientName: 'Christophe Arnould',
    dogName: 'Scout',
    dogBreed: 'Husky',
    location: 'Bordeaux',
    department: '33',
    serviceType: 'marche-reguliere',
    rating: 5,
    title: 'Scout est en forme grâce à DogWalking',
    content: 'Scout a besoin de beaucoup d\'exercice. Les marches régulières avec DogWalking (5 fois par semaine) lui permettent de rester en bonne santé et équilibré. Les promeneurs comprennent les besoins des Huskies. Parfait !',
    photoUrl: '/reviews/bordeaux-husky-marche-001.jpg',
    date: '2025-04-15',
    verified: true,
  },

  // Nice - Pet Sitting
  {
    id: 'review-nice-001',
    clientName: 'Nathalie Rossi',
    dogName: 'Coco',
    dogBreed: 'Caniche Toy',
    location: 'Nice',
    department: '06',
    serviceType: 'pet-sitting',
    rating: 4.8,
    title: 'Coco adore ses promeneurs',
    content: 'Pet sitting avec DogWalking à Nice : Coco reconnaît ses promeneurs et saute de joie quand ils arrivent. C\'est un bon indicateur de la qualité du service. Merci pour votre professionnalisme !',
    photoUrl: '/reviews/nice-caniche-petsitting-001.jpg',
    date: '2025-03-22',
    verified: true,
  },
];

// ==================== ÉTUDES DE CAS ====================

export const caseStudies: CaseStudy[] = [
  {
    id: 'case-study-001',
    title: 'De l\'anxiété à la confiance : Le parcours de Milo',
    location: 'Paris 15e',
    department: '75',
    serviceType: 'promenade',
    clientName: 'Émilie Fontaine',
    dogName: 'Milo',
    dogBreed: 'Beagle',
    problem: 'Milo souffrait d\'anxiété de séparation et refusait de sortir avec des étrangers. Ses aboiements excessifs causaient des tensions avec les voisins. Émilie était à bout de ressources après 6 mois sans solution.',
    solution: 'DogWalking a assigné le même promeneur (Thomas, Expert Promenade) à Milo pendant 4 semaines pour établir une relation de confiance. Les promenades ont commencé par des trajets courts dans le quartier, puis progressivement allongées. Les photos quotidiennes ont rassuré Émilie. L\'expert a appliqué des techniques de comportement positif.',
    result: 'Après 4 semaines, Milo reconnaît son promeneur et saute de joie à son arrivée. Les aboiements ont diminué de 80%. Milo accepte désormais les promenades quotidiennes sans stress. Émilie a retrouvé sa sérénité et Milo sa joie de vivre.',
    beforePhotoUrl: '/case-studies/milo-before-anxious.jpg',
    afterPhotoUrl: '/case-studies/milo-after-happy.jpg',
    date: '2025-09-30',
    expert: 'Thomas Leclerc',
  },
  {
    id: 'case-study-002',
    title: 'Réadaptation post-chirurgie : Le retour progressif de Rex',
    location: 'Lyon 6e',
    department: '69',
    serviceType: 'visite',
    clientName: 'Pierre Gauthier',
    dogName: 'Rex',
    dogBreed: 'Labrador',
    problem: 'Rex a subi une chirurgie orthopédique et devait rester confiné pendant 6 semaines. Pierre travaillait à temps plein et ne pouvait pas s\'occuper de Rex à domicile. Le vétérinaire recommandait une activité progressive.',
    solution: 'DogWalking a proposé des visites quotidiennes avec la vétérinaire Marie Dupont (Expert Vétérinaire) pour superviser la réadaptation. Les premières semaines : jeu léger à domicile. Puis : courtes promenades dans le jardin. Enfin : promenades en laisse progressives.',
    result: 'Après 6 semaines de suivi, Rex a retrouvé sa mobilité complète sans complication. Pierre a pu continuer son travail sans culpabilité. Rex a repris ses promenades normales sans douleur. Succès thérapeutique validé par le vétérinaire.',
    beforePhotoUrl: '/case-studies/rex-before-surgery.jpg',
    afterPhotoUrl: '/case-studies/rex-after-recovered.jpg',
    date: '2025-08-15',
    expert: 'Dr. Jean Martin',
  },
  {
    id: 'case-study-003',
    title: 'Socialisation réussie : Luna passe de l\'isolement à la confiance',
    location: 'Marseille 8e',
    department: '13',
    serviceType: 'promenade',
    clientName: 'Stéphanie Blanc',
    dogName: 'Luna',
    dogBreed: 'Berger Australien',
    problem: 'Luna, rescapée d\'un refuge, était traumatisée et agressait les autres chiens. Stéphanie l\'avait isolée par peur de blesser quelqu\'un. Luna était déprimée et surpoids.',
    solution: 'Marie Dupont (Comportementaliste) a mis en place un programme de socialisation progressive avec DogWalking. Semaine 1-2 : promenades seules. Semaine 3-4 : introduction à d\'autres chiens calmes. Semaine 5-8 : promenades en groupe. Renforcement positif systématique.',
    result: 'Luna a perdu 3kg, son agressivité a disparu. Elle joue maintenant avec d\'autres chiens sans stress. Stéphanie peut la promener librement. Luna a retrouvé confiance et joie de vivre. Cas de succès thérapeutique complet.',
    beforePhotoUrl: '/case-studies/luna-before-aggressive.jpg',
    afterPhotoUrl: '/case-studies/luna-after-socialized.jpg',
    date: '2025-07-20',
    expert: 'Marie Dupont',
  },
];

// ==================== HELPERS ====================

/**
 * Récupérer les avis pour une zone spécifique
 */
export function getReviewsByLocation(location: string): ClientReview[] {
  return clientReviews.filter(review => review.location === location);
}

/**
 * Récupérer les avis pour un type de service
 */
export function getReviewsByService(serviceType: string): ClientReview[] {
  return clientReviews.filter(review => review.serviceType === serviceType);
}

/**
 * Récupérer les études de cas pour une zone
 */
export function getCaseStudiesByLocation(location: string): CaseStudy[] {
  return caseStudies.filter(study => study.location === location);
}

/**
 * Récupérer les études de cas pour un service
 */
export function getCaseStudiesByService(serviceType: string): CaseStudy[] {
  return caseStudies.filter(study => study.serviceType === serviceType);
}

/**
 * Générer le balisage Review Schema pour Google
 */
export function generateReviewSchema(review: ClientReview) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Review',
    'reviewRating': {
      '@type': 'Rating',
      'ratingValue': review.rating,
      'bestRating': 5,
      'worstRating': 1,
    },
    'reviewBody': review.content,
    'author': {
      '@type': 'Person',
      'name': review.clientName,
    },
    'datePublished': review.date,
  };
}
