import { useState, useEffect } from "react";
import { MapPin, Zap } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";

const AvailabilityToggle = () => {
  const { user } = useAuth();
  const [available, setAvailable] = useState(true);
  const [loading, setLoading] = useState(false);

  // Load initial state from walker_profiles
  useEffect(() => {
    if (!user) return;
    const fetchAvailability = async () => {
      const { data } = await supabase
        .from("walker_profiles")
        .select("available_hours_start")
        .eq("user_id", user.id)
        .single();
      // Use available_hours_start as proxy: null = unavailable
      if (data) {
        setAvailable(!!data.available_hours_start);
      }
    };
    fetchAvailability();
  }, [user]);

  const toggleAvailability = async () => {
    const newState = !available;
    setAvailable(newState);
    
    if (!user) return;
    setLoading(true);
    
    const { error } = await supabase
      .from("walker_profiles")
      .update({
        available_hours_start: newState ? "08:00" : null,
        available_hours_end: newState ? "19:00" : null,
      })
      .eq("user_id", user.id);

    if (error) {
      setAvailable(!newState); // Revert
      toast.error("Erreur de mise à jour");
    } else {
      toast.success(newState ? "Vous êtes maintenant disponible" : "Vous êtes hors ligne");
    }
    setLoading(false);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={`rounded-2xl shadow-card p-4 flex items-center justify-between transition-colors duration-300 ${
        available ? "bg-accent/8 border border-accent/20" : "bg-card border border-border"
      }`}
    >
      <div className="flex items-center gap-3">
        <div className={`w-11 h-11 rounded-xl flex items-center justify-center transition-all duration-300 ${
          available ? "gradient-accent shadow-card" : "bg-muted"
        }`}>
          {available ? <Zap className="w-5 h-5 text-white" /> : <MapPin className="w-5 h-5 text-muted-foreground" />}
        </div>
        <div>
          <span className="font-bold text-foreground text-sm">
            {available ? "🟢 Disponible" : "⚫ Indisponible"}
          </span>
          <p className="text-[10px] text-muted-foreground mt-0.5">
            {available ? "Vous recevez des demandes" : "Vous ne recevez plus de demandes"}
          </p>
        </div>
      </div>
      <button
        onClick={toggleAvailability}
        disabled={loading}
        className={`relative rounded-full transition-all duration-300 ${available ? "gradient-accent" : "bg-muted"} ${loading ? "opacity-50" : ""}`}
        style={{ width: 52, height: 28 }}
      >
        <AnimatePresence mode="wait">
          <motion.span
            key={available ? "on" : "off"}
            layout
            className="absolute top-[3px] w-[22px] h-[22px] rounded-full bg-white shadow-card"
            style={{ left: available ? 27 : 3 }}
            transition={{ type: "spring", stiffness: 500, damping: 30 }}
          />
        </AnimatePresence>
      </button>
    </motion.div>
  );
};

export default AvailabilityToggle;
