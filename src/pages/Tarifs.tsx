import { Header } from "@/components/ui/header";
import { Footer } from "@/components/ui/footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Check, Shield, Lock, Camera, CreditCard, Clock, Award, Sparkles, ArrowRight, Star, Users } from 'lucide-react';
import { useNavigate } from "react-router-dom";
import { SEOHead } from "@/components/seo/SEOHead";
import { SEOFAQ } from "@/components/ui/seo-faq";
import { FloatingContact } from "@/components/ui/floating-contact";
import { motion } from "framer-motion";
import { AnimatedIcon } from "@/components/ui/animated-icon";
import { AnimatedCard, AnimatedGrid, AnimatedGridItem } from "@/components/ui/animated-card";
import { SectionHeader } from "@/components/ui/section-header";
import tarifsHero from "@/assets/pages/tarifs-hero.jpg";

const Tarifs = () => {
  const navigate = useNavigate();
  const services = [
    {
      name: "Promenade",
      minPrice: "8€",
      description: "Dépense & Stimulation",
      features: ["Exercice adapté au rythme de votre animal", "Preuves visuelles (photo/vidéo) obligatoires", "Tarif librement fixé par l'Accompagnateur Certifié", "Durée définie d'un commun accord"],
      icon: "🚶"
    },
    {
      name: "Visite à domicile",
      minPrice: "8€",
      description: "30 minutes de présence",
      features: ["Nourriture, eau et soins d'hygiène", "Compagnie, câlins et jeux", "Preuve visuelle dès l'arrivée", "Rapport détaillé de la visite"],
      icon: "🏠"
    },
    {
      name: "Hébergement",
      minPrice: "10€",
      description: "Nuit en toute sécurité",
      features: ["Hébergement complet (chez vous ou l'Accompagnateur Certifié)", "Environnement familial et chaleureux", "Preuves visuelles (soir et matin)", "Paiement sécurisé"],
      popular: true,
      icon: "🌙"
    },
    {
      name: "Garderie de Jour/Nuit",
      minPrice: "10€",
      description: "Journée ou nuit d'activités",
      features: ["Socialisation encadrée et jeux", "Activités variées et stimulantes", "Preuves visuelles régulières", "Zéro risque grâce au code unique"],
      icon: "☀️"
    },
    {
      name: "Visite Sanitaire",
      minPrice: "16€",
      description: "45 min d'hygiène",
      features: ["Brossage et soins du pelage", "Utilisation de vos produits habituels", "Photos avant/après obligatoires", "Respect de la sensibilité de l'animal"],
      icon: "🧴"
    },
    {
      name: "Accomp. Vétérinaire",
      minPrice: "13€",
      description: "Transport inclus",
      features: ["Prise en charge complète (Aller-Retour)", "Accompagnement en consultation", "Compte-rendu médical précis", "Preuve d'arrivée en clinique"],
      icon: "🏥"
    },
    {
      name: "Multi-animaux",
      minPrice: "Sur devis",
      description: "Foyers nombreux",
      features: ["Gestion de plusieurs compagnons", "Tarifs adaptés à la meute", "Organisation logistique sur mesure", "Preuves visuelles groupées"],
      icon: "🐾"
    }
  ];

  const guarantees = [
    { icon: Shield, title: "Accompagnateurs Certifiés", description: "Identité (CNI) et documents vérifiés manuellement", variant: "primary" as const },
    { icon: Lock, title: "Paiement Sécurisé", description: "Fonds bloqués et libérés par le code de fin de service", variant: "accent" as const },
    { icon: Camera, title: "Preuve Visuelle", description: "Photo/vidéo recommandées pour un meilleur classement", variant: "success" as const },
    { icon: CreditCard, title: "Tarifs Libres", description: "Prix fixés par les Accompagnateurs (85% reversés)", variant: "warning" as const }
  ];

  const faqItems = [
    {
      question: "Comment sont fixés les tarifs sur DogWalking ?",
      answer: "DogWalking affiche des tarifs indicatifs (« à partir de… »). Chaque Accompagnateur Certifié est libre de fixer ses propres tarifs en fonction de son expérience et de sa zone géographique. La durée et les modalités des prestations sont définies d'un commun accord entre le Propriétaire et l'Accompagnateur Certifié."
    },
    {
      question: "Qu'est-ce que le système de paiement sécurisé ?",
      answer: "C'est votre garantie sécurité. Lors de la réservation, le montant total est prélevé et bloqué par DogWalking. L'argent n'est jamais versé directement à l'Accompagnateur avant la fin de la mission. Vous restez maître de vos fonds jusqu'à la communication du code de fin de service."
    },
    {
      question: "À quoi sert le code de fin de service ?",
      answer: "Le code de fin de service est déclenché par l'Accompagnateur à la fin de la prestation. Vous le communiquez à l'Accompagnateur pour valider le paiement. Sans ce code, aucun fonds n'est versé. En cas de problème technique, l'option « Le promeneur n'a plus de batterie » permet de valider à distance."
    },
    {
      question: "Les preuves visuelles sont-elles obligatoires ?",
      answer: "Les preuves visuelles (photos/vidéos) sont fortement recommandées mais pas obligatoires pour le paiement. Elles permettent aux Accompagnateurs de bénéficier d'un meilleur classement (surclassement) dans les résultats de recherche. Le paiement est validé par le code de fin de service, indépendamment des preuves visuelles."
    },
    {
      question: "Puis-je annuler une réservation ?",
      answer: "Oui, vous pouvez annuler votre réservation et être remboursé directement sur votre dashboard jusqu'à 3 heures avant le début de la mission. Passé ce délai, des frais peuvent s'appliquer pour dédommager l'Accompagnateur."
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <SEOHead
        title="Tarifs DogWalking | Prix Promenade, Garde & Soins"
        description="Découvrez nos tarifs indicatifs : promenade à partir de 8€, garde à partir de 10€. Système de paiement sécurisé avec code unique et preuves visuelles obligatoires."
        canonical="https://dogwalking.fr/tarifs"
      />
      <Header />
      
      <main className="container mx-auto px-4 pt-20 pb-12">
        <motion.div 
          className="relative rounded-3xl overflow-hidden mb-12"
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6 }}
        >
          <img 
            src={tarifsHero} 
            alt="Paiement sécurisé et réservation DogWalking" 
            className="w-full h-56 md:h-72 object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/70 to-transparent" />
          <div className="absolute bottom-0 left-0 right-0 p-8 text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <Badge className="bg-primary/10 backdrop-blur text-primary px-4 py-1.5 rounded-full text-sm font-medium mb-4">
                <Sparkles className="h-4 w-4 mr-2" />
                Confiance Vérifiée & Sécurité Totale
              </Badge>
            </motion.div>
            <motion.h1 
              className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              Services & Tarifs
            </motion.h1>
            <motion.p 
              className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              Tarifs libres fixés par les Accompagnateurs Certifiés. Paiement sécurisé.
            </motion.p>
          </div>
        </motion.div>

        <AnimatedGrid className="grid-cols-2 md:grid-cols-4 gap-4 max-w-5xl mx-auto mb-12" staggerDelay={0.1}>
          {guarantees.map((item, index) => (
            <AnimatedGridItem key={index}>
              <div className="bg-card rounded-2xl p-5 text-center shadow-sm border border-border hover:border-primary/30 transition-colors">
                <AnimatedIcon icon={item.icon} size="md" variant={item.variant} className="mx-auto mb-3" />
                <h3 className="font-semibold text-sm mb-1">{item.title}</h3>
                <p className="text-xs text-muted-foreground">{item.description}</p>
              </div>
            </AnimatedGridItem>
          ))}
        </AnimatedGrid>

        <motion.div 
          className="max-w-4xl mx-auto mb-12 text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <h2 className="text-2xl md:text-3xl font-bold mb-4">
            Une tarification transparente et flexible
          </h2>
          <p className="text-lg text-muted-foreground leading-relaxed">
            Chez DogWalking, chaque Accompagnateur Certifié définit ses propres tarifs. Les montants affichés sont indicatifs (« à partir de… »). Votre paiement est intégralement bloqué par notre système de paiement sécurisé au moment de la réservation et n'est libéré qu'à la fin de la mission grâce à votre code unique de validation. Ce processus garantit que chaque prestation payée est une prestation réalisée et documentée par des preuves visuelles.
          </p>
        </motion.div>

        <AnimatedGrid className="grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 max-w-7xl mx-auto mb-12" staggerDelay={0.08}>
          {services.map((plan, index) => (
            <AnimatedGridItem key={index}>
              <Card 
                className={`relative h-full transition-all duration-300 hover:shadow-xl ${
                  plan.popular ? 'border-primary shadow-lg ring-2 ring-primary/20' : 'hover:border-primary/30'
                }`}
              >
                {plan.popular && (
                  <motion.div 
                    className="absolute -top-3 left-1/2 -translate-x-1/2 bg-primary text-primary-foreground px-4 py-1 rounded-full text-xs font-semibold flex items-center gap-1"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", delay: 0.5 }}
                  >
                    <Star className="h-3 w-3" />
                    Populaire
                  </motion.div>
                )}
                <CardHeader className="pb-3">
                  <div className="text-3xl mb-2">{plan.icon}</div>
                  <CardTitle className="text-lg">{plan.name}</CardTitle>
                  <div className="flex items-baseline gap-1">
                    <span className="text-3xl font-bold text-primary">à partir de {plan.minPrice}</span>
                  </div>
                  <p className="text-sm text-muted-foreground">{plan.description}</p>
                </CardHeader>
                <CardContent className="pt-0">
                  <ul className="space-y-2.5 mb-5">
                    {plan.features.map((feature, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm">
                        <Check className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                  <Button 
                    className="w-full" 
                    variant={plan.popular ? 'default' : 'outline'}
                    onClick={() => navigate("/walkers")}
                  >
                    Réserver un Accompagnateur
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </CardContent>
              </Card>
            </AnimatedGridItem>
          ))}
        </AnimatedGrid>

        <div className="max-w-4xl mx-auto space-y-12">
          <SectionHeader
            title="Le Paiement en Attente DogWalking"
            subtitle="Une sécurité financière totale pour le Propriétaire et une garantie de paiement pour l'Accompagnateur Certifié"
            icon={Lock}
            iconVariant="accent"
          />
          
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <h3 className="text-2xl font-bold mb-4">Pourquoi le paiement en attente ?</h3>
              <p className="text-muted-foreground leading-relaxed mb-4">
                Le paiement en attente protège les deux parties. Le Propriétaire a la garantie que son argent n'est libéré qu'après communication du code unique de validation en fin de service. L'Accompagnateur Certifié a la certitude que les fonds sont déjà réservés et disponibles via le séquestre DogWalking.
              </p>
              <ul className="space-y-3">
                <li className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-full bg-success/10 flex items-center justify-center">
                    <Check className="h-4 w-4 text-success" />
                  </div>
                  <span className="text-sm">Zéro risque de non-paiement</span>
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-full bg-success/10 flex items-center justify-center">
                    <Check className="h-4 w-4 text-success" />
                  </div>
                  <span className="text-sm">Remboursement facilité en cas d'annulation</span>
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-full bg-success/10 flex items-center justify-center">
                    <Check className="h-4 w-4 text-success" />
                  </div>
                  <span className="text-sm">Transparence totale des flux financiers</span>
                </li>
              </ul>
            </motion.div>
            <motion.div
              className="bg-card rounded-3xl p-8 border shadow-sm relative overflow-hidden"
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full -translate-y-1/2 translate-x-1/2" />
              <div className="relative z-10">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center">
                    <Users className="h-6 w-6 text-primary" />
                  </div>
                  <h4 className="text-xl font-bold">Commission Plateforme</h4>
                </div>
                <div className="space-y-4">
                  <div className="flex justify-between items-center pb-4 border-b">
                    <span className="text-muted-foreground">Reversé à l'Accompagnateur</span>
                    <span className="text-2xl font-bold text-primary">85%</span>
                  </div>
                  <div className="flex justify-between items-center pb-4 border-b">
                    <span className="text-muted-foreground">Frais de service DogWalking</span>
                    <span className="text-2xl font-bold text-accent">15%</span>
                  </div>
                  <p className="text-xs text-muted-foreground italic mt-4">
                    Ces 15% permettent de financer la vérification manuelle des profils, le support client 7j/7, la médiation en cas de litige et le développement de la plateforme.
                  </p>
                </div>
              </div>
            </motion.div>
          </div>

          <div className="bg-muted/50 rounded-3xl p-8 md:p-12">
            <SectionHeader
              title="Questions Fréquentes sur les Tarifs"
              subtitle="Tout ce qu'il faut savoir sur le fonctionnement financier de DogWalking"
              icon={Users}
              iconVariant="primary"
              className="mb-8"
            />
            <SEOFAQ faqs={faqItems} />
          </div>

          <motion.div 
            className="text-center space-y-6"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl font-bold">Prêt à offrir le meilleur à votre animal ?</h2>
            <div className="flex flex-wrap justify-center gap-4">
              <Button size="lg" className="rounded-full px-8" onClick={() => navigate("/walkers")}>
                Trouver un Accompagnateur
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
              <Button size="lg" variant="outline" className="rounded-full px-8" onClick={() => navigate("/support?tab=contact")}>
                Demander un devis personnalisé
              </Button>
            </div>
          </motion.div>
        </div>
      </main>
      
      <Footer />
      <FloatingContact />
    </div>
  );
};

export default Tarifs;
