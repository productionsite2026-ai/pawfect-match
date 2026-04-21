import { Star, Quote, Shield } from "lucide-react";

// Import des images
import familleChienParc from '@/assets/testimonials/famille-chien-parc.jpg';
import proprietaireRassure from '@/assets/testimonials/proprietaire-rassure.jpg';

export const TestimonialsSection = () => {
  const testimonials = [
    {
      name: "Marie L.",
      city: "Paris 15e",
      rating: 5,
      comment: "Le système de preuves photo est génial ! Je reçois des photos de mon golden pendant sa promenade. Ça me rassure énormément au bureau.",
      dog: "Max, Golden Retriever",
      verified: true,
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Marie"
    },
    {
      name: "Thomas B.",
      city: "Lyon 6e",
      rating: 5,
      comment: "Enfin une plateforme sérieuse. Le paiement en paiement sécurisé et la vérification du vérification approfondie, c'est ce qui m'a convaincu.",
      dog: "Luna, Berger Australien",
      verified: true,
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Thomas"
    },
    {
      name: "Sophie M.",
      city: "Marseille",
      rating: 5,
      comment: "J'ai testé 3 plateformes avant DogWalking. La différence ? Les preuves obligatoires et le support ultra réactif. Je recommande !",
      dog: "Coco, Bouledogue Français",
      verified: true,
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Sophie"
    },
    {
      name: "Pierre D.",
      city: "Bordeaux",
      rating: 5,
      comment: "Mon Accompagnateur Certifié m'envoie toujours une vidéo de la balade. Voir mon chien heureux en pleine nature, ça n'a pas de prix.",
      dog: "Rocky, Labrador",
      verified: true,
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Pierre"
    },
    {
      name: "Julie R.",
      city: "Toulouse",
      rating: 5,
      comment: "Le badge 'Super Accompagnateur Certifié' m'a aidée à choisir. Sarah est incroyable avec mon anxieux de Beauceron. Merci DogWalking !",
      dog: "Oscar, Beauceron",
      verified: true,
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Julie"
    },
    {
      name: "Marc V.",
      city: "Nantes",
      rating: 5,
      comment: "Je voyage souvent pour le travail. Savoir que mon chien est entre de bonnes mains vérifiées, c'est un vrai soulagement.",
      dog: "Milo, Jack Russell",
      verified: true,
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Marc"
    }
  ];

  return (
    <section className="py-16 md:py-24 px-4 bg-warm relative overflow-hidden">
      {/* Background decorative images */}
      <div className="absolute top-0 left-0 w-1/3 h-full opacity-5 pointer-events-none">
        <img 
          src={familleChienParc} 
          alt="" 
          className="w-full h-full object-cover"
          aria-hidden="true"
        />
      </div>
      <div className="absolute top-0 right-0 w-1/3 h-full opacity-5 pointer-events-none">
        <img 
          src={proprietaireRassure} 
          alt="" 
          className="w-full h-full object-cover"
          aria-hidden="true"
        />
      </div>

      <div className="container mx-auto relative z-10">
        <div className="text-center mb-12 md:mb-16">
          <span className="inline-block bg-primary/10 text-primary px-4 py-1.5 rounded-full text-sm font-medium mb-4">
            Avis certifiés
          </span>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4">Ce que disent nos clients</h2>
          <p className="text-base md:text-lg text-muted-foreground max-w-2xl mx-auto">
            Des milliers de Propriétaires satisfaits partagent leur expérience. 
            Seuls les clients ayant réservé peuvent laisser un avis.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-6 max-w-6xl mx-auto">
          {testimonials.map((testimonial, index) => (
            <div 
              key={index} 
              className="group bg-card p-6 md:p-7 rounded-2xl shadow-soft border border-border hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
            >
              {/* Header with avatar and rating */}
              <div className="flex items-start gap-4 mb-4">
                <div className="relative flex-shrink-0">
                  <img 
                    src={testimonial.avatar} 
                    alt={`Avatar de ${testimonial.name}`}
                    className="w-14 h-14 rounded-full bg-muted"
                  />
                  {testimonial.verified && (
                    <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-primary rounded-full flex items-center justify-center">
                      <Shield className="h-3 w-3 text-primary-foreground" />
                    </div>
                  )}
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-semibold text-foreground">{testimonial.name}</span>
                  </div>
                  <div className="text-xs text-muted-foreground mb-1.5">{testimonial.city}</div>
                  <div className="flex gap-0.5">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="h-4 w-4 fill-primary text-primary" />
                    ))}
                  </div>
                </div>
                <Quote className="h-8 w-8 text-primary/20 flex-shrink-0" />
              </div>

              {/* Comment */}
              <p className="text-foreground mb-4 text-sm md:text-base leading-relaxed">
                "{testimonial.comment}"
              </p>

              {/* Dog info */}
              <div className="flex items-center gap-2 pt-3 border-t border-border/50">
                <span className="text-2xl">🐕</span>
                <span className="text-sm font-medium text-primary">{testimonial.dog}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Stats banner */}
        <div className="mt-12 md:mt-16 flex flex-wrap justify-center gap-8 md:gap-12">
          <div className="text-center">
            <div className="text-3xl md:text-4xl font-bold text-primary">4.9/5</div>
            <div className="text-sm text-muted-foreground">Note moyenne</div>
          </div>
          <div className="text-center">
            <div className="text-3xl md:text-4xl font-bold text-primary">2,500+</div>
            <div className="text-sm text-muted-foreground">Avis vérifiés</div>
          </div>
          <div className="text-center">
            <div className="text-3xl md:text-4xl font-bold text-primary">98%</div>
            <div className="text-sm text-muted-foreground">Clients satisfaits</div>
          </div>
        </div>
      </div>
    </section>
  );
};
