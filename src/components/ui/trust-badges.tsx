import { Shield, Camera, Lock, CheckCircle, Award } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

export interface TrustBadgeItem {
  icon: React.ReactNode;
  title: string;
  description: string;
  highlight?: string;
}

interface TrustBadgesProps {
  items?: TrustBadgeItem[];
  layout?: "grid" | "horizontal";
  size?: "sm" | "md" | "lg";
}

/**
 * Composant pour afficher les preuves d'E-E-A-T (Expérience, Expertise, Autorité, Confiance)
 * Utilise les fonctionnalités clés du README : paiement sécurisé, Vérification, Preuves photo
 */
export const TrustBadges = ({
  items,
  layout = "grid",
  size = "md",
}: TrustBadgesProps) => {
  // Badges par défaut basés sur les fonctionnalités clés d'Open-Go
  const defaultItems: TrustBadgeItem[] = [
    {
      icon: <Lock className="w-6 h-6" />,
      title: "Paiement Sécurisé",
      description:
        "Votre argent est bloqué jusqu'à la validation du service. Zéro risque.",
      highlight: "100% sécurisé",
    },
    {
      icon: <Shield className="w-6 h-6" />,
      title: "Accompagnateurs Certifiés",
      description:
        "Chaque Accompagnateur Certifié est rigoureusement sélectionné et vérifié par notre équipe.",
      highlight: "35% d'acceptation",
    },
    {
      icon: <Camera className="w-6 h-6" />,
      title: "Preuves Photo/Vidéo",
      description:
        "Suivi en temps réel avec photos et vidéos obligatoires à chaque mission.",
      highlight: "Transparence totale",
    },
    {
      icon: <Award className="w-6 h-6" />,
      title: "Protection Incluse",
      description: "Chaque mission est protégée et suivie de bout en bout.",
      highlight: "Protection maximale",
    },
  ];

  const displayItems = items || defaultItems;

  const containerClass = {
    grid: "grid md:grid-cols-2 lg:grid-cols-4 gap-4",
    horizontal: "flex flex-wrap gap-4",
  };

  const cardClass = {
    sm: "p-4",
    md: "p-6",
    lg: "p-8",
  };

  const iconClass = {
    sm: "w-5 h-5",
    md: "w-6 h-6",
    lg: "w-8 h-8",
  };

  return (
    <div className={containerClass[layout]}>
      {displayItems.map((item, index) => (
        <Card
          key={index}
          className="border-2 hover:border-primary/50 transition-colors"
        >
          <CardContent className={cardClass[size]}>
            <div className={`text-primary mb-3 ${iconClass[size]}`}>
              {item.icon}
            </div>
            <h3 className="font-bold mb-2 text-sm md:text-base">
              {item.title}
            </h3>
            <p className="text-muted-foreground text-xs md:text-sm mb-2">
              {item.description}
            </p>
            {item.highlight && (
              <p className="text-primary font-semibold text-xs">
                ✓ {item.highlight}
              </p>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default TrustBadges;
