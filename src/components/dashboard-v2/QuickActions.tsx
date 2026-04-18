import { Calendar, MapPin, Clock, Star, Euro, Search } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

interface QuickAction {
  icon: LucideIcon;
  label: string;
  gradient: string;
  path?: string;
}

const QuickActions = ({ role }: { role: "owner" | "walker" }) => {
  const navigate = useNavigate();

  const ownerActions: QuickAction[] = [
    { icon: Search, label: "Réserver", gradient: "gradient-primary", path: "/find-walkers" },
    { icon: Calendar, label: "Réservations", gradient: "gradient-accent", path: "/dashboard?tab=reservations" },
    { icon: MapPin, label: "Mes Animaux", gradient: "gradient-passion", path: "/dashboard?tab=chiens" },
    { icon: Star, label: "Favoris", gradient: "gradient-community", path: "/dashboard?tab=favoris" },
  ];

  const walkerActions: QuickAction[] = [
    { icon: Calendar, label: "Planning", gradient: "gradient-primary", path: "/walker/dashboard?tab=missions" },
    { icon: MapPin, label: "Disponibilité", gradient: "gradient-accent", path: "/walker/dashboard?tab=disponibilite" },
    { icon: Euro, label: "Revenus", gradient: "gradient-passion", path: "/walker/dashboard?tab=gains" },
    { icon: Star, label: "Avis", gradient: "gradient-community", path: "/walker/dashboard?tab=avis" },
  ];

  const actions = role === "owner" ? ownerActions : walkerActions;

  return (
    <div className="grid grid-cols-4 gap-2">
      {actions.map((action, i) => (
        <motion.button
          key={action.label}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.06 }}
          whileTap={{ scale: 0.93 }}
          onClick={() => action.path && navigate(action.path)}
          className="bg-card rounded-2xl shadow-card p-3 flex flex-col items-center gap-2 hover:shadow-card-hover transition-shadow"
        >
          <div className={`w-11 h-11 rounded-xl ${action.gradient} flex items-center justify-center shadow-card`}>
            <action.icon className="w-5 h-5 text-white" />
          </div>
          <span className="text-[10px] font-bold text-foreground">{action.label}</span>
        </motion.button>
      ))}
    </div>
  );
};

export default QuickActions;
