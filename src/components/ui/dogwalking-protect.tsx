import { Shield, FileCheck, Users, Lock, Camera, Award } from "lucide-react";

export const DogWalkingProtect = () => {
  const protections = [
    {
      icon: Shield,
      title: "Protection Garantie",
      description: "Toutes les missions sont sécurisées. En cas de problème, notre équipe intervient immédiatement.",
      stat: "100%"
    },
    {
      icon: FileCheck,
      title: "Vérification Rigoureuse",
      description: "Chaque Accompagnateur Certifié est soigneusement sélectionné et vérifié par notre équipe avant d'être accepté.",
      stat: "Sélection"
    },
    {
      icon: Lock,
      title: "Paiement en Attente",
      description: "Votre paiement est bloqué jusqu'à ce que vous communiquiez le code de fin de service à l'Accompagnateur. Zéro risque.",
      stat: "Sécurisé"
    },
    {
      icon: Camera,
      title: "Preuves Visuelles Recommandées",
      description: "Les Accompagnateurs qui envoient photos/vidéos bénéficient d'un meilleur classement. Transparence valorisée.",
      stat: "Surclassement"
    },
    {
      icon: Award,
      title: "Accompagnateurs Certifiés",
      description: "Formation, expérience vérifiée et références contrôlées.",
      stat: "Certifiés"
    },
    {
      icon: Users,
      title: "Support 7j/7",
      description: "Notre équipe dédiée répond en moins de 2h. Médiation gratuite en cas de litige.",
      stat: "< 2h"
    }
  ];

  return (
    <section className="py-12 md:py-16 px-4 bg-gradient-primary text-white">
      <div className="container mx-auto">
        <div className="text-center mb-10 md:mb-12">
          <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-4 py-2 mb-4">
            <Shield className="h-4 w-4" />
            <span className="text-sm font-medium">Sécurité Maximale</span>
          </div>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-3">DogWalking Protect™</h2>
          <p className="text-base md:text-lg opacity-90 max-w-2xl mx-auto">
            Notre garantie exclusive pour votre tranquillité d'esprit et la sécurité de votre animal
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
          {protections.map((item, index) => (
            <div 
              key={index} 
              className="bg-white/10 backdrop-blur-sm rounded-2xl p-5 md:p-6 border border-white/20 hover:bg-white/15 transition-colors"
            >
              <div className="flex items-start gap-4">
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-white/20">
                  <item.icon className="h-6 w-6" />
                </div>
                <div className="flex-1">
                  <div className="text-2xl font-bold text-white/90 mb-1">{item.stat}</div>
                  <h3 className="text-lg font-semibold mb-1">{item.title}</h3>
                  <p className="text-sm opacity-80">{item.description}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
