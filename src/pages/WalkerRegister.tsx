import { Header } from "@/components/ui/header";
import { Footer } from "@/components/ui/footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useNavigate } from 'react-router-dom';
import { toast } from "@/hooks/use-toast";
import { Briefcase, Euro, Clock, Shield, CheckCircle, Users } from 'lucide-react';
import { SEOHead } from "@/components/seo/SEOHead";
import { FloatingContact } from "@/components/ui/floating-contact";
import { motion } from "framer-motion";
import heroImage from "@/assets/pages/devenir-promeneur-hero.jpg";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 }
};

const WalkerRegister = () => {
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      title: "Candidature envoyée !",
      description: "Nous étudierons votre demande et vous recontacterons sous 48h.",
    });
    navigate('/');
  };

  const advantages = [
    {
      icon: Euro,
      title: "Revenus attractifs",
      description: "Fixez vos tarifs librement. Gagnez un complément de revenu significatif en étant votre propre patron."
    },
    {
      icon: Clock,
      title: "Total flexibilité",
      description: "Horaires et zones d'intervention libres. Travaillez quand vous voulez, selon vos disponibilités."
    },
    {
      icon: Shield,
      title: "Paiement Sécurisé",
      description: "Vos gains sont garantis et libérés dès que le Propriétaire communique son code unique de fin de mission."
    },
    {
      icon: Users,
      title: "Clientèle de quartier",
      description: "Construisez votre réputation locale. Les avis certifiés boostent votre visibilité sur la plateforme."
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <SEOHead
        title="Devenir Accompagnateur Certifié | DogWalking"
        description="Rejoignez notre réseau d'Accompagnateurs Certifiés. Fixez vos tarifs, gérez vos horaires et gagnez un revenu attractif en prenant soin des animaux."
        canonical="https://dogwalking.fr/walker/register"
      />
      
      <Header />
      
      {/* Hero Section */}
      <section className="relative h-[50vh] min-h-[400px] flex items-center justify-center overflow-hidden">
        <div 
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${heroImage})` }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-background/80 via-background/60 to-background" />
        
        <motion.div 
          className="relative z-10 text-center px-4 max-w-4xl mx-auto"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
            className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-primary/20 mb-6"
          >
            <Briefcase className="h-10 w-10 text-primary" />
          </motion.div>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Devenez Accompagnateur Certifié</h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Rejoignez l'élite de l'accompagnement animalier. Seuls 35% des candidats sont retenus pour garantir une sécurité et une confiance totale aux Propriétaires.
          </p>
        </motion.div>
      </section>

      <main className="container mx-auto px-4 py-12">
        <div className="max-w-5xl mx-auto">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {/* Advantages Grid */}
            <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
              {advantages.map((advantage, index) => (
                <motion.div 
                  key={advantage.title}
                  className="text-center"
                  whileHover={{ scale: 1.05, y: -4 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <Card className="h-full shadow-card">
                    <CardContent className="pt-6">
                      <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-4">
                        <advantage.icon className="h-8 w-8 text-primary" />
                      </div>
                      <h3 className="font-semibold mb-2">{advantage.title}</h3>
                      <p className="text-sm text-muted-foreground">{advantage.description}</p>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </motion.div>

            {/* Requirements */}
            <motion.div variants={itemVariants} className="mb-12">
              <Card className="bg-muted/50 shadow-card border-primary/20">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <CheckCircle className="h-5 w-5 text-primary" />
                    Processus de certification strict
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex items-start gap-3">
                      <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                        <CheckCircle className="h-4 w-4 text-primary" />
                      </div>
                      <div>
                        <p className="font-medium">Identité vérifiée</p>
                        <p className="text-sm text-muted-foreground">CNI ou passeport en cours de validité</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                        <CheckCircle className="h-4 w-4 text-primary" />
                      </div>
                      <div>
                        <p className="font-medium">Références Vérifiées</p>
                         <p className="text-sm text-muted-foreground">Références et expériences contrôlées</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                        <CheckCircle className="h-4 w-4 text-primary" />
                      </div>
                      <div>
                        <p className="font-medium">Sélection manuelle</p>
                        <p className="text-sm text-muted-foreground">Taux d'acceptation de 35% maximum</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                        <CheckCircle className="h-4 w-4 text-primary" />
                      </div>
                      <div>
                        <p className="font-medium">Protocole DogWalking</p>
                        <p className="text-sm text-muted-foreground">Engagement sur les preuves visuelles obligatoires</p>
                      </div>
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground mt-4 pt-4 border-t">
                    ⏱️ Étude manuelle de votre dossier sous 48h ouvrées par nos équipes
                  </p>
                </CardContent>
              </Card>
            </motion.div>

            {/* Application Form */}
            <motion.div variants={itemVariants}>
              <Card className="shadow-card">
                <CardHeader>
                  <CardTitle>Candidature Accompagnateur Certifié</CardTitle>
                  <CardDescription>
                    Remplissez ce formulaire pour initier votre processus de certification. 
                    Nous vous recontacterons sous 48h.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <motion.div whileFocus={{ scale: 1.02 }}>
                        <Label htmlFor="firstName">Prénom *</Label>
                        <Input id="firstName" required placeholder="Jean" />
                      </motion.div>
                      <div>
                        <Label htmlFor="lastName">Nom *</Label>
                        <Input id="lastName" required placeholder="Dupont" />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="email">Email *</Label>
                        <Input id="email" type="email" required placeholder="jean@email.com" />
                      </div>
                      <div>
                        <Label htmlFor="phone">Téléphone *</Label>
                        <Input id="phone" type="tel" required placeholder="06 12 34 56 78" />
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="city">Ville d'intervention *</Label>
                      <Input id="city" required placeholder="Paris, Lyon, Marseille..." />
                    </div>

                    <div>
                      <Label htmlFor="experience">Expérience animalière *</Label>
                      <Textarea 
                        id="experience" 
                        placeholder="Décrivez votre expérience : possédez-vous des animaux ? Avez-vous des formations ? Quelle est votre approche de la sécurité ?"
                        rows={4}
                        required
                      />
                    </div>

                    <div>
                      <Label htmlFor="motivation">Pourquoi DogWalking ? *</Label>
                      <Textarea 
                        id="motivation" 
                        placeholder="Quelles sont vos motivations pour rejoindre un réseau certifié ? Comment garantissez-vous la satisfaction des Propriétaires ?"
                        rows={4}
                        required
                      />
                    </div>

                    <Button type="submit" className="w-full" size="lg">
                      Envoyer ma candidature
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </motion.div>
          </motion.div>
        </div>
      </main>
      
      <Footer />
      <FloatingContact />
    </div>
  );
};

export default WalkerRegister;
