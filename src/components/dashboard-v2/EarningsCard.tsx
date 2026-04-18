import { TrendingUp, Euro } from "lucide-react";
import { motion } from "framer-motion";

interface EarningsCardProps {
  today: number;
  week: number;
  month: number;
  trend: number;
}

const EarningsCard = ({ today, week, month, trend }: EarningsCardProps) => (
  <motion.div
    initial={{ opacity: 0, y: 10 }}
    animate={{ opacity: 1, y: 0 }}
    className="bg-card rounded-2xl shadow-card p-4"
  >
    <div className="flex items-center justify-between mb-3">
      <h3 className="font-bold text-foreground">💰 Revenus</h3>
      <div className="flex items-center gap-1 px-2 py-1 rounded-full bg-primary/10 text-primary text-xs font-bold">
        <TrendingUp className="w-3.5 h-3.5" />
        +{trend}%
      </div>
    </div>
    <div className="flex items-center justify-around">
      {[
        { label: "Aujourd'hui", value: today },
        { label: "Semaine", value: week },
        { label: "Mois", value: month },
      ].map((item, i) => (
        <div key={item.label} className="flex flex-col items-center px-3 relative">
          {i > 0 && <div className="absolute left-0 top-1/2 -translate-y-1/2 w-px h-8 bg-border" />}
          <span className="text-lg font-black text-foreground flex items-center gap-0.5">
            {item.value}<Euro className="w-3 h-3 text-muted-foreground" />
          </span>
          <span className="text-[9px] text-muted-foreground font-semibold">{item.label}</span>
        </div>
      ))}
    </div>
  </motion.div>
);

export default EarningsCard;
