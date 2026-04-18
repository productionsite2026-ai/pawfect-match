import { Header } from "@/components/ui/header";
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
  Dog, Clock, Shield, Camera, MapPin, Heart, Star, 
  CheckCircle, ArrowRight, Users, Zap, Calendar, Award
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import servicePromenadeImg from "@/assets/service-promenade.jpg";
import { TrustBadges } from "@/components/ui/trust-badges";
import { ExpertBio } from "@/components/ui/expert-bio";
import { getExpertsByExpertise } from "@/data/expertsData";

// Données pour reviews et case studies
const reviews = getReviewsByService("promenade");
const caseStudies = getCaseStudiesByService("promenade");

const promenadeFAQs = [
  {
    question: "Combien de temps dure une promenade de chien standard avec DogWalking ?",
    answer: "Nos promenades durent entre 30 minutes et 2 heures selon vos besoins. La durée la plus demandée est de 45 minutes à 1 heure, idéale pour une bonne dépense d'énergie. Chaque promeneur affiche ses créneaux disponibles sur son profil."
  },
  {
    question: "Mon chien peut-il être promené avec d'autres chiens ?",
    answer: "Cela dépend de l'Accompagnateur choisi. Certains proposent des promenades individuelles exclusives, d'autres des balades en petit groupe (2-3 chiens maximum). Cette information est clairement visible sur chaque profil. Pour les chiens réactifs ou avec des besoins spécifiques, privilégiez les promenades individuelles."
  },
  {
    question: "Comment l'Accompagnateur récupère-t-il mon chien ?",
    answer: "Vous convenez d'un point de rendez-vous avec l'Accompagnateur, généralement à votre domicile. Vous pouvez confier les clés si vous êtes absent, ou remettre votre compagnon en main propre. La laisse et le collier restent avec votre chien pendant toute la promenade."
  },
  {
    question: "Que se passe-t-il en cas de mauvais temps ?",
    answer: "Les promenades ont lieu par tous les temps, sauf conditions extrêmes (canicule au-delà de 35°C, tempête, verglas dangereux). En cas de météo défavorable, l'Accompagnateur peut proposer un report ou une adaptation. La sécurité de votre chien reste toujours la priorité absolue."
  },
  {
    question: "Puis-je suivre la promenade de mon chien en temps réel ?",
    answer: "Chaque promeneur envoie obligatoirement des preuves photo et vidéo pendant et après la promenade via notre plateforme sécurisée. Vous recevez une notification à chaque envoi. La plupart des Accompagnateurs partagent plusieurs photos tout au long de la balade pour votre tranquillité."
  },
  {
    question: "Mon chien a des besoins médicaux, est-ce possible ?",
    answer: "Absolument. Lors de la réservation, vous pouvez indiquer tous les besoins spécifiques : médicaments à administrer, restrictions alimentaires, problèmes de mobilité. L'Accompagnateur confirme qu'il peut gérer ces besoins avant d'accepter. Utilisez la messagerie pour discuter des détails."
  }
];

const ServicePromenade = () => {
  const navigate = useNavigate();

  const serviceJsonLd = {
    "@context": "https://schema.org",
    "@type": "Service",
    "name": "Promenade de Chien Professionnelle",
    "description": "Service de promenade de chien par des Accompagnateurs professionnels vérifiés. Promenades individuelles ou en petit groupe, avec preuves photo obligatoires et protection incluse.",
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
      "name": "Options de promenade",
      "itemListElement": [
        {
          "@type": "Offer",
          "name": "Promenade de chien",
          "priceCurrency": "EUR"
        }
      ]
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <SEOHead
        title="Promenade de Chien | Accompagnateurs Certifiés Vérifiés | DogWalking"
        description="Service de promenade de chien par des professionnels vérifiés partout en France. Preuves photo obligatoires, protection incluse, paiement sécurisé. Réservez en quelques clics."
        keywords="promenade chien, dog walking, promeneur canin, balade chien, sortie chien, promeneur professionnel, dog walker france"
        canonicalUrl="https://dogwalking.fr/services/promenade"
        structuredData={serviceJsonLd}
        ogImage={servicePromenadeImg}
      />
      <Header />
      
      <main>
        <ServiceHero
          backgroundImage={servicePromenadeImg}
          badgeIcon={Dog}
          badgeText="Service n°1 en France"
          title={<>Promenade de Chien par des <span className="text-gradient">Professionnels Vérifiés</span></>}
          description="Offrez à votre compagnon des promenades enrichissantes avec des Accompagnateurs passionnés et vérifiés. Exercice quotidien, socialisation et bien-être garantis partout en France."
          ctaText="Trouver un Accompagnateur"
          ctaLink="/walkers?service=promenade"
          imageAlt="Accompagnateur Certifié professionnel avec un chien heureux dans un parc en automne"
          trustIndicators={[
            { icon: Shield, text: "Protection incluse" },
            { icon: Camera, text: "Preuves photo" },
            { icon: Star, text: "Avis vérifiés" },
          ]}
          statBadge={{ icon: Users, value: "2 500+", label: "Accompagnateurs actifs" }}
        />

        {/* Pourquoi choisir nos promenades */}
        <section className="py-16 bg-muted/30">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                Pourquoi Choisir DogWalking pour la Promenade de Votre Chien ?
              </h2>
              <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
                Nous avons révolutionné la promenade canine en combinant technologie, sécurité et passion pour les animaux. 
                Chaque balade est une expérience unique et sécurisée pour votre compagnon.
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              <Card className="border-2 hover:border-primary/50 transition-colors">
                <CardContent className="p-6">
                  <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mb-4">
                    <Shield className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="text-xl font-bold mb-2">Accompagnateurs 100% Vérifiés</h3>
                  <p className="text-muted-foreground">
                    Chaque Accompagnateur fournit une pièce d'identité, une vérification approfondie et une protection professionnelle. 
                    Notre équipe vérifie manuellement chaque candidature avant validation.
                  </p>
                </CardContent>
              </Card>

              <Card className="border-2 hover:border-primary/50 transition-colors">
                <CardContent className="p-6">
                  <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mb-4">
                    <Camera className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="text-xl font-bold mb-2">Preuves Photo Recommandées</h3>
                  <p className="text-muted-foreground">
                    L'Accompagnateur peut envoyer des photos et vidéos de votre chien pour un meilleur classement. 
                    Vous suivez les aventures de votre compagnon en temps réel.
                  </p>
                </CardContent>
              </Card>

              <Card className="border-2 hover:border-primary/50 transition-colors">
                <CardContent className="p-6">
                  <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mb-4">
                    <Zap className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="text-xl font-bold mb-2">Paiement Sécurisé</h3>
                  <p className="text-muted-foreground">
                    Votre paiement est bloqué en attente. Il n'est libéré qu'après communication du code de fin de service par le Propriétaire. 
                    Une sécurité unique sur le marché français.
                  </p>
                </CardContent>
              </Card>

              <Card className="border-2 hover:border-primary/50 transition-colors">
                <CardContent className="p-6">
                  <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mb-4">
                    <Heart className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="text-xl font-bold mb-2">Promenades Personnalisées</h3>
                  <p className="text-muted-foreground">
                    Chaque chien est unique. Nos Accompagnateurs adaptent l'intensité, la durée et le parcours aux besoins spécifiques 
                    de votre animal : chiot, senior, athlétique ou calme.
                  </p>
                </CardContent>
              </Card>

              <Card className="border-2 hover:border-primary/50 transition-colors">
                <CardContent className="p-6">
                  <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mb-4">
                    <MapPin className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="text-xl font-bold mb-2">Accompagnateurs de Proximité</h3>
                  <p className="text-muted-foreground">
                    Trouvez un Accompagnateur qualifié dans votre quartier. Notre algorithme géolocalise les professionnels 
                    les plus proches pour un service rapide et pratique.
                  </p>
                </CardContent>
              </Card>

              <Card className="border-2 hover:border-primary/50 transition-colors">
                <CardContent className="p-6">
                  <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mb-4">
                    <Award className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="text-xl font-bold mb-2">Protection Complète</h3>
                  <p className="text-muted-foreground">
                    Chaque mission est protégée et suivie de bout en bout. En cas d'incident, notre équipe gère toutes les démarches pour vous.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Comment ça marche */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                Comment Réserver une Promenade en 3 Étapes ?
              </h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Réserver une promenade pour votre chien n'a jamais été aussi simple et sécurisé.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
              <div className="text-center">
                <div className="w-16 h-16 bg-primary text-primary-foreground rounded-2xl flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                  1
                </div>
                <h3 className="text-xl font-bold mb-2">Trouvez Votre Accompagnateur Certifié</h3>
                <p className="text-muted-foreground">
                  Recherchez parmi nos Accompagnateurs vérifiés près de chez vous. Consultez les avis, tarifs et disponibilités 
                  de chaque professionnel avant de faire votre choix.
                </p>
              </div>

              <div className="text-center">
                <div className="w-16 h-16 bg-primary text-primary-foreground rounded-2xl flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                  2
                </div>
                <h3 className="text-xl font-bold mb-2">Réservez en Ligne</h3>
                <p className="text-muted-foreground">
                  Sélectionnez la date, l'heure et la durée de promenade souhaitées. Ajoutez les informations 
                  sur votre chien et validez votre réservation en toute sécurité.
                </p>
              </div>

              <div className="text-center">
                <div className="w-16 h-16 bg-primary text-primary-foreground rounded-2xl flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                  3
                </div>
                <h3 className="text-xl font-bold mb-2">Recevez les Preuves</h3>
                <p className="text-muted-foreground">
                  Le jour de la promenade, recevez des photos et vidéos de votre compagnon en balade. 
                  Le paiement est libéré après communication du code de fin de service par le Propriétaire.
                </p>
              </div>
            </div>

            <div className="text-center mt-12">
              <Button size="lg" onClick={() => navigate("/walkers?service=promenade")}>
                Réserver une promenade maintenant
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </div>
          </div>
        </section>

        {/* Situations concrètes */}
        <section className="py-16 bg-muted/30">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                Dans Quelles Situations Faire Appel à un Accompagnateur ?
              </h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Chaque situation de vie mérite une réponse adaptée pour le bien-être de votre compagnon.
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card className="text-center hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="text-4xl mb-4">🏢</div>
                  <h3 className="font-bold mb-2">Journées de bureau</h3>
                  <p className="text-sm text-muted-foreground mt-2">
                    Votre chien attend seul toute la journée ? Un Accompagnateur vient le sortir et le stimuler pendant votre absence.
                  </p>
                </CardContent>
              </Card>

              <Card className="text-center hover:shadow-lg transition-shadow border-primary">
                <CardContent className="p-6">
                  <Badge className="mb-2">Cas fréquent</Badge>
                  <div className="text-4xl mb-4">🤕</div>
                  <h3 className="font-bold mb-2">Blessure ou mobilité réduite</h3>
                  <p className="text-sm text-muted-foreground mt-2">
                    Vous ne pouvez plus promener votre chien vous-même ? Nos Accompagnateurs prennent le relais sans interruption.
                  </p>
                </CardContent>
              </Card>

              <Card className="text-center hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="text-4xl mb-4">👶</div>
                  <h3 className="font-bold mb-2">Arrivée d'un bébé</h3>
                  <p className="text-sm text-muted-foreground mt-2">
                    Les premiers mois sont intenses. Offrez à votre chien ses promenades quotidiennes sans culpabiliser.
                  </p>
                </CardContent>
              </Card>

              <Card className="text-center hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="text-4xl mb-4">🐶</div>
                  <h3 className="font-bold mb-2">Chien hyperactif</h3>
                  <p className="text-sm text-muted-foreground mt-2">
                    Votre chien déborde d'énergie ? Des promenades longues et stimulantes canalisent son excitation.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Avantages pour le chien */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="text-3xl md:text-4xl font-bold mb-6">
                  Les Bienfaits d'une Promenade Régulière pour Votre Chien
                </h2>
                <p className="text-lg text-muted-foreground mb-8">
                  Une promenade quotidienne n'est pas un luxe, c'est un besoin fondamental pour l'équilibre physique 
                  et mental de votre compagnon. Nos Accompagnateurs professionnels offrent bien plus qu'une simple sortie.
                </p>
                
                <div className="space-y-4">
                  <div className="flex items-start gap-4">
                    <CheckCircle className="h-6 w-6 text-primary shrink-0 mt-1" />
                    <div>
                      <h4 className="font-semibold">Dépense d'Énergie Optimale</h4>
                      <p className="text-muted-foreground">
                        Un chien bien promené est un chien calme à la maison. Réduction des comportements destructeurs 
                        et de l'anxiété grâce à une activité physique adaptée.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <CheckCircle className="h-6 w-6 text-primary shrink-0 mt-1" />
                    <div>
                      <h4 className="font-semibold">Stimulation Mentale</h4>
                      <p className="text-muted-foreground">
                        Nouvelles odeurs, nouveaux environnements, nouvelles rencontres. Chaque promenade est une aventure 
                        sensorielle qui enrichit la vie de votre chien.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <CheckCircle className="h-6 w-6 text-primary shrink-0 mt-1" />
                    <div>
                      <h4 className="font-semibold">Socialisation Positive</h4>
                      <p className="text-muted-foreground">
                        Rencontres avec d'autres chiens et humains dans un cadre contrôlé. Amélioration du comportement 
                        social et de la confiance de votre animal.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <CheckCircle className="h-6 w-6 text-primary shrink-0 mt-1" />
                    <div>
                      <h4 className="font-semibold">Maintien en Bonne Santé</h4>
                      <p className="text-muted-foreground">
                        Prévention de l'obésité, renforcement cardiovasculaire, maintien de la mobilité articulaire. 
                        La promenade est le meilleur médicament préventif.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-card p-8 rounded-2xl border">
                <h3 className="text-2xl font-bold mb-6 text-center">Ce que nos clients disent</h3>
                <div className="space-y-6">
                  <div className="bg-muted/50 p-4 rounded-xl">
                    <div className="flex items-center gap-1 mb-2">
                      {[1,2,3,4,5].map(i => <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />)}
                    </div>
                    <p className="text-sm italic mb-2">
                      "Depuis que Max est promené par Sophie, il est beaucoup plus calme le soir. Les photos qu'elle m'envoie me rassurent vraiment."
                    </p>
                    <p className="text-xs text-muted-foreground">— Marie D., Paris 15e</p>
                  </div>

                  <div className="bg-muted/50 p-4 rounded-xl">
                    <div className="flex items-center gap-1 mb-2">
                      {[1,2,3,4,5].map(i => <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />)}
                    </div>
                    <p className="text-sm italic mb-2">
                      "Service impeccable ! Mon golden adore ses promenades quotidiennes. Le système de preuves photo est génial pour suivre ses aventures."
                    </p>
                    <p className="text-xs text-muted-foreground">— Thomas L., Lyon 6e</p>
                  </div>

                  <div className="bg-muted/50 p-4 rounded-xl">
                    <div className="flex items-center gap-1 mb-2">
                      {[1,2,3,4,5].map(i => <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />)}
                    </div>
                    <p className="text-sm italic mb-2">
                      "Enfin une plateforme sérieuse ! Le paiement sécurisé et la vérification des Accompagnateurs m'ont convaincue."
                    </p>
                    <p className="text-xs text-muted-foreground">— Nathalie R., Bordeaux</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Section Preuves de Confiance (E-E-A-T) */}
        <section className="py-16 md:py-20 bg-muted/30">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                Vos Garanties pour la Promenade de Votre Chien
              </h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Des engagements concrets pour chaque sortie avec votre compagnon.
              </p>
            </div>
            <TrustBadges />
          </div>
        </section>

        {/* FAQ */}
        <SEOFAQ 
          title="Questions Fréquentes sur la Promenade de Chien"
          subtitle="Tout ce que vous devez savoir avant de réserver une promenade"
          faqs={promenadeFAQs}
          className="bg-muted/30"
        />

        {/* CTA Final */}
        <section className="py-16 bg-primary text-primary-foreground">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Prêt à Offrir des Promenades de Qualité à Votre Chien ?
            </h2>
            <p className="text-xl opacity-90 mb-8 max-w-2xl mx-auto">
              Rejoignez les milliers de Propriétaires qui font confiance à DogWalking pour le bien-être de leur compagnon.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Button 
                size="lg" 
                variant="secondary"
                onClick={() => navigate("/walkers?service=promenade")}
              >
                Trouver un Accompagnateur
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
              <Button 
                size="lg" 
                variant="outline"
                className="border-primary-foreground text-primary-foreground hover:bg-primary-foreground hover:text-primary"
                onClick={() => navigate("/walker/register")}
              >
                Devenir promeneur
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

export default ServicePromenade;
