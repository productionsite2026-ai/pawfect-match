// Images importées pour les services
import promenadeParc from '@/assets/services/promenade-chien-parc.jpg';
import promenadeForet from '@/assets/services/promenade-chien-foret.jpg';
import promenadeLiberte from '@/assets/services/promenade-chien-liberte.jpg';
import gardeDomicile from '@/assets/services/garde-chien-domicile.jpg';
import gardeJardin from '@/assets/services/garde-chien-jardin.jpg';
import gardeRepos from '@/assets/services/garde-chien-repos.jpg';
import visiteRepas from '@/assets/services/visite-chien-repas.jpg';
import visiteAccueil from '@/assets/services/visite-chien-accueil.jpg';
import visiteSoins from '@/assets/services/visite-chien-soins.jpg';
import vetAccompagnement from '@/assets/services/veterinaire-accompagnement.jpg';
import vetTransport from '@/assets/services/veterinaire-transport.jpg';
import vetAttente from '@/assets/services/veterinaire-attente.jpg';
// Nouvelles images hébergement et garderie
import hebergementNuit from '@/assets/services/hebergement-nuit-chambre.jpg';
import hebergementJardin from '@/assets/services/hebergement-jardin-jeu.jpg';
import hebergementRepas from '@/assets/services/hebergement-repas-matin.jpg';
import garderieSalle from '@/assets/services/garderie-salle-jeux.jpg';
import garderieSocial from '@/assets/services/garderie-socialisation.jpg';
import garderieRepos from '@/assets/services/garderie-repos-sieste.jpg';
// Nouvelles images hero pour les pages services
import promenadeHero from '@/assets/services/promenade-hero.jpg';
import visiteHero from '@/assets/services/visite-hero.jpg';
import hebergementHero from '@/assets/services/hebergement-hero.jpg';
import garderieHero from '@/assets/services/garderie-hero.jpg';
import gardeHero from '@/assets/services/garde-hero.jpg';
import visiteSanitaireHero from '@/assets/services/visite-sanitaire-hero.jpg';
import veterinaryHero from '@/assets/services/veterinaire-hero.jpg';

export interface ServiceData {
  id: string;
  slug: string;
  title: string;
  metaTitle: string;
  metaDescription: string;
  h1: string;
  heroDescription: string;
  localZoneMention: string;
  heroImage: string;
  image: string;
  images: { src: string; alt: string }[];
  minPrice: number;
  priceLabel?: string;
  galleryImages?: string[];
  subDescription?: string;
  benefits?: { title: string; description: string }[];
  duration: string;
  description: {
    intro: string;
    forWhom: string;
    problemsSolved: string;
    benefits: string;
  };
  howItWorks: {
    title: string;
    intro: string;
    steps: { title: string; description: string }[];
    safety: string;
    dogWelfare: string;
  };
  expertiseAdvantages: {
    experience: string;
    protection: string;
    method: string;
    trust: string;
  };
  advantages: string[];
  localAvailability: {
    mainCity: string;
    surroundingAreas: string;
    coverage: string;
  };
  faq: { question: string; answer: string }[];
}

export const servicesData: Record<string, ServiceData> = {
  "promenade-chien": {
    id: "promenade",
    slug: "promenade-chien",
    title: "Promenade de chien",
    metaTitle: "Promenade de chien | Accompagnateurs Certifiés | DogWalking",
    metaDescription: "Trouvez un Accompagnateur Certifié DogWalking pour la promenade de votre chien. Preuves visuelles obligatoires, paiement sécurisé et code unique.",
    h1: "Promenade de chien – Accompagnateurs Certifiés DogWalking",
    heroDescription: "Offrez à votre chien l'exercice et la stimulation dont il a besoin avec nos Accompagnateurs Certifiés, sélectionnés rigoureusement pour leur expertise.",
    localZoneMention: "Service disponible partout en France",
    heroImage: promenadeHero,
    image: promenadeParc,
    images: [
      { src: promenadeParc, alt: "Accompagnateur Certifié DogWalking avec un golden retriever dans un parc urbain" },
      { src: promenadeForet, alt: "Promenade de deux chiens par un Accompagnateur DogWalking sur un sentier forestier" },
      { src: promenadeLiberte, alt: "Chien heureux profitant d'une promenade DogWalking en pleine nature" }
    ],
    minPrice: 8,
    priceLabel: "À partir de",
    duration: "Durée libre",
    description: {
      intro: "La promenade régulière est essentielle pour l'équilibre physique et mental de votre chien. Chez DogWalking, nos Accompagnateurs Certifiés ne se contentent pas de sortir votre animal : ils veillent à sa stimulation et à son bien-être tout au long de la mission. Chaque sortie est personnalisée selon les besoins de votre compagnon, qu'il s'agisse d'une dépense d'énergie intense ou d'une marche tranquille pour les seniors. Notre approche repose sur une confiance vérifiée et une transparence totale, garantissant une expérience sereine pour le Propriétaire et joyeuse pour le chien.",
      forWhom: "Ce service s'adresse aux Propriétaires qui souhaitent offrir le meilleur à leur animal malgré un emploi du temps chargé, une mobilité réduite ou un besoin spécifique de socialisation. Que vous ayez un chiot en plein apprentissage ou un chien de travail nécessitant une activité soutenue, nos Accompagnateurs Certifiés s'adaptent à chaque profil. C'est la solution idéale pour éviter l'isolement prolongé de votre compagnon et lui garantir une coupure bénéfique dans sa journée.",
      problemsSolved: "DogWalking apporte une réponse concrète aux troubles liés au manque d'activité : destructions, aboiements intempestifs ou anxiété de séparation. En confiant votre chien à un Accompagnateur Certifié, vous éliminez le stress de la solitude. Notre système de Preuve Visuelle Obligatoire lève toute incertitude : vous recevez une photo ou vidéo dès la prise en charge de l'animal, vous assurant que la mission est réalisée avec professionnalisme.",
      benefits: "Les bénéfices sont immédiats : un chien plus calme, mieux socialisé et en meilleure santé. L'exercice régulier prévient le surpoids et renforce le système cardiovasculaire. Mentalement, la découverte de nouvelles odeurs et de nouveaux environnements apaise l'animal. Grâce au système de paiement sécurisé, vous avez la protection d'un service de qualité : les fonds ne sont libérés que lorsque vous communiquez votre code unique à l'Accompagnateur en fin de mission."
    },
    howItWorks: {
      title: "Comment fonctionne DogWalking",
      intro: "Un processus structuré pour garantir que chaque prestation payée est une prestation réalisée, en toute sécurité.",
      steps: [
        { title: "Recherche & Contact", description: "Trouvez un Accompagnateur Certifié près de chez vous. Échangez via nos messages pré-enregistrés pour définir vos besoins initiaux en toute sécurité." },
        { title: "Réservation & Paiement en Attente", description: "Validez la demande et bloquez les fonds sur la plateforme. Votre paiement est sécurisé et vous recevez un code unique de confirmation." },
        { title: "Organisation Logistique", description: "Une fois les fonds sécurisés, la messagerie instantanée complète est débloquée pour organiser les détails de la rencontre et de la promenade." },
        { title: "Preuves Visuelles", description: "L'Accompagnateur envoie obligatoirement une photo ou vidéo dès la prise en charge de votre chien, puis une autre à la fin de la mission." },
        { title: "Déblocage du Paiement", description: "En fin de mission, communiquez votre code unique à l'Accompagnateur. Sa saisie sur son dashboard libère les fonds et valide la prestation." }
      ],
      safety: "La sécurité repose sur notre système de paiement sécurisé : aucun paiement n'est versé sans votre code unique. De plus, chaque Accompagnateur est rigoureusement sélectionné (CNI).",
      dogWelfare: "Le bien-être est assuré par l'envoi systématique de preuves visuelles. Pas de GPS intrusif, mais un contact humain et des images concrètes de votre chien heureux et en sécurité."
    },
    expertiseAdvantages: {
      experience: "Seuls 35% des candidats sont acceptés sur DogWalking. Chaque Accompagnateur Certifié justifie d'une expérience solide et d'une passion vérifiée pour le bien-être animal.",
      protection: "Chaque mission est couverte par une protection professionnelle. En cas d'imprévu, DogWalking assure la médiation et la sécurité de votre compagnon.",
      method: "Nous privilégions la Preuve Visuelle à la géolocalisation. Vous voyez votre chien en action, ce qui garantit la réalité du service bien mieux qu'un simple point sur une carte.",
      trust: "La confiance est vérifiée manuellement : CNI,  et contrôle des formations sont les piliers de notre processus de sélection."
    },
    advantages: [
      "Accompagnateurs Certifiés rigoureusement sélectionnés (taux d'acceptation de 35%)",
      "Système de paiement sécurisé : zéro risque pour le Propriétaire",
      "Déblocage des fonds par code unique détenu par le Propriétaire",
      "Preuves visuelles (photos/vidéos) obligatoires à chaque étape de la mission",
      "Communication sécurisée avec messagerie débloquée après réservation",
      "Tarifs libres fixés par les Accompagnateurs pour une flexibilité maximale",
      "Protection professionnelle incluse pour chaque prestation",
      "Gestion simplifiée via votre Dashboard Propriétaire dédié"
    ],
    localAvailability: {
      mainCity: "Notre réseau d'Accompagnateurs Certifiés couvre l'ensemble du territoire français.",
      surroundingAreas: "Que vous soyez en centre-ville ou en périphérie, trouvez un Accompagnateur disponible près de chez vous.",
      coverage: "Plus de 500 communes déjà desservies par DogWalking."
    },
    faq: [
      { question: "Qui sont les Accompagnateurs DogWalking ?", answer: "Ce sont des prestataires certifiés ayant passé un processus de sélection manuel rigoureux. Nous vérifions leur identité (CNI), leur  et leurs compétences. Seuls 35% des candidats sont retenus pour garantir un haut niveau de confiance." },
      { question: "Comment fonctionne le code unique de paiement ?", answer: "Lors de la réservation, vous bloquez les fonds et recevez un code secret. À la fin de la promenade, si tout s'est bien passé, vous donnez ce code à l'Accompagnateur. C'est la saisie de ce code par ses soins qui déclenche le versement de son paiement." },
      { question: "Pourquoi n'y a-t-il pas de suivi GPS ?", answer: "Le GPS est souvent imprécis et intrusif. DogWalking privilégie la Preuve Visuelle : l'Accompagnateur doit vous envoyer une photo ou vidéo au début et à la fin de la mission. C'est la preuve irréfutable que votre chien a bien été pris en charge." },
      { question: "Quelles sont les conditions d'annulation ?", answer: "Vous pouvez annuler une réservation jusqu'à 3 heures avant le début de la mission. Au-delà de ce délai, les fonds bloqués peuvent être retenus selon les conditions de la plateforme." },
      { question: "Comment contacter l'Accompagnateur ?", answer: "Avant le blocage du paiement, vous communiquez via des messages pré-enregistrés pour protéger votre vie privée. Une fois la réservation validée et les fonds sécurisés, la messagerie instantanée complète est débloquée." }
    ]
  },
  "visite-domicile": {
    id: "visite_domicile",
    slug: "visite-domicile",
    title: "Visite à domicile",
    metaTitle: "Visite à domicile pour animaux | Accompagnateurs Certifiés | DogWalking",
    metaDescription: "Réservez une visite à domicile (30 min) pour votre chien. Nourriture, eau, câlins et soins. Preuves visuelles obligatoires et paiement sécurisé en attente.",
    h1: "Visite à domicile – Votre animal choyé dans son environnement",
    heroDescription: "Pendant votre absence, nos Accompagnateurs Certifiés se déplacent chez vous pour prendre soin de votre compagnon dans son environnement habituel.",
    localZoneMention: "Service disponible partout en France",
    heroImage: visiteHero,
    image: visiteRepas,
    images: [
      { src: visiteRepas, alt: "Accompagnateur Certifié DogWalking nourrissant un chat à domicile" },
      { src: visiteAccueil, alt: "Accueil chaleureux d'un chien lors d'une visite DogWalking" },
      { src: visiteSoins, alt: "Soins et attention portés à un animal pendant une visite à domicile" }
    ],
    minPrice: 8,
    priceLabel: "À partir de",
    duration: "30 min",
    description: {
      intro: "La visite à domicile est la solution idéale pour les animaux qui préfèrent rester dans leur environnement familier. Qu'il s'agisse d'un chat indépendant, d'un chien âgé ou d'un animal nécessitant des soins spécifiques, nos Accompagnateurs Certifiés assurent une présence bienveillante. Chaque visite de 30 minutes comprend le renouvellement de l'eau, la distribution de nourriture, le nettoyage de la litière si nécessaire, et surtout, un moment privilégié de jeux et de câlins. C'est la garantie d'une routine préservée et d'un animal serein en votre absence.",
      forWhom: "Ce service s'adresse aux Propriétaires d'animaux (chiens, chats, NAC) qui s'absentent pour la journée ou pour quelques jours. C'est une alternative moins stressante que la pension, car l'animal garde ses repères, ses odeurs et ses habitudes. C'est aussi une sécurité pour votre domicile, car la visite régulière d'un Accompagnateur simule une présence.",
      problemsSolved: "DogWalking résout le problème du stress lié au changement d'environnement. En évitant le déplacement de votre animal, vous éliminez les risques de maladies contractées en collectivité et l'anxiété liée au transport. Notre système de Preuve Visuelle Obligatoire vous permet de voir votre animal chez vous, heureux et détendu, dès que l'Accompagnateur arrive sur place.",
      benefits: "Votre animal reste calme et en sécurité dans son foyer. Vous recevez des nouvelles fraîches et des photos à chaque passage. Le paiement sécurisé vous garantit que la visite a bien eu lieu : vous ne libérez les fonds qu'une fois la mission terminée en donnant votre code unique à l'Accompagnateur."
    },
    howItWorks: {
      title: "Fonctionnement de la visite",
      intro: "Un protocole strict pour une sécurité maximale à votre domicile.",
      steps: [
        { title: "Sélection & Réservation", description: "Choisissez votre Accompagnateur Certifié et bloquez les fonds en paiement en attente sur DogWalking." },
        { title: "Consignes & Clés", description: "Organisez la remise des clés et transmettez vos consignes détaillées via la messagerie sécurisée." },
        { title: "Preuve d'Arrivée", description: "L'Accompagnateur envoie une photo ou vidéo dès son entrée à votre domicile pour confirmer le début de la visite." },
        { title: "Soins & Attention", description: "Réalisation des soins prévus : nourriture, eau, jeux et câlins pendant toute la durée de la visite." },
        { title: "Validation Finale", description: "L'Accompagnateur envoie une preuve de fin de mission et vous lui transmettez le code unique pour libérer son paiement." }
      ],
      safety: "La sécurité de votre domicile est notre priorité. Nos Accompagnateurs sont sélectionnés manuellement et vérifiés (CNI). Le code unique assure que vous seul validez la prestation.",
      dogWelfare: "Le bien-être est au cœur de la visite : respect du rythme de l'animal et attention personnalisée garantie par les preuves visuelles."
    },
    expertiseAdvantages: {
      experience: "Nos Accompagnateurs Certifiés sont habitués à gérer les besoins spécifiques des animaux à domicile, incluant les protocoles d'hygiène et de sécurité.",
      protection: "Chaque visite est protégée par notre plateforme. Nous assurons un suivi rigoureux de chaque mission pour votre tranquillité d'esprit.",
      method: "La méthode DogWalking privilégie l'interaction humaine. Les photos reçues témoignent de la qualité du moment passé avec votre animal.",
      trust: "Une confiance vérifiée manuellement pour vous permettre d'ouvrir votre porte en toute sérénité à un professionnel certifié."
    },
    advantages: [
      "Maintien de l'animal dans son environnement familier (zéro stress)",
      "Accompagnateurs Certifiés rigoureusement sélectionnés (35% d'acceptation)",
      "Paiement sécurisé et déblocage par code unique",
      "Preuves visuelles obligatoires à chaque passage",
      "Nettoyage litière et soins de base inclus",
      "Simulation de présence à votre domicile",
      "Compte-rendu détaillé après chaque visite",
      "Protection professionnelle DogWalking incluse"
    ],
    localAvailability: {
      mainCity: "Service de visite disponible dans toutes les villes de France.",
      surroundingAreas: "Trouvez un Accompagnateur de proximité pour des passages réguliers.",
      coverage: "Un réseau national pour couvrir vos besoins, même en période de vacances."
    },
    faq: [
      { question: "Combien de temps dure une visite ?", answer: "Une visite standard dure 30 minutes, mais vous pouvez convenir d'une durée plus longue avec votre Accompagnateur selon les besoins de votre animal." },
      { question: "Comment se passe la remise des clés ?", answer: "La remise des clés est organisée directement entre le Propriétaire et l'Accompagnateur une fois la réservation validée et les fonds sécurisés." },
      { question: "Puis-je demander plusieurs visites par jour ?", answer: "Oui, vous pouvez réserver plusieurs créneaux de visite par jour pour assurer une présence régulière à votre animal." },
      { question: "Quelles preuves vais-je recevoir ?", answer: "L'Accompagnateur doit obligatoirement vous envoyer une photo ou vidéo de votre animal à son arrivée et une autre avant son départ." }
    ]
  },
  "hebergement-chien": {
    id: "hebergement",
    slug: "hebergement-chien",
    title: "Hébergement chez l'Accompagnateur",
    metaTitle: "Hébergement pour chien | Accompagnateurs Certifiés | DogWalking",
    metaDescription: "Votre chien séjourne chez un Accompagnateur Certifié DogWalking. Environnement familial, attention 24h/24, preuves visuelles et paiement sécurisé.",
    h1: "Hébergement en famille – Le confort comme à la maison",
    heroDescription: "Offrez à votre chien des vacances en famille chez l'un de nos Accompagnateurs Certifiés, dans un cadre sécurisé et chaleureux.",
    localZoneMention: "Service disponible partout en France",
    heroImage: hebergementHero,
    image: hebergementNuit,
    images: [
      { src: hebergementNuit, alt: "Chien dormant paisiblement dans un salon chez un Accompagnateur DogWalking" },
      { src: hebergementJardin, alt: "Chien s'amusant dans le jardin sécurisé d'un Accompagnateur" },
      { src: hebergementRepas, alt: "Moment du repas préparé avec soin par l'Accompagnateur" }
    ],
    minPrice: 10,
    priceLabel: "À partir de",
    duration: "Par nuit",
    description: {
      intro: "L'hébergement chez l'Accompagnateur est l'alternative premium au chenil traditionnel. Votre chien est accueilli au sein d'un foyer chaleureux, où il partage la vie quotidienne de son Accompagnateur Certifié. Pas de cages, pas de box : votre compagnon bénéficie du confort d'une maison, de la présence humaine constante et de soins personnalisés. C'est la solution parfaite pour les Propriétaires qui souhaitent partir l'esprit tranquille, sachant que leur animal est traité comme un membre de la famille.",
      forWhom: "Ce service est conçu pour les chiens sociables qui apprécient la compagnie humaine et, éventuellement, celle d'autres congénères. C'est idéal pour les séjours de courte ou longue durée (vacances, déplacements professionnels, week-ends). Nos Accompagnateurs s'adaptent aux habitudes de votre chien : horaires de repas, types de promenades et rituels de sommeil.",
      problemsSolved: "DogWalking élimine le traumatisme lié à l'enfermement en pension. Nous résolvons le manque de transparence grâce à la Preuve Visuelle Obligatoire : vous recevez chaque jour des photos et vidéos de votre chien participant à la vie de famille. Le stress de la séparation est ainsi largement atténué pour le Propriétaire comme pour l'animal.",
      benefits: "Un chien épanoui qui ne subit pas de rupture brutale avec ses habitudes de vie. Une sécurité financière totale grâce au paiement en attente : vous ne validez le paiement qu'à la fin du séjour en remettant votre code unique. Une protection professionnelle couvre l'animal durant toute la durée de l'hébergement."
    },
    howItWorks: {
      title: "Le séjour pas à pas",
      intro: "Une organisation rigoureuse pour des vacances canines réussies.",
      steps: [
        { title: "Rencontre préalable", description: "Nous conseillons une rencontre (gratuite ou via une promenade) pour vérifier l'entente entre le chien et l'Accompagnateur." },
        { title: "Réservation & Paiement en Attente", description: "Validation des dates et blocage sécurisé des fonds sur la plateforme DogWalking." },
        { title: "Installation", description: "Arrivée du chien avec ses affaires (panier, nourriture, jouets). Preuve visuelle d'arrivée envoyée immédiatement." },
        { title: "Suivi Quotidien", description: "Envoi régulier de photos et vidéos pour vous faire partager le quotidien de votre compagnon." },
        { title: "Fin de Séjour", description: "Récupération de l'animal et transmission du code unique pour libérer le paiement de l'Accompagnateur." }
      ],
      safety: "L'environnement de l'Accompagnateur est vérifié. La sécurité est renforcée par notre processus de sélection manuel (35% d'acceptation) et la vérification des documents officiels.",
      dogWelfare: "Le bien-être est garanti par une attention 24h/24 et un cadre familial qui prévient l'anxiété de séparation."
    },
    expertiseAdvantages: {
      experience: "Nos Accompagnateurs Certifiés en hébergement ont l'habitude d'intégrer un nouvel animal à leur foyer en toute sécurité.",
      protection: "Votre animal est protégé par les garanties de la plateforme DogWalking durant tout son séjour.",
      method: "Une approche basée sur l'affection et le respect des besoins physiologiques de chaque chien.",
      trust: "La confiance est le pilier de l'hébergement : nous ne retenons que des profils d'exception pour ce service sensible."
    },
    advantages: [
      "Cadre familial chaleureux (pas de box ni de cages)",
      "Attention et présence humaine constante (24h/24)",
      "Accompagnateurs Certifiés sélectionnés avec rigueur (35% d'acceptation)",
      "Paiement sécurisé : libération par code unique en fin de séjour",
      "Preuves visuelles quotidiennes (photos/vidéos)",
      "Respect strict du régime alimentaire et des habitudes de l'animal",
      "Protection professionnelle incluse",
      "Communication directe avec l'Accompagnateur via messagerie sécurisée"
    ],
    localAvailability: {
      mainCity: "Accompagnateurs disponibles pour l'hébergement dans toute la France.",
      surroundingAreas: "Trouvez un foyer d'accueil près de chez vous ou sur votre trajet de vacances.",
      coverage: "Une large sélection de profils pour trouver la famille d'accueil idéale."
    },
    faq: [
      { question: "Dois-je fournir la nourriture ?", answer: "Oui, il est fortement conseillé de fournir la nourriture habituelle de votre chien pour éviter tout trouble digestif lié à un changement de régime." },
      { question: "Mon chien dormira-t-il à l'intérieur ?", answer: "Absolument. Tous nos Accompagnateurs hébergent les animaux à l'intérieur de leur domicile, dans des conditions de confort optimales." },
      { question: "Puis-je visiter le domicile avant ?", answer: "Oui, nous encourageons vivement une rencontre préalable pour s'assurer que l'environnement convient parfaitement à votre animal." },
      { question: "Que se passe-t-il en cas d'urgence ?", answer: "L'Accompagnateur dispose de vos coordonnées d'urgence et de celles de votre vétérinaire. DogWalking assure également une assistance en cas de besoin." }
    ]
  },
  "garderie-chien": {
    id: "garderie",
    slug: "garderie-chien",
    title: "Garderie de jour",
    metaTitle: "Garderie de jour pour chien | Accompagnateurs Certifiés | DogWalking",
    metaDescription: "Votre chien passe la journée chez un Accompagnateur Certifié. Jeux, socialisation et attention. Preuves visuelles obligatoires et paiement sécurisé en attente.",
    h1: "Garderie de jour – Une journée active et entourée",
    heroDescription: "Confiez votre chien à un Accompagnateur Certifié pour la journée : il bénéficiera de jeux, de promenades et d'une compagnie constante.",
    localZoneMention: "Service disponible partout en France",
    heroImage: garderieHero,
    image: garderieSalle,
    images: [
      { src: garderieSalle, alt: "Chien s'amusant avec des jouets en garderie de jour" },
      { src: garderieSocial, alt: "Socialisation encadrée entre deux chiens chez un Accompagnateur" },
      { src: garderieRepos, alt: "Sieste méritée après une matinée d'activités en garderie" }
    ],
    minPrice: 10,
    priceLabel: "À partir de",
    duration: "Journée",
    description: {
      intro: "La garderie de jour est la solution parfaite pour les Propriétaires qui travaillent de longues heures et ne souhaitent pas laisser leur chien seul à la maison. Votre compagnon est accueilli le matin chez un Accompagnateur Certifié et récupéré le soir. Durant toute la journée, il participe à la vie du foyer, bénéficie de sorties régulières et d'interactions sociales stimulantes. C'est bien plus qu'une simple garde : c'est une journée d'éveil et de bien-être qui garantit un chien calme et équilibré à votre retour.",
      forWhom: "Ce service s'adresse aux chiens de tous âges qui ont besoin de compagnie ou de dépense d'énergie en journée. C'est particulièrement bénéfique pour les chiots en phase d'apprentissage de la propreté et de la socialisation, ou pour les chiens souffrant d'anxiété de séparation. Nos Accompagnateurs offrent un cadre sécurisé et une attention que seul un milieu familial peut apporter.",
      problemsSolved: "DogWalking résout le problème de la solitude prolongée et des comportements destructeurs liés à l'ennui. Grâce à la Preuve Visuelle Obligatoire, vous recevez des nouvelles de la journée de votre chien directement sur votre smartphone. Le système de paiement sécurisé assure que la prestation est validée selon vos critères : vous donnez votre code unique à l'Accompagnateur le soir lors de la récupération.",
      benefits: "Un chien stimulé physiquement et mentalement, mieux socialisé et moins stressé. Une tranquillité d'esprit totale pour le Propriétaire qui sait son animal entre de bonnes mains. Une protection professionnelle accompagne chaque journée de garderie pour une sécurité optimale."
    },
    howItWorks: {
      title: "Déroulement de la journée",
      intro: "Un emploi du temps adapté au rythme de chaque chien.",
      steps: [
        { title: "Dépôt le matin", description: "Vous déposez votre chien chez l'Accompagnateur Certifié. Preuve visuelle d'arrivée envoyée immédiatement." },
        { title: "Activités & Jeux", description: "La journée est rythmée par des promenades, des séances de jeux et des moments de repos." },
        { title: "Suivi en direct", description: "Réception de photos et vidéos durant la journée pour suivre les activités de votre compagnon." },
        { title: "Socialisation", description: "Interactions contrôlées et bienveillantes pour renforcer le bon comportement de l'animal." },
        { title: "Récupération", description: "Vous récupérez votre chien et transmettez le code unique pour libérer le paiement de la journée." }
      ],
      safety: "La sécurité est assurée par une surveillance constante et un environnement familial vérifié. Nos Accompagnateurs sont sélectionnés manuellement (35% d'acceptation).",
      dogWelfare: "Le respect du rythme biologique de l'animal (alternance activité/repos) est la priorité de nos Accompagnateurs Certifiés."
    },
    expertiseAdvantages: {
      experience: "Nos Accompagnateurs ont l'expertise nécessaire pour gérer la dynamique de groupe et les besoins individuels en journée.",
      protection: "Chaque journée de garderie est couverte par la protection DogWalking.",
      method: "Une pédagogie positive basée sur la récompense et le jeu pour une expérience enrichissante.",
      trust: "Une confiance vérifiée manuellement pour vous garantir un service professionnel et attentionné."
    },
    advantages: [
      "Zéro solitude pour votre chien durant vos heures de travail",
      "Socialisation encadrée et positive avec d'autres animaux",
      "Accompagnateurs Certifiés rigoureusement sélectionnés (35% d'acceptation)",
      "Paiement sécurisé et déblocage par code unique",
      "Preuves visuelles obligatoires durant la journée",
      "Alternance équilibrée entre dépenses physiques et repos",
      "Protection professionnelle incluse",
      "Compte-rendu de la journée lors de la récupération"
    ],
    localAvailability: {
      mainCity: "Garderie de jour disponible dans les zones urbaines et périurbaines de France.",
      surroundingAreas: "Trouvez un Accompagnateur sur votre trajet domicile-travail.",
      coverage: "Un réseau croissant pour faciliter votre quotidien de Propriétaire."
    },
    faq: [
      { question: "Quels sont les horaires de la garderie ?", answer: "Les horaires sont flexibles et définis d'un commun accord entre le Propriétaire et l'Accompagnateur." },
      { question: "Mon chien doit-il être à jour de ses vaccins ?", answer: "Oui, pour la sécurité de tous, les animaux accueillis en garderie doivent être à jour de leurs vaccinations obligatoires." },
      { question: "Puis-je apporter ses jouets ?", answer: "Bien sûr, apporter un objet familier peut aider votre chien à se sentir encore plus à l'aise." },
      { question: "Y a-t-il un jardin ?", answer: "Beaucoup de nos Accompagnateurs disposent d'un jardin sécurisé, cette information est précisée sur leur profil individuel." }
    ]
  },
  "garde-domicile": {
    id: "garde_domicile",
    slug: "garde-domicile",
    title: "Garde à votre domicile",
    metaTitle: "Garde d'animaux à domicile | Accompagnateurs Certifiés | DogWalking",
    metaDescription: "Un Accompagnateur Certifié DogWalking séjourne chez vous pour garder vos animaux. Sécurité, routine préservée, preuves visuelles et paiement sécurisé.",
    h1: "Garde à domicile – La sérénité absolue pour vos animaux",
    heroDescription: "Un Accompagnateur Certifié s'installe chez vous pour offrir une présence constante et rassurante à vos animaux dans leur foyer.",
    localZoneMention: "Service disponible partout en France",
    heroImage: gardeHero,
    image: gardeDomicile,
    images: [
      { src: gardeDomicile, alt: "Accompagnateur Certifié DogWalking veillant sur un chien dans son salon" },
      { src: gardeJardin, alt: "Jeux dans le jardin du Propriétaire sous la surveillance de l'Accompagnateur" },
      { src: gardeRepos, alt: "Soirée calme et rassurante pour l'animal grâce à la présence de l'Accompagnateur" }
    ],
    minPrice: 12,
    priceLabel: "À partir de",
    duration: "Par nuit",
    description: {
      intro: "La garde à votre domicile (ou 'house-sitting') est le service de luxe par excellence pour vos animaux. Un Accompagnateur Certifié DogWalking vient séjourner chez vous pour prendre soin de vos compagnons et veiller sur votre maison. C'est la solution ultime pour les animaux très attachés à leur territoire, les seniors ou les foyers multi-animaux. Vos compagnons ne subissent aucun changement de routine : ils dorment dans leur panier, mangent à leurs heures habituelles et profitent de leurs promenades de quartier, le tout sous la surveillance d'un professionnel dédié.",
      forWhom: "Ce service est idéal pour les Propriétaires qui s'absentent plusieurs jours et ne souhaitent pas déplacer leurs animaux. C'est particulièrement recommandé pour les chiens anxieux, les chats territoriaux ou si vous possédez plusieurs animaux (chiens, chats, oiseaux, etc.). C'est aussi une garantie de sécurité pour votre maison qui reste habitée et entretenue en votre absence.",
      problemsSolved: "DogWalking résout la double problématique de la garde d'animaux et de la sécurité du domicile. La Preuve Visuelle Obligatoire vous assure quotidiennement que vos animaux sont choyés et que tout se passe bien chez vous. Le paiement sécurisé garantit que le service est rendu selon vos exigences : vous ne communiquez le code unique qu'à votre retour, une fois la mission accomplie.",
      benefits: "Absence totale de stress pour vos animaux qui gardent tous leurs repères. Une maison surveillée et des plantes arrosées. Une protection professionnelle couvre l'Accompagnateur et vos animaux durant toute la mission. La tranquillité d'esprit d'un service haut de gamme validé par vos soins."
    },
    howItWorks: {
      title: "Organisation de la garde",
      intro: "Un protocole de confiance pour ouvrir votre porte en toute sérénité.",
      steps: [
        { title: "Rencontre & Sélection", description: "Rencontrez votre Accompagnateur Certifié chez vous pour valider le 'feeling' et présenter les lieux." },
        { title: "Réservation & Paiement en Attente", description: "Validation des dates et blocage sécurisé des fonds sur la plateforme DogWalking." },
        { title: "Prise de Poste", description: "L'Accompagnateur s'installe chez vous. Envoi immédiat d'une photo/vidéo de début de mission." },
        { title: "Vie Quotidienne", description: "Suivi rigoureux de vos consignes et envoi quotidien de preuves visuelles de vos animaux." },
        { title: "Retour & Validation", description: "À votre retour, vous récupérez votre foyer et transmettez le code unique pour libérer le paiement." }
      ],
      safety: "La sécurité est garantie par notre sélection manuelle ultra-sélective (35% d'acceptation) et la vérification des documents officiels (CNI). Le code unique est votre garantie finale.",
      dogWelfare: "Le bien-être est maximal car l'animal ne subit aucun stress de transport ou de changement d'environnement."
    },
    expertiseAdvantages: {
      experience: "Nos Accompagnateurs en garde à domicile sont des profils matures et responsables, habitués à gérer des propriétés.",
      protection: "Une protection professionnelle DogWalking est incluse pour sécuriser la mission à votre domicile.",
      method: "Une présence discrète et respectueuse de votre intimité, entièrement tournée vers le bien-être de vos animaux.",
      trust: "Une confiance vérifiée manuellement pour vous permettre de partir l'esprit léger."
    },
    advantages: [
      "Zéro changement pour vos animaux (routine 100% préservée)",
      "Présence constante et rassurante à votre domicile",
      "Accompagnateurs Certifiés sélectionnés avec la plus grande rigueur (35%)",
      "Paiement sécurisé et déblocage par code unique au retour",
      "Preuves visuelles quotidiennes obligatoires",
      "Surveillance et entretien léger de votre domicile inclus",
      "Solution idéale pour les foyers multi-animaux",
      "Protection professionnelle incluse"
    ],
    localAvailability: {
      mainCity: "Service de garde à domicile disponible dans toute la France.",
      surroundingAreas: "Nos Accompagnateurs se déplacent pour des missions de moyenne et longue durée.",
      coverage: "Un service exclusif pour une sérénité totale durant vos absences."
    },
    faq: [
      { question: "L'Accompagnateur peut-il s'absenter de la maison ?", answer: "Oui, pour ses besoins personnels (courses, etc.), mais il doit respecter les durées d'absence maximales convenues avec vous." },
      { question: "Comment sont gérés les frais de nourriture de l'Accompagnateur ?", answer: "L'Accompagnateur assure sa propre nourriture, sauf accord particulier entre vous et lui." },
      { question: "Puis-je confier d'autres tâches (courrier, plantes) ?", answer: "Oui, l'entretien léger du domicile fait partie intégrante du service de house-sitting." },
      { question: "Que se passe-t-il en cas de problème technique dans la maison ?", answer: "Vous devez laisser les coordonnées de vos artisans habituels ou d'une personne de confiance à contacter." }
    ]
  },
  "visite-sanitaire": {
    id: "visite_sanitaire",
    slug: "visite-sanitaire",
    title: "Visite Sanitaire & Hygiène",
    metaTitle: "Visite Sanitaire pour animaux | Accompagnateurs Certifiés | DogWalking",
    metaDescription: "Soins d'hygiène et bien-être pour votre animal à domicile. Brossage, nettoyage, soins légers. Preuves visuelles et paiement sécurisé en attente.",
    h1: "Visite Sanitaire – Le bien-être et l'hygiène à domicile",
    heroDescription: "Nos Accompagnateurs Certifiés assurent les soins d'hygiène de base de votre animal pour son confort et sa santé au quotidien.",
    localZoneMention: "Service disponible partout en France",
    heroImage: visiteSanitaireHero,
    image: visiteSoins,
    images: [
      { src: visiteSoins, alt: "Accompagnateur Certifié DogWalking brossant délicatement un chien" },
      { src: visiteAccueil, alt: "Nettoyage des yeux et des oreilles avec douceur" },
      { src: visiteRepas, alt: "Vérification de l'état général de l'animal pendant la visite" }
    ],
    minPrice: 16,
    priceLabel: "À partir de",
    duration: "45 min",
    description: {
      intro: "La visite sanitaire est un service spécialisé axé sur l'hygiène et le bien-être physique de votre animal. Durant 45 minutes, un Accompagnateur Certifié se déplace à votre domicile pour effectuer les soins de base essentiels : brossage minutieux (idéal en période de mue), nettoyage des yeux et des oreilles, vérification des coussinets ou administration de soins légers prescrits. Ce n'est pas un toilettage complet, mais un entretien régulier qui prévient les problèmes de santé et assure le confort de votre compagnon entre deux rendez-vous chez le professionnel.",
      forWhom: "Ce service est idéal pour les Propriétaires d'animaux à poils longs nécessitant un brossage fréquent, pour les animaux âgés ayant besoin d'une aide à la toilette, ou pour assurer le suivi d'un traitement simple en votre absence. C'est aussi une excellente solution pour les animaux stressés par les salons de toilettage, car les soins sont prodigués dans le calme de leur foyer.",
      problemsSolved: "DogWalking résout le problème du manque de temps pour l'entretien régulier de l'animal. Nous éliminons le stress du transport pour les soins de base. Grâce à la Preuve Visuelle Obligatoire, vous recevez des photos 'avant/après' ou des vidéos du soin en cours. Le paiement sécurisé vous garantit la réalisation effective du soin : vous donnez le code unique une fois la visite sanitaire terminée.",
      benefits: "Un animal propre, sans nœuds et en bonne santé. Une détection précoce d'éventuels problèmes cutanés ou parasitaires. Une protection professionnelle accompagne chaque visite. Le confort d'un soin professionnel à domicile validé par vos soins via le code unique."
    },
    howItWorks: {
      title: "Déroulement du soin",
      intro: "Une approche douce et méthodique pour le confort de l'animal.",
      steps: [
        { title: "Préparation", description: "L'Accompagnateur prépare le matériel (fourni par le Propriétaire) et met l'animal en confiance." },
        { title: "Preuve de début", description: "Envoi d'une photo de l'animal avant le début des soins pour valider la prise en charge." },
        { title: "Soins d'Hygiène", description: "Réalisation méthodique des soins : brossage, nettoyage, vérifications sanitaires." },
        { title: "Rapport de Soin", description: "L'Accompagnateur note ses observations sur l'état général de la peau, du poil et des yeux." },
        { title: "Validation", description: "Envoi de la preuve finale et transmission du code unique pour libérer le paiement." }
      ],
      safety: "Les soins sont prodigués sans contrainte excessive. Nos Accompagnateurs sont sélectionnés pour leur patience et leur douceur (35% d'acceptation).",
      dogWelfare: "Le bien-être est la priorité absolue : le soin doit être un moment de détente pour l'animal."
    },
    expertiseAdvantages: {
      experience: "Nos Accompagnateurs en visite sanitaire ont une solide expérience des manipulations animalières et des soins de base.",
      protection: "Chaque prestation est protégée par la plateforme DogWalking.",
      method: "Une technique douce adaptée à la sensibilité de chaque animal.",
      trust: "Une confiance vérifiée manuellement pour des soins prodigués avec professionnalisme."
    },
    advantages: [
      "Entretien régulier pour la santé et le confort de l'animal",
      "Zéro stress : les soins sont faits à domicile",
      "Accompagnateurs Certifiés sélectionnés pour leur douceur (35%)",
      "Paiement sécurisé et déblocage par code unique",
      "Preuves visuelles obligatoires des soins effectués",
      "Détection précoce d'anomalies (tiques, rougeurs, etc.)",
      "Idéal pour les animaux âgés ou stressés",
      "Protection professionnelle incluse"
    ],
    localAvailability: {
      mainCity: "Visite sanitaire disponible dans toutes les grandes agglomérations.",
      surroundingAreas: "Trouvez un Accompagnateur compétent près de chez vous pour un suivi régulier.",
      coverage: "Un service de proximité pour le bien-être quotidien de votre compagnon."
    },
    faq: [
      { question: "Dois-je fournir le matériel ?", answer: "Oui, pour des raisons d'hygiène, l'Accompagnateur utilise vos brosses, lotions et produits habituels." },
      { question: "L'Accompagnateur peut-il couper les griffes ?", answer: "Ce soin peut être réalisé si l'animal est coopératif et si l'Accompagnateur possède l'expérience nécessaire, à confirmer lors de la réservation." },
      { question: "Est-ce un toilettage complet ?", answer: "Non, c'est une visite d'entretien et d'hygiène. Elle ne remplace pas une tonte ou un bain complet chez un toiletteur professionnel." },
      { question: "Puis-je demander l'administration d'un médicament ?", answer: "Oui, si vous fournissez l'ordonnance et les instructions précises, nos Accompagnateurs peuvent assurer ce suivi." }
    ]
  },
  "accompagnement-veterinaire": {
    id: "accompagnement_veterinaire",
    slug: "accompagnement-veterinaire",
    title: "Accompagnement Vétérinaire",
    metaTitle: "Accompagnement Vétérinaire | Accompagnateurs Certifiés | DogWalking",
    metaDescription: "Transport et accompagnement de votre animal chez le vétérinaire. Prise en charge complète, preuves visuelles et paiement sécurisé en attente.",
    h1: "Accompagnement Vétérinaire – La logistique santé simplifiée",
    heroDescription: "Nos Accompagnateurs Certifiés prennent en charge le transport et l'accompagnement de votre animal pour ses rendez-vous santé.",
    localZoneMention: "Service disponible partout en France",
    heroImage: veterinaryHero,
    image: vetAccompagnement,
    images: [
      { src: vetAccompagnement, alt: "Accompagnateur Certifié DogWalking accompagnant un chien en clinique" },
      { src: vetTransport, alt: "Transport sécurisé de l'animal vers son rendez-vous" },
      { src: vetAttente, alt: "Présence rassurante de l'Accompagnateur en salle d'attente" }
    ],
    minPrice: 13,
    priceLabel: "À partir de",
    duration: "Variable",
    description: {
      intro: "L'accompagnement vétérinaire est le service indispensable pour les Propriétaires dont l'emploi du temps ne permet pas de se rendre aux rendez-vous médicaux de leur animal. Un Accompagnateur Certifié vient chercher votre compagnon à votre domicile, assure son transport sécurisé jusqu'à la clinique vétérinaire, assiste à la consultation si nécessaire et ramène l'animal chez vous. C'est la garantie que la santé de votre compagnon n'est jamais négligée, même quand vous êtes débordé. L'Accompagnateur assure également la transmission fidèle des informations et des prescriptions du vétérinaire.",
      forWhom: "Ce service s'adresse aux Propriétaires actifs, aux personnes sans moyen de transport adapté, ou aux personnes à mobilité réduite. C'est aussi une solution précieuse pour les urgences programmées ou les suivis réguliers (vaccins, contrôles, soins chroniques). Nos Accompagnateurs gèrent toute la logistique pour vous.",
      problemsSolved: "DogWalking résout le stress du transport et les contraintes horaires. Nous éliminons l'incertitude grâce à la Preuve Visuelle Obligatoire : vous recevez une photo de la prise en charge, une autre à la clinique et une dernière au retour. Le paiement sécurisé sécurise la mission : vous ne libérez les fonds qu'après avoir reçu le compte-rendu de la consultation et récupéré votre animal en donnant votre code unique.",
      benefits: "Un suivi santé rigoureux pour votre animal. Un transport sécurisé et professionnel. Une protection professionnelle accompagne chaque trajet. La tranquillité d'esprit d'un service complet validé par vos soins via le code unique."
    },
    howItWorks: {
      title: "Le parcours santé",
      intro: "Une prise en charge sérieuse pour la santé de votre compagnon.",
      steps: [
        { title: "Prise en charge", description: "L'Accompagnateur récupère l'animal et son carnet de santé à votre domicile. Envoi d'une preuve photo." },
        { title: "Transport Sécurisé", description: "Trajet vers la clinique dans un véhicule adapté ou selon les modalités convenues." },
        { title: "La Consultation", description: "L'Accompagnateur accompagne l'animal durant le rendez-vous et note les consignes du vétérinaire." },
        { title: "Retour & Prescription", description: "Retour au domicile, remise de l'animal, du carnet de santé et des éventuels médicaments." },
        { title: "Validation", description: "Transmission du compte-rendu médical et libération du paiement par le code unique." }
      ],
      safety: "Le transport est effectué selon les normes de sécurité. Nos Accompagnateurs sont sélectionnés pour leur fiabilité (35% d'acceptation).",
      dogWelfare: "Le bien-être est assuré par une présence rassurante durant un moment souvent stressant pour l'animal."
    },
    expertiseAdvantages: {
      experience: "Nos Accompagnateurs en service vétérinaire sont habitués au milieu médical et savent rassurer les animaux.",
      protection: "Le transport et l'accompagnement sont protégés par la plateforme DogWalking.",
      method: "Une organisation rigoureuse pour respecter les horaires de rendez-vous et les consignes médicales.",
      trust: "Une confiance vérifiée manuellement pour déléguer la santé de votre animal en toute sérénité."
    },
    advantages: [
      "Prise en charge complète du rendez-vous vétérinaire",
      "Transport sécurisé aller-retour inclus",
      "Accompagnateurs Certifiés rigoureusement sélectionnés (35%)",
      "Paiement sécurisé et déblocage par code unique",
      "Preuves visuelles à chaque étape (départ, clinique, retour)",
      "Transmission fidèle du compte-rendu médical",
      "Gain de temps précieux pour le Propriétaire",
      "Protection professionnelle incluse"
    ],
    localAvailability: {
      mainCity: "Service disponible dans toutes les agglomérations disposant de cliniques vétérinaires.",
      surroundingAreas: "Accompagnateurs mobiles pour couvrir vos rendez-vous de proximité.",
      coverage: "Un service essentiel pour la continuité des soins de vos animaux."
    },
    faq: [
      { question: "L'Accompagnateur peut-il avancer les frais vétérinaires ?", answer: "Non, les frais de consultation et de médicaments doivent être réglés directement par le Propriétaire (par téléphone à la clinique ou via un moyen de paiement laissé sur place)." },
      { question: "Quels animaux peuvent être accompagnés ?", answer: "Tous les animaux de compagnie pouvant être transportés en sécurité (chiens, chats, NAC)." },
      { question: "Comment sont transmises les consignes médicales ?", answer: "L'Accompagnateur vous remet un compte-rendu écrit ou vocal et vous rend le carnet de santé à jour." },
      { question: "Puis-je réserver pour une urgence ?", answer: "Le service est principalement destiné aux rendez-vous programmés, mais vous pouvez tenter de trouver un Accompagnateur disponible pour une urgence immédiate." }
    ]
  }
};

export const getServiceBySlug = (slug: string): ServiceData | undefined => {
  return servicesData[slug];
};

export const getAllServices = (): ServiceData[] => {
  return Object.values(servicesData);
};
