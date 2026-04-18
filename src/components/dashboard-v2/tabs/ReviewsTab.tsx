import { Star, MessageSquare, ThumbsUp, TrendingUp, Award, PenLine } from "lucide-react";
import { motion } from "framer-motion";
import { useAuth } from "@/contexts/AuthContext";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import StarRating from "../StarRating";
import avatarWalker from "@/assets/avatar-walker.jpg";
import { DEMO_REVIEWS } from "@/data/demoData";
import { useState } from "react";

type ReviewFilter = "all" | "5" | "4" | "3" | "2" | "1";

const ReviewsTab = ({ role = "walker" }: { role?: "owner" | "walker" }) => {
  const { user } = useAuth();
  const [filter, setFilter] = useState<ReviewFilter>("all");

  // Walker: reviews received (reviewed_id = me)
  // Owner: reviews I gave (reviewer_id = me)
  const { data: reviews = [] } = useQuery({
    queryKey: ["my-reviews", user?.id, role],
    queryFn: async () => {
      if (!user) return [];

      if (role === "owner") {
        // Owner sees reviews they GAVE
        const { data } = await supabase
          .from("reviews")
          .select("*, booking:booking_id(dogs(name), walker_id)")
          .eq("reviewer_id", user.id)
          .order("created_at", { ascending: false });

        if (!data || data.length === 0) return [];

        // Get walker profiles for names
        const walkerIds = [...new Set(data.map(r => r.reviewed_id))];
        const { data: profiles } = await supabase
          .from("profiles")
          .select("id, first_name, avatar_url")
          .in("id", walkerIds);
        const profileMap = new Map(profiles?.map(p => [p.id, p]) || []);

        return data.map((r: any) => ({
          id: r.id, rating: r.rating, comment: r.comment || "",
          reviewerName: profileMap.get(r.reviewed_id)?.first_name || "Accompagnateur Certifié",
          reviewerAvatar: profileMap.get(r.reviewed_id)?.avatar_url,
          dogName: r.booking?.dogs?.name || "",
          date: new Date(r.created_at).toLocaleDateString("fr-FR"),
          isGiven: true,
        }));
      } else {
        // Walker sees reviews received
        const { data } = await supabase
          .from("reviews")
          .select("*")
          .eq("reviewed_id", user.id)
          .order("created_at", { ascending: false });

        if (!data || data.length === 0) return [];

        const reviewerIds = [...new Set(data.map(r => r.reviewer_id))];
        const { data: profiles } = await supabase
          .from("profiles")
          .select("id, first_name, avatar_url")
          .in("id", reviewerIds);
        const profileMap = new Map(profiles?.map(p => [p.id, p]) || []);

        return data.map((r: any) => ({
          id: r.id, rating: r.rating, comment: r.comment || "",
          reviewerName: profileMap.get(r.reviewer_id)?.first_name || "Client",
          reviewerAvatar: profileMap.get(r.reviewer_id)?.avatar_url,
          date: new Date(r.created_at).toLocaleDateString("fr-FR"),
          isGiven: false,
        }));
      }
    },
    enabled: !!user,
  });

  const isDemo = !user;
  const list = isDemo || reviews.length === 0 ? DEMO_REVIEWS : reviews;
  const filteredList = filter === "all" ? list : list.filter((r: any) => r.rating === Number(filter));

  const avgRating = list.length > 0 ? (list.reduce((a: number, r: any) => a + r.rating, 0) / list.length) : 0;

  const distribution = [5, 4, 3, 2, 1].map(star => ({
    star,
    count: list.filter((r: any) => r.rating === star).length,
    pct: list.length > 0 ? (list.filter((r: any) => r.rating === star).length / list.length) * 100 : 0,
  }));

  const satisfactionPct = list.length > 0 ? Math.round((list.filter((r: any) => r.rating >= 4).length / list.length) * 100) : 0;

  return (
    <div className="px-4 py-6 space-y-4 pb-24">
      <div className="flex items-center gap-2">
        {role === "owner" ? <PenLine className="w-5 h-5 text-primary" /> : <Star className="w-5 h-5 text-[hsl(var(--star))]" />}
        <h2 className="text-lg font-black text-foreground">
          {role === "owner" ? "Mes Avis Donnés" : "Avis Clients"}
        </h2>
        <span className="text-xs font-bold text-muted-foreground bg-muted px-2 py-0.5 rounded-full">{list.length}</span>
      </div>

      {/* Summary Card */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
        className="bg-card rounded-2xl shadow-card p-5">
        <div className="flex items-center gap-5">
          <div className="text-center">
            <span className="text-4xl font-black text-foreground">{avgRating.toFixed(1)}</span>
            <div className="mt-1"><StarRating rating={Math.round(avgRating)} /></div>
            <p className="text-[10px] text-muted-foreground mt-1">{list.length} avis</p>
          </div>
          <div className="flex-1 space-y-1.5">
            {distribution.map(d => (
              <button key={d.star} onClick={() => setFilter(filter === String(d.star) ? "all" : String(d.star) as ReviewFilter)}
                className={`flex items-center gap-2 text-[10px] w-full rounded-lg px-1 py-0.5 transition-colors ${
                  filter === String(d.star) ? "bg-primary/10" : "hover:bg-muted/50"
                }`}>
                <span className="w-3 text-right text-muted-foreground font-bold">{d.star}</span>
                <Star className="w-2.5 h-2.5 text-[hsl(var(--star))] fill-[hsl(var(--star))]" />
                <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                  <motion.div initial={{ width: 0 }} animate={{ width: `${d.pct}%` }}
                    transition={{ delay: 0.3, duration: 0.5 }}
                    className="h-full gradient-primary rounded-full" />
                </div>
                <span className="w-5 text-muted-foreground">{d.count}</span>
              </button>
            ))}
          </div>
        </div>
      </motion.div>

      {/* Quick Metrics */}
      <div className="grid grid-cols-3 gap-2">
        <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}
          className="bg-card rounded-xl shadow-card p-3 text-center">
          <ThumbsUp className="w-4 h-4 text-primary mx-auto mb-1" />
          <span className="text-lg font-black text-foreground">{satisfactionPct}%</span>
          <p className="text-[9px] text-muted-foreground font-semibold">Satisfaction</p>
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.04 }}
          className="bg-card rounded-xl shadow-card p-3 text-center">
          <TrendingUp className="w-4 h-4 text-accent mx-auto mb-1" />
          <span className="text-lg font-black text-foreground">{avgRating.toFixed(1)}</span>
          <p className="text-[9px] text-muted-foreground font-semibold">Note moyenne</p>
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.08 }}
          className="bg-card rounded-xl shadow-card p-3 text-center">
          <Award className="w-4 h-4 text-[hsl(var(--star))] mx-auto mb-1" />
          <span className="text-lg font-black text-foreground">{distribution[0].count}</span>
          <p className="text-[9px] text-muted-foreground font-semibold">5 étoiles</p>
        </motion.div>
      </div>

      {/* Filter active indicator */}
      {filter !== "all" && (
        <button onClick={() => setFilter("all")}
          className="text-xs font-bold text-primary bg-primary/10 px-3 py-1.5 rounded-full">
          ✕ Filtre: {filter} étoile{Number(filter) > 1 ? "s" : ""} · Afficher tout
        </button>
      )}

      {/* Reviews List */}
      {filteredList.length === 0 ? (
        <div className="text-center py-8">
          <MessageSquare className="w-10 h-10 text-muted-foreground/30 mx-auto mb-2" />
          <p className="text-sm font-semibold text-muted-foreground">Aucun avis {filter !== "all" ? `avec ${filter} étoile${Number(filter) > 1 ? "s" : ""}` : ""}</p>
        </div>
      ) : (
        filteredList.map((r: any, i: number) => (
          <motion.div key={r.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            className="bg-card rounded-2xl shadow-card p-4">
            <div className="flex items-center gap-3 mb-2">
              <img src={r.reviewerAvatar || avatarWalker} alt={r.reviewerName}
                className="w-10 h-10 rounded-full object-cover ring-2 ring-primary/10" loading="lazy" />
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="font-bold text-sm text-foreground">{r.reviewerName}</span>
                    {r.dogName && (
                      <span className="text-[10px] text-muted-foreground ml-1.5">pour 🐕 {r.dogName}</span>
                    )}
                  </div>
                  <span className="text-[9px] text-muted-foreground">{r.date}</span>
                </div>
                <StarRating rating={r.rating} />
              </div>
            </div>
            {r.comment && <p className="text-sm text-muted-foreground leading-relaxed">{r.comment}</p>}
          </motion.div>
        ))
      )}
    </div>
  );
};

export default ReviewsTab;