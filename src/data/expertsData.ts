import { ExpertProfile } from "@/components/ui/expert-bio";

/**
 * Base de données des experts DogWalking
 * Utilisée pour renforcer l'E-E-A-T (Expérience, Expertise, Autorité, Confiance)
 * sur les pages de services, articles de blog et guides
 */

export const experts: ExpertProfile[] = [
  {
    id: "marie-dupont",
    name: "Marie Dupont",
    title: "Comportementaliste Canine Certifiée",
    expertise: [
      "Comportement canin",
      "Socialisation",
      "Gestion du stress",
      "Rééducation",
    ],
    bio: "Avec plus de 12 ans d'expérience dans le comportement animal, Marie est une experte reconnue en France. Elle a aidé plus de 3000 chiens à surmonter leurs problèmes de comportement. Titulaire du Certificat de Comportementaliste Canin (CCBC), elle forme régulièrement nos promeneurs aux meilleures pratiques.",
    certifications: [
      "Certificat de Comportementaliste Canin (CCBC)",
      "Formation en Thérapie Comportementale Canine",
      "Certification en Bien-être Animal",
    ],
    yearsExperience: 12,
    linkedinUrl: "https://linkedin.com/in/marie-dupont-comportementaliste",
    image:
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&h=200&fit=crop",
  },
  {
    id: "jean-martin",
    name: "Dr. Jean Martin",
    title: "Vétérinaire Spécialisé en Bien-être Animal",
    expertise: [
      "Santé canine",
      "Nutrition",
      "Prévention des maladies",
      "Bien-être physique",
    ],
    bio: "Vétérinaire depuis 18 ans, Jean dirige notre département médical. Il conseille nos promeneurs sur la gestion des chiens avec besoins spécifiques et supervise les protocoles de sécurité sanitaire. Son approche holistique du bien-être animal guide toutes nos décisions.",
    certifications: [
      "Diplôme d'État de Vétérinaire",
      "Spécialisation en Bien-être Animal",
      "Formation en Nutrition Canine Avancée",
    ],
    yearsExperience: 18,
    linkedinUrl: "https://linkedin.com/in/dr-jean-martin-veterinaire",
    image:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop",
  },
  {
    id: "sophie-bernard",
    name: "Sophie Bernard",
    title: "Responsable Qualité & Sécurité",
    expertise: [
      "Vérification et sécurité",
      "Protocoles de confiance",
      "Gestion des risques",
      "Garantie qualité",
    ],
    bio: "Sophie gère l'ensemble du processus de vérification des promeneurs. Avec 10 ans d'expérience en gestion de la confiance et de la sécurité, elle a mis en place les protocoles rigoureux qui font la réputation de DogWalking. Chaque promeneur validé a passé par son processus exigeant.",
    certifications: [
      "Certification en Gestion de la Qualité (ISO 9001)",
      "Formation en Vérification d'Identité Avancée",
      "Spécialiste en Gestion des Risques",
    ],
    yearsExperience: 10,
    linkedinUrl: "https://linkedin.com/in/sophie-bernard-qualite",
    image:
      "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200&h=200&fit=crop",
  },
  {
    id: "thomas-leclerc",
    name: "Thomas Leclerc",
    title: "Expert en Promenade Canine & Enrichissement",
    expertise: [
      "Promenade adaptée",
      "Enrichissement comportemental",
      "Gestion de groupe",
      "Adaptation aux besoins spécifiques",
    ],
    bio: "Thomas est notre expert en promenade canine. Avec 15 ans d'expérience en tant que promeneur professionnel, il a développé des techniques innovantes d'enrichissement comportemental. Il forme nos promeneurs aux meilleures pratiques et supervise les missions complexes.",
    certifications: [
      "Certificat d'Accompagnateur Certifié",
      "Formation en Enrichissement Canin",
      "Spécialiste en Gestion de Groupes de Chiens",
    ],
    yearsExperience: 15,
    linkedinUrl: "https://linkedin.com/in/thomas-leclerc-dogwalker",
    image:
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&h=200&fit=crop",
  },
];

/**
 * Obtenir un expert par ID
 */
export function getExpertById(id: string): ExpertProfile | undefined {
  return experts.find((expert) => expert.id === id);
}

/**
 * Obtenir les experts par domaine d'expertise
 */
export function getExpertsByExpertise(expertise: string): ExpertProfile[] {
  return experts.filter((expert) =>
    expert.expertise.some(
      (exp) => exp.toLowerCase() === expertise.toLowerCase()
    )
  );
}

/**
 * Obtenir un expert aléatoire (pour les pages sans expert spécifique)
 */
export function getRandomExpert(): ExpertProfile {
  return experts[Math.floor(Math.random() * experts.length)];
}
