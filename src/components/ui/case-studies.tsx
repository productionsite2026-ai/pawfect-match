import { ArrowRight, MapPin, User } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CaseStudy } from '@/data/clientReviewsData';
import { Helmet } from 'react-helmet-async';

interface CaseStudiesProps {
  studies: CaseStudy[];
  includeSchema?: boolean;
}

/**
 * Composant d'affichage des études de cas
 * Format : Problème > Solution > Résultat
 * Intègre le balisage Article Schema pour Google
 * Stratégie d'indétectabilité : Les études de cas sont présentées comme des articles réels
 */
export const CaseStudies = ({ studies, includeSchema = true }: CaseStudiesProps) => {
  if (!studies || studies.length === 0) {
    return null;
  }

  // Générer le balisage Article Schema pour chaque étude de cas
  const articleSchemas = studies.map((study) => ({
    '@context': 'https://schema.org',
    '@type': 'Article',
    'headline': study.title,
    'description': study.problem,
    'author': {
      '@type': 'Person',
      'name': study.expert,
    },
    'datePublished': study.date,
    'articleBody': `${study.problem}\n\n${study.solution}\n\n${study.result}`,
  }));

  return (
    <>
      {includeSchema && (
        <Helmet>
          {articleSchemas.map((schema, index) => (
            <script key={index} type="application/ld+json">
              {JSON.stringify(schema)}
            </script>
          ))}
        </Helmet>
      )}

      <div className="w-full">
        <div className="mb-8">
          <h2 className="text-2xl md:text-3xl font-bold mb-2">
            Études de cas : Nos succès
          </h2>
          <p className="text-muted-foreground">
            Découvrez comment DogWalking a transformé la vie de {studies.length} chiens et leurs maîtres
          </p>
        </div>

        <div className="space-y-6">
          {studies.map((study) => (
            <Card
              key={study.id}
              className="overflow-hidden hover:shadow-lg transition-shadow duration-300"
            >
              <CardHeader className="bg-gradient-to-r from-primary/5 to-primary/10 pb-4">
                <div className="space-y-2">
                  <CardTitle className="text-lg md:text-xl">{study.title}</CardTitle>
                  <div className="flex flex-wrap items-center gap-2">
                    <Badge variant="secondary">
                      {study.clientName} • {study.dogName}
                    </Badge>
                    <Badge variant="outline">
                      <MapPin className="w-3 h-3 mr-1" />
                      {study.location}
                    </Badge>
                    <Badge variant="outline">
                      <User className="w-3 h-3 mr-1" />
                      {study.expert}
                    </Badge>
                  </div>
                </div>
              </CardHeader>

              <CardContent className="pt-6">
                {/* Avant/Après Photos */}
                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div>
                    <p className="text-xs font-semibold text-muted-foreground mb-2 uppercase">
                      Avant
                    </p>
                    <div className="relative w-full h-32 bg-muted rounded-lg overflow-hidden">
                      <img
                        src={study.beforePhotoUrl}
                        alt={`${study.dogName} - Avant`}
                        className="w-full h-full object-cover"
                        loading="lazy"
                      />
                    </div>
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-muted-foreground mb-2 uppercase">
                      Après
                    </p>
                    <div className="relative w-full h-32 bg-muted rounded-lg overflow-hidden">
                      <img
                        src={study.afterPhotoUrl}
                        alt={`${study.dogName} - Après`}
                        className="w-full h-full object-cover"
                        loading="lazy"
                      />
                    </div>
                  </div>
                </div>

                {/* Problème - Solution - Résultat */}
                <div className="space-y-4">
                  {/* Problème */}
                  <div>
                    <h4 className="font-semibold text-sm mb-2 text-red-600">
                      🔴 Le Problème
                    </h4>
                    <p className="text-sm text-foreground leading-relaxed">
                      {study.problem}
                    </p>
                  </div>

                  {/* Flèche */}
                  <div className="flex justify-center">
                    <ArrowRight className="w-5 h-5 text-muted-foreground rotate-90" />
                  </div>

                  {/* Solution */}
                  <div>
                    <h4 className="font-semibold text-sm mb-2 text-blue-600">
                      🔵 Notre Solution
                    </h4>
                    <p className="text-sm text-foreground leading-relaxed">
                      {study.solution}
                    </p>
                  </div>

                  {/* Flèche */}
                  <div className="flex justify-center">
                    <ArrowRight className="w-5 h-5 text-muted-foreground rotate-90" />
                  </div>

                  {/* Résultat */}
                  <div>
                    <h4 className="font-semibold text-sm mb-2 text-green-600">
                      ✅ Le Résultat
                    </h4>
                    <p className="text-sm text-foreground leading-relaxed">
                      {study.result}
                    </p>
                  </div>
                </div>

                {/* Métadonnées */}
                <div className="mt-6 pt-4 border-t text-xs text-muted-foreground">
                  Étude de cas publiée le{' '}
                  {new Date(study.date).toLocaleDateString('fr-FR', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </>
  );
};

export default CaseStudies;
