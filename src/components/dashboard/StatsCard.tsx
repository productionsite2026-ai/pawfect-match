import { LucideIcon } from "lucide-react";
import StatCard from "@/components/dashboard/shared/StatCard";

interface StatsCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: LucideIcon;
  trend?: {
    value: number;
    label: string;
  };
  variant?: 'default' | 'primary' | 'success' | 'warning' | 'danger';
  onClick?: () => void;
}

const variantMap: Record<string, 'primary' | 'green' | 'yellow' | 'red' | 'muted'> = {
  default: 'muted',
  primary: 'primary',
  success: 'green',
  warning: 'yellow',
  danger: 'red',
};

export const StatsCard = ({
  title,
  value,
  subtitle,
  icon,
  trend,
  variant = 'default',
  onClick
}: StatsCardProps) => {
  return (
    <StatCard
      icon={icon}
      value={value}
      label={title}
      sublabel={subtitle || (trend ? `${trend.value >= 0 ? '↑' : '↓'} ${Math.abs(trend.value)}% ${trend.label}` : undefined)}
      variant={variantMap[variant] || 'muted'}
      onClick={onClick}
      trend={trend ? { value: trend.value, isPositive: trend.value >= 0 } : undefined}
    />
  );
};

export default StatsCard;
