import { Heart, Star, MapPin, MessageCircle, Trash2, Search, Filter, ChevronRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "@/contexts/AuthContext";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import avatarWalker from "@/assets/avatar-walker.jpg";
import StarRating from "../StarRating";
import { toast } from "sonner";
import { useState } from "react";

const DEMO_FAVORITES = [
  { id: "1", name: "Lucas M.", rating: 4.9, reviews: 89, avatar: avatarWalker, city: "Paris", price: 15, verified: true, services: ["Promenade", "Garde"], experience: 3 },
  { id: "2", name: "Sophie B.", rating: 4.7, reviews: 34, avatar: avatarWalker, city: "Lyon", price: 12, verified: true, services: ["Promenade", "Visite"], experience: 2 },
  { id: "3", name: "Emma P.", rating: 4.5, reviews: 21, avatar: null, city: "Marseille", price: 18, verified: false, services: ["Promenade"], experience: 1 },
];

const FavoritesTab = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [searchQuery, setSearchQuery] = useState("");

  const { data: favorites = [] } = useQuery({
    queryKey: ["favorites", user?.id],
    queryFn: async () => {
      if (!user) return [];
      const { data } = await supabase
        .from("favorites")
        .select("*, walker:walker_id(id, user_id)")
        .eq("user_id", user.id);
      if (!data || data.length === 0) return [];
      const walkerIds = data.map((f: any) => f.walker_id);
      const { data: walkerProfiles } = await supabase
        .from("walker_profiles")
        .select("*")
        .in("user_id", walkerIds);
      const wpUserIds = (walkerProfiles || []).map((p: any) => p.user_id);
      const { data: profilesData } = wpUserIds.length > 0
        ? await supabase.from("profiles").select("id, first_name, last_name, avatar_url, city").in("id", wpUserIds)
        : { data: [] };
      const profileMap = new Map((profilesData || []).map((p: any) => [p.id, p]));
      return (walkerProfiles || []).map((p: any) => {
        const prof = profileMap.get(p.user_id);
        return {
          id: p.user_id,
          name: `${prof?.first_name || "Accompagnateur Certifié"} ${(prof?.last_name || "")[0] || ""}.`,
          rating: Number(p.rating || 0),
          reviews: p.total_reviews || 0,
          avatar: prof?.avatar_url,
          city: prof?.city || "",
          price: p.hourly_rate || 15,
          verified: p.verified || false,
          services: p.services || [],
          experience: p.experience_years || 0,
        };
      });
    },
    enabled: !!user,
  });

  const removeFavorite = useMutation({
    mutationFn: async (walkerId: string) => {
      if (!user) throw new Error("Not authenticated");
      await supabase.from("favorites").delete().eq("user_id", user.id).eq("walker_id", walkerId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["favorites"] });
      toast.success("Retiré des favoris");
    },
  });

  const list = !user || favorites.length === 0 ? DEMO_FAVORITES : favorites;
  const filtered = list.filter((w: any) => w.name.toLowerCase().includes(searchQuery.toLowerCase()));

  return (
    <div className="px-4 py-6 space-y-4 pb-24">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <Heart className="w-5 h-5 text-[hsl(var(--heart))]" />
          <h2 className="text-lg font-black text-foreground">Mes Favoris</h2>
          <span className="text-xs font-bold text-muted-foreground bg-muted px-2 py-0.5 rounded-full">{list.length}</span>
        </div>
        <button onClick={() => navigate("/find-walkers")} className="text-xs font-bold text-primary">
          Découvrir +
        </button>
      </div>

      {/* Search */}
      {list.length > 0 && (
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input value={searchQuery} onChange={e => setSearchQuery(e.target.value)}
            placeholder="Rechercher un Accompagnateur Certifié..."
            className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-muted text-sm focus:outline-none focus:ring-2 focus:ring-primary/30" />
        </div>
      )}

      {filtered.length === 0 && list.length > 0 ? (
        <div className="text-center py-8">
          <p className="text-sm text-muted-foreground">Aucun résultat pour "{searchQuery}"</p>
        </div>
      ) : list.length === 0 ? (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-12">
          <Heart className="w-12 h-12 text-muted-foreground/30 mx-auto mb-3" />
          <p className="font-semibold text-foreground">Aucun favori</p>
          <p className="text-xs text-muted-foreground mt-1">Ajoutez des Accompagnateurs Certifiés en favoris</p>
          <motion.button whileTap={{ scale: 0.95 }} onClick={() => navigate("/find-walkers")}
            className="mt-4 px-4 py-2 rounded-full gradient-primary text-white text-xs font-bold">
            🔍 Trouver des Accompagnateurs Certifiés
          </motion.button>
        </motion.div>
      ) : (
        <div className="space-y-3">
          {filtered.map((w: any, i: number) => (
            <motion.div
              key={w.id}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.06 }}
              className="bg-card rounded-2xl shadow-card overflow-hidden"
            >
              <div className="p-4 flex items-start gap-3">
                <div className="relative shrink-0">
                  <img
                    src={w.avatar || avatarWalker}
                    alt={w.name}
                    className="w-14 h-14 rounded-full object-cover ring-2 ring-primary/20"
                    loading="lazy"
                  />
                  {w.verified && (
                    <div className="absolute -bottom-0.5 -right-0.5 w-4 h-4 rounded-full gradient-primary border-2 border-card flex items-center justify-center">
                      <span className="text-[6px] text-white">✓</span>
                    </div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-sm text-foreground">{w.name}</span>
                    <span className="text-sm font-black text-foreground">{w.price}€<span className="text-[9px] text-muted-foreground font-normal">/h</span></span>
                  </div>
                  <div className="flex items-center gap-1.5 mt-0.5">
                    <StarRating rating={Math.round(w.rating)} />
                    <span className="text-[10px] text-muted-foreground">{w.rating.toFixed(1)} ({w.reviews} avis)</span>
                  </div>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="flex items-center gap-0.5 text-[10px] text-muted-foreground">
                      <MapPin className="w-3 h-3" /> {w.city}
                    </span>
                    {w.experience > 0 && (
                      <span className="text-[10px] text-muted-foreground">· {w.experience} an{w.experience > 1 ? "s" : ""} exp.</span>
                    )}
                  </div>
                  {/* Services badges */}
                  {w.services && w.services.length > 0 && (
                    <div className="flex gap-1 mt-1.5 flex-wrap">
                      {(w.services as string[]).slice(0, 3).map((s: string) => (
                        <span key={s} className="text-[8px] font-bold bg-primary/8 text-primary px-2 py-0.5 rounded-full">
                          {s}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>
              {/* Actions */}
              <div className="flex border-t border-border/50">
                <button onClick={() => navigate(`/book/${w.id}`)}
                  className="flex-1 py-2.5 text-xs font-bold text-primary flex items-center justify-center gap-1 hover:bg-primary/5 transition-colors">
                  📅 Réserver
                </button>
                <div className="w-px bg-border/50" />
                <button onClick={() => navigate(`/messages?user=${w.id}`)}
                  className="flex-1 py-2.5 text-xs font-bold text-accent flex items-center justify-center gap-1 hover:bg-accent/5 transition-colors">
                  <MessageCircle className="w-3 h-3" /> Message
                </button>
                {user && (
                  <>
                    <div className="w-px bg-border/50" />
                    <button onClick={() => removeFavorite.mutate(w.id)}
                      className="px-4 py-2.5 text-xs text-destructive flex items-center justify-center hover:bg-destructive/5 transition-colors">
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};

export default FavoritesTab;
