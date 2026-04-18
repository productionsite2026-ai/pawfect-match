import { Helmet } from "react-helmet-async";

interface SEOHeadProps {
  title?: string;
  description?: string;
  canonical?: string;
  image?: string;
  type?: "website" | "article" | "service";
  noindex?: boolean;
}

export const SEOHead = ({
  title = "DogWalking | Service de promenade et garde de chien en France",
  description = "Trouvez un Accompagnateur Certifié de confiance près de chez vous. Profils vérifiés, paiement sécurisé en attente, preuves visuelles obligatoires. Réservez en quelques clics.",
  canonical = "https://dogwalking.fr",
  image = "https://dogwalking.fr/og-image.jpg",
  type = "website",
  noindex = false,
}: SEOHeadProps) => {
  const schemaOrganization = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": "https://dogwalking.fr/#organization",
    "name": "DogWalking",
    "url": "https://dogwalking.fr",
    "logo": "https://dogwalking.fr/logo.png",
    "description": "Plateforme n°1 de mise en relation entre Propriétaires et Accompagnateurs Certifiés en France. Profils 100% vérifiés, paiement sécurisé en attente, preuves visuelles obligatoires.",
    "foundingDate": "2023",
    "areaServed": {
      "@type": "Country",
      "name": "France"
    },
    "contactPoint": {
      "@type": "ContactPoint",
      "contactType": "customer service",
      "availableLanguage": "French",
      "telephone": "+33 1 XX XX XX XX",
      "email": "contact@dogwalking.fr"
    },
    "sameAs": [
      "https://facebook.com/dogwalkingfr",
      "https://instagram.com/dogwalkingfr",
      "https://twitter.com/dogwalkingfr"
    ],
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": "4.9",
      "reviewCount": "2847"
    }
  };

  const schemaWebSite = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": "DogWalking",
    "url": "https://dogwalking.fr",
    "potentialAction": {
      "@type": "SearchAction",
      "target": "https://dogwalking.fr/walkers?search={search_term_string}",
      "query-input": "required name=search_term_string"
    }
  };

  return (
    <Helmet>
      {/* Primary Meta Tags */}
      <title>{title}</title>
      <meta name="title" content={title} />
      <meta name="description" content={description} />
      <link rel="canonical" href={canonical} />
      {noindex && <meta name="robots" content="noindex, nofollow" />}
      
      {/* Open Graph / Facebook */}
      <meta property="og:type" content={type} />
      <meta property="og:url" content={canonical} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={image} />
      <meta property="og:locale" content="fr_FR" />
      <meta property="og:site_name" content="DogWalking" />
      
      {/* Twitter */}
      <meta property="twitter:card" content="summary_large_image" />
      <meta property="twitter:url" content={canonical} />
      <meta property="twitter:title" content={title} />
      <meta property="twitter:description" content={description} />
      <meta property="twitter:image" content={image} />
      
      {/* Additional Meta Tags */}
      <meta name="theme-color" content="#00D084" />
      <meta name="author" content="DogWalking" />
      <meta name="keywords" content="promenade chien, dog walking, garde chien, pet sitting, Accompagnateur Certifié, garde animaux, visite domicile animal, France, Propriétaire" />
      
      {/* Schema.org JSON-LD */}
      <script type="application/ld+json">{JSON.stringify(schemaOrganization)}</script>
      <script type="application/ld+json">{JSON.stringify(schemaWebSite)}</script>
    </Helmet>
  );
};
