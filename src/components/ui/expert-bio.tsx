import { Helmet } from "react-helmet-async";
import { Badge } from "@/components/ui/badge";
import { ExternalLink } from "lucide-react";

export interface ExpertProfile {
  id: string;
  name: string;
  title: string;
  expertise: string[];
  bio: string;
  image?: string;
  certifications?: string[];
  linkedinUrl?: string;
  yearsExperience?: number;
}

interface ExpertBioProps {
  expert: ExpertProfile;
  showJsonLd?: boolean;
}

/**
 * Composant pour afficher la biographie d'un expert
 * Génère automatiquement le balisage Person Schema pour renforcer l'E-E-A-T
 * Utilisé sur les pages de services et les articles de blog
 */
export const ExpertBio = ({
  expert,
  showJsonLd = true,
}: ExpertBioProps) => {
  // Générer le schéma Person pour l'expertise
  const personSchema = {
    "@context": "https://schema.org",
    "@type": "Person",
    "@id": `https://dogwalking.fr/expert/${expert.id}`,
    "name": expert.name,
    "jobTitle": expert.title,
    "description": expert.bio,
    "image": expert.image,
    "knowsAbout": expert.expertise,
    ...(expert.certifications && {
      "award": expert.certifications,
    }),
    ...(expert.yearsExperience && {
      "workLocation": {
        "@type": "Place",
        "name": "France",
      },
    }),
    ...(expert.linkedinUrl && {
      "sameAs": expert.linkedinUrl,
    }),
  };

  return (
    <>
      {showJsonLd && (
        <Helmet>
          <script type="application/ld+json">
            {JSON.stringify(personSchema)}
          </script>
        </Helmet>
      )}

      <div className="bg-muted/50 rounded-lg p-6 md:p-8 border border-border">
        <div className="flex flex-col md:flex-row gap-6 items-start md:items-center">
          {expert.image && (
            <div className="flex-shrink-0">
              <img
                src={expert.image}
                alt={`${expert.name}, ${expert.title}`}
                className="w-24 h-24 md:w-32 md:h-32 rounded-full object-cover border-4 border-primary/20"
              />
            </div>
          )}

          <div className="flex-1">
            <div className="mb-2">
              <h3 className="text-xl md:text-2xl font-bold">{expert.name}</h3>
              <p className="text-primary font-semibold">{expert.title}</p>
            </div>

            <p className="text-muted-foreground mb-4 leading-relaxed">
              {expert.bio}
            </p>

            {expert.expertise && expert.expertise.length > 0 && (
              <div className="mb-4">
                <p className="text-sm font-semibold mb-2">Domaines d'expertise :</p>
                <div className="flex flex-wrap gap-2">
                  {expert.expertise.map((exp, index) => (
                    <Badge key={index} variant="secondary">
                      {exp}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            {expert.certifications && expert.certifications.length > 0 && (
              <div className="mb-4">
                <p className="text-sm font-semibold mb-2">Certifications :</p>
                <ul className="text-sm text-muted-foreground space-y-1">
                  {expert.certifications.map((cert, index) => (
                    <li key={index}>✓ {cert}</li>
                  ))}
                </ul>
              </div>
            )}

            {expert.yearsExperience && (
              <p className="text-sm text-muted-foreground">
                <strong>{expert.yearsExperience}+ ans d'expérience</strong> dans le domaine
              </p>
            )}

            {expert.linkedinUrl && (
              <a
                href={expert.linkedinUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-primary hover:underline text-sm mt-4"
              >
                Voir le profil LinkedIn
                <ExternalLink className="w-4 h-4" />
              </a>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default ExpertBio;
