import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import type { TablesInsert, TablesUpdate } from "@/integrations/supabase/types";

export const useDogs = () => {
  const { user } = useAuth();
  return useQuery({
    queryKey: ["dogs", user?.id],
    queryFn: async () => {
      if (!user) return [];
      const { data, error } = await supabase.from("dogs").select("*").eq("owner_id", user.id).order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    },
    enabled: !!user,
  });
};

export const useAddDog = () => {
  const { user } = useAuth();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (dog: Omit<TablesInsert<"dogs">, "owner_id">) => {
      if (!user) throw new Error("Not authenticated");
      const { data, error } = await supabase.from("dogs").insert({ ...dog, owner_id: user.id }).select().single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["dogs"] }),
  });
};

export const useDeleteDog = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("dogs").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["dogs"] }),
  });
};
