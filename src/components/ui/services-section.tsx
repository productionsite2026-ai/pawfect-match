import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Clock, Camera, ArrowRight, Dog, Home, Moon, Sun, Heart, Stethoscope, Car, PawPrint, Shield, Check } from 'lucide-react';
import { useNavigate } from "react-router-dom";

// Import des images locales
import promenadeParc from '@/assets/services/promenade-chien-parc.jpg';
import visiteRepas from '@/assets/services/visite-chien-repas.jpg';
import hebergementNuit from '@/assets/services/hebergement-nuit-chambre.jpg';
import garderieJour from '@/assets/services/garderie-salle-jeux.jpg';
import gardeDomicile from '@/assets/services/garde-chien-domicile.jpg';
import visiteSoins from '@/assets/services/visite-chien-soins.jpg';
import vetAccompagnement from '@/assets/services/veterinaire-accompagnement.jpg';

export const ServicesSection = () => {
  const navigate = useNavigate();

  const services = [
    {
      id: "promenade",
      slug: "promenade",
      title: "Promenade",
      description: "Promenade en extérieur adaptée aux besoins de votre animal. Exercice physique et stimulation mentale garantis.",
      minPrice: 8,
      duration: "Durée libre",
      image: promenadeParc,
      tags: ["Exercice adapté", "Preuves visuelles"],
      icon: Dog,
      benefits: ["Socialisation", "Dépense d'énergie"]
    },
    {
      id: "visite_domicile",
      slug: "visite",
      title: "Visite à domicile",
      description: "Nourriture, eau fraîche et câlins pour vos animaux dans le confort de leur maison.",
      minPrice: 8,
      duration: "30 min",
      image: visiteRepas,
      tags: ["Animaux choyés", "Soins quotidiens"],
      icon: Home,
      benefits: ["Routine préservée", "Moins de stress"]
    },
    {
      id: "hebergement_nuit",
      slug: "garde",
      title: "Hébergement",
      description: "Votre animal séjourne chez l'Accompagnateur Certifié dans un environnement sécurisé et familial.",
      minPrice: 10,
      duration: "Par nuit",
      image: hebergementNuit,
      tags: ["Env. familial", "Suivi régulier"],
      icon: Moon,
      benefits: ["Attention 24h", "Compagnie"],
      popular: true
    },
    {
      id: "garderie",
      slug: "garde-domicile",
      title: "Garderie de Jour/Nuit",
      description: "Garderie de jour chez l'Accompagnateur Certifié, idéal pour la socialisation et l'exercice en journée.",
      minPrice: 10,
      duration: "Journée",
      image: garderieJour,
      tags: ["Socialisation", "Activités variées"],
      icon: Sun,
      benefits: ["Jeux", "Stimulation"]
    },
    {
      id: "garde_domicile",
      slug: "garde-multi-animaux",
      title: "Garde à domicile",
      description: "L'Accompagnateur Certifié reste chez vous pour garder vos animaux dans leur environnement.",
      minPrice: 12,
      duration: "Par nuit",
      image: gardeDomicile,
      tags: ["Chez vous", "Routine préservée"],
      icon: Heart,
      benefits: ["Confort maison", "Sécurité"]
    },
    {
      id: "visite_sanitaire",
      slug: "marche-reguliere",
      title: "Visite Sanitaire",
      description: "Entretien et soins assurés à l’aide des produits fournis par le Propriétaire (brossage, hygiène, soins).",
      minPrice: 16,
      duration: "45 min",
      image: visiteSoins,
      tags: ["Soins hygiène", "Brossage"],
      icon: Stethoscope,
      benefits: ["Bien-être", "Propreté"]
    },
    {
      id: "accompagnement_veterinaire",
      slug: "visite",
      title: "Accomp. Vétérinaire",
      description: "Transport et accompagnement de votre animal chez le vétérinaire pour ses rendez-vous santé.",
      minPrice: 13,
      duration: "Variable",
      image: vetAccompagnement,
      tags: ["Transport inclus", "Compte-rendu"],
      icon: Car,
      benefits: ["Tranquillité", "Suivi santé"]
    }
  ];

  return (
    <section id="services" className="py-16 md:py-24 px-4 bg-muted/30">
      <div className="container mx-auto">
        <div className="text-center mb-12 md:mb-16">
          <span className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-1.5 rounded-full text-sm font-medium mb-4">
            <PawPrint className="h-4 w-4" />
            7 services disponibles
          </span>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4">Nos Services d'Accompagnement pour vos animaux</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Promenade, Garde, Hébergement, Accompagnement Vétérinaire : trouvez le service adapté avec preuves visuelles obligatoires et paiement sécurisé en attente.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 md:gap-6 max-w-7xl mx-auto">
          {services.map((service) => (
            <div 
              key={service.id}
              className={`group bg-card rounded-3xl overflow-hidden shadow-soft hover:shadow-xl transition-all duration-500 border hover:-translate-y-1 ${
                service.popular ? 'border-primary ring-2 ring-primary/20' : 'border-border/50'
              }`}
            >
              {/* Image */}
              <div className="relative h-44 md:h-48 overflow-hidden">
                <img
                  src={service.image}
                  alt={service.title}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                {service.popular && (
                  <div className="absolute top-3 left-3">
                    <Badge className="bg-primary text-primary-foreground text-xs px-3 py-1 shadow-lg">
                      ⭐ Populaire
                    </Badge>
                  </div>
                )}
                <div className="absolute top-3 right-3">
                  <Badge className="bg-white/95 text-foreground font-bold text-sm shadow-md px-3 py-1">
                    À partir de {service.minPrice}€
                  </Badge>
                </div>
                <div className="absolute bottom-3 left-3">
                  <Badge variant="secondary" className="bg-black/70 text-white text-xs backdrop-blur-sm">
                    <Clock className="h-3 w-3 mr-1" />
                    {service.duration}
                  </Badge>
                </div>
              </div>

              {/* Content */}
              <div className="p-5">
                <div className="flex items-center gap-2.5 mb-3">
                  <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                    <service.icon className="h-5 w-5 text-primary" />
                  </div>
                  <h3 className="text-lg font-bold">{service.title}</h3>
                </div>
                <p className="text-muted-foreground text-sm mb-4 line-clamp-2 leading-relaxed">
                  {service.description}
                </p>

                {/* Benefits */}
                <div className="flex flex-wrap gap-2 mb-4">
                  {service.benefits.map((benefit, index) => (
                    <span 
                      key={index} 
                      className="inline-flex items-center gap-1 text-xs text-primary bg-primary/10 px-2.5 py-1 rounded-full font-medium"
                    >
                      <Check className="h-3 w-3" />
                      {benefit}
                    </span>
                  ))}
                </div>

                {/* Tags */}
                <div className="flex flex-wrap gap-2 mb-4">
                  {service.tags.map((tag, index) => (
                    <Badge key={index} variant="outline" className="text-xs font-normal py-0.5 px-2">
                      {index === 1 && <Camera className="h-3 w-3 mr-1" />}
                      {tag}
                    </Badge>
                  ))}
                </div>

                <Button 
                  variant="ghost" 
                  size="sm"
                  className="p-0 h-auto font-semibold text-primary hover:text-primary/80 group/btn"
                  onClick={() => navigate(`/services/${service.slug}`)}
                >
                  En savoir plus
                  <ArrowRight className="ml-1 h-4 w-4 group-hover/btn:translate-x-1 transition-transform" />
                </Button>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-12 md:mt-16 text-center">
          <div className="inline-flex items-center gap-3 bg-card rounded-2xl px-6 py-4 shadow-soft border border-border mb-8">
            <Shield className="h-6 w-6 text-primary" />
            <span className="text-sm md:text-base">
              <strong>Garantie DogWalking :</strong> Preuves visuelles obligatoires + Paiement sécurisé
            </span>
          </div>
          <div>
            <Button size="lg" className="rounded-full px-8" onClick={() => navigate('/walkers')}>
              Voir tous les Accompagnateurs
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};
