import { useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";
import { Header } from "@/components/ui/header";
import { Footer } from "@/components/ui/footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AnimatedSection, StaggeredChildren } from "@/components/ui/animated-section";
import { AvailabilityCalendar } from "@/components/booking/AvailabilityCalendar";
import { 
  Star, MapPin, Clock, Shield, Heart, MessageCircle, Calendar,
  CheckCircle, Award, Dog, Euro, Phone, Mail, Camera, Verified,
  ThumbsUp, Users, Route
} from 'lucide-react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { motion } from "framer-motion";

interface WalkerProfile {
  id: string;
  user_id: string;
  hourly_rate: number | null;
  rating: number | null;
  total_reviews: number | null;
  total_walks: number | null;
  verified: boolean | null;
  services: string[] | null;
  experience_years: number | null;
  available_days: string[] | null;
  available_hours_start: string | null;
  available_hours_end: string | null;
  max_dogs: number | null;
  service_radius_km: number | null;
  bio?: string;
  first_name?: string;
  last_name?: string;
  avatar_url?: string;
  city?: string;
  phone?: string;
  email?: string;
}

interface Review {
  id: string;
  rating: number;
  comment: string | null;
  created_at: string;
  reviewer_name?: string;
}

interface Badge {
  id: string;
  badge_name: string;
  badge_type: string;
  badge_description: string | null;
  earned_at: string | null;
}

const WalkerProfilePage = () => {
  const { walkerId } = useParams();
  const navigate = useNavigate();
  const [walker, setWalker] = useState<WalkerProfile | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [badges, setBadges] = useState<Badge[]>([]);
  const [loading, setLoading] = useState(true);
  const [isFavorite, setIsFavorite] = useState(false);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);

  const services = {
    promenade: { label: 'Accompagnement', icon: Route },
    visite: { label: 'Visite à domicile', icon: Dog },
    garde: { label: 'Garde', icon: Calendar },
    veterinaire: { label: 'Accomp. Vétérinaire', icon: Shield },
  };

  const days = {
    monday: 'Lundi',
    tuesday: 'Mardi',
    wednesday: 'Mercredi',
    thursday: 'Jeudi',
    friday: 'Vendredi',
    saturday: 'Samedi',
    sunday: 'Dimanche',
  };

  useEffect(() => {
    checkAuth();
    fetchWalkerProfile();
  }, [walkerId]);

  const checkAuth = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (session) {
      setCurrentUserId(session.user.id);
      checkFavorite(session.user.id);
    }
  };

  const checkFavorite = async (userId: string) => {
    if (!walkerId) return;
    const { data } = await supabase
      .from('favorites')
      .select('id')
      .eq('user_id', userId)
      .eq('walker_id', walkerId)
      .single();
    setIsFavorite(!!data);
  };

  const fetchWalkerProfile = async () => {
    if (!walkerId) return;

    try {
      // Fetch walker profile
      const { data: walkerData, error: walkerError } = await supabase
        .from('walker_profiles')
        .select('*')
        .eq('user_id', walkerId)
        .single();

      if (walkerError) throw walkerError;

      // Fetch user profile
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('first_name, last_name, avatar_url, city, bio, phone, email')
        .eq('id', walkerId)
        .single();

      if (profileError) throw profileError;

      setWalker({ ...walkerData, ...profileData });

      // Fetch reviews
      const { data: reviewsData } = await supabase
        .from('reviews')
        .select('*')
        .eq('reviewed_id', walkerId)
        .order('created_at', { ascending: false })
        .limit(10);

      if (reviewsData) {
        // Fetch reviewer names
        const reviewerIds = reviewsData.map(r => r.reviewer_id);
        const { data: reviewerProfiles } = await supabase
          .from('profiles')
          .select('id, first_name')
          .in('id', reviewerIds);

        const reviewerMap = new Map(reviewerProfiles?.map(p => [p.id, p.first_name]) || []);
        
        setReviews(reviewsData.map(r => ({
          ...r,
          reviewer_name: reviewerMap.get(r.reviewer_id) || 'Utilisateur'
        })));
      }

      // Fetch badges
      const { data: badgesData } = await supabase
        .from('walker_badges')
        .select('*')
        .eq('walker_id', walkerId);

      if (badgesData) {
        setBadges(badgesData);
      }

    } catch (error: any) {
      toast({
        title: "Erreur",
        description: error.message,
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const toggleFavorite = async () => {
    if (!currentUserId) {
      navigate('/auth');
      return;
    }

    try {
      if (isFavorite) {
        await supabase
          .from('favorites')
          .delete()
          .eq('user_id', currentUserId)
          .eq('walker_id', walkerId);
        setIsFavorite(false);
        toast({ title: "Retiré des favoris" });
      } else {
        await supabase
          .from('favorites')
          .insert({ user_id: currentUserId, walker_id: walkerId });
        setIsFavorite(true);
        toast({ title: "Ajouté aux favoris" });
      }
    } catch (error: any) {
      toast({
        title: "Erreur",
        description: error.message,
        variant: "destructive"
      });
    }
  };

  const startConversation = async () => {
    if (!currentUserId) {
      navigate('/auth');
      return;
    }
    navigate('/messages', { state: { selectedWalkerId: walkerId } });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="container mx-auto px-4 py-24">
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (!walker) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="container mx-auto px-4 py-24">
          <h1 className="text-4xl font-bold mb-8">Accompagnateur Certifié introuvable</h1>
        </main>
        <Footer />
      </div>
    );
  }

  const responseRate = 95; 
  const acceptanceRate = 88;

  const localBusinessSchema = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "name": `${walker.first_name} - Accompagnateur Certifié`,
    "description": walker.bio || "Accompagnateur professionnel certifié et vérifié",
    "address": {
      "@type": "PostalAddress",
      "addressLocality": walker.city || "France"
    },
    "priceRange": `${walker.hourly_rate || 15}€`,
    "aggregateRating": walker.rating ? {
      "@context": "https://schema.org",
      "@type": "AggregateRating",
      "ratingValue": walker.rating,
      "reviewCount": walker.total_reviews || 0
    } : undefined
  };

  return (
    <div className="min-h-screen bg-background">
      <Helmet>
        <title>{walker.first_name} - Accompagnateur Certifié à {walker.city || 'France'} | DogWalking</title>
        <meta name="description" content={`${walker.first_name}, Accompagnateur Certifié vérifié à ${walker.city || 'France'}. Note: ${walker.rating?.toFixed(1) || '5.0'}/5. Tarif: $à partir de {walker.hourly_rate || 15}€.`} />
        <script type="application/ld+json">{JSON.stringify(localBusinessSchema)}</script>
      </Helmet>
      <Header />
      <main className="container mx-auto px-4 py-24">
        {/* Hero Section */}
        <AnimatedSection animation="fade-up">
          <Card className="overflow-hidden mb-8">
            <div className="relative h-48 bg-gradient-to-r from-primary/20 via-accent/20 to-primary/10">
              <div className="absolute inset-0 bg-[url('data:image/svg+xml,...')] opacity-10" />
            </div>
            <CardContent className="relative -mt-20 pb-8">
              <div className="flex flex-col md:flex-row gap-6">
                {/* Avatar */}
                <div className="relative">
                  <Avatar className="h-40 w-40 border-4 border-background shadow-xl">
                    <AvatarImage src={walker.avatar_url || ''} />
                    <AvatarFallback className="text-4xl bg-primary/10">
                      {walker.first_name?.[0] || 'A'}
                    </AvatarFallback>
                  </Avatar>
                  {walker.verified && (
                    <div className="absolute bottom-2 right-2 bg-primary text-primary-foreground rounded-full p-2 shadow-lg">
                      <Verified className="h-5 w-5" />
                    </div>
                  )}
                </div>

                {/* Info */}
                <div className="flex-1">
                  <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                    <div>
                      <h1 className="text-3xl font-bold flex items-center gap-2">
                        {walker.first_name} {walker.last_name?.[0]}.
                        {walker.verified && (
                          <Badge className="bg-primary/10 text-primary">
                            <Shield className="h-3 w-3 mr-1" />
                            Certifié
                          </Badge>
                        )}
                      </h1>
                      <div className="flex items-center gap-4 mt-2 text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <MapPin className="h-4 w-4" />
                          {walker.city}
                        </div>
                        <div className="flex items-center gap-1">
                          <Star className="h-4 w-4 text-amber-500 fill-amber-500" />
                          <span className="font-bold text-foreground">{walker.rating?.toFixed(1) || '5.0'}</span>
                          <span>({walker.total_reviews || 0} avis)</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <CheckCircle className="h-4 w-4 text-primary" />
                          {walker.total_walks || 0} prestations
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <Button variant="outline" size="icon" onClick={toggleFavorite} className={isFavorite ? "text-destructive border-destructive" : ""}>
                        <Heart className={isFavorite ? "fill-current" : ""} />
                      </Button>
                      <Button onClick={startConversation}>
                        <MessageCircle className="h-4 w-4 mr-2" />
                        Contacter
                      </Button>
                      <Button onClick={() => navigate(`/book/${walker.user_id}`)} className="shadow-lg shadow-primary/20">
                        <Calendar className="h-4 w-4 mr-2" />
                        Réserver
                      </Button>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2 mt-6">
                    <Badge variant="secondary" className="px-3 py-1">
                      <Clock className="h-3 w-3 mr-1" />
                      {walker.experience_years || 0} ans d'expérience
                    </Badge>
                    <Badge variant="secondary" className="px-3 py-1">
                      <Euro className="h-3 w-3 mr-1" />
                      À partir de {walker.hourly_rate || 15}€
                    </Badge>
                    <Badge variant="secondary" className="px-3 py-1">
                      <Users className="h-3 w-3 mr-1" />
                      Max {walker.max_dogs || 1} Animaux
                    </Badge>
                    <Badge variant="secondary" className="px-3 py-1">
                      <MapPin className="h-3 w-3 mr-1" />
                      Rayon {walker.service_radius_km || 5}km
                    </Badge>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </AnimatedSection>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Bio & Services */}
          <div className="lg:col-span-2 space-y-8">
            <AnimatedSection animation="fade-right">
              <Card>
                <CardHeader>
                  <CardTitle>À propos de {walker.first_name}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-lg leading-relaxed text-muted-foreground whitespace-pre-wrap">
                    {walker.bio || "Aucune description fournie."}
                  </p>
                </CardContent>
              </Card>
            </AnimatedSection>

            <AnimatedSection animation="fade-right" delay={0.1}>
              <Card>
                <CardHeader>
                  <CardTitle>Services proposés</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {walker.services?.map((serviceKey) => {
                      const service = services[serviceKey as keyof typeof services];
                      if (!service) return null;
                      return (
                        <div key={serviceKey} className="flex items-center gap-3 p-4 rounded-xl border bg-card/50">
                          <div className="p-2 rounded-lg bg-primary/10 text-primary">
                            <service.icon className="h-5 w-5" />
                          </div>
                          <span className="font-semibold">{service.label}</span>
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>
            </AnimatedSection>

            <AnimatedSection animation="fade-right" delay={0.2}>
              <Tabs defaultValue="reviews">
                <TabsList className="w-full justify-start border-b rounded-none bg-transparent h-auto p-0 mb-6">
                  <TabsTrigger value="reviews" className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent px-6 py-3">
                    Avis ({reviews.length})
                  </TabsTrigger>
                  <TabsTrigger value="photos" className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent px-6 py-3">
                    Photos
                  </TabsTrigger>
                </TabsList>
                
                <TabsContent value="reviews" className="space-y-6">
                  {reviews.length > 0 ? (
                    reviews.map((review) => (
                      <div key={review.id} className="p-6 rounded-2xl border bg-card/50">
                        <div className="flex items-center justify-between mb-4">
                          <div className="flex items-center gap-3">
                            <Avatar className="h-10 w-10">
                              <AvatarFallback>{review.reviewer_name?.[0]}</AvatarFallback>
                            </Avatar>
                            <div>
                              <p className="font-bold">{review.reviewer_name}</p>
                              <p className="text-xs text-muted-foreground">
                                {new Date(review.created_at).toLocaleDateString()}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center gap-1">
                            <Star className="h-4 w-4 text-amber-500 fill-amber-500" />
                            <span className="font-bold">{review.rating}</span>
                          </div>
                        </div>
                        <p className="text-muted-foreground leading-relaxed italic">
                          "{review.comment}"
                        </p>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-12 text-muted-foreground">
                      Aucun avis pour le moment.
                    </div>
                  )}
                </TabsContent>
                
                <TabsContent value="photos">
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    <div className="aspect-square rounded-xl bg-muted flex items-center justify-center">
                      <Camera className="h-8 w-8 text-muted-foreground/30" />
                    </div>
                    <div className="aspect-square rounded-xl bg-muted flex items-center justify-center">
                      <Camera className="h-8 w-8 text-muted-foreground/30" />
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            </AnimatedSection>
          </div>

          {/* Right Column - Stats & Availability */}
          <div className="space-y-8">
            {badges.length > 0 && (
              <AnimatedSection animation="fade-left" delay={0.1}>
                <Card className="border-amber-200/50 bg-amber-50/10">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Award className="h-5 w-5 text-amber-600" />
                      Badges & Certifications
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 gap-3">
                      {badges.map((badge) => (
                        <motion.div
                          key={badge.id}
                          className="flex flex-col items-center p-3 rounded-xl bg-gradient-to-br from-amber-50 to-amber-100/50 dark:from-amber-950/30 dark:to-amber-900/20 text-center"
                          whileHover={{ scale: 1.05 }}
                        >
                          <Award className="h-8 w-8 text-amber-600 mb-2" />
                          <span className="text-xs font-medium">{badge.badge_name}</span>
                        </motion.div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </AnimatedSection>
            )}

            {/* Response Stats */}
            <AnimatedSection animation="fade-left" delay={0.2}>
              <Card>
                <CardHeader>
                  <CardTitle>Statistiques</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span className="text-muted-foreground">Taux de réponse</span>
                      <span className="font-semibold">{responseRate}%</span>
                    </div>
                    <Progress value={responseRate} className="h-2" />
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span className="text-muted-foreground">Taux d'acceptation</span>
                      <span className="font-semibold">{acceptanceRate}%</span>
                    </div>
                    <Progress value={acceptanceRate} className="h-2" />
                  </div>
                  <div className="pt-2 border-t">
                    <div className="flex items-center gap-2 text-sm">
                      <Clock className="h-4 w-4 text-muted-foreground" />
                      <span className="text-muted-foreground">Répond en moyenne en</span>
                      <span className="font-semibold">1h</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </AnimatedSection>

            {/* Availability - Visual Calendar */}
            <AnimatedSection animation="fade-left" delay={0.3}>
              <AvailabilityCalendar
                availableDays={walker.available_days}
                availableHoursStart={walker.available_hours_start}
                availableHoursEnd={walker.available_hours_end}
              />
              {walker.max_dogs && (
                <Card className="mt-4">
                  <CardContent className="py-3">
                    <p className="text-sm text-muted-foreground flex items-center gap-2">
                      <Dog className="h-4 w-4" />
                      Maximum {walker.max_dogs} Animal{walker.max_dogs > 1 ? 's' : ''} simultanément
                    </p>
                  </CardContent>
                </Card>
              )}
            </AnimatedSection>

            {/* CTA Card */}
            <AnimatedSection animation="scale" delay={0.4}>
              <Card className="bg-gradient-to-br from-primary/10 to-accent/10 border-primary/20">
                <CardContent className="p-6 text-center">
                  <h3 className="text-xl font-bold mb-2">Prêt à réserver ?</h3>
                  <p className="text-muted-foreground mb-4">
                    Réservez une prestation avec {walker.first_name} dès maintenant
                  </p>
                  <Button 
                    size="lg" 
                    className="w-full"
                    onClick={() => navigate(`/book/${walker.user_id}`)}
                  >
                    <Calendar className="h-4 w-4 mr-2" />
                    Réserver maintenant
                  </Button>
                </CardContent>
              </Card>
            </AnimatedSection>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default WalkerProfilePage;
