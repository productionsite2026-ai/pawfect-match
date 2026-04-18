import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

export const useProfile = () => {
  const { user } = useAuth();
  return useQuery({
    queryKey: ["profile", user?.id],
    queryFn: async () => {
      if (!user) return null;
      const { data, error } = await supabase.from("profiles").select("*").eq("id", user.id).single();
      if (error) throw error;
      return data;
    },
    enabled: !!user,
  });
};

export const useWalkerProfile = (userId?: string) => {
  return useQuery({
    queryKey: ["walker_profile", userId],
    queryFn: async () => {
      if (!userId) return null;
      const { data, error } = await supabase.from("walker_profiles").select("*").eq("user_id", userId).single();
      if (error) throw error;
      return data;
    },
    enabled: !!userId,
  });
};
