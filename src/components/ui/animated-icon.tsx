import { motion } from "framer-motion";
import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface AnimatedIconProps {
  icon: LucideIcon;
  size?: "sm" | "md" | "lg" | "xl";
  variant?: "primary" | "accent" | "success" | "warning" | "destructive" | "muted";
  className?: string;
  animate?: boolean;
  pulse?: boolean;
  float?: boolean;
}

const sizeClasses = {
  sm: "w-10 h-10",
  md: "w-14 h-14",
  lg: "w-16 h-16",
  xl: "w-20 h-20",
};

const iconSizes = {
  sm: "h-5 w-5",
  md: "h-7 w-7",
  lg: "h-8 w-8",
  xl: "h-10 w-10",
};

const variantClasses = {
  primary: "bg-primary/10 text-primary",
  accent: "bg-accent/10 text-accent",
  success: "bg-emerald-500/10 text-emerald-500",
  warning: "bg-amber-500/10 text-amber-500",
  destructive: "bg-destructive/10 text-destructive",
  muted: "bg-muted text-muted-foreground",
};

const floatAnimation = {
  y: [0, -8, 0],
  transition: {
    duration: 3,
    repeat: Infinity,
    ease: "easeInOut" as const,
  },
};

const pulseAnimation = {
  scale: [1, 1.05, 1],
  transition: {
    duration: 2,
    repeat: Infinity,
    ease: "easeInOut" as const,
  },
};

export const AnimatedIcon = ({
  icon: Icon,
  size = "md",
  variant = "primary",
  className,
  animate = true,
  pulse = false,
  float = false,
}: AnimatedIconProps) => {
  return (
    <motion.div
      className={cn(
        "rounded-2xl flex items-center justify-center",
        sizeClasses[size],
        variantClasses[variant],
        className
      )}
      initial={animate ? { scale: 0, opacity: 0 } : false}
      whileInView={animate ? { scale: 1, opacity: 1 } : undefined}
      viewport={{ once: true }}
      transition={{ type: "spring", stiffness: 200, damping: 15 }}
      animate={float ? floatAnimation : pulse ? pulseAnimation : undefined}
      whileHover={{ scale: 1.1, rotate: 5 }}
    >
      <Icon className={iconSizes[size]} />
    </motion.div>
  );
};
