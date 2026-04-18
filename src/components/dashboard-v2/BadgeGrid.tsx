import { CheckCircle2, Clock, Heart, Users } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { motion } from "framer-motion";

interface Badge {
  icon: LucideIcon;
  label: string;
  sub?: string;
  gradient: string;
}

const defaultBadges: Badge[] = [
  { icon: CheckCircle2, label: "Certifié", gradient: "gradient-primary" },
  { icon: Clock, label: "Expérience", sub: "5 ans", gradient: "gradient-accent" },
  { icon: Heart, label: "Passion", gradient: "gradient-passion" },
  { icon: Users, label: "Communauté", sub: "128 clients", gradient: "gradient-community" },
];

const BadgeGrid = ({ badges = defaultBadges }: { badges?: Badge[] }) => (
  <div className="grid grid-cols-4 gap-2">
    {badges.map((badge, i) => (
      <motion.div
        key={i}
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: i * 0.08 }}
        className={`${badge.gradient} text-white rounded-2xl p-3 flex flex-col items-center justify-center gap-1.5 shadow-card`}
      >
        <badge.icon className="w-6 h-6" strokeWidth={2.2} />
        <span className="text-[10px] font-black text-center leading-tight">{badge.label}</span>
        {badge.sub && <span className="text-[9px] opacity-80 font-semibold">{badge.sub}</span>}
      </motion.div>
    ))}
  </div>
);

export default BadgeGrid;
