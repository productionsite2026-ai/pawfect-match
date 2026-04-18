import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Dog, Briefcase, Check, ArrowRight, Plane, Briefcase as Work, 
  CreditCard, Clock, Euro, Users, Star, Home, HeartPulse, Accessibility, CloudRain
} from "lucide-react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

export const UserTypesSection = () => {
  const navigate = useNavigate();

  const ownerBenefits = [
    { text: "Vous partez en voyage ou en week-end", icon: Plane },
    { text: "Journée de travail chargée ou déplacement pro", icon: Work },
    { text: "Fatigue, mauvaise météo ou pas envie de sortir", icon: CloudRain },
    { text: "Personne malade, blessée ou en convalescence", icon: HeartPulse },
    { text: "Personne âgée ou à mobilité réduite", icon: Accessibility }
  ];

  const walkerBenefits = [
    { text: "Revenus complémentaires attractifs", icon: Euro },
    { text: "Emploi du temps 100% flexible", icon: Clock },
    { text: "Paiements rapides et sécurisés", icon: CreditCard },
    { text: "Badges et reconnaissance", icon: Star },
    { text: "Formation continue", icon: Users }
  ];

  const ownerStats = [
    { value: "2 500+", label: "Professionnels actifs" },
    { value: "4.9/5", label: "Note moyenne" },
    { value: "< 24h", label: "Temps de réponse" }
  ];

  const walkerStats = [
    { value: "500-1500€", label: "Revenus moyens/mois" },
    { value: "85%", label: "Reversé aux Accompagnateurs" },
    { value: "48h", label: "Profil validé une fois complété" }
  ];

  return (
    <section className="py-12 md:py-16 px-4 bg-gradient-to-b from-background to-muted/30">
      <div className="container mx-auto">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-8 md:mb-10"
        >
          <Badge className="mb-3 bg-primary/10 text-primary border-primary/20">
            <Users className="w-3 h-3 mr-1" />
            Rejoignez-nous
          </Badge>
          <h2 className="text-2xl md:text-3xl font-bold mb-3">
            Choisissez votre profil
          </h2>
          <p className="text-base text-muted-foreground max-w-2xl mx-auto">
            Que vous soyez Propriétaire d’animal ou passionné souhaitant devenir Accompagnateur Certifié, 
            DogWalking vous offre une expérience unique, sécurisée et transparente.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-5xl mx-auto items-stretch">
          {/* Propriétaires Card */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="flex"
          >
            <Card className="flex flex-col w-full border-2 hover:border-primary/50 transition-colors shadow-lg overflow-hidden">
              <div className="bg-gradient-primary p-4 md:p-5 text-white">
                <div className="flex items-center gap-3">
                  <div className="inline-flex items-center justify-center w-11 h-11 rounded-xl bg-white/20 flex-shrink-0">
                    <Dog className="h-5 w-5" />
                  </div>
                  <div className="min-w-0">
                    <h3 className="text-lg md:text-xl font-bold">Propriétaires</h3>
                    <p className="text-white/80 text-xs md:text-sm leading-tight">Dans quelles situations faire appel à DogWalking ?</p>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-3 border-b">
                {ownerStats.map((stat, index) => (
                  <div key={index} className="p-2 md:p-3 text-center border-r last:border-r-0">
                    <p className="text-base md:text-lg font-bold text-primary">{stat.value}</p>
                    <p className="text-[10px] md:text-xs text-muted-foreground leading-tight">{stat.label}</p>
                  </div>
                ))}
              </div>

              <CardContent className="p-4 md:p-5 flex flex-col flex-1">
                <p className="text-muted-foreground text-sm mb-4 leading-relaxed">
                  La vie ne s'arrête jamais, mais votre animal a toujours besoin d'attention. Voyage, travail, fatigue, maladie ou perte d'autonomie : DogWalking prend le relais à chaque fois que vous ne pouvez pas vous occuper de votre compagnon.
                </p>

                <ul className="space-y-2 mb-5">
                  {ownerBenefits.map((benefit, index) => (
                    <motion.li 
                      key={index} 
                      className="flex items-center gap-2"
                      initial={{ opacity: 0, x: -10 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: index * 0.05 }}
                    >
                      <div className="w-5 h-5 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                        <Check className="h-3 w-3 text-primary" />
                      </div>
                      <span className="text-xs md:text-sm">{benefit.text}</span>
                    </motion.li>
                  ))}
                </ul>

                <div className="flex gap-2 mt-auto">
                  <Button 
                    className="flex-1 group text-xs md:text-sm" 
                    size="sm"
                    onClick={() => navigate('/walkers')}
                  >
                    Trouver un Accompagnateur
                    <ArrowRight className="h-3.5 w-3.5 ml-1 group-hover:translate-x-1 transition-transform" />
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm"
                    className="text-xs md:text-sm"
                    onClick={() => navigate('/walkers#deposer-annonce')}
                  >
                    Déposer une Annonce Libre
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Accompagnateurs Card */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="flex"
          >
            <Card className="flex flex-col w-full border-2 hover:border-accent/50 transition-colors shadow-lg overflow-hidden">
              <div className="bg-gradient-to-r from-accent to-ocean p-4 md:p-5 text-white">
                <div className="flex items-center gap-3">
                  <div className="inline-flex items-center justify-center w-11 h-11 rounded-xl bg-white/20 flex-shrink-0">
                    <Briefcase className="h-5 w-5" />
                  </div>
                  <div className="min-w-0">
                    <h3 className="text-lg md:text-xl font-bold">Accompagnateurs</h3>
                    <p className="text-white/80 text-xs md:text-sm leading-tight">Gagnez de l'argent en faisant ce que vous aimez</p>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-3 border-b">
                {walkerStats.map((stat, index) => (
                  <div key={index} className="p-2 md:p-3 text-center border-r last:border-r-0">
                    <p className="text-base md:text-lg font-bold text-accent">{stat.value}</p>
                    <p className="text-[10px] md:text-xs text-muted-foreground leading-tight">{stat.label}</p>
                  </div>
                ))}
              </div>

              <CardContent className="p-4 md:p-5 flex flex-col flex-1">
                <p className="text-muted-foreground text-sm mb-4 leading-relaxed">
                  Rejoignez notre réseau de professionnels passionnés. Fixez vos tarifs, choisissez vos horaires et vos zones d'intervention en toute liberté. Recevez vos paiements rapidement et en toute sécurité.
                </p>

                <ul className="space-y-2 mb-5">
                  {walkerBenefits.map((benefit, index) => (
                    <motion.li 
                      key={index} 
                      className="flex items-center gap-2"
                      initial={{ opacity: 0, x: -10 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: index * 0.05 }}
                    >
                      <div className="w-5 h-5 rounded-full bg-accent/10 flex items-center justify-center flex-shrink-0">
                        <Check className="h-3 w-3 text-accent" />
                      </div>
                      <span className="text-xs md:text-sm">{benefit.text}</span>
                    </motion.li>
                  ))}
                </ul>

                <div className="flex gap-2 mt-auto">
                  <Button 
                    className="flex-1 group bg-accent hover:bg-accent/90 text-xs md:text-sm" 
                    size="sm"
                    onClick={() => navigate('/walker/register')}
                  >
                    Devenir Accompagnateur
                    <ArrowRight className="h-3.5 w-3.5 ml-1 group-hover:translate-x-1 transition-transform" />
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm"
                    className="text-xs md:text-sm"
                    onClick={() => navigate('/walkers#annonces')}
                  >
                    Voir les Annonces Propriétaire
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Bottom CTA */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mt-10"
        >
          <p className="text-muted-foreground text-sm mb-3">
            Des questions ? Notre équipe est là pour vous accompagner.
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            <Button size="sm" onClick={() => navigate('/support')}>
              Consulter l'aide
            </Button>
            <Button variant="secondary" size="sm" className="border border-primary/30" onClick={() => navigate('/support?tab=contact')}>
              Nous contacter
            </Button>
          </div>
        </motion.div>
      </div>
    </section>
  );
};
