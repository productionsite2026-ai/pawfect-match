import { Shield, Star, Camera, CreditCard, FileCheck, Award, Lock, Heart, Clock } from "lucide-react";

export const FeaturesSection = () => {
  const features = [
    {
      icon: Shield,
      title: "Vérification triple",
      description: "Chaque promeneur est rigoureusement sélectionné et vérifié. Validation manuelle par notre équipe.",
      badge: "Sécurité maximale"
    },
    {
      icon: Camera,
      title: "Preuves photo/vidéo",
      description: "Recevez obligatoirement des photos ou vidéos avec message personnalisé pendant chaque mission.",
      badge: "Transparence totale"
    },
    {
      icon: Lock,
      title: "Paiement sécurisé",
      description: "Votre argent reste bloqué jusqu'à preuve de service validée. Commission 15% tout inclus.",
      badge: "Protection 100%"
    },
    {
      icon: FileCheck,
      title: "Documents certifiés",
      description: "Attestation premiers secours, certificat de capacité. Qualité professionnelle garantie.",
      badge: "Accompagnateur Certifiés pros"
    },
    {
      icon: Star,
      title: "Avis certifiés",
      description: "Seuls les Propriétaires ayant réservé peuvent noter. Impossible de truquer les avis.",
      badge: "Avis vérifiés"
    },
    {
      icon: Award,
      title: "Badges de qualité",
      description: "Super Accompagnateur Certifié, 50+ missions, Premiers Secours, Expert Comportement. Récompenses méritées.",
      badge: "Excellence"
    },
    {
      icon: Heart,
      title: "Protection incluse",
      description: "Toutes les missions bénéficient de notre garantie de protection et de suivi.",
      badge: "Couverture totale"
    },
    {
      icon: Clock,
      title: "Support réactif",
      description: "Notre équipe répond en moins de 2h. Assistance disponible 7j/7 pour toute question.",
      badge: "Support 7j/7"
    },
    {
      icon: CreditCard,
      title: "Remboursement facile",
      description: "Mission non conforme ? Remboursement sous 48h sans discussion. Satisfaction garantie.",
      badge: "Garantie satisfait"
    }
  ];

  return (
    <section className="py-12 md:py-16 px-4">
      <div className="container mx-auto">
        <div className="text-center mb-10 md:mb-12">
          <span className="inline-block bg-accent/10 text-accent px-4 py-1 rounded-full text-sm font-medium mb-3">
            Notre différence
          </span>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-3">
            Pourquoi choisir DogWalking ?
          </h2>
          <p className="text-base md:text-lg text-muted-foreground max-w-3xl mx-auto">
            La seule plateforme française avec preuves photo/vidéo obligatoires, 
            paiement sécurisé et vérification triple des promeneurs.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
          {features.map((feature, index) => (
            <div 
              key={index} 
              className="group bg-card rounded-2xl p-5 md:p-6 shadow-soft border border-border hover:shadow-card hover:border-primary/20 transition-all duration-300"
            >
              <div className="flex items-start gap-4">
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-primary/10 group-hover:bg-primary/20 transition-colors">
                  <feature.icon className="h-6 w-6 text-primary" />
                </div>
                <div className="flex-1">
                  <span className="inline-block bg-sage/10 text-sage text-xs px-2 py-0.5 rounded-full mb-2">
                    {feature.badge}
                  </span>
                  <h3 className="text-lg font-semibold mb-1">{feature.title}</h3>
                  <p className="text-sm text-muted-foreground">{feature.description}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};