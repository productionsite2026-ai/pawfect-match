import { useParams, useNavigate } from "react-router-dom";
import { Header } from "@/components/ui/header";
import { Footer } from "@/components/ui/footer";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { SEOHead } from "@/components/seo/SEOHead";
import { getServiceBySlug } from "@/data/servicesData";
import { ArrowRight, Check, Clock, MapPin, Search, Dog, Cat, Shield, Award, Heart, Users, Star, CheckCircle2, Sparkles, Eye, ThumbsUp, Zap, Phone, MessageCircle, Lock, CreditCard, Camera, HelpCircle } from "lucide-react";
import { useState } from "react";
import { motion } from "framer-motion";
import { AnimatedIcon } from "@/components/ui/animated-icon";
import { AnimatedCard, AnimatedGrid, AnimatedGridItem } from "@/components/ui/animated-card";
import { SectionHeader } from "@/components/ui/section-header";
import { FloatingContact } from "@/components/ui/floating-contact";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Input } from "@/components/ui/input";
import NotFound from "./NotFound";

// Animation variants
const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
};

const staggerContainer = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1 } }
};

const scaleIn = {
  hidden: { opacity: 0, scale: 0.8 },
  visible: { opacity: 1, scale: 1, transition: { duration: 0.5 } }
};

const ServicePage = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const [address, setAddress] = useState("");
  const [animalType, setAnimalType] = useState<"chien" | "chat">("chien");

  const service = slug ? getServiceBySlug(slug) : undefined;

  if (!service) {
    return <NotFound />;
  }

  const handleSearch = () => {
    navigate(`/walkers?service=${service.id}&address=${encodeURIComponent(address)}`);
  };

  // Schema.org structured data
  const schemaService = {
    "@context": "https://schema.org",
    "@type": "Service",
    "name": service.title,
    "description": service.metaDescription,
    "provider": {
      "@type": "Organization",
      "name": "DogWalking",
      "url": "https://dogwalking.fr"
    },
    "areaServed": {
      "@type": "Country",
      "name": "France"
    },
    "offers": {
      "@type": "Offer",
      "price": service.minPrice,
      "priceCurrency": "EUR"
    }
  };

  const schemaFAQ = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": service.faq.map(item => ({
      "@type": "Question",
      "name": item.question,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": item.answer
      }
    }))
  };

  const schemaBreadcrumb = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      { "@type": "ListItem", "position": 1, "name": "Accueil", "item": "https://dogwalking.fr" },
      { "@type": "ListItem", "position": 2, "name": "Services", "item": "https://dogwalking.fr/#services" },
      { "@type": "ListItem", "position": 3, "name": service.title, "item": `https://dogwalking.fr/services/${service.slug}` }
    ]
  };

  return (
    <>
      <SEOHead
        title={service.metaTitle}
        description={service.metaDescription}
        canonical={`https://dogwalking.fr/services/${service.slug}`}
        type="service"
      />
      
      {/* Schema.org JSON-LD */}
      <script type="application/ld+json">{JSON.stringify(schemaService)}</script>
      <script type="application/ld+json">{JSON.stringify(schemaFAQ)}</script>
      <script type="application/ld+json">{JSON.stringify(schemaBreadcrumb)}</script>

      <div className="min-h-screen bg-background">
        <Header />

        {/* 1️⃣ HERO SECTION - Animée avec image de fond */}
        <section className="relative min-h-[85vh] flex items-center overflow-hidden">
          {/* Image de fond animée */}
          <motion.div 
            className="absolute inset-0 z-0"
            initial={{ scale: 1.1 }}
            animate={{ scale: 1 }}
            transition={{ duration: 1.5, ease: "easeOut" }}
          >
            <img 
              src={service.heroImage} 
              alt={service.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-background via-background/90 to-background/40" />
          </motion.div>

          <div className="container mx-auto px-4 relative z-10">
            <motion.div 
              className="max-w-2xl"
              initial="hidden"
              animate="visible"
              variants={staggerContainer}
            >
              {/* Breadcrumb */}
              <motion.nav 
                className="text-sm text-muted-foreground mb-6"
                variants={fadeInUp}
              >
                <a href="/" className="hover:text-primary transition-colors">Accueil</a>
                <span className="mx-2">/</span>
                <a href="/#services" className="hover:text-primary transition-colors">Services</a>
                <span className="mx-2">/</span>
                <span className="text-foreground font-medium">{service.title}</span>
              </motion.nav>

              {/* Badge */}
              <motion.div variants={scaleIn} className="mb-4">
                <Badge className="bg-primary/15 text-primary border-0 text-sm py-1.5 px-4">
                  <Sparkles className="h-4 w-4 mr-2" />
                  Service vérifié & sécurisé
                </Badge>
              </motion.div>

              {/* H1 animé */}
              <motion.h1 
                className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight"
                variants={fadeInUp}
              >
                {service.h1}
              </motion.h1>
              
              {/* Description */}
              <motion.p 
                className="text-lg md:text-xl text-muted-foreground mb-4 leading-relaxed"
                variants={fadeInUp}
              >
                {service.heroDescription}
              </motion.p>
              
              {/* Zone mention */}
              <motion.div 
                className="flex items-center gap-2 text-primary font-medium mb-8"
                variants={fadeInUp}
              >
                <MapPin className="h-5 w-5" />
                <span>{service.localZoneMention}</span>
              </motion.div>

              {/* Badges info */}
              <motion.div 
                className="flex flex-wrap gap-4 mb-10"
                variants={fadeInUp}
              >
                <Badge className="bg-primary/15 text-primary border-0 text-base py-2 px-4 backdrop-blur-sm">
                  <Clock className="h-4 w-4 mr-2" />{service.duration}
                </Badge>
                <Badge className="bg-accent/15 text-accent border-0 text-base py-2 px-4 backdrop-blur-sm">
                  <Star className="h-4 w-4 mr-2" />À partir de {service.minPrice}€
                </Badge>
                <Badge className="bg-emerald-500/15 text-emerald-600 border-0 text-base py-2 px-4 backdrop-blur-sm">
                  <Shield className="h-4 w-4 mr-2" />Sécurité & Transparence
                </Badge>
              </motion.div>

              {/* Formulaire de recherche animé */}
              <motion.div 
                className="bg-card/95 backdrop-blur-md rounded-3xl p-6 shadow-xl border border-border/50"
                variants={fadeInUp}
                whileHover={{ boxShadow: "0 25px 50px -12px hsl(var(--primary) / 0.25)" }}
              >
                <div className="flex gap-3 mb-5">
                  <motion.button 
                    onClick={() => setAnimalType("chien")} 
                    className={`flex items-center gap-2 px-5 py-2.5 rounded-full font-medium transition-all ${
                      animalType === "chien" 
                        ? "bg-primary text-primary-foreground shadow-lg" 
                        : "bg-muted/80 text-muted-foreground hover:bg-muted"
                    }`}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Dog className="h-4 w-4" />Chien
                  </motion.button>
                  <motion.button 
                    onClick={() => setAnimalType("chat")} 
                    className={`flex items-center gap-2 px-5 py-2.5 rounded-full font-medium transition-all ${
                      animalType === "chat" 
                        ? "bg-primary text-primary-foreground shadow-lg" 
                        : "bg-muted/80 text-muted-foreground hover:bg-muted"
                    }`}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Cat className="h-4 w-4" />Chat
                  </motion.button>
                </div>
                <div className="flex flex-col sm:flex-row gap-3">
                  <div className="relative flex-1">
                    <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                    <Input 
                      type="text" 
                      placeholder="Votre adresse ou ville..." 
                      value={address} 
                      onChange={(e) => setAddress(e.target.value)} 
                      className="pl-12 h-14 text-base rounded-xl border-border/50 bg-background/50"
                    />
                  </div>
                  <Button size="lg" className="h-14 px-8 rounded-xl text-base font-semibold" onClick={handleSearch}>
                    <Search className="h-5 w-5 mr-2" />Rechercher
                  </Button>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </section>

        {/* 2️⃣ GALERIE D'IMAGES avec présentation enrichie */}
        <section className="py-20 px-4 bg-muted/30">
          <div className="container mx-auto">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              {/* Images en grille créative animée */}
              <motion.div 
                className="grid grid-cols-2 gap-4"
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={staggerContainer}
              >
                {(service.galleryImages || service.images.map(img => img.src)).map((img, i) => (
                  <motion.div 
                    key={i} 
                    className={`rounded-2xl overflow-hidden shadow-lg ${i === 0 ? 'col-span-2 h-64' : 'h-48'}`}
                    variants={scaleIn}
                    whileHover={{ scale: 1.02, transition: { duration: 0.2 } }}
                  >
                    <img src={img} alt={`${service.title} - Galerie ${i+1}`} className="w-full h-full object-cover" />
                  </motion.div>
                ))}
              </motion.div>

              {/* Texte de présentation enrichi */}
              <motion.div
                initial={{ opacity: 0, x: 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
              >
                <Badge className="bg-primary/10 text-primary mb-4">À propos de ce service</Badge>
                <h2 className="text-3xl md:text-4xl font-bold mb-6">Un accompagnement sur-mesure pour votre animal</h2>
                <div className="space-y-6 text-lg text-muted-foreground leading-relaxed">
                  <p>{typeof service.description === 'string' ? service.description : service.description.intro}</p>
                  <p>{service.subDescription || (typeof service.description !== 'string' ? service.description.forWhom : '')}</p>
                </div>
                
                <div className="grid grid-cols-2 gap-6 mt-10">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary">
                      <Users className="h-6 w-6" />
                    </div>
                    <div>
                      <div className="font-bold text-foreground">1500+</div>
                      <div className="text-sm">Accompagnateurs Certifiés</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-2xl bg-accent/10 flex items-center justify-center text-accent">
                      <Star className="h-6 w-6" />
                    </div>
                    <div>
                      <div className="font-bold text-foreground">4.9/5</div>
                      <div className="text-sm">Note moyenne</div>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* 3️⃣ AVANTAGES & GARANTIES - Style moderne */}
        <section className="py-24 px-4">
          <div className="container mx-auto">
            <SectionHeader 
              title="Les Garanties DogWalking" 
              subtitle="Pourquoi nous confier votre animal en toute sérénité"
              icon={Shield}
              iconVariant="primary"
            />
            
            <AnimatedGrid className="grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-16" staggerDelay={0.1}>
              {(service.benefits || []).map((benefit, i) => (
                <AnimatedGridItem key={i}>
                  <Card className="h-full border-border/50 shadow-soft hover:shadow-card hover:-translate-y-1 transition-all duration-300">
                    <CardHeader className="pb-3">
                      <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center mb-4">
                        {i === 0 && <Shield className="h-7 w-7 text-primary" />}
                        {i === 1 && <Eye className="h-7 w-7 text-primary" />}
                        {i === 2 && <Lock className="h-7 w-7 text-primary" />}
                        {i === 3 && <ThumbsUp className="h-7 w-7 text-primary" />}
                      </div>
                      <CardTitle className="text-xl">{benefit.title}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-muted-foreground leading-relaxed">{benefit.description}</p>
                    </CardContent>
                  </Card>
                </AnimatedGridItem>
              ))}
            </AnimatedGrid>
          </div>
        </section>

        {/* 4️⃣ FONCTIONNEMENT - Étapes claires */}
        <section className="py-24 px-4 bg-muted/30">
          <div className="container mx-auto max-w-5xl">
            <SectionHeader 
              title="Comment ça marche ?" 
              subtitle="Votre réservation en 4 étapes simples et sécurisées"
              icon={Zap}
              iconVariant="accent"
            />
            
            <div className="relative mt-20">
              {/* Ligne de connexion (Desktop) */}
              <div className="hidden lg:block absolute top-1/2 left-0 w-full h-0.5 bg-border -translate-y-1/2 z-0" />
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 relative z-10">
                {[
                  { title: "Trouvez", desc: "Choisissez votre Accompagnateur Certifié", icon: Search },
                  { title: "Réservez", desc: "Bloquez les fonds sécurisé", icon: CreditCard },
                  { title: "Suivez", desc: "Recevez les preuves visuelles", icon: Camera },
                  { title: "Validez", desc: "Libérez le paiement par code unique", icon: CheckCircle2 }
                ].map((step, i) => (
                  <motion.div 
                    key={i} 
                    className="flex flex-col items-center text-center"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.1 }}
                  >
                    <div className="w-16 h-16 rounded-full bg-background border-4 border-primary flex items-center justify-center text-primary font-bold text-xl shadow-lg mb-6">
                      {i + 1}
                    </div>
                    <h3 className="text-xl font-bold mb-2">{step.title}</h3>
                    <p className="text-muted-foreground text-sm">{step.desc}</p>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* 5️⃣ FAQ SECTION - Accordéon moderne */}
        <section className="py-24 px-4">
          <div className="container mx-auto max-w-4xl">
            <SectionHeader 
              title="Questions Fréquentes" 
              subtitle="Tout ce qu'il faut savoir sur ce service"
              icon={HelpCircle}
              iconVariant="primary"
            />
            
            <motion.div 
              className="mt-12 bg-card rounded-3xl border shadow-soft overflow-hidden"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <Accordion type="single" collapsible className="w-full">
                {service.faq.map((item, i) => (
                  <AccordionItem key={i} value={`item-${i}`} className="border-b border-border/50 last:border-0">
                    <AccordionTrigger className="px-8 py-6 text-left hover:no-underline hover:bg-muted/30 transition-all">
                      <span className="text-lg font-semibold">{item.question}</span>
                    </AccordionTrigger>
                    <AccordionContent className="px-8 pb-6 pt-2 text-muted-foreground text-base leading-relaxed">
                      {item.answer}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </motion.div>
          </div>
        </section>

        {/* 6️⃣ CTA FINAL - Impactant */}
        <section className="py-20 px-4">
          <div className="container mx-auto">
            <motion.div 
              className="bg-primary rounded-[3rem] p-8 md:p-16 text-center text-primary-foreground relative overflow-hidden shadow-2xl"
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
            >
              {/* Éléments décoratifs */}
              <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
              <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />
              
              <div className="relative z-10 max-w-3xl mx-auto">
                <h2 className="text-3xl md:text-5xl font-bold mb-6">Prêt à réserver pour votre animal ?</h2>
                <p className="text-xl opacity-90 mb-10 leading-relaxed">
                  Rejoignez des milliers de Propriétaires sereins et offrez à votre compagnon l'attention qu'il mérite avec nos Accompagnateurs Certifiés.
                </p>
                <div className="flex flex-wrap justify-center gap-4">
                  <Button 
                    size="lg" 
                    variant="secondary" 
                    className="h-14 px-10 rounded-full text-lg font-bold shadow-xl hover:shadow-2xl transition-all"
                    onClick={handleSearch}
                  >
                    Trouver un Accompagnateur
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                  <Button 
                    size="lg" 
                    variant="outline" 
                    className="h-14 px-10 rounded-full text-lg font-bold border-white/30 bg-white/10 hover:bg-white/20 backdrop-blur-sm"
                    onClick={() => navigate("/support?tab=contact")}
                  >
                    Besoin d'aide ?
                  </Button>
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        <Footer />
        <FloatingContact />
      </div>
    </>
  );
};

export default ServicePage;
