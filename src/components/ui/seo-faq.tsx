import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { HelpCircle } from "lucide-react";

export interface FAQItem {
  question: string;
  answer: string;
}

interface SEOFAQProps {
  title?: string;
  subtitle?: string;
  faqs: FAQItem[];
  className?: string;
}

export const SEOFAQ = ({ 
  title = "Questions fréquentes", 
  subtitle,
  faqs, 
  className = "" 
}: SEOFAQProps) => {
  // Generate JSON-LD structured data for FAQ
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": faqs.map(faq => ({
      "@type": "Question",
      "name": faq.question,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": faq.answer
      }
    }))
  };

  return (
    <section className={`py-12 ${className}`}>
      {/* JSON-LD Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">

          <Accordion type="single" collapsible className="space-y-3">
            {faqs.map((faq, index) => (
              <AccordionItem 
                key={index} 
                value={`faq-${index}`}
                className="bg-card border border-border rounded-xl px-6 data-[state=open]:shadow-md transition-shadow"
              >
                <AccordionTrigger className="text-left font-semibold hover:no-underline py-4">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground pb-4 leading-relaxed">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </div>
    </section>
  );
};

// Predefined FAQ collections for reuse
export const tarifsFAQs: FAQItem[] = [
  {
    question: "Comment sont calculés les tarifs des promenades de chien ?",
    answer: "Les tarifs sont fixés librement par chaque promeneur, avec un minimum garanti par DogWalking (8€ pour une promenade). Le prix final dépend de la durée, du nombre de chiens, et des services additionnels. La commission de 13% couvre la protection, le support client et la plateforme sécurisée."
  },
  {
    question: "Qu'est-ce que le paiement sécurisé et comment ça fonctionne ?",
    answer: "Le paiement sécurisé est un système de sécurité où votre argent est bloqué sur un compte tiers pendant 24 à 48 heures. Le promeneur ne reçoit le paiement qu'après avoir envoyé une preuve photo/vidéo de la prestation. Si aucune preuve n'est fournie, vous êtes automatiquement remboursé."
  },
  {
    question: "La commission de 13% est-elle justifiée ?",
    answer: "La commission de 13% inclut : l'protection complète, la vérification complète des promeneurs (Identité vérifiée), le système de paiement sécurisé, le support client disponible, et la plateforme technologique. C'est un package tout compris pour votre tranquillité."
  },
  {
    question: "Puis-je laisser un pourboire au promeneur ?",
    answer: "Absolument ! Les pourboires sont possibles et très appréciés des promeneurs. Vous pouvez ajouter un pourboire directement via la plateforme après la prestation, sans aucune commission supplémentaire prélevée par DogWalking."
  },
  {
    question: "Y a-t-il des frais cachés ou des abonnements obligatoires ?",
    answer: "Non, il n'y a aucun frais caché ni abonnement obligatoire pour les Propriétaires. Vous payez uniquement le service réservé. Les promeneurs peuvent souscrire à un abonnement PRO optionnel (6-12€/mois) pour des avantages supplémentaires, mais ce n'est pas requis."
  },
  {
    question: "Comment sont protégés mes paiements ?",
    answer: "Vos paiements sont traités via Stripe, leader mondial du paiement en ligne, conforme aux normes PCI-DSS. Vos données bancaires ne sont jamais stockées sur nos serveurs. Le système de paiement sécurisé garantit que le promeneur n'est payé qu'après validation de la prestation."
  }
];

export const securiteFAQs: FAQItem[] = [
  {
    question: "Comment les promeneurs sont-ils vérifiés par DogWalking ?",
    answer: "Chaque promeneur doit fournir une pièce d'identité (CNI ou passeport) et une preuve d'protection professionnelle. Notre équipe vérifie manuellement chaque document avant validation. Ce processus prend généralement 24 à 48 heures ouvrées."
  },
  {
    question: "Que se passe-t-il si mon chien est blessé pendant une promenade ?",
    answer: "Tous nos promeneurs disposent d'une protection complète. En cas de problème, contactez immédiatement notre support. Nous déclenchons la procédure de résolution et vous assistons dans toutes les démarches. Le paiement reste bloqué jusqu'à résolution."
  },
  {
    question: "Comment fonctionne le système de preuves obligatoires ?",
    answer: "À chaque prestation, le promeneur doit envoyer une photo ou vidéo de votre chien accompagnée d'un message décrivant le déroulement. Sans cette preuve, le paiement reste bloqué en paiement sécurisé et peut être remboursé. Les preuves sont conservées dans votre historique pour référence."
  },
  {
    question: "Que faire si je ne suis pas satisfait d'une prestation ?",
    answer: "Vous disposez de 24 heures après réception de la preuve pour signaler un problème. Notre équipe de médiation examine votre réclamation et peut décider d'un remboursement partiel ou total selon les circonstances. Le dialogue avec le promeneur est toujours privilégié en premier lieu."
  },
  {
    question: "Les promeneurs ont-ils accès à mes informations personnelles ?",
    answer: "Les promeneurs n'ont accès qu'aux informations nécessaires à la prestation : prénom, photo du chien, adresse de récupération, et consignes spéciales. Votre numéro de téléphone et email restent masqués. La communication se fait exclusivement via la messagerie sécurisée de la plateforme."
  },
  {
    question: "DogWalking vérifie-t-il régulièrement les promeneurs ?",
    answer: "Oui, nous effectuons des vérifications continues. Les promeneurs doivent renouveler leurs documents annuellement. Nous surveillons également les avis et notes. Tout promeneur avec des signalements récurrents ou une note inférieure à 4/5 fait l'objet d'une enquête et peut être suspendu."
  }
];

export const promenadeFAQs: FAQItem[] = [
  {
    question: "Combien de temps dure une promenade de chien standard ?",
    answer: "Les promenades durent généralement entre 30 minutes et 2 heures selon vos besoins et ceux de votre chien. La durée la plus populaire est de 45 minutes à 1 heure, idéale pour une bonne dépense d'énergie. Chaque promeneur indique ses options de durée sur son profil."
  },
  {
    question: "Mon chien peut-il être promené avec d'autres chiens ?",
    answer: "Cela dépend du promeneur et de son profil. Certains proposent des promenades individuelles, d'autres des promenades en petit groupe (2-3 chiens maximum). Cette information est clairement indiquée sur le profil du promeneur. Si votre chien a des besoins spécifiques ou des problèmes de socialisation, privilégiez les promenades individuelles."
  },
  {
    question: "Que faire si mon chien a des besoins médicaux particuliers ?",
    answer: "Lors de la réservation, vous pouvez indiquer tous les besoins spéciaux de votre chien : médicaments à administrer, restrictions alimentaires, problèmes de mobilité, etc. Le promeneur valide qu'il peut gérer ces besoins avant d'accepter la réservation. N'hésitez pas à discuter en détail via la messagerie."
  },
  {
    question: "Comment le promeneur récupère-t-il mon chien ?",
    answer: "Vous convenez d'un point de rendez-vous avec le promeneur, généralement à votre domicile. Vous pouvez laisser les clés si vous êtes absent, ou confier votre chien en main propre. La laisse, le collier et les accessoires restent avec le chien pendant la promenade."
  },
  {
    question: "Quelles sont les conditions météo pour les promenades ?",
    answer: "Les promenades ont lieu par tous les temps, sauf conditions extrêmes (canicule, tempête, verglas dangereux). En cas de météo défavorable, le promeneur peut proposer un report ou une adaptation (promenade plus courte mais plus fréquente). La sécurité de votre chien reste la priorité."
  },
  {
    question: "Puis-je suivre la promenade en temps réel ?",
    answer: "Actuellement, le suivi se fait via les preuves photo/vidéo envoyées pendant et après la promenade. Le promeneur vous envoie obligatoirement au moins une preuve avec message. De nombreux promeneurs envoient plusieurs photos tout au long de la promenade pour votre tranquillité."
  }
];

export const deveniAccompagnateur_CertifiéFAQs: FAQItem[] = [
  {
    question: "Quelles sont les conditions pour devenir promeneur DogWalking ?",
    answer: "Vous devez être majeur, résider en France, et fournir : une pièce d'identité valide, une preuve d'protection professionnelle, et une photo de profil réelle. Aucun diplôme spécifique n'est requis, mais l'expérience avec les chiens est un plus apprécié."
  },
  {
    question: "Combien puis-je gagner comme promeneur de chien ?",
    answer: "Les revenus varient selon votre disponibilité et votre zone. En moyenne, un promeneur actif gagne entre 500€ et 2000€ par mois. Les tarifs minimum sont de 8€ pour une promenade, mais vous fixez librement vos prix. Après la commission de 13%, vous percevez 87% du montant."
  },
  {
    question: "Dois-je déclarer mes revenus de promeneur ?",
    answer: "Oui, les revenus de promenade de chien doivent être déclarés. Vous pouvez exercer en tant qu'auto-entrepreneur (micro-entreprise) ou déclarer en BNC si vous êtes particulier. DogWalking vous fournit un récapitulatif annuel de vos gains pour faciliter votre déclaration fiscale."
  },
  {
    question: "Comment fonctionne le système de paiement pour les promeneurs ?",
    answer: "Après chaque prestation validée (preuve envoyée et période paiement sécurisé terminée), le montant moins la commission est versé sur votre compte Stripe Connect. Les virements vers votre compte bancaire peuvent être configurés en automatique ou à la demande, généralement sous 2-3 jours ouvrés."
  },
  {
    question: "Puis-je choisir mes horaires et mes zones d'intervention ?",
    answer: "Absolument ! Vous êtes totalement libre de définir vos disponibilités : jours, créneaux horaires, zones géographiques. Vous pouvez modifier ces paramètres à tout moment depuis votre tableau de bord. Vous choisissez également d'accepter ou refuser chaque demande de réservation."
  },
  {
    question: "Que se passe-t-il si un incident survient pendant une promenade ?",
    answer: "En cas d'incident, contactez immédiatement notre support et les services d'urgence si nécessaire. Votre protection couvre les dommages causés. Documentez l'incident avec photos et témoignages. DogWalking vous accompagne dans les démarches et la résolution du litige."
  }
];
