import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Helmet } from "react-helmet-async";

export interface SEOAccordionItem {
  question: string;
  answer: string;
}

interface SEOAccordionProps {
  items: SEOAccordionItem[];
  title?: string;
  description?: string;
  includeJsonLd?: boolean;
}

/**
 * Composant Accordion SEO-optimisé pour les FAQ
 * - Utilise les balises sémantiques <details> et <summary> via Shadcn
 * - Génère automatiquement le balisage FAQPage en JSON-LD pour l'indexation IA
 * - Assure la visibilité du contenu masqué pour Google et les moteurs de recherche
 */
export const SEOAccordion = ({
  items,
  title = "Questions Fréquentes",
  description,
  includeJsonLd = true,
}: SEOAccordionProps) => {
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

        <Accordion type="single" collapsible className="w-full">
          {items.map((item, index) => (
            <AccordionItem key={index} value={`faq-${index}`}>
              <AccordionTrigger className="text-left hover:no-underline">
                <span className="font-semibold text-base">
                  {item.question}
                </span>
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground pt-4">
                {/* Contenu visible dans le DOM pour l'indexation */}
                <div
                  dangerouslySetInnerHTML={{ __html: item.answer }}
                  className="prose prose-sm max-w-none"
                />
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </>
  );
};

export default SEOAccordion;
