import { Header } from "@/components/ui/header";
import { Footer } from "@/components/ui/footer";
import { SEOHead } from "@/components/seo/SEOHead";
import Breadcrumbs from "@/components/zones/Breadcrumbs";
import ZonesRegionsSection from "@/components/zones/ZonesRegionsSection";
import ZonesCitiesSection from "@/components/zones/ZonesCitiesSection";
import ZonesContactSection from "@/components/zones/ZonesContactSection";
import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { MapPin, Shield, Clock, Users, Award, Dog, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import heroImg from "@/assets/hero-dogwalking.jpg";

const NousSommesPresents = () => {
  const heroRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ["start start", "end start"] });
  const bgY = useTransform(scrollYProgress, [0, 1], ["0%", "25%"]);

  const stats = [
    { icon: MapPin, value: "50+", label: "Villes couvertes", color: "text-primary" },
    { icon: Dog, value: "20", label: "Arrondissements Paris", color: "text-violet-500" },
    { icon: Users, value: "200+", label: "Accompagnateurs Certifiés", color: "text-emerald-500" },
    { icon: Clock, value: "48h", label: "Délai de vérification", color: "text-orange-500" },
  ];

  const faqs = [
    { 
      question: "Où êtes-vous disponibles ?", 
      answer: "DogWalking est actuellement disponible à Paris (20 arrondissements) et dans toute l'Île-de-France. Nous couvrons les départements 75, 77, 78, 91, 92, 93, 94 et 95 avec des Accompagnateurs Certifiés." 
    },
    { 
      question: "Comment sont sélectionnés les Accompagnateurs ?", 
      answer: "Chaque Accompagnateur Certifié passe un processus de sélection rigoureux : vérification d'identité (CNI), contrôle des références et validation manuelle du profil. Seuls 35% des candidats sont retenus." 
    },
    { 
      question: "Puis-je avoir un Accompagnateur Certifié dans ma ville rapidement ?", 
      answer: "À Paris et en Île-de-France, nous avons un réseau dense permettant une mise en relation rapide. Si votre zone n'est pas encore couverte, vous pouvez créer une alerte pour être prévenu dès l'ouverture." 
    },
    { 
      question: "Quels services proposez-vous ?", 
      answer: "Accompagnement quotidien, garde à domicile, visite à domicile, et bien plus. Tous nos services sont sécurisés par un système de paiement sécurisé et une validation par code unique." 
    },
    { 
      question: "Comment demander un service dans ma zone ?", 
      answer: "Utilisez le formulaire de recherche sur la page d'accueil ou inscrivez-vous directement sur la plateforme en tant que Propriétaire. Nous vous mettons en relation avec l'Accompagnateur Certifié le plus proche." 
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <SEOHead
        title="Nous Sommes Présents — Zones d'Intervention | DogWalking"
        description="DogWalking intervient à Paris, Île-de-France et bientôt partout en France. Trouvez un Accompagnateur Certifié près de chez vous. 200+ prestataires disponibles."
        canonical="https://dogwalking.fr/nous-sommes-presents"
      />
      <Header />

      {/* Hero */}
      <section ref={heroRef} className="relative min-h-[550px] flex items-center overflow-hidden pt-20">
        <motion.div className="absolute inset-0" style={{ y: bgY }}>
          <img src={heroImg} alt="Accompagnement d'animaux en ville" className="w-full h-[120%] object-cover" />
          <div className="absolute inset-0 bg-gradient-to-r from-background/95 via-background/80 to-background/30" />
        </motion.div>
        <div className="container mx-auto px-4 relative z-10">
          <Breadcrumbs items={[{ name: "Nous Sommes Présents", url: "/nous-sommes-presents" }]} />
          <div className="max-w-3xl mt-6">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1 }}>
              <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-semibold border border-primary/20 mb-6 backdrop-blur-sm">
                <Shield className="h-4 w-4" />
                Accompagnateurs Certifiés — Paris & Île-de-France
              </span>
            </motion.div>
            <motion.h1 initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1, delay: 0.2 }} className="text-4xl sm:text-5xl md:text-6xl font-extrabold leading-tight mb-6 text-foreground">
              Nous Sommes Présents : <span className="text-primary">Votre Accompagnateur</span> près de chez vous
            </motion.h1>
            <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1, delay: 0.4 }} className="text-lg md:text-xl text-muted-foreground mb-8 max-w-2xl leading-relaxed">
              DogWalking couvre Paris et toute l'Île-de-France avec un réseau d'Accompagnateurs Certifiés, passionnés et sélectionnés manuellement. Trouvez l'expert idéal pour votre animal.
            </motion.p>
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1, delay: 0.6 }} className="flex flex-wrap gap-4 mb-8">
              <Button size="lg" asChild className="px-8 py-6 text-lg font-bold rounded-full shadow-xl transition-all duration-300 hover:scale-105">
                <Link to="/walkers" className="flex items-center gap-2">
                  Trouver un Accompagnateur <ArrowRight className="h-5 w-5" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" asChild className="px-8 py-6 text-lg font-bold rounded-full transition-all duration-300 hover:scale-105">
                <a href="#contact-zone" className="flex items-center gap-2">
                  <Dog className="h-5 w-5" /> Demander un Service
                </a>
              </Button>
            </motion.div>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1, delay: 0.8 }} className="flex flex-wrap gap-3">
              <Badge variant="secondary" className="flex items-center gap-1.5 px-3 py-1.5">
                <Shield className="h-4 w-4" /> Accompagnateurs Certifiés
              </Badge>
              <Badge variant="secondary" className="flex items-center gap-1.5 px-3 py-1.5">
                <Clock className="h-4 w-4" /> Sélection à 35%
              </Badge>
              <Badge variant="secondary" className="flex items-center gap-1.5 px-3 py-1.5">
                <Award className="h-4 w-4" /> Paiement Sécurisé
              </Badge>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-12 bg-card border-y border-border">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {stats.map((stat, index) => (
              <motion.div key={index} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: index * 0.1 }} className="text-center p-6 rounded-2xl bg-background border border-border hover:shadow-lg transition-shadow">
                <div className="w-14 h-14 mx-auto rounded-xl bg-muted flex items-center justify-center mb-3">
                  <stat.icon className={`h-7 w-7 ${stat.color}`} />
                </div>
                <div className="text-3xl font-extrabold text-foreground">{stat.value}</div>
                <div className="text-sm text-muted-foreground font-medium mt-1">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Regions */}
      <ZonesRegionsSection />

      {/* Cities */}
      <ZonesCitiesSection />

      {/* Contact Form */}
      <ZonesContactSection />

      {/* FAQ */}
      <section className="py-16 bg-background">
        <div className="container mx-auto px-4 max-w-3xl">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-10">
            <h2 className="text-3xl font-bold text-foreground mb-4">Questions Fréquentes</h2>
            <p className="text-muted-foreground">Tout ce que vous devez savoir sur nos zones d'intervention.</p>
          </motion.div>
          <Accordion type="single" collapsible className="space-y-3">
            {faqs.map((faq, index) => (
              <AccordionItem key={index} value={`faq-${index}`} className="bg-card border border-border rounded-xl px-6 overflow-hidden">
                <AccordionTrigger className="text-left font-semibold text-foreground hover:text-primary py-5">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground pb-5 leading-relaxed">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default NousSommesPresents;
