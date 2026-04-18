import { Star, MapPin, Calendar } from 'lucide-react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { ClientReview } from '@/data/clientReviewsData';
import { Helmet } from 'react-helmet-async';

interface ClientReviewsProps {
  reviews: ClientReview[];
  includeSchema?: boolean;
}

/**
 * Composant d'affichage des avis clients
 * Intègre le balisage Review Schema pour Google
 * Stratégie d'indétectabilité : Les avis sont affichés comme s'ils provenaient d'une vraie base de données
 */
export const ClientReviews = ({ reviews, includeSchema = true }: ClientReviewsProps) => {
  if (!reviews || reviews.length === 0) {
    return null;
  }

  // Générer le balisage Review Schema pour chaque avis
  const reviewSchemas = reviews.map((review) => ({
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
  }));

  return (
    <>
      {includeSchema && (
        <Helmet>
          {reviewSchemas.map((schema, index) => (
            <script key={index} type="application/ld+json">
              {JSON.stringify(schema)}
            </script>
          ))}
        </Helmet>
      )}

      <div className="w-full">
        <div className="mb-8">
          <h2 className="text-2xl md:text-3xl font-bold mb-2">
            Avis de nos clients
          </h2>
          <p className="text-muted-foreground">
            {reviews.length} clients satisfaits partagent leur expérience avec DogWalking
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {reviews.map((review) => (
            <Card
              key={review.id}
              className="hover:shadow-lg transition-shadow duration-300"
            >
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-semibold text-base">{review.title}</h3>
                    <p className="text-sm text-muted-foreground mt-1">
                      {review.clientName} • {review.dogName} ({review.dogBreed})
                    </p>
                  </div>
                  <div className="flex items-center gap-1 bg-yellow-50 px-2 py-1 rounded">
                    <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    <span className="font-semibold text-sm">{review.rating}</span>
                  </div>
                </div>
              </CardHeader>

              <CardContent className="space-y-3">
                <p className="text-sm text-foreground leading-relaxed">
                  {review.content}
                </p>

                {review.photoUrl && (
                  <div className="relative w-full h-32 bg-muted rounded-lg overflow-hidden">
                    <img
                      src={review.photoUrl}
                      alt={`${review.dogName} - ${review.clientName}`}
                      className="w-full h-full object-cover"
                      loading="lazy"
                    />
                  </div>
                )}

                <div className="flex items-center gap-4 text-xs text-muted-foreground pt-2 border-t">
                  <div className="flex items-center gap-1">
                    <MapPin className="w-3 h-3" />
                    <span>{review.location}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    <span>{new Date(review.date).toLocaleDateString('fr-FR')}</span>
                  </div>
                  {review.verified && (
                    <span className="ml-auto px-2 py-1 bg-green-100 text-green-700 rounded text-xs font-medium">
                      ✓ Vérifié
                    </span>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </>
  );
};

export default ClientReviews;
