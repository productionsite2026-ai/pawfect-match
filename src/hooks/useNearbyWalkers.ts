import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export const useNearbyWalkers = () => {
  return useQuery({
    queryKey: ["nearby_walkers"],
    queryFn: async () => {
      const { data: walkers, error } = await supabase
        .from("walker_profiles")
        .select("*")
        .eq("verified", true)
        .order("rating", { ascending: false })
        .limit(10);
      if (error) throw error;
      if (!walkers || walkers.length === 0) return [];

      const userIds = walkers.map(w => w.user_id);
      const { data: profiles } = await supabase
        .from("profiles")
        .select("id, first_name, last_name, avatar_url")
        .in("id", userIds);

      const profileMap = new Map(profiles?.map(p => [p.id, p]) || []);

      return walkers.map(w => ({
        ...w,
        profiles: profileMap.get(w.user_id) || null,
      }));
    },
  });
};
