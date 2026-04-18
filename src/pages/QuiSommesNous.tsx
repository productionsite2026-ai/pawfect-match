import { Header } from "@/components/ui/header";
import { Footer } from "@/components/ui/footer";
import { SEOHead } from "@/components/seo/SEOHead";
import { SEOFAQ } from "@/components/ui/seo-faq";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Heart, Shield, Users, Award, Target, Eye, 
  CheckCircle, Star, MapPin, Clock, Camera, Zap
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import teamImage from "@/assets/pages/equipe-dogwalking.jpg";
import missionImage from "@/assets/trust/Accompagnateur-verifie-badge.jpg";
import { ExpertBio } from "@/components/ui/expert-bio";
import { experts } from "@/data/expertsData";

const quiSommesNousFAQs = [
  {
    question: "Depuis quand DogWalking existe-t-il ?",
    answer: "DogWalking a été fondé en 2023 par une équipe de passionnés d'animaux et d'entrepreneurs tech. Notre mission était simple : révolutionner le pet-sitting en France en apportant la transparence et la sécurité qui manquaient cruellement au marché. Aujourd'hui, nous sommes fiers d'accompagner des milliers de familles."
  },
  {
    question: "Comment DogWalking sélectionne-t-il ses Accompagnateurs ?",
    answer: "Chaque candidat Accompagnateur passe par un processus de vérification rigoureux : vérification d'identité (CNI), contrôle du vérification approfondie, validation de la protection, et entretien de motivation. Seuls 35% des candidats sont acceptés. Nous privilégions la qualité à la quantité pour garantir votre tranquillité."
  },
  {
    question: "DogWalking est-il disponible dans ma ville ?",
    answer: "DogWalking couvre l'ensemble du territoire français, avec une présence renforcée en Île-de-France, dans les grandes métropoles (Lyon, Marseille, Bordeaux, Toulouse, Nantes, Lille) et les régions densément peuplées. Nos Accompagnateurs sont disponibles pour vous proposer les profils les plus proches de chez vous."
  },
  {
    question: "Comment contacter l'équipe DogWalking ?",
    answer: "Notre équipe support est disponible 7j/7 par email à contact@dogwalking.fr, par téléphone au 01 23 45 67 89, et via la messagerie intégrée à la plateforme. Le temps de réponse moyen est inférieur à 2 heures. Pour les urgences pendant une mission, une ligne prioritaire est activée."
  },
  {
    question: "Quels sont les engagements de DogWalking envers les animaux ?",
    answer: "Le bien-être animal est au cœur de notre ADN. Nous imposons des limites strictes : maximum 3 chiens par Accompagnateur, durées adaptées à chaque animal, interdiction de laisser un chien sans surveillance. Chaque prestation doit être documentée par photos et vidéos. En cas de maltraitance suspectée, l'Accompagnateur est immédiatement suspendu."
  }
];

const QuiSommesNous = () => {
  const navigate = useNavigate();

  const stats = [
    { value: "50 000+", label: "Prestations réalisées", icon: CheckCircle },
    { value: "2 500+", label: "Accompagnateurs actifs", icon: Users },
    { value: "4.9/5", label: "Note moyenne", icon: Star },
    { value: "50+", label: "Villes couvertes", icon: MapPin }
  ];

  const values = [
    {
      icon: Shield,
      title: "Sécurité Absolue",
      description: "La protection de votre animal et de vos données est notre priorité. Vérifications rigoureuses, paiement sécurisé, paiement sécurisé inclus."
    },
    {
      icon: Heart,
      title: "Passion Animale",
      description: "Nous ne recrutons que des passionnés. Chaque Accompagnateur partage notre amour inconditionnel pour les animaux de compagnie."
    },
    {
      icon: Eye,
      title: "Transparence Totale",
      description: "Preuves photo obligatoires, tarifs affichés, avis authentiques. Aucune zone d'ombre dans notre fonctionnement."
    },
    {
      icon: Zap,
      title: "Innovation Continue",
      description: "Nous investissons constamment dans la technologie pour améliorer l'expérience utilisateur et la sécurité des prestations."
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <SEOHead
        title="Qui Sommes-Nous | L'Équipe DogWalking | Accompagnateurs Certifiés France"
        description="Découvrez l'équipe DogWalking, la plateforme n°1 de promenade de chiens en France. Notre mission : connecter les Propriétaires avec des Accompagnateurs passionnés et vérifiés."
        canonical="https://dogwalking.fr/qui-sommes-nous"
        image={teamImage}
      />
      <Header />
      
      <main>
        {/* Hero Section */}
        <section className="relative py-16 md:py-24 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-background to-accent/10" />
          <div className="container mx-auto px-4 relative z-10">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6 }}
              >
                <Badge className="mb-4 bg-primary/10 text-primary border-primary/20">
                  <Heart className="w-3 h-3 mr-1" />
                  Notre Histoire
                </Badge>
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
                  Qui Sommes-Nous ? <span className="text-primary">L'Équipe DogWalking</span>
                </h1>
                <p className="text-xl text-muted-foreground mb-8 leading-relaxed">
                  Nous sommes une équipe de passionnés d'animaux et de technologie, unis par une mission commune : 
                  offrir aux chiens de France les meilleures promenades possibles, en toute sécurité. Depuis 2023, 
                  nous révolutionnons l'accompagnement animal avec transparence, innovation et bienveillance.
                </p>
                <div className="flex flex-wrap gap-4">
                  <Button size="lg" onClick={() => navigate("/walkers")}>
                    Découvrir nos Accompagnateurs
                  </Button>
                  <Button size="lg" variant="outline" onClick={() => navigate("/walker/register")}>
                    Rejoindre l'équipe
                  </Button>
                </div>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="relative"
              >
                <img 
                  src={teamImage} 
                  alt="L'équipe DogWalking avec des chiens heureux dans un parc" 
                  className="rounded-2xl shadow-2xl w-full object-cover aspect-video"
                />
              </motion.div>
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="py-12 bg-muted/30">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {stats.map((stat, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="text-center"
                >
                  <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mx-auto mb-3">
                    <stat.icon className="h-6 w-6 text-primary" />
                  </div>
                  <p className="text-3xl font-bold text-primary">{stat.value}</p>
                  <p className="text-sm text-muted-foreground">{stat.label}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Notre Mission */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div>
                <img 
                  src={missionImage} 
                  alt="Badge de vérification DogWalking pour Accompagnateurs certifiés" 
                  className="rounded-2xl shadow-lg w-full object-cover aspect-square"
                />
              </div>
              <div>
                <Badge className="mb-4 bg-accent/10 text-accent border-accent/20">
                  <Target className="w-3 h-3 mr-1" />
                  Notre Mission
                </Badge>
                <h2 className="text-3xl md:text-4xl font-bold mb-6">
                  Révolutionner l'Accompagnement Animal en France
                </h2>
                <p className="text-lg text-muted-foreground mb-6 leading-relaxed">
                  Avant DogWalking, trouver un Accompagnateur de confiance relevait du parcours du combattant. 
                  Annonces douteuses, absence de vérifications, paiements hasardeux... Les Propriétaires 
                  de chiens méritaient mieux. Nous avons créé la solution.
                </p>
                <p className="text-lg text-muted-foreground mb-6 leading-relaxed">
                  Notre plateforme combine la puissance de la technologie avec l'expertise humaine. 
                  Chaque Accompagnateur est soigneusement sélectionné, chaque prestation est documentée, 
                  chaque paiement est sécurisé. Nous avons éliminé toutes les sources d'inquiétude 
                  pour que vous puissiez confier votre compagnon en toute sérénité.
                </p>
                <div className="space-y-3">
                  {[
                    "Vérification d'identité approfondie",
                    "Vérification d'identité obligatoire",
                    "Preuves photo/vidéo à chaque mission",
                    "Paiement 100% sécurisé"
                  ].map((item, i) => (
                    <div key={i} className="flex items-center gap-3">
                      <CheckCircle className="h-5 w-5 text-primary flex-shrink-0" />
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Nos Valeurs */}
        <section className="py-16 bg-muted/30">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <Badge className="mb-4 bg-primary/10 text-primary border-primary/20">
                <Award className="w-3 h-3 mr-1" />
                Nos Valeurs
              </Badge>
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                Les Piliers de DogWalking
              </h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Quatre valeurs fondamentales guident chacune de nos décisions et définissent 
                notre identité en tant qu'entreprise engagée pour le bien-être animal.
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {values.map((value, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card className="h-full hover:shadow-lg transition-shadow border-2 hover:border-primary/30">
                    <CardContent className="p-6 text-center">
                      <div className="w-14 h-14 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
                        <value.icon className="h-7 w-7 text-primary" />
                      </div>
                      <h3 className="text-xl font-bold mb-3">{value.title}</h3>
                      <p className="text-muted-foreground">{value.description}</p>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Couverture Nationale */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <Badge className="mb-4 bg-accent/10 text-accent border-accent/20">
                <MapPin className="w-3 h-3 mr-1" />
                Couverture Nationale
              </Badge>
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                Présents Partout en France
              </h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                De Paris à Marseille, de Lyon à Bordeaux, DogWalking déploie son réseau 
                d'Accompagnateurs vérifiés sur l'ensemble du territoire. Où que vous soyez, 
                un professionnel qualifié est proche de chez vous.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
              <Card className="text-center">
                <CardContent className="p-6">
                  <p className="text-4xl font-bold text-primary mb-2">Paris & IDF</p>
                  <p className="text-muted-foreground">Couverture dense avec plus de 800 Accompagnateurs actifs</p>
                </CardContent>
              </Card>
              <Card className="text-center">
                <CardContent className="p-6">
                  <p className="text-4xl font-bold text-primary mb-2">Métropoles</p>
                  <p className="text-muted-foreground">Lyon, Marseille, Bordeaux, Toulouse, Nantes, Lille</p>
                </CardContent>
              </Card>
              <Card className="text-center">
                <CardContent className="p-6">
                  <p className="text-4xl font-bold text-primary mb-2">Régions</p>
                  <p className="text-muted-foreground">Expansion continue sur tout le territoire français</p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Notre Equipe d'Experts */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <Badge className="mb-4 bg-primary/10 text-primary border-primary/20">
                <Award className="w-3 h-3 mr-1" />
                Notre Equipe d'Experts
              </Badge>
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                Les Experts Derriere DogWalking
              </h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Notre equipe est composee de professionnels reconnus dans leurs domaines respectifs : 
                comportement canin, veterinaire, qualite et bien-etre animal.
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              {experts.map((expert, index) => (
                <motion.div
                  key={expert.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                >
                  <ExpertBio expert={expert} />
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="py-16 bg-muted/30">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                Questions Fréquentes sur DogWalking
              </h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Tout ce que vous devez savoir sur notre entreprise, notre équipe et notre fonctionnement.
              </p>
            </div>
            <div className="max-w-3xl mx-auto">
              <SEOFAQ faqs={quiSommesNousFAQs} />
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <Card className="bg-gradient-to-r from-primary to-primary/80 text-primary-foreground">
              <CardContent className="p-8 md:p-12 text-center">
                <h2 className="text-3xl md:text-4xl font-bold mb-4">
                  Rejoignez la Communauté DogWalking
                </h2>
                <p className="text-xl opacity-90 mb-8 max-w-2xl mx-auto">
                  Que vous soyez Propriétaire de chien ou passionné souhaitant devenir Accompagnateur, 
                  faites partie de l'aventure DogWalking dès aujourd'hui.
                </p>
                <div className="flex flex-wrap gap-4 justify-center">
                  <Button size="lg" variant="secondary" onClick={() => navigate("/walkers")}>
                    Trouver un Accompagnateur
                  </Button>
                  <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10" onClick={() => navigate("/walker/register")}>
                    Devenir Accompagnateur
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default QuiSommesNous;
