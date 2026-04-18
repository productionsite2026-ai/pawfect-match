import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Search, Heart, Star, MapPin, Trash2, Loader2, MessageCircle, Calendar } from 'lucide-react';
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

interface FavoriteWalker {
  id: string;
  walker_id: string;
  created_at: string;
  walker_profile: {
    user_id: string;
    rating: number | null;
    total_reviews: number | null;
    hourly_rate: number | null;
    verified: boolean | null;
    services: string[] | null;
  } | null;
  profile: {
    first_name: string | null;
    last_name: string | null;
    avatar_url: string | null;
    city: string | null;
  } | null;
}

const WalkersTab = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [favorites, setFavorites] = useState<FavoriteWalker[]>([]);
  const [removingId, setRemovingId] = useState<string | null>(null);

  useEffect(() => {
    fetchFavorites();
  }, []);

  const fetchFavorites = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return;

      // Fetch favorites
      const { data: favoritesData } = await supabase
        .from('favorites')
        .select('*')
        .eq('user_id', session.user.id);

      if (!favoritesData || favoritesData.length === 0) {
        setLoading(false);
        return;
      }

      // Fetch walker profiles
      const walkerIds = favoritesData.map(f => f.walker_id);
      
      const { data: walkerProfiles } = await supabase
        .from('walker_profiles')
        .select('user_id, rating, total_reviews, hourly_rate, verified, services')
        .in('user_id', walkerIds);

      const { data: profiles } = await supabase
        .from('profiles')
        .select('id, first_name, last_name, avatar_url, city')
        .in('id', walkerIds);

      const walkerMap = new Map(walkerProfiles?.map(w => [w.user_id, w]) || []);
      const profileMap = new Map(profiles?.map(p => [p.id, p]) || []);

      const enrichedFavorites: FavoriteWalker[] = favoritesData.map(fav => ({
        ...fav,
        walker_profile: walkerMap.get(fav.walker_id) || null,
        profile: profileMap.get(fav.walker_id) || null
      }));

      setFavorites(enrichedFavorites);
    } catch (error) {
      console.error('Error fetching favorites:', error);
    } finally {
      setLoading(false);
    }
  };

  const removeFavorite = async (favoriteId: string, walkerName: string) => {
    setRemovingId(favoriteId);
    try {
      const { error } = await supabase
        .from('favorites')
        .delete()
        .eq('id', favoriteId);

      if (error) throw error;

      setFavorites(prev => prev.filter(f => f.id !== favoriteId));
      toast({ 
        title: "Favori supprimé", 
        description: `${walkerName} a été retiré de vos favoris` 
      });
    } catch (error: any) {
      toast({ 
        title: "Erreur", 
        description: "Impossible de supprimer ce favori", 
        variant: "destructive" 
      });
    } finally {
      setRemovingId(null);
    }
  };

  const getServiceLabel = (service: string) => {
    const labels: Record<string, string> = {
      promenade: "Promenade",
      garde: "Garde",
      visite: "Visite",
      veterinaire: "Vétérinaire"
    };
    return labels[service] || service;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-16">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold flex items-center gap-2">
          <Heart className="h-6 w-6 text-primary fill-primary/20" />
          Mes Accompagnateur Certifiés Favoris
        </h2>
        <Button onClick={() => navigate('/walkers')} className="gap-2">
          <Search className="h-4 w-4" />
          Explorer
        </Button>
      </div>

      {favorites.length === 0 ? (
        <Card className="text-center py-16">
          <CardContent>
            <Heart className="h-16 w-16 mx-auto mb-4 text-muted-foreground/30" />
            <h3 className="text-xl font-semibold mb-2">Aucun favori</h3>
            <p className="text-muted-foreground mb-6 max-w-md mx-auto">
              Explorez nos promeneurs vérifiés et ajoutez vos préférés pour les retrouver facilement
            </p>
            <Button onClick={() => navigate('/walkers')} size="lg" className="gap-2">
              <Search className="h-4 w-4" />
              Trouver un promeneur
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {favorites.map(fav => {
            const fullName = `${fav.profile?.first_name || ''} ${fav.profile?.last_name || ''}`.trim() || 'Accompagnateur Certifié';
            
            return (
              <Card key={fav.id} className="overflow-hidden hover:shadow-xl transition-all duration-300 group">
                <CardContent className="p-0">
                  {/* Header with Avatar */}
                  <div className="relative bg-gradient-to-br from-primary/10 to-primary/5 p-6 pb-12">
                    {fav.walker_profile?.verified && (
                      <Badge className="absolute top-4 right-4 bg-green-100 text-green-700 border-green-200">
                        Vérifié
                      </Badge>
                    )}
                    <Avatar className="h-20 w-20 mx-auto border-4 border-background shadow-lg">
                      <AvatarImage src={fav.profile?.avatar_url || undefined} />
                      <AvatarFallback className="text-2xl bg-primary/20 text-primary">
                        {fullName.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                  </div>

                  {/* Info */}
                  <div className="p-5 -mt-6 relative">
                    <div className="text-center mb-4">
                      <h3 className="font-bold text-lg">{fullName}</h3>
                      {fav.profile?.city && (
                        <p className="text-sm text-muted-foreground flex items-center justify-center gap-1">
                          <MapPin className="h-3 w-3" />
                          {fav.profile.city}
                        </p>
                      )}
                    </div>

                    {/* Rating & Price */}
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-1">
                        <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
                        <span className="font-semibold">
                          {fav.walker_profile?.rating?.toFixed(1) || '—'}
                        </span>
                        <span className="text-sm text-muted-foreground">
                          ({fav.walker_profile?.total_reviews || 0} avis)
                        </span>
                      </div>
                      <div className="text-right">
                        <span className="font-bold text-lg text-primary">
                          {fav.walker_profile?.hourly_rate || 15}€
                        </span>
                        <span className="text-sm text-muted-foreground">/h</span>
                      </div>
                    </div>

                    {/* Services */}
                    {fav.walker_profile?.services && fav.walker_profile.services.length > 0 && (
                      <div className="flex flex-wrap gap-1 mb-4">
                        {fav.walker_profile.services.slice(0, 3).map(service => (
                          <Badge key={service} variant="outline" className="text-xs">
                            {getServiceLabel(service)}
                          </Badge>
                        ))}
                      </div>
                    )}

                    {/* Actions */}
                    <div className="flex gap-2">
                      <Button 
                        onClick={() => navigate(`/walker/${fav.walker_id}`)} 
                        className="flex-1 gap-2"
                        size="sm"
                      >
                        <Calendar className="h-4 w-4" />
                        Réserver
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => navigate(`/messages?user=${fav.walker_id}`)}
                      >
                        <MessageCircle className="h-4 w-4" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => removeFavorite(fav.id, fullName)}
                        disabled={removingId === fav.id}
                        className="text-red-500 hover:text-red-600 hover:bg-red-50"
                      >
                        {removingId === fav.id ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          <Trash2 className="h-4 w-4" />
                        )}
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </motion.div>
  );
};

export default WalkersTab;
