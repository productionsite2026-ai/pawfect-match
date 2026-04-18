import React from 'react';
import { LucideIcon, TrendingUp, TrendingDown } from 'lucide-react';
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface StatCardProps {
  icon: LucideIcon;
  value: string | number;
  label: string;
  sublabel?: string;
  variant?: 'primary' | 'accent' | 'red' | 'green' | 'blue' | 'yellow' | 'purple' | 'cyan' | 'orange' | 'heart' | 'muted' | 'walker' | 'owner' | 'success' | 'warning' | 'info' | 'violet' | 'money';
  trend?: {
    value: number;
    isPositive: boolean;
  };
  onClick?: () => void;
  size?: 'sm' | 'md' | 'lg';
  filled?: boolean;
}

/* Professional white-card style with colored icon accents */
const colorMap: Record<string, { icon: string; iconBg: string; value: string; border: string }> = {
  primary: { icon: 'text-primary', iconBg: 'bg-primary/10', value: 'text-primary', border: 'border-primary/15' },
  accent: { icon: 'text-accent', iconBg: 'bg-accent/10', value: 'text-accent', border: 'border-accent/15' },
  red: { icon: 'text-stat-red', iconBg: 'bg-stat-red/10', value: 'text-stat-red', border: 'border-stat-red/15' },
  green: { icon: 'text-stat-green', iconBg: 'bg-stat-green/10', value: 'text-stat-green', border: 'border-stat-green/15' },
  blue: { icon: 'text-stat-blue', iconBg: 'bg-stat-blue/10', value: 'text-stat-blue', border: 'border-stat-blue/15' },
  yellow: { icon: 'text-stat-yellow', iconBg: 'bg-stat-yellow/10', value: 'text-stat-yellow', border: 'border-stat-yellow/15' },
  purple: { icon: 'text-stat-purple', iconBg: 'bg-stat-purple/10', value: 'text-stat-purple', border: 'border-stat-purple/15' },
  cyan: { icon: 'text-stat-cyan', iconBg: 'bg-stat-cyan/10', value: 'text-stat-cyan', border: 'border-stat-cyan/15' },
  orange: { icon: 'text-stat-yellow', iconBg: 'bg-stat-yellow/10', value: 'text-stat-yellow', border: 'border-stat-yellow/15' },
  heart: { icon: 'text-heart', iconBg: 'bg-heart/10', value: 'text-heart', border: 'border-heart/15' },
  muted: { icon: 'text-muted-foreground', iconBg: 'bg-muted', value: 'text-foreground', border: 'border-border' },
  walker: { icon: 'text-primary', iconBg: 'bg-primary/10', value: 'text-primary', border: 'border-primary/15' },
  owner: { icon: 'text-primary', iconBg: 'bg-primary/10', value: 'text-primary', border: 'border-primary/15' },
  success: { icon: 'text-stat-green', iconBg: 'bg-stat-green/10', value: 'text-stat-green', border: 'border-stat-green/15' },
  warning: { icon: 'text-stat-yellow', iconBg: 'bg-stat-yellow/10', value: 'text-stat-yellow', border: 'border-stat-yellow/15' },
  info: { icon: 'text-stat-cyan', iconBg: 'bg-stat-cyan/10', value: 'text-stat-cyan', border: 'border-stat-cyan/15' },
  violet: { icon: 'text-stat-purple', iconBg: 'bg-stat-purple/10', value: 'text-stat-purple', border: 'border-stat-purple/15' },
  money: { icon: 'text-stat-green', iconBg: 'bg-stat-green/10', value: 'text-stat-green', border: 'border-stat-green/15' },
};

const StatCard: React.FC<StatCardProps> = ({
  icon: Icon,
  value,
  label,
  sublabel,
  variant = 'primary',
  trend,
  onClick,
  size = 'md',
}) => {
  const colors = colorMap[variant] || colorMap.primary;

  const sizes = {
    sm: { card: 'p-3', icon: 'h-4 w-4', iconWrap: 'w-8 h-8', value: 'text-lg', label: 'text-[10px]' },
    md: { card: 'p-4', icon: 'h-5 w-5', iconWrap: 'w-10 h-10', value: 'text-2xl', label: 'text-xs' },
    lg: { card: 'p-5', icon: 'h-6 w-6', iconWrap: 'w-12 h-12', value: 'text-3xl', label: 'text-sm' },
  };
  const s = sizes[size];

  return (
    <motion.button
      whileHover={{ scale: 1.02, y: -2 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className={cn(
        "rounded-xl bg-card border transition-all duration-200 text-left w-full shadow-sm hover:shadow-md",
        colors.border,
        s.card
      )}
    >
      <div className="flex items-start justify-between">
        <div className="flex flex-col gap-0.5">
          <span className={cn("font-bold leading-tight", s.value, colors.value)}>
            {value}
          </span>
          <span className={cn("text-muted-foreground font-medium", s.label)}>
            {label}
          </span>
          {sublabel && (
            <span className="text-[10px] text-muted-foreground/60">{sublabel}</span>
          )}
          {trend && (
            <div className={cn(
              "flex items-center gap-1 mt-1",
              trend.isPositive ? "text-stat-green" : "text-destructive"
            )}>
              {trend.isPositive ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
              <span className="text-[10px] font-semibold">
                {trend.isPositive ? '+' : ''}{trend.value}%
              </span>
            </div>
          )}
        </div>
        
        <div className={cn("rounded-xl flex items-center justify-center", colors.iconBg, s.iconWrap)}>
          <Icon className={cn(s.icon, colors.icon)} />
        </div>
      </div>
    </motion.button>
  );
};

export default StatCard;
