import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import type { TablesInsert, TablesUpdate } from "@/integrations/supabase/types";

export const useBookings = (role: "owner" | "walker") => {
  const { user } = useAuth();
  return useQuery({
    queryKey: ["bookings", role, user?.id],
    queryFn: async () => {
      if (!user) return [];
      const col = role === "owner" ? "owner_id" : "walker_id";
      const { data, error } = await supabase
        .from("bookings")
        .select("*, dogs(name, breed, photo_url)")
        .eq(col, user.id)
        .order("scheduled_date", { ascending: true });
      if (error) throw error;
      return data;
    },
    enabled: !!user,
  });
};

export const useCreateBooking = () => {
  const { user } = useAuth();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (booking: Omit<TablesInsert<"bookings">, "owner_id">) => {
      if (!user) throw new Error("Not authenticated");
      const { data, error } = await supabase.from("bookings").insert({ ...booking, owner_id: user.id }).select().single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["bookings"] }),
  });
};

export const useUpdateBooking = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, ...updates }: { id: string } & TablesUpdate<"bookings">) => {
      const { data, error } = await supabase.from("bookings").update(updates).eq("id", id).select().single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["bookings"] }),
  });
};
