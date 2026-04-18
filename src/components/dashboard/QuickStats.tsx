import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface QuickStat {
  label: string;
  value: string | number;
  subtitle?: string;
  icon: LucideIcon;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  variant?: 'default' | 'primary' | 'success' | 'warning' | 'danger';
}

interface QuickStatsProps {
  stats: QuickStat[];
  columns?: 2 | 3 | 4;
}

const variantStyles = {
  default: {
    bg: 'bg-card border',
    iconBg: 'bg-muted',
    iconColor: 'text-muted-foreground',
    valueColor: 'text-foreground'
  },
  primary: {
    bg: 'bg-card border border-primary/15',
    iconBg: 'bg-primary/10',
    iconColor: 'text-primary',
    valueColor: 'text-primary'
  },
  success: {
    bg: 'bg-card border border-stat-green/15',
    iconBg: 'bg-stat-green/10',
    iconColor: 'text-stat-green',
    valueColor: 'text-stat-green'
  },
  warning: {
    bg: 'bg-card border border-stat-yellow/15',
    iconBg: 'bg-stat-yellow/10',
    iconColor: 'text-stat-yellow',
    valueColor: 'text-stat-yellow'
  },
  danger: {
    bg: 'bg-card border border-stat-red/15',
    iconBg: 'bg-stat-red/10',
    iconColor: 'text-stat-red',
    valueColor: 'text-stat-red'
  }
};

export const QuickStats = ({ stats, columns = 4 }: QuickStatsProps) => {
  const gridCols = {
    2: 'grid-cols-2',
    3: 'grid-cols-2 lg:grid-cols-3',
    4: 'grid-cols-2 lg:grid-cols-4'
  };

  return (
    <div className={cn("grid gap-4", gridCols[columns])}>
      {stats.map((stat, index) => {
        const variant = stat.variant || 'default';
        const styles = variantStyles[variant];

        return (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
          >
            <Card className={cn(
              "hover:shadow-lg transition-all duration-300 hover:-translate-y-1",
              styles.bg
            )}>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  {stat.label}
                </CardTitle>
                <div className={cn(
                  "w-10 h-10 rounded-full flex items-center justify-center",
                  styles.iconBg
                )}>
                  <stat.icon className={cn("h-5 w-5", styles.iconColor)} />
                </div>
              </CardHeader>
              <CardContent>
                <div className={cn("text-2xl md:text-3xl font-bold", styles.valueColor)}>
                  {stat.value}
                </div>
                {stat.subtitle && (
                  <p className="text-xs text-muted-foreground mt-1">
                    {stat.trend && (
                      <span className={cn(
                        "font-semibold mr-1",
                        stat.trend.isPositive ? 'text-stat-green' : 'text-stat-red'
                      )}>
                        {stat.trend.isPositive ? '+' : ''}{stat.trend.value}%
                      </span>
                    )}
                    {stat.subtitle}
                  </p>
                )}
              </CardContent>
            </Card>
          </motion.div>
        );
      })}
    </div>
  );
};

export default QuickStats;
