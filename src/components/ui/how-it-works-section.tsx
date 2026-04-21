import { Search, Calendar, Camera, ThumbsUp, ArrowRight } from "lucide-react";

// Import des images - UNIQUES pour chaque section
import searchWalker from '@/assets/homepage/search-walker.jpg';
import bookingReservation from '@/assets/homepage/booking-reservation.jpg';
import promeneurPhotoPreuve from '@/assets/homepage/promeneur-photo-preuve.jpg';
import paiementValideApp from '@/assets/homepage/paiement-valide-app.jpg';

export const HowItWorksSection = () => {
  const steps = [
    {
      number: "1",
      icon: Search,
      title: "Trouvez",
      description: "Déposez une annonce ou consultez les profils vérifiés des Accompagnateurs Certifiés et Propriétaires près de chez vous. Profils contrôlés et avis certifiés.",
      highlight: "100% vérifiés",
      image: searchWalker
    },
    {
      number: "2",
      icon: Calendar,
      title: "Réservez",
      description: "Déposez une annonce spécifique ou choisissez le service, la date et l’heure. Votre paiement est sécurisé et bloqué jusqu’à votre validation lors du retour de votre animal.",
      highlight: "Paiement bloqué",
      image: bookingReservation
    },
    {
      number: "3",
      icon: Camera,
      title: "Suivez la mission",
      description: "L'Accompagnateur envoie des preuves visuelles (photo/vidéo) pour un meilleur positionnement. Il déclenche le code de fin de service une fois la prestation terminée.",
      highlight: "Transparence valorisée",
      image: promeneurPhotoPreuve
    },
    {
      number: "4",
      icon: ThumbsUp,
      title: "Validez le paiement",
      description: "Communiquez le code de fin de service à l'Accompagnateur pour libérer le paiement. Option « Le Accompagnateur Certifié n'a plus de batterie » disponible pour valider à distance.",
      highlight: "Vous gardez le contrôle",
      image: paiementValideApp
    }
  ];

  return (
    <section id="comment-ca-marche" className="py-16 md:py-24 px-4 bg-warm">
      <div className="container mx-auto">
        <div className="text-center mb-12 md:mb-16">
          <span className="inline-block bg-primary/10 text-primary px-4 py-1.5 rounded-full text-sm font-medium mb-4">
            Simple & Sécurisé
          </span>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4">Comment réserver un Accompagnateur Certifié ?</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Déposez une annonce ou choisissez un Accompagnateur Certifié, réservez, suivez la mission en photos, puis validez le paiement au retour de votre animal grâce à un code unique.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
          {steps.map((step, index) => (
            <div key={index} className="relative group">
              <div className={`bg-card rounded-3xl overflow-hidden shadow-card border border-border h-full transition-all duration-300 hover:shadow-xl hover:-translate-y-1 ${
                step.image ? 'grid md:grid-cols-2' : ''
              }`}>
                {/* Image si disponible */}
                {step.image && (
                  <div className="relative h-48 md:h-full overflow-hidden">
                    <img 
                      src={step.image} 
                      alt={step.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent to-card/50 md:bg-gradient-to-l md:from-card/50 md:to-transparent" />
                  </div>
                )}
                
                {/* Contenu */}
                <div className="p-6 md:p-8 flex flex-col justify-center">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-primary text-white font-bold text-xl shadow-lg">
                      {step.number}
                    </div>
                    <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                      <step.icon className="h-6 w-6 text-primary" />
                    </div>
                  </div>
                  <span className="inline-block bg-primary/10 text-primary text-xs px-3 py-1 rounded-full mb-3 w-fit font-medium">
                    {step.highlight}
                  </span>
                  <h3 className="text-xl md:text-2xl font-bold mb-3">{step.title}</h3>
                  <p className="text-muted-foreground leading-relaxed">{step.description}</p>
                </div>
              </div>
              
              {/* Connecteur */}
              {index < steps.length - 1 && index % 2 === 1 && (
                <div className="hidden lg:flex absolute -bottom-4 left-1/2 transform -translate-x-1/2 z-10">
                  <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
                    <ArrowRight className="h-4 w-4 text-primary rotate-90" />
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
