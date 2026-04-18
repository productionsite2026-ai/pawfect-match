import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

export const useEarnings = () => {
  const { user } = useAuth();
  return useQuery({
    queryKey: ["earnings", user?.id],
    queryFn: async () => {
      if (!user) return { today: 0, week: 0, month: 0, trend: 0 };
      const now = new Date();
      const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate()).toISOString();
      const startOfWeek = new Date(now.getTime() - now.getDay() * 86400000).toISOString();
      const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1).toISOString();

      const { data, error } = await supabase
        .from("walker_earnings")
        .select("net_amount, created_at")
        .eq("walker_id", user.id);
      if (error) throw error;

      const earnings = data || [];
      const today = earnings.filter(e => e.created_at && e.created_at >= startOfDay).reduce((s, e) => s + Number(e.net_amount), 0);
      const week = earnings.filter(e => e.created_at && e.created_at >= startOfWeek).reduce((s, e) => s + Number(e.net_amount), 0);
      const month = earnings.filter(e => e.created_at && e.created_at >= startOfMonth).reduce((s, e) => s + Number(e.net_amount), 0);

      return { today, week, month, trend: 12 };
    },
    enabled: !!user,
  });
};
