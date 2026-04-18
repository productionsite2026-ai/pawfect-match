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
  Home, Clock, Shield, Camera, Moon, Sun, Heart, Star, 
  CheckCircle, ArrowRight, Users, Calendar, Award, Bed
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import serviceGardeImg from "@/assets/service-garde.jpg";

// Données pour reviews et case studies
const reviews = getReviewsByService("garde");
const caseStudies = getCaseStudiesByService("garde");

const gardeFAQs = [
  {
    question: "Quelle est la différence entre garde à domicile et hébergement ?",
    answer: "La garde à domicile signifie que le Accompagnateur vient chez vous et dort dans votre maison avec votre chien. L'hébergement implique que votre chien séjourne chez le Accompagnateur, dans son environnement familial. Les deux options incluent les mêmes garanties de sécurité et preuves photo."
  },
  {
    question: "Comment se passe la première rencontre avec le Accompagnateur ?",
    answer: "Nous recommandons fortement une rencontre préalable gratuite entre le Accompagnateur, vous et votre chien. Cela permet de vérifier la compatibilité, de partager les habitudes de votre animal et de visiter le lieu d'hébergement si applicable. Cette rencontre peut être organisée via la messagerie de la plateforme."
  },
  {
    question: "Mon chien peut-il être gardé avec d'autres animaux ?",
    answer: "Chaque Accompagnateur indique sur son profil s'il accueille d'autres animaux simultanément. Si votre chien n'est pas sociable avec ses congénères, privilégiez les gardiens qui proposent des séjours exclusifs. Vous pouvez filtrer les profils selon ce critère."
  },
  {
    question: "Que se passe-t-il en cas d'urgence médicale pendant la garde ?",
    answer: "Chaque Accompagnateur dispose de vos coordonnées et celles de votre vétérinaire. En cas d'urgence, il contacte immédiatement les services vétérinaires et vous prévient. Les frais d'urgence sont à votre charge, mais notre équipe intervient immédiatement pour vous accompagner."
  },
  {
    question: "Puis-je avoir des nouvelles de mon chien pendant la garde ?",
    answer: "Absolument ! Les Accompagnateurs envoient obligatoirement des photos et vidéos quotidiennes via notre plateforme. Vous pouvez également échanger avec eux via la messagerie sécurisée pour prendre des nouvelles ou donner des instructions."
  },
  {
    question: "Quels objets dois-je fournir pour la garde ?",
    answer: "Nous recommandons d'apporter : la nourriture habituelle de votre chien, ses médicaments si nécessaire, son panier ou couverture préférée, un jouet familier, et le carnet de santé à jour. Ces éléments rassurent votre compagnon et facilitent son adaptation."
  }
];

const ServiceGarde = () => {
  const navigate = useNavigate();

  const serviceJsonLd = {
    "@context": "https://schema.org",
    "@type": "Service",
    "name": "Garde de Chien à Domicile et Hébergement",
    "description": "Service de garde de chien par des Accompagnateurs professionnels vérifiés. Garde à domicile, hébergement de jour et de nuit. Preuves photo quotidiennes et protection incluse.",
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
      "name": "Options de garde",
      "itemListElement": [
        { "@type": "Offer", "name": "Garde de chien", "priceCurrency": "EUR" }
      ]
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <SEOHead
        title="Garde de Chien | Accompagnateurs Vérifiés | Hébergement & Domicile | DogWalking"
        description="Faites garder votre chien par des Accompagnateurs vérifiés. Garde à domicile ou hébergement chez le gardien. Preuves photo quotidiennes, protection incluse. Réservez en quelques clics."
        keywords="garde chien, garde multi-animaux, hébergement chien, pension chien, garde à domicile, gardien chien, pension canine france"
        canonicalUrl="https://dogwalking.fr/services/garde"
        structuredData={serviceJsonLd}
        ogImage={serviceGardeImg}
      />
      <Header />
      
      <main>
        <ServiceHero
          backgroundImage={serviceGardeImg}
          badgeIcon={Home}
          badgeText="Alternative aux pensions classiques"
          title={<>Garde de Chien par des <span className="text-gradient">Accompagnateurs Vérifiés</span></>}
          description="Confiez votre compagnon à des gardiens passionnés et certifiés. Garde à domicile ou hébergement en environnement familial, avec suivi quotidien et protection complète."
          ctaText="Trouver un gardien"
          ctaLink="/walkers?service=garde"
          imageAlt="Accompagnateur Certifié prenant soin d'un chien heureux dans un salon confortable"
          trustIndicators={[
            { icon: Shield, text: "Gardiens vérifiés" },
            { icon: Camera, text: "Photos quotidiennes" },
            { icon: Heart, text: "Env. familial" },
          ]}
          statBadge={{ icon: Bed, value: "50 000+", label: "Nuits de garde" }}
        />

        {/* Types de garde */}
        <section className="py-16 bg-muted/30">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                Les Formules de Garde Adaptées à Votre Situation
              </h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Choisissez la formule qui correspond le mieux aux besoins de votre compagnon.
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-5xl mx-auto">
              <Card className="border-2 hover:border-primary/50 transition-all hover:shadow-lg">
                <CardContent className="p-6 text-center">
                  <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <Sun className="h-8 w-8 text-primary" />
                  </div>
                  <h3 className="text-xl font-bold mb-2">Garderie de Jour</h3>
                  <p className="text-sm text-muted-foreground mb-4">Journée complète</p>
                  <ul className="text-sm text-left space-y-2 mb-6">
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-primary" />
                      Journée complète chez le gardien
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-primary" />
                      Activités et promenades incluses
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-primary" />
                      Socialisation avec autres chiens
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-primary" />
                      Photos tout au long de la journée
                    </li>
                  </ul>
                  <Button className="w-full" onClick={() => navigate("/walkers?service=hebergement_jour")}>
                    Réserver
                  </Button>
                </CardContent>
              </Card>

              <Card className="border-2 border-primary hover:shadow-xl transition-all relative">
                <Badge className="absolute -top-3 left-1/2 -translate-x-1/2">Populaire</Badge>
                <CardContent className="p-6 text-center">
                  <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <Moon className="h-8 w-8 text-primary" />
                  </div>
                  <h3 className="text-xl font-bold mb-2">Hébergement Nuit</h3>
                  <p className="text-sm text-muted-foreground mb-4">Nuit complète</p>
                  <ul className="text-sm text-left space-y-2 mb-6">
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-primary" />
                      Nuit chez le gardien
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-primary" />
                      Environnement familial sécurisé
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-primary" />
                      Promenades et jeux inclus
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-primary" />
                      Attention personnalisée 24h
                    </li>
                  </ul>
                  <Button className="w-full" onClick={() => navigate("/walkers?service=hebergement_nuit")}>
                    Réserver
                  </Button>
                </CardContent>
              </Card>

              <Card className="border-2 hover:border-primary/50 transition-all hover:shadow-lg">
                <CardContent className="p-6 text-center">
                  <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <Home className="h-8 w-8 text-primary" />
                  </div>
                  <h3 className="text-xl font-bold mb-2">Garde à Domicile</h3>
                  <p className="text-sm text-muted-foreground mb-4">Garde à votre domicile</p>
                  <ul className="text-sm text-left space-y-2 mb-6">
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-primary" />
                      Le gardien dort chez vous
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-primary" />
                      Votre chien reste dans son environnement
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-primary" />
                      Routine habituelle préservée
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-primary" />
                      Surveillance maison incluse
                    </li>
                  </ul>
                  <Button className="w-full" onClick={() => navigate("/walkers?service=garde_domicile")}>
                    Réserver
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Pourquoi choisir DogWalking */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                Pourquoi Choisir DogWalking Plutôt qu'une Pension Traditionnelle ?
              </h2>
              <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
                Les pensions classiques peuvent être stressantes pour votre chien : environnement impersonnel, 
                nombreux animaux, box individuel. Nos Accompagnateurs offrent une alternative humaine et chaleureuse.
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
              <div className="bg-red-50 dark:bg-red-950/20 p-6 rounded-2xl border border-red-200 dark:border-red-900">
                <h3 className="text-xl font-bold mb-4 text-red-700 dark:text-red-400">❌ Pension Traditionnelle</h3>
                <ul className="space-y-3 text-sm">
                  <li className="flex items-start gap-2">
                    <span className="text-red-500 mt-1">•</span>
                    <span>Environnement de box, souvent bruyant et stressant</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-red-500 mt-1">•</span>
                    <span>Nombreux chiens, risque sanitaire accru</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-red-500 mt-1">•</span>
                    <span>Personnel partagé entre de nombreux animaux</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-red-500 mt-1">•</span>
                    <span>Horaires fixes, peu de flexibilité</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-red-500 mt-1">•</span>
                    <span>Peu de nouvelles pendant le séjour</span>
                  </li>
                </ul>
              </div>

              <div className="bg-green-50 dark:bg-green-950/20 p-6 rounded-2xl border border-green-200 dark:border-green-900">
                <h3 className="text-xl font-bold mb-4 text-green-700 dark:text-green-400">✓ DogWalking</h3>
                <ul className="space-y-3 text-sm">
                  <li className="flex items-start gap-2">
                    <span className="text-green-500 mt-1">•</span>
                    <span>Environnement familial, chaleureux et rassurant</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-500 mt-1">•</span>
                    <span>Peu d'animaux, attention personnalisée</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-500 mt-1">•</span>
                    <span>Un gardien dédié qui connaît votre chien</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-500 mt-1">•</span>
                    <span>Flexibilité totale sur les horaires</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-500 mt-1">•</span>
                    <span>Photos et vidéos quotidiennes obligatoires</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* Garanties */}
        <section className="py-16 bg-muted/30">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                Nos Garanties pour Votre Tranquillité d'Esprit
              </h2>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card className="text-center hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <Shield className="h-12 w-12 text-primary mx-auto mb-4" />
                  <h3 className="font-bold mb-2">Gardiens Vérifiés</h3>
                  <p className="text-sm text-muted-foreground">
                    Identité vérifiée et profil contrôlé avant validation
                  </p>
                </CardContent>
              </Card>

              <Card className="text-center hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <Camera className="h-12 w-12 text-primary mx-auto mb-4" />
                  <h3 className="font-bold mb-2">Preuves Quotidiennes</h3>
                  <p className="text-sm text-muted-foreground">
                    Photos et vidéos obligatoires chaque jour de la garde
                  </p>
                </CardContent>
              </Card>

              <Card className="text-center hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <Award className="h-12 w-12 text-primary mx-auto mb-4" />
                  <h3 className="font-bold mb-2">Sécurité & Transparence</h3>
                  <p className="text-sm text-muted-foreground">
                    Couverture complète en cas d'incident pendant la garde
                  </p>
                </CardContent>
              </Card>

              <Card className="text-center hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <Users className="h-12 w-12 text-primary mx-auto mb-4" />
                  <h3 className="font-bold mb-2">Support 7j/7</h3>
                  <p className="text-sm text-muted-foreground">
                    Équipe disponible pour répondre à toutes vos questions
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Témoignages */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                Ils Nous Font Confiance pour la Garde de Leur Chien
              </h2>
            </div>

            <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
              <Card className="hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-center gap-1 mb-4">
                    {[1,2,3,4,5].map(i => <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />)}
                  </div>
                  <p className="italic mb-4">
                    "Nous avons fait garder Luna pendant 2 semaines. Elle a été chouchoutée comme une reine ! 
                    Les photos quotidiennes nous ont vraiment rassurés."
                  </p>
                  <p className="text-sm text-muted-foreground">— Sophie M., Marseille</p>
                </CardContent>
              </Card>

              <Card className="hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-center gap-1 mb-4">
                    {[1,2,3,4,5].map(i => <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />)}
                  </div>
                  <p className="italic mb-4">
                    "Notre boxer anxieux a parfaitement été pris en charge. Le gardien a su le rassurer 
                    et respecter ses habitudes. Merci infiniment !"
                  </p>
                  <p className="text-sm text-muted-foreground">— Pierre L., Toulouse</p>
                </CardContent>
              </Card>

              <Card className="hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-center gap-1 mb-4">
                    {[1,2,3,4,5].map(i => <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />)}
                  </div>
                  <p className="italic mb-4">
                    "La garde à domicile était parfaite. Notre chien est resté dans ses repères 
                    et la gardienne a même arrosé nos plantes !"
                  </p>
                  <p className="text-sm text-muted-foreground">— Marie & Jean D., Nantes</p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>


        {/* Section Preuves de Confiance (E-E-A-T) */}
        <section className="py-16 md:py-20 bg-muted/30">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                La Sécurité au Cœur de Chaque Garde
              </h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Des mesures de protection concrètes pour la garde de votre animal.
              </p>
            </div>
            <TrustBadges />
          </div>
        </section>

        {/* FAQ */}
        <SEOFAQ 
          title="Questions Fréquentes sur la Garde de Chien"
          subtitle="Tout savoir avant de confier votre compagnon"
          faqs={gardeFAQs}
          className="bg-muted/30"
        />

        {/* CTA Final */}
        <section className="py-16 bg-primary text-primary-foreground">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Partez l'Esprit Tranquille avec DogWalking
            </h2>
            <p className="text-xl opacity-90 mb-8 max-w-2xl mx-auto">
              Vacances, déplacements professionnels, imprévus... Trouvez le gardien idéal pour votre compagnon.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Button 
                size="lg" 
                variant="secondary"
                onClick={() => navigate("/walkers?service=garde")}
              >
                Trouver un gardien
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

export default ServiceGarde;
