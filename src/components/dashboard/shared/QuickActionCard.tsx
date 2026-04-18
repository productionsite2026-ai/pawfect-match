import React from 'react';
import { LucideIcon } from 'lucide-react';
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface QuickActionCardProps {
  icon: LucideIcon;
  label: string;
  onClick: () => void;
  variant?: 'primary' | 'accent' | 'heart' | 'muted' | 'walker' | 'owner' | 'success' | 'warning' | 'info' | 'violet' | 'money' | 'red' | 'green' | 'blue' | 'yellow' | 'orange' | 'purple' | 'cyan';
  size?: 'sm' | 'md' | 'lg';
  badge?: string | number;
  disabled?: boolean;
  filled?: boolean;
}

const colorMap: Record<string, { icon: string; bg: string; border: string }> = {
  primary: { icon: 'text-primary', bg: 'bg-primary/8', border: 'border-primary/15' },
  accent: { icon: 'text-accent', bg: 'bg-accent/8', border: 'border-accent/15' },
  green: { icon: 'text-stat-green', bg: 'bg-stat-green/8', border: 'border-stat-green/15' },
  success: { icon: 'text-stat-green', bg: 'bg-stat-green/8', border: 'border-stat-green/15' },
  blue: { icon: 'text-stat-blue', bg: 'bg-stat-blue/8', border: 'border-stat-blue/15' },
  red: { icon: 'text-stat-red', bg: 'bg-stat-red/8', border: 'border-stat-red/15' },
  heart: { icon: 'text-heart', bg: 'bg-heart/8', border: 'border-heart/15' },
  yellow: { icon: 'text-stat-yellow', bg: 'bg-stat-yellow/8', border: 'border-stat-yellow/15' },
  warning: { icon: 'text-stat-yellow', bg: 'bg-stat-yellow/8', border: 'border-stat-yellow/15' },
  orange: { icon: 'text-stat-yellow', bg: 'bg-stat-yellow/8', border: 'border-stat-yellow/15' },
  purple: { icon: 'text-stat-purple', bg: 'bg-stat-purple/8', border: 'border-stat-purple/15' },
  violet: { icon: 'text-stat-purple', bg: 'bg-stat-purple/8', border: 'border-stat-purple/15' },
  cyan: { icon: 'text-stat-cyan', bg: 'bg-stat-cyan/8', border: 'border-stat-cyan/15' },
  info: { icon: 'text-stat-cyan', bg: 'bg-stat-cyan/8', border: 'border-stat-cyan/15' },
  muted: { icon: 'text-muted-foreground', bg: 'bg-muted', border: 'border-border' },
  walker: { icon: 'text-primary', bg: 'bg-primary/8', border: 'border-primary/15' },
  owner: { icon: 'text-primary', bg: 'bg-primary/8', border: 'border-primary/15' },
  money: { icon: 'text-stat-green', bg: 'bg-stat-green/8', border: 'border-stat-green/15' },
};

const QuickActionCard: React.FC<QuickActionCardProps> = ({
  icon: Icon,
  label,
  onClick,
  variant = 'primary',
  size = 'md',
  badge,
  disabled = false,
}) => {
  const colors = colorMap[variant] || colorMap.primary;

  const sizes = {
    sm: { card: 'p-3 gap-1.5', icon: 'h-5 w-5', text: 'text-[10px]' },
    md: { card: 'p-4 gap-2', icon: 'h-6 w-6', text: 'text-xs' },
    lg: { card: 'p-5 gap-2.5', icon: 'h-7 w-7', text: 'text-sm' },
  };
  const s = sizes[size];

  return (
    <motion.button
      whileHover={{ scale: 1.03, y: -2 }}
      whileTap={{ scale: 0.95 }}
      onClick={onClick}
      disabled={disabled}
      className={cn(
        "flex flex-col items-center justify-center rounded-xl border bg-card transition-all duration-200 relative shadow-sm hover:shadow-md",
        colors.border,
        s.card,
        disabled && "opacity-50 cursor-not-allowed"
      )}
    >
      {badge && (
        <motion.span 
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="absolute -top-1.5 -right-1.5 px-1.5 py-0.5 bg-destructive text-white text-[9px] font-bold rounded-full shadow-sm z-20"
        >
          {badge}
        </motion.span>
      )}
      
      <div className={cn("w-9 h-9 rounded-lg flex items-center justify-center", colors.bg)}>
        <Icon className={cn(s.icon, colors.icon)} />
      </div>
      <span className={cn("font-medium text-center leading-tight text-foreground", s.text)}>
        {label}
      </span>
    </motion.button>
  );
};

export default QuickActionCard;
