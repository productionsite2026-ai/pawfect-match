import React from 'react';
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface CircularProgressProps {
  value: number;
  max?: number;
  size?: 'sm' | 'md' | 'lg';
  strokeWidth?: number;
  variant?: 'primary' | 'success' | 'warning' | 'danger' | 'owner' | 'walker';
  label?: string;
  sublabel?: string;
  showPercentage?: boolean;
  animated?: boolean;
}

const CircularProgress: React.FC<CircularProgressProps> = ({
  value,
  max = 100,
  size = 'md',
  strokeWidth = 8,
  variant = 'primary',
  label,
  sublabel,
  showPercentage = true,
  animated = true
}) => {
  const percentage = Math.min(Math.max((value / max) * 100, 0), 100);
  
  const sizes = {
    sm: { container: 'w-16 h-16', text: 'text-sm', label: 'text-[10px]' },
    md: { container: 'w-24 h-24', text: 'text-lg', label: 'text-xs' },
    lg: { container: 'w-32 h-32', text: 'text-2xl', label: 'text-sm' }
  };

  const colors: Record<string, { stroke: string; bg: string }> = {
    primary: { stroke: 'stroke-primary', bg: 'text-primary' },
    success: { stroke: 'stroke-stat-green', bg: 'text-stat-green' },
    warning: { stroke: 'stroke-stat-yellow', bg: 'text-stat-yellow' },
    danger: { stroke: 'stroke-stat-red', bg: 'text-stat-red' },
    owner: { stroke: 'stroke-owner', bg: 'text-owner' },
    walker: { stroke: 'stroke-walker', bg: 'text-walker' }
  };

  const sizeStyle = sizes[size];
  const colorStyle = colors[variant];

  // SVG parameters
  const containerSize = size === 'sm' ? 64 : size === 'md' ? 96 : 128;
  const center = containerSize / 2;
  const radius = center - strokeWidth;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  return (
    <div className={cn("relative flex items-center justify-center", sizeStyle.container)}>
      <svg 
        className="transform -rotate-90" 
        width={containerSize} 
        height={containerSize}
      >
        {/* Background circle */}
        <circle
          cx={center}
          cy={center}
          r={radius}
          fill="none"
          stroke="currentColor"
          strokeWidth={strokeWidth}
          className="text-muted/30"
        />
        
        {/* Progress circle */}
        <motion.circle
          cx={center}
          cy={center}
          r={radius}
          fill="none"
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          className={colorStyle.stroke}
          style={{
            strokeDasharray: circumference,
          }}
          initial={animated ? { strokeDashoffset: circumference } : { strokeDashoffset }}
          animate={{ strokeDashoffset }}
          transition={{ duration: 1, ease: "easeOut" }}
        />
      </svg>

      {/* Center content */}
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        {showPercentage && (
          <motion.span 
            className={cn("font-bold", sizeStyle.text, colorStyle.bg)}
            initial={animated ? { opacity: 0, scale: 0.5 } : {}}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.5, duration: 0.3 }}
          >
            {Math.round(percentage)}%
          </motion.span>
        )}
        {label && (
          <span className={cn("text-muted-foreground font-medium", sizeStyle.label)}>
            {label}
          </span>
        )}
        {sublabel && (
          <span className="text-[10px] text-muted-foreground/70">
            {sublabel}
          </span>
        )}
      </div>
    </div>
  );
};

export default CircularProgress;
