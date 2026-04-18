import { Sun, Cloud, CloudRain } from "lucide-react";
import { motion } from "framer-motion";

interface WeatherWidgetProps {
  temp: number;
  condition: "sunny" | "cloudy" | "rainy";
  recommendation: string;
}

const weatherConfig = {
  sunny: { icon: Sun, emoji: "☀️", bg: "bg-amber-50", text: "text-amber-700" },
  cloudy: { icon: Cloud, emoji: "☁️", bg: "bg-slate-50", text: "text-slate-600" },
  rainy: { icon: CloudRain, emoji: "🌧️", bg: "bg-blue-50", text: "text-blue-600" },
};

const WeatherWidget = ({ temp, condition, recommendation }: WeatherWidgetProps) => {
  const w = weatherConfig[condition];
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={`${w.bg} rounded-2xl p-3.5 flex items-center gap-3`}
    >
      <span className="text-2xl">{w.emoji}</span>
      <div className="flex-1">
        <div className="flex items-center gap-2">
          <span className={`font-black text-lg ${w.text}`}>{temp}°C</span>
        </div>
        <p className="text-[11px] text-muted-foreground font-semibold mt-0.5">{recommendation.replace("balade", "mission").replace("promenade", "mission")}</p>
      </div>
    </motion.div>
  );
};

export default WeatherWidget;
