import { MapPin, Clock, Dog } from "lucide-react";
import { motion } from "framer-motion";

interface ActiveMissionProps {
  dogName: string;
  ownerName: string;
  startTime: string;
  location: string;
  status: "en_route" | "en_cours" | "terminée";
}

const statusConfig = {
  en_route: { label: "🚶 En route", className: "bg-amber-500/12 text-amber-600 border border-amber-500/20" },
  en_cours: { label: "🐕 En cours", className: "bg-accent/12 text-accent border border-accent/20" },
  terminée: { label: "✅ Terminée", className: "bg-muted text-muted-foreground" },
};

const ActiveMissionCard = ({ dogName, ownerName, startTime, location, status }: ActiveMissionProps) => {
  const s = statusConfig[status];
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-card rounded-2xl shadow-card p-4 border-l-4 border-accent"
    >
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-bold text-foreground text-sm">Mission Active</h3>
        <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full ${s.className}`}>
          {s.label}
        </span>
      </div>
      <div className="space-y-2.5">
        <div className="flex items-center gap-2.5 text-sm">
          <div className="w-8 h-8 rounded-lg gradient-primary flex items-center justify-center">
            <Dog className="w-4 h-4 text-white" />
          </div>
          <div>
            <span className="text-foreground font-bold">{dogName}</span>
            <span className="text-muted-foreground ml-1.5 text-xs">· {ownerName}</span>
          </div>
        </div>
        <div className="flex items-center gap-3 text-xs text-muted-foreground bg-muted/50 rounded-xl px-3 py-2">
          <Clock className="w-3.5 h-3.5" />
          <span className="font-semibold">{startTime}</span>
          <div className="w-px h-3 bg-border" />
          <MapPin className="w-3.5 h-3.5" />
          <span className="font-semibold">{location}</span>
        </div>
      </div>
      {status === "en_cours" && (
        <motion.button
          whileTap={{ scale: 0.97 }}
          className="w-full mt-3 py-3 rounded-xl gradient-cta text-white font-bold text-sm shadow-glow-cta hover:opacity-90 transition-opacity"
        >
          Terminer la Mission (Code Unique)
        </motion.button>
      )}
    </motion.div>
  );
};

export default ActiveMissionCard;
