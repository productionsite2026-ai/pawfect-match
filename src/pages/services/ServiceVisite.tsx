import { Header } from "@/components/ui/header";
import { TrustBadges } from "@/components/ui/trust-badges";
import { Footer } from "@/components/ui/footer";
import { SEOHead } from "@/components/ui/seo-head";
import { SEOFAQ } from "@/components/ui/seo-faq";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { ClientReviews } from "@/components/ui/client-reviews";
import { CaseStudies } from "@/components/ui/case-studies";
import { getReviewsByService, getCaseStudiesByService } from "@/data/clientReviewsData";
import { ServiceHero } from "@/components/ui/service-hero";
import { 
  Home, Clock, Shield, Camera, Heart, Star, 
  CheckCircle, ArrowRight, Droplet, UtensilsCrossed, Stethoscope, Award
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import serviceVisiteImg from "@/assets/service-visite.jpg";

// Données pour reviews et case studies
const reviews = getReviewsByService("visite");
const caseStudies = getCaseStudiesByService("visite");

const visiteFAQs = [
  {
    question: "Que comprend une visite à domicile pour mon chien ?",
    answer: "Une visite standard de 30 minutes comprend : le nourrissage avec la nourriture que vous fournissez, le renouvellement de l'eau fraîche, une sortie hygiénique dans le jardin ou à proximité, des câlins et du temps de jeu, et l'envoi de photos/vidéos comme preuve. Vous pouvez personnaliser le contenu selon vos besoins."
  },
  {
    question: "Le Accompagnateur peut-il administrer des médicaments à mon chien ?",
    answer: "Oui, la plupart de nos Accompagnateurs peuvent administrer des médicaments simples (comprimés, gouttes) selon vos instructions. Précisez les besoins médicaux lors de la réservation et discutez-en avec l'Accompagnateur avant la première visite. Pour les traitements complexes, choisissez un visiteur avec expérience médicale."
  },
  {
    question: "Combien de fois par jour puis-je faire venir le Accompagnateur ?",
    answer: "Vous pouvez réserver autant de visites que nécessaire : 1, 2, 3 visites par jour ou plus. L'idéal pour un chien adulte est 2 à 3 visites espacées dans la journée. Pour un chiot, prévoyez des visites plus rapprochées toutes les 3-4 heures."
  },
  {
    question: "Le Accompagnateur peut-il s'occuper aussi de mes chats ou autres animaux ?",
    answer: "Absolument ! De nombreux visiteurs s'occupent également des chats, oiseaux, poissons, rongeurs et reptiles. Indiquez tous vos animaux lors de la réservation. Le tarif peut être légèrement ajusté si plusieurs animaux nécessitent des soins spécifiques."
  },
  {
    question: "Comment le Accompagnateur entre-t-il chez moi ?",
    answer: "Plusieurs options : vous pouvez laisser un double de clés à l'Accompagnateur, utiliser un boîtier à code à l'extérieur de chez vous, ou donner un code de digicode/serrure connectée. La remise des clés se fait généralement lors d'une rencontre préalable."
  },
  {
    question: "Que se passe-t-il si le Accompagnateur constate un problème chez moi ?",
    answer: "L'Accompagnateur vous contacte immédiatement en cas de problème : fuite d'eau, porte mal fermée, animal qui semble malade. C'est un service de surveillance bonus de votre domicile. Nos visiteurs sont formés pour être vigilants et réactifs."
  }
];

const ServiceVisite = () => {
  const navigate = useNavigate();

  const serviceJsonLd = {
    "@context": "https://schema.org",
    "@type": "Service",
    "name": "Visite à Domicile pour Chien et Animaux",
    "description": "Service de visite à domicile par des Accompagnateurs professionnels vérifiés. Nourriture, eau, câlins et sortie hygiénique pour votre chien pendant votre absence.",
    "provider": {
      "@type": "Organization",
      "name": "DogWalking",
      "url": "https://dogwalking.fr"
    },
    "areaServed": {
      "@type": "Country",
      "name": "France"
    },
    
    "hasOfferCatalog": {
      "@type": "OfferCatalog",
      "name": "Options de visite",
      "itemListElement": [
        { "@type": "Offer", "name": "Visite à domicile", "priceCurrency": "EUR" }
      ]
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <SEOHead
        title="Visite à Domicile Chien | Accompagnateurs Vérifiés | DogWalking"
        description="Faites nourrir et câliner votre chien chez vous par un Accompagnateur vérifié. Visite à domicile, soins quotidiens, preuves photo. Réservez en quelques clics."
        keywords="visite domicile chien, garde multi-animaux maison, nourriture chien, soins animal domicile, garde chat domicile, visite chat, garde animaux maison"
        canonicalUrl="https://dogwalking.fr/services/visite"
        structuredData={serviceJsonLd}
        ogImage={serviceVisiteImg}
      />
      <Header />
      
      <main>
        <ServiceHero
          backgroundImage={serviceVisiteImg}
          badgeIcon={Home}
          badgeText="Votre animal reste chez lui"
          title={<>Visite à Domicile pour <span className="text-gradient">Votre Chien</span></>}
          description="Votre compagnon reste dans son environnement familier pendant que nos Accompagnateurs vérifiés assurent nourriture, eau fraîche, câlins et sortie hygiénique. La solution idéale pour les journées chargées."
          ctaText="Trouver un visiteur"
          ctaLink="/walkers?service=visite"
          imageAlt="Accompagnateur Certifié nourrissant un chien heureux à domicile dans un appartement parisien"
          trustIndicators={[
            { icon: Clock, text: "30 min de visite" },
            { icon: Camera, text: "Preuves photo" },
            { icon: Heart, text: "Câlins inclus" },
          ]}
          statBadge={{ icon: UtensilsCrossed, value: "15 000+", label: "Visites par mois" }}
        />

        {/* Ce qui est inclus */}
        <section className="py-16 bg-muted/30">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                Ce Qui Est Inclus dans Chaque Visite
              </h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Une visite complète pour assurer le bien-être de votre compagnon pendant votre absence.
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
              <Card className="border-2 hover:border-primary/50 transition-colors">
                <CardContent className="p-6">
                  <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mb-4">
                    <UtensilsCrossed className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="text-xl font-bold mb-2">Nourriture</h3>
                  <p className="text-muted-foreground">
                    Distribution de la nourriture selon vos instructions : quantité, horaires, type d'alimentation. 
                    Nous respectons le régime alimentaire de votre chien à la lettre.
                  </p>
                </CardContent>
              </Card>

              <Card className="border-2 hover:border-primary/50 transition-colors">
                <CardContent className="p-6">
                  <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mb-4">
                    <Droplet className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="text-xl font-bold mb-2">Eau Fraîche</h3>
                  <p className="text-muted-foreground">
                    Renouvellement systématique de l'eau de la gamelle. Votre chien a toujours accès 
                    à une eau propre et fraîche pour rester hydraté.
                  </p>
                </CardContent>
              </Card>

              <Card className="border-2 hover:border-primary/50 transition-colors">
                <CardContent className="p-6">
                  <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mb-4">
                    <Heart className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="text-xl font-bold mb-2">Câlins & Jeux</h3>
                  <p className="text-muted-foreground">
                    Moment de tendresse et de jeu avec votre animal. Nos visiteurs adorent passer du temps 
                    de qualité avec vos compagnons à quatre pattes.
                  </p>
                </CardContent>
              </Card>

              <Card className="border-2 hover:border-primary/50 transition-colors">
                <CardContent className="p-6">
                  <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mb-4">
                    <Home className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="text-xl font-bold mb-2">Sortie Hygiénique</h3>
                  <p className="text-muted-foreground">
                    Petite sortie dans le jardin ou à proximité immédiate pour les besoins. 
                    Parfait pour les chiens qui ne peuvent pas attendre longtemps.
                  </p>
                </CardContent>
              </Card>

              <Card className="border-2 hover:border-primary/50 transition-colors">
                <CardContent className="p-6">
                  <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mb-4">
                    <Camera className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="text-xl font-bold mb-2">Preuves Photo</h3>
                  <p className="text-muted-foreground">
                    Photos et vidéos envoyées après chaque visite pour vous rassurer. 
                    Vous voyez que tout s'est bien passé et que votre animal va bien.
                  </p>
                </CardContent>
              </Card>

              <Card className="border-2 hover:border-primary/50 transition-colors">
                <CardContent className="p-6">
                  <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mb-4">
                    <Stethoscope className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="text-xl font-bold mb-2">Administration Médicaments</h3>
                  <p className="text-muted-foreground">
                    Sur demande, l'Accompagnateur peut administrer les médicaments prescrits 
                    selon vos instructions précises et le protocole établi.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Options de visite */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                Deux Niveaux de Service pour Votre Animal
              </h2>
            </div>

            <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
              <Card className="border-2 hover:border-primary/50 transition-all hover:shadow-lg">
                <CardContent className="p-8">
                  <h3 className="text-2xl font-bold mb-2">Visite Standard</h3>
                  <p className="text-muted-foreground mb-6">30 minutes de présence</p>
                  <ul className="space-y-3 mb-6">
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-5 w-5 text-primary" />
                      Nourriture et eau fraîche
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-5 w-5 text-primary" />
                      Câlins et temps de jeu
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-5 w-5 text-primary" />
                      Sortie hygiénique courte
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-5 w-5 text-primary" />
                      Photos/vidéos envoyées
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-5 w-5 text-primary" />
                      Chiens ET chats acceptés
                    </li>
                  </ul>
                  <Button className="w-full" size="lg" onClick={() => navigate("/walkers?service=visite_domicile")}>
                    Réserver une visite
                  </Button>
                </CardContent>
              </Card>

              <Card className="border-2 border-primary hover:shadow-xl transition-all relative">
                <Badge className="absolute -top-3 left-1/2 -translate-x-1/2">Complet</Badge>
                <CardContent className="p-8">
                  <h3 className="text-2xl font-bold mb-2">Visite Sanitaire</h3>
                  <p className="text-muted-foreground mb-6">45 minutes de soins complets</p>
                  <ul className="space-y-3 mb-6">
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-5 w-5 text-primary" />
                      Tout le contenu visite standard
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-5 w-5 text-primary" />
                      Brossage et soins du pelage
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-5 w-5 text-primary" />
                      Nettoyage des yeux/oreilles
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-5 w-5 text-primary" />
                      Administration médicaments
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-5 w-5 text-primary" />
                      Compte-rendu détaillé
                    </li>
                  </ul>
                  <Button className="w-full" size="lg" onClick={() => navigate("/walkers?service=visite_sanitaire")}>
                    Réserver cette formule
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Idéal pour */}
        <section className="py-16 bg-muted/30">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                La Visite à Domicile est Idéale Pour...
              </h2>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-5xl mx-auto">
              <Card className="text-center hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="text-4xl mb-4">🏢</div>
                  <h3 className="font-bold mb-2">Journées de Travail</h3>
                  <p className="text-sm text-muted-foreground">
                    Vous travaillez toute la journée ? Une visite à midi permet à votre chien 
                    de se dégourdir et manger.
                  </p>
                </CardContent>
              </Card>

              <Card className="text-center hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="text-4xl mb-4">🐱</div>
                  <h3 className="font-bold mb-2">Chats & Petits Animaux</h3>
                  <p className="text-sm text-muted-foreground">
                    Les chats préfèrent rester chez eux. Une visite quotidienne est parfaite 
                    pour leur bien-être.
                  </p>
                </CardContent>
              </Card>

              <Card className="text-center hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="text-4xl mb-4">🐕‍🦺</div>
                  <h3 className="font-bold mb-2">Chiens Seniors ou Malades</h3>
                  <p className="text-sm text-muted-foreground">
                    Besoin de médicaments réguliers ou de surveillance ? Nos visiteurs 
                    s'adaptent aux besoins spéciaux.
                  </p>
                </CardContent>
              </Card>

              <Card className="text-center hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="text-4xl mb-4">✈️</div>
                  <h3 className="font-bold mb-2">Courts Déplacements</h3>
                  <p className="text-sm text-muted-foreground">
                    Absent 1-2 jours ? Préférez les visites à la garde pour minimiser 
                    le stress de votre animal.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Témoignages */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="text-3xl md:text-4xl font-bold mb-6">
                  Pourquoi Nos Clients Adorent les Visites à votre Domicile
                </h2>
                <div className="space-y-6">
                  <div className="bg-card p-6 rounded-xl border">
                    <div className="flex items-center gap-1 mb-2">
                      {[1,2,3,4,5].map(i => <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />)}
                    </div>
                    <p className="italic mb-2">
                      "Notre chat déteste les voyages. Les visites quotidiennes pendant nos vacances 
                      sont la solution parfaite. Marion est devenue sa meilleure amie !"
                    </p>
                    <p className="text-sm text-muted-foreground">— Claire T., Paris 11e</p>
                  </div>

                  <div className="bg-card p-6 rounded-xl border">
                    <div className="flex items-center gap-1 mb-2">
                      {[1,2,3,4,5].map(i => <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />)}
                    </div>
                    <p className="italic mb-2">
                      "Je travaille souvent 12h par jour. Savoir que quelqu'un passe voir mon chien 
                      à midi me soulage énormément. Les photos sont toujours adorables."
                    </p>
                    <p className="text-sm text-muted-foreground">— Julien M., Lyon 3e</p>
                  </div>

                  <div className="bg-card p-6 rounded-xl border">
                    <div className="flex items-center gap-1 mb-2">
                      {[1,2,3,4,5].map(i => <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />)}
                    </div>
                    <p className="italic mb-2">
                      "Mon vieux labrador a besoin de ses médicaments 2 fois par jour. 
                      La visiteuse est ponctuelle et très douce avec lui. Service impeccable."
                    </p>
                    <p className="text-sm text-muted-foreground">— André D., Bordeaux</p>
                  </div>
                </div>
              </div>

              <div className="bg-primary/5 p-8 rounded-2xl border border-primary/20">
                <h3 className="text-2xl font-bold mb-6">Avantages de la Visite à Domicile</h3>
                <ul className="space-y-4">
                  <li className="flex items-start gap-3">
                    <CheckCircle className="h-6 w-6 text-primary shrink-0 mt-0.5" />
                    <div>
                      <p className="font-semibold">Pas de stress du transport</p>
                      <p className="text-sm text-muted-foreground">Votre animal reste dans son environnement familier</p>
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle className="h-6 w-6 text-primary shrink-0 mt-0.5" />
                    <div>
                      <p className="font-semibold">Routine préservée</p>
                      <p className="text-sm text-muted-foreground">Mêmes repères, mêmes odeurs, même confort</p>
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle className="h-6 w-6 text-primary shrink-0 mt-0.5" />
                    <div>
                      <p className="font-semibold">Surveillance de votre domicile</p>
                      <p className="text-sm text-muted-foreground">L'Accompagnateur vérifie que tout va bien chez vous</p>
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle className="h-6 w-6 text-primary shrink-0 mt-0.5" />
                    <div>
                      <p className="font-semibold">Économique</p>
                      <p className="text-sm text-muted-foreground">Moins cher qu'une garde complète pour des absences courtes</p>
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle className="h-6 w-6 text-primary shrink-0 mt-0.5" />
                    <div>
                      <p className="font-semibold">Flexible</p>
                      <p className="text-sm text-muted-foreground">1, 2 ou 3 visites par jour selon vos besoins</p>
                    </div>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </section>


        {/* Section Preuves de Confiance (E-E-A-T) */}
        <section className="py-16 md:py-20 bg-muted/30">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                Fiabilité et Confiance pour Chaque Visite
              </h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Un cadre sécurisé pour les visites à votre domicile.
              </p>
            </div>
            <TrustBadges />
          </div>
        </section>

        {/* FAQ */}
        <SEOFAQ 
          title="Questions Fréquentes sur les Visites à votre Domicile"
          subtitle="Tout ce que vous devez savoir avant de réserver"
          faqs={visiteFAQs}
          className="bg-muted/30"
        />

        {/* CTA Final */}
        <section className="py-16 bg-primary text-primary-foreground">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Votre Animal Mérite une Attention Quotidienne
            </h2>
            <p className="text-xl opacity-90 mb-8 max-w-2xl mx-auto">
              Réservez une visite à domicile et partez l'esprit tranquille. 
              Nos Accompagnateurs vérifiés prendront soin de votre compagnon.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Button 
                size="lg" 
                variant="secondary"
                onClick={() => navigate("/walkers?service=visite")}
              >
                Trouver un visiteur
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
              <Button 
                size="lg" 
                variant="outline"
                className="border-primary-foreground text-primary-foreground hover:bg-primary-foreground hover:text-primary"
                onClick={() => navigate("/walker/register")}
              >
                Devenir Accompagnateur
              </Button>
            </div>
          </div>
        </section>
      </main>
        {/* Client Reviews Section */}
        <section className="py-12 bg-muted/30">
          <div className="container mx-auto px-4">
            <ClientReviews reviews={reviews} />
          </div>
        </section>

        {/* Case Studies Section */}
        <section className="py-12">
          <div className="container mx-auto px-4">
            <CaseStudies studies={caseStudies} />
          </div>
        </section>


      <Footer />
    </div>
  );
};

export default ServiceVisite;
