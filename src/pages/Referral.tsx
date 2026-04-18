import { useEffect, useState } from "react";
import { Header } from "@/components/ui/header";
import { Footer } from "@/components/ui/footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Gift, Copy, Users, Share2, Check, Star, ArrowRight } from 'lucide-react';
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { SEOHead } from "@/components/seo/SEOHead";
import { FloatingContact } from "@/components/ui/floating-contact";
import { motion } from "framer-motion";

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

const Referral = () => {
  const navigate = useNavigate();
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);

  // Generate a unique referral code based on user id
  const generateReferralCode = (userId: string) => {
    return `DOG${userId.slice(0, 8).toUpperCase()}`;
  };

  useEffect(() => {
    const fetchProfile = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        navigate('/auth');
        return;
      }
      
      const { data } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', session.user.id)
        .single();
      
      setProfile(data);
      setLoading(false);
    };
    
    fetchProfile();
  }, [navigate]);

  const referralCode = profile ? generateReferralCode(profile.id) : "DOGWALK123";
  const referralLink = `${window.location.origin}/auth?ref=${referralCode}`;

  const handleCopy = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    toast({
      title: `${label} copié !`,
      description: "Partagez-le avec vos amis",
    });
    setTimeout(() => setCopied(false), 2000);
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Rejoignez DogWalking !',
          text: `Utilisez mon code ${referralCode} pour obtenir 10€ de réduction sur votre première réservation !`,
          url: referralLink,
        });
      } catch (error) {
        // User cancelled share
      }
    } else {
      handleCopy(referralLink, "Lien");
    }
  };

  const steps = [
    {
      number: "1",
      title: "Partagez votre code",
      description: "Envoyez votre code unique à vos amis par SMS, email ou réseaux sociaux"
    },
    {
      number: "2", 
      title: "Inscription de l'ami",
      description: "Votre ami s'inscrit sur DogWalking avec votre code de parrainage"
    },
    {
      number: "3",
      title: "Première réservation",
      description: "Votre ami effectue sa première réservation et bénéficie de 10€ de réduction"
    },
    {
      number: "4",
      title: "Vous êtes récompensé",
      description: "Recevez 15€ de crédit automatiquement sur votre compte"
    }
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="container mx-auto px-4 py-24 flex items-center justify-center">
          <motion.div 
            className="rounded-full h-8 w-8 border-b-2 border-primary"
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          />
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <SEOHead
        title="Programme de Parrainage | DogWalking"
        description="Parrainez vos amis sur DogWalking ! Gagnez 15€ pour chaque nouveau membre inscrit avec votre code. Votre ami reçoit 10€ de réduction."
        canonical="https://dogwalking.fr/referral"
        noindex
      />
      
      <Header />
      
      <main className="container mx-auto px-4 py-24 max-w-5xl">
        {/* Hero Section */}
        <motion.div 
          className="text-center mb-12"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <motion.div 
            className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-primary to-accent mb-6"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
          >
            <Gift className="h-10 w-10 text-white" />
          </motion.div>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Programme de Parrainage
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Parrainez vos amis et gagnez des récompenses ! 
            15€ pour vous, 10€ pour eux sur leur première réservation.
          </p>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {/* Rewards Cards */}
          <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
            <motion.div whileHover={{ scale: 1.02, y: -4 }} transition={{ type: "spring", stiffness: 300 }}>
              <Card className="relative overflow-hidden border-2 border-primary/20 bg-gradient-to-br from-primary/5 to-primary/10 h-full">
                <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 rounded-full -translate-y-1/2 translate-x-1/2"></div>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Star className="h-5 w-5 text-primary" />
                    Pour vous
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-5xl font-bold text-primary mb-2">15€</div>
                  <p className="text-muted-foreground">
                    de crédit pour chaque ami qui s'inscrit et effectue sa première réservation
                  </p>
                  <div className="mt-4 pt-4 border-t border-border">
                    <p className="text-sm text-muted-foreground">
                      ✓ Crédit sans limite de parrainages<br/>
                      ✓ Utilisable sur tous les services<br/>
                      ✓ Crédit valable 12 mois
                    </p>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div whileHover={{ scale: 1.02, y: -4 }} transition={{ type: "spring", stiffness: 300 }}>
              <Card className="relative overflow-hidden border-2 border-accent/20 bg-gradient-to-br from-accent/5 to-accent/10 h-full">
                <div className="absolute top-0 right-0 w-32 h-32 bg-accent/10 rounded-full -translate-y-1/2 translate-x-1/2"></div>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Gift className="h-5 w-5 text-accent" />
                    Pour votre ami
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-5xl font-bold text-accent mb-2">10€</div>
                  <p className="text-muted-foreground">
                    de réduction immédiate sur sa première réservation avec votre code
                  </p>
                  <div className="mt-4 pt-4 border-t border-border">
                    <p className="text-sm text-muted-foreground">
                      ✓ Réduction appliquée automatiquement<br/>
                      ✓ Sur tous les services<br/>
                      ✓ Utilisable dès l'inscription
                    </p>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </motion.div>

          {/* Referral Code Card */}
          <motion.div variants={itemVariants}>
            <Card className="mb-12 shadow-card">
              <CardHeader>
                <CardTitle>Votre code de parrainage</CardTitle>
                <CardDescription>
                  Partagez ce code avec vos amis pour qu'ils bénéficient de leur réduction
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex gap-3">
                  <div className="flex-1 relative">
                    <Input 
                      value={referralCode} 
                      readOnly 
                      className="font-mono text-xl h-14 text-center tracking-widest bg-muted" 
                    />
                  </div>
                  <Button 
                    onClick={() => handleCopy(referralCode, "Code")}
                    className="h-14 px-6"
                    variant={copied ? "outline" : "default"}
                  >
                    {copied ? <Check className="h-5 w-5 mr-2" /> : <Copy className="h-5 w-5 mr-2" />}
                    {copied ? "Copié !" : "Copier"}
                  </Button>
                </div>
                
                <div className="flex gap-3">
                  <div className="flex-1 relative">
                    <Input 
                      value={referralLink} 
                      readOnly 
                      className="text-sm h-12 text-muted-foreground bg-muted" 
                    />
                  </div>
                  <Button 
                    onClick={handleShare}
                    variant="outline"
                    className="h-12 px-6"
                  >
                    <Share2 className="h-5 w-5 mr-2" />
                    Partager
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* How it works */}
          <motion.div variants={itemVariants} className="mb-12">
            <h2 className="text-2xl font-bold text-center mb-8">Comment ça marche ?</h2>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {steps.map((step, index) => (
                <motion.div 
                  key={step.number} 
                  className="relative"
                  whileHover={{ scale: 1.03, y: -4 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <Card className="h-full">
                    <CardContent className="pt-6">
                      <div className="w-10 h-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold mb-4">
                        {step.number}
                      </div>
                      <h3 className="font-semibold mb-2">{step.title}</h3>
                      <p className="text-sm text-muted-foreground">{step.description}</p>
                    </CardContent>
                  </Card>
                  {index < steps.length - 1 && (
                    <div className="hidden md:flex absolute top-1/2 -right-4 z-10">
                      <ArrowRight className="h-6 w-6 text-muted-foreground" />
                    </div>
                  )}
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Referral Stats */}
          <motion.div variants={itemVariants}>
            <Card className="shadow-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  Vos parrainages
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                  <motion.div 
                    className="text-center p-4 bg-muted/50 rounded-lg"
                    whileHover={{ scale: 1.05 }}
                  >
                    <div className="text-3xl font-bold text-primary">0</div>
                    <p className="text-sm text-muted-foreground">Amis parrainés</p>
                  </motion.div>
                  <motion.div 
                    className="text-center p-4 bg-muted/50 rounded-lg"
                    whileHover={{ scale: 1.05 }}
                  >
                    <div className="text-3xl font-bold text-primary">0€</div>
                    <p className="text-sm text-muted-foreground">Crédits gagnés</p>
                  </motion.div>
                  <motion.div 
                    className="text-center p-4 bg-muted/50 rounded-lg"
                    whileHover={{ scale: 1.05 }}
                  >
                    <div className="text-3xl font-bold text-primary">0€</div>
                    <p className="text-sm text-muted-foreground">Crédits disponibles</p>
                  </motion.div>
                </div>
                
                <div className="text-center py-8 border-t">
                  <Users className="h-12 w-12 mx-auto mb-4 text-muted-foreground opacity-50" />
                  <p className="text-muted-foreground mb-2">Vous n'avez pas encore parrainé d'amis</p>
                  <p className="text-sm text-muted-foreground">Commencez à partager votre code maintenant !</p>
                  <Button onClick={handleShare} className="mt-4">
                    <Share2 className="h-4 w-4 mr-2" />
                    Inviter des amis
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </motion.div>
      </main>
      
      <Footer />
      <FloatingContact />
    </div>
  );
};

export default Referral;
