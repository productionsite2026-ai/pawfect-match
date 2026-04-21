import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Header } from '@/components/ui/header';
import { Footer } from '@/components/ui/footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Dog, Users, ArrowRight, Shield, Star, Calendar, MessageCircle, Wallet } from 'lucide-react';
import { motion } from 'framer-motion';
import { SEOHead } from '@/components/seo/SEOHead';

/**
 * Page de redirection automatique selon le type d'utilisateur
 * - Si connecté en tant que Propriétaire → /dashboard-proprietaire
 * - Si connecté en tant que Accompagnateur Certifié → //dashboard-promeneur
 * - Si non connecté → affiche les options d'inscription
 */
const DashboardPreview = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    checkUserAndRedirect();
  }, []);

  const checkUserAndRedirect = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (session?.user) {
        setIsAuthenticated(true);
        // Récupérer le type d'utilisateur
        const { data: profile } = await supabase
          .from('profiles')
          .select('user_type')
          .eq('id', session.user.id)
          .single();

        if (profile?.user_type === 'walker') {
          navigate('//dashboard-promeneur', { replace: true });
          return;
        } else if (profile?.user_type === 'owner') {
          navigate('/dashboard-proprietaire', { replace: true });
          return;
        } else if (profile?.user_type === 'both') {
          // Si l'utilisateur a les deux rôles, rediriger vers Propriétaire par défaut
          navigate('/dashboard-proprietaire', { replace: true });
          return;
        }
      }
    } catch (error) {
      console.error('Error checking user:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <motion.div 
          className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full"
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
        />
      </div>
    );
  }

  // Si non connecté, afficher les options pour choisir son rôle
  return (
    <div className="min-h-screen bg-background">
      <SEOHead 
        title="Choisir mon espace | DogWalking"
        description="Accédez à votre espace Propriétaire ou Accompagnateur Certifié sur DogWalking"
      />
      <Header />
      
      <main className="container mx-auto px-4 py-12">
        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl md:text-5xl font-bold mb-4 text-foreground">
            Bienvenue sur <span className="text-primary">DogWalking</span>
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            La plateforme qui connecte les Propriétaires de chiens avec des Accompagnateurs Certifiés et de confiance.
          </p>
        </motion.div>

        {/* Choix du rôle - Cards séparées */}
        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto mb-16">
          {/* Card Propriétaire */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Card className="h-full border-2 border-primary/20 hover:border-primary/50 transition-all duration-300 hover:shadow-xl bg-card">
              <CardHeader className="text-center pb-4">
                <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-primary/10 flex items-center justify-center">
                  <Dog className="h-10 w-10 text-primary" />
                </div>
                <CardTitle className="text-2xl text-foreground">Espace Propriétaire</CardTitle>
                <CardDescription className="text-base">
                  Vous avez un ou plusieurs chiens et cherchez un Accompagnateur Certifié de confiance
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <ul className="space-y-3">
                  <li className="flex items-center gap-3 text-muted-foreground">
                    <Calendar className="h-5 w-5 text-primary flex-shrink-0" />
                    <span>Réservez des promenades facilement</span>
                  </li>
                  <li className="flex items-center gap-3 text-muted-foreground">
                    <Shield className="h-5 w-5 text-primary flex-shrink-0" />
                    <span>Accompagnateurs Certifiés et assurés</span>
                  </li>
                  <li className="flex items-center gap-3 text-muted-foreground">
                    <MessageCircle className="h-5 w-5 text-primary flex-shrink-0" />
                    <span>Suivi photo et messagerie intégrée</span>
                  </li>
                  <li className="flex items-center gap-3 text-muted-foreground">
                    <Star className="h-5 w-5 text-primary flex-shrink-0" />
                    <span>Avis et notes des Accompagnateurs Certifiés</span>
                  </li>
                </ul>
                <Button 
                  onClick={() => navigate('/auth?role=owner')} 
                  className="w-full gap-2 mt-6"
                  size="lg"
                >
                  Je suis Propriétaire <ArrowRight className="h-4 w-4" />
                </Button>
              </CardContent>
            </Card>
          </motion.div>

          {/* Card Accompagnateur Certifié */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Card className="h-full border-2 border-accent/20 hover:border-accent/50 transition-all duration-300 hover:shadow-xl bg-card">
              <CardHeader className="text-center pb-4">
                <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-accent/10 flex items-center justify-center">
                  <Users className="h-10 w-10 text-accent" />
                </div>
                <CardTitle className="text-2xl text-foreground">Espace Accompagnateur</CardTitle>
                <CardDescription className="text-base">
                  Vous souhaitez devenir Accompagnateur Certifié et gagner de l'argent
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <ul className="space-y-3">
                  <li className="flex items-center gap-3 text-muted-foreground">
                    <Wallet className="h-5 w-5 text-accent flex-shrink-0" />
                    <span>Gagnez jusqu'à 25€/h</span>
                  </li>
                  <li className="flex items-center gap-3 text-muted-foreground">
                    <Calendar className="h-5 w-5 text-accent flex-shrink-0" />
                    <span>Gérez vos disponibilités</span>
                  </li>
                  <li className="flex items-center gap-3 text-muted-foreground">
                    <Shield className="h-5 w-5 text-accent flex-shrink-0" />
                    <span>Protection incluse</span>
                  </li>
                  <li className="flex items-center gap-3 text-muted-foreground">
                    <Star className="h-5 w-5 text-accent flex-shrink-0" />
                    <span>Construisez votre réputation</span>
                  </li>
                </ul>
                <Button 
                  onClick={() => navigate('/auth?role=walker')} 
                  variant="outline"
                  className="w-full gap-2 mt-6 border-accent text-accent hover:bg-accent hover:text-accent-foreground"
                  size="lg"
                >
                  Je suis Accompagnateur Certifié <ArrowRight className="h-4 w-4" />
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Section de confiance */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="text-center bg-primary/5 rounded-3xl p-8 md:p-12"
        >
          <h2 className="text-2xl font-bold mb-6 text-foreground">Pourquoi choisir DogWalking ?</h2>
          <div className="grid sm:grid-cols-3 gap-6 max-w-3xl mx-auto">
            <div className="flex flex-col items-center gap-3">
              <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center">
                <Shield className="h-7 w-7 text-primary" />
              </div>
              <h3 className="font-semibold text-foreground">100% Vérifié</h3>
              <p className="text-sm text-muted-foreground">Identité vérifiée</p>
            </div>
            <div className="flex flex-col items-center gap-3">
              <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center">
                <Star className="h-7 w-7 text-primary" />
              </div>
              <h3 className="font-semibold text-foreground">4.9/5 Satisfaction</h3>
              <p className="text-sm text-muted-foreground">Note moyenne de nos utilisateurs</p>
            </div>
            <div className="flex flex-col items-center gap-3">
              <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center">
                <MessageCircle className="h-7 w-7 text-primary" />
              </div>
              <h3 className="font-semibold text-foreground">Support 7j/7</h3>
              <p className="text-sm text-muted-foreground">Une équipe à votre écoute</p>
            </div>
          </div>
        </motion.div>

        {/* Déjà inscrit ? */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="text-center mt-12"
        >
          <p className="text-muted-foreground mb-4">Vous avez déjà un compte ?</p>
          <Button variant="ghost" onClick={() => navigate('/auth')} className="text-primary">
            Se connecter
          </Button>
        </motion.div>
      </main>
      
      <Footer />
    </div>
  );
};

export default DashboardPreview;
