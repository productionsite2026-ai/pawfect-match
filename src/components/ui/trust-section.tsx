import { Users, Star, MapPin, Heart, Shield, Camera, CheckCircle } from "lucide-react";

// Import image
import couvertureFrance from '@/assets/trust/couverture-france.jpg';

export const TrustSection = () => {
  const stats = [
    { icon: Users, value: "10,000+", label: "Propriétaires satisfaits", color: "text-primary" },
    { icon: Heart, value: "5,000+", label: "Accompagnateurs Certifiés", color: "text-heart" },
    { icon: Star, value: "4.9/5", label: "Note moyenne", color: "text-primary" },
    { icon: MapPin, value: "50+", label: "Villes en France", color: "text-accent" },
    { icon: Shield, value: "100%", label: "Missions protégées", color: "text-primary" },
    { icon: Camera, value: "25,000+", label: "Preuves envoyées", color: "text-accent" }
  ];

  const guarantees = [
    "Accompagnateur Certifiés rigoureusement vérifiés",
    "Sécurité & Transparence incluse",
    "Preuves photo obligatoires",
    "Paiement Sécurisé",
    "Support 7j/7",
    "Remboursement garanti"
  ];

  return (
    <section className="py-16 md:py-24 px-4 bg-muted/30 relative overflow-hidden">
      <div className="container mx-auto">
        <div className="text-center mb-10 md:mb-14">
          <span className="inline-block bg-primary/10 text-primary px-4 py-1.5 rounded-full text-sm font-medium mb-4">
            La confiance en chiffres
          </span>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-3">Ils nous font confiance</h2>
          <p className="text-muted-foreground max-w-xl mx-auto text-base md:text-lg">
            Rejoignez la communauté DogWalking et offrez le meilleur à votre compagnon
          </p>
        </div>
        
        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 md:gap-5 mb-12 md:mb-16">
          {stats.map((stat, index) => (
            <div 
              key={index} 
              className="bg-card rounded-2xl p-5 md:p-6 text-center shadow-soft border border-border hover:shadow-card hover:-translate-y-1 transition-all duration-300"
            >
              <div className={`inline-flex items-center justify-center w-12 h-12 rounded-xl ${stat.color === 'text-primary' ? 'bg-primary/10' : stat.color === 'text-heart' ? 'bg-heart-light' : 'bg-accent/10'} mb-3`}>
                <stat.icon className={`h-6 w-6 ${stat.color}`} />
              </div>
              <div className="text-2xl md:text-3xl font-bold mb-1">{stat.value}</div>
              <div className="text-xs md:text-sm text-muted-foreground">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Coverage + Guarantees */}
        <div className="grid lg:grid-cols-2 gap-8 items-center max-w-6xl mx-auto">
          {/* Map Image */}
          <div className="relative rounded-3xl overflow-hidden shadow-xl group">
            <img 
              src={couvertureFrance} 
              alt="Carte de couverture DogWalking en France avec les principales villes desservies"
              className="w-full h-auto object-cover group-hover:scale-105 transition-transform duration-700"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
            <div className="absolute bottom-6 left-6 right-6">
              <div className="bg-white/95 backdrop-blur-sm rounded-2xl p-4 shadow-lg">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center">
                    <MapPin className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <div className="font-bold text-lg">50+ villes en France</div>
                    <div className="text-sm text-muted-foreground">Un réseau en expansion continue</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Guarantees */}
          <div className="space-y-6">
            <div>
              <h3 className="text-2xl md:text-3xl font-bold mb-2">Nos garanties</h3>
              <p className="text-muted-foreground">
                Chaque élément est pensé pour votre tranquillité d'esprit et le bien-être de votre compagnon.
              </p>
            </div>
            <div className="grid sm:grid-cols-2 gap-4">
              {guarantees.map((guarantee, index) => (
                <div 
                  key={index}
                  className="flex items-center gap-3 bg-card rounded-xl p-4 border border-border shadow-soft"
                >
                  <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                    <CheckCircle className="h-4 w-4 text-primary" />
                  </div>
                  <span className="font-medium text-sm">{guarantee}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
