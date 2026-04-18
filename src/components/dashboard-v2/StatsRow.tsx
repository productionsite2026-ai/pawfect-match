import { motion } from "framer-motion";

interface StatItem {
  value: string | number;
  label: string;
  isStar?: boolean;
}

const StatsRow = ({ stats }: { stats: StatItem[] }) => (
  <motion.div
    initial={{ opacity: 0, y: 10 }}
    animate={{ opacity: 1, y: 0 }}
    className="bg-card rounded-2xl shadow-card p-4 flex items-center justify-around"
  >
    {stats.map((s, i) => (
      <div key={s.label} className="flex flex-col items-center px-3 relative">
        {i > 0 && <div className="absolute left-0 top-1/2 -translate-y-1/2 w-px h-8 bg-border" />}
        <span className="text-lg font-black text-foreground flex items-center gap-1">
          {s.isStar && <span className="text-amber-400">★</span>}
          {s.value}
        </span>
        <span className="text-[9px] text-muted-foreground font-semibold">{s.label}</span>
      </div>
    ))}
  </motion.div>
);

export default StatsRow;
