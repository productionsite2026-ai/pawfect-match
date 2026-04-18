import { Helmet } from "react-helmet-async";

export interface SemanticFAQItem {
  question: string;
  answer: string;
}

interface SemanticFAQProps {
  items: SemanticFAQItem[];
  title?: string;
  description?: string;
  includeJsonLd?: boolean;
}

/**
 * Composant FAQ sémantique HTML5 avec balises <details> et <summary>
 * Conforme aux directives 2026 pour l'IA-Ready
 * 
 * Avantages :
 * - Balises HTML5 natives : <details> et <summary> sont nativement comprises par les moteurs de recherche
 * - Double balisage : JSON-LD FAQPage + HTML5 sémantique
 * - Accessibilité : Complètement accessible au clavier (Enter/Space pour ouvrir/fermer)
 * - Pas de dépendance JavaScript : Fonctionne même sans JavaScript
 * - Indexation IA : Le contenu est visible dans le DOM, pas caché par JavaScript
 */
export const SemanticFAQ = ({
  items,
  title = "Questions Fréquentes",
  description,
  includeJsonLd = true,
}: SemanticFAQProps) => {
  // Générer le schéma FAQPage pour Google AI Overviews
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": items.map((item) => ({
      "@type": "Question",
      "name": item.question,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": item.answer,
      },
    })),
  };

  return (
    <>
      {includeJsonLd && (
        <Helmet>
          <script type="application/ld+json">
            {JSON.stringify(faqSchema)}
          </script>
        </Helmet>
      )}

      <div className="w-full">
        {title && (
          <h2 className="text-2xl md:text-3xl font-bold mb-2">{title}</h2>
        )}
        {description && (
          <p className="text-muted-foreground mb-6">{description}</p>
        )}

        {/* Utiliser les balises <details> et <summary> natives pour la sémantique HTML5 */}
        <div className="space-y-2">
          {items.map((item, index) => (
            <details
              key={index}
              className="group border border-border rounded-lg hover:border-primary/50 transition-colors"
            >
              <summary className="flex items-center justify-between cursor-pointer p-4 font-semibold text-base hover:bg-muted/50 transition-colors">
                <span>{item.question}</span>
                <span className="text-muted-foreground group-open:rotate-180 transition-transform duration-300">
                  ▼
                </span>
              </summary>

              {/* Contenu visible dans le DOM pour l'indexation IA */}
              <div className="px-4 pb-4 pt-0 text-muted-foreground border-t border-border">
                <div
                  dangerouslySetInnerHTML={{ __html: item.answer }}
                  className="prose prose-sm max-w-none"
                />
              </div>
            </details>
          ))}
        </div>
      </div>
    </>
  );
};

export default SemanticFAQ;
