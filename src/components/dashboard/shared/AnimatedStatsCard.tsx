import { useEffect, useState, useRef } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { motion } from "framer-motion";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";
import type { LucideIcon } from "lucide-react";

interface AnimatedStatsCardProps {
  title: string;
  value: number;
  previousValue?: number;
  suffix?: string;
  prefix?: string;
  icon: LucideIcon;
  iconColor?: string;
  description?: string;
  format?: "number" | "currency" | "percent";
  delay?: number;
}

const AnimatedStatsCard = ({
  title,
  value,
  previousValue,
  suffix = "",
  prefix = "",
  icon: Icon,
  iconColor = "text-primary",
  description,
  format = "number",
  delay = 0
}: AnimatedStatsCardProps) => {
  const [displayValue, setDisplayValue] = useState(0);
  const [hasAnimated, setHasAnimated] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  // Calculate trend
  const trend = previousValue !== undefined 
    ? ((value - previousValue) / (previousValue || 1)) * 100 
    : null;

  const formatValue = (val: number) => {
    switch (format) {
      case "currency":
        return new Intl.NumberFormat("fr-FR", {
          style: "currency",
          currency: "EUR",
          minimumFractionDigits: 0,
          maximumFractionDigits: 0
        }).format(val);
      case "percent":
        return `${val.toFixed(1)}%`;
      default:
        return new Intl.NumberFormat("fr-FR").format(val);
    }
  };

  // Animate counter when in viewport
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasAnimated) {
          setHasAnimated(true);
          animateValue(0, value, 1500);
        }
      },
      { threshold: 0.5 }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => observer.disconnect();
  }, [value, hasAnimated]);

  const animateValue = (start: number, end: number, duration: number) => {
    const startTime = performance.now();
    
    const animate = (currentTime: number) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      
      // Easing function (ease-out-expo)
      const easeOut = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
      
      const current = Math.floor(start + (end - start) * easeOut);
      setDisplayValue(current);
      
      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };
    
    requestAnimationFrame(animate);
  };

  const getTrendIcon = () => {
    if (trend === null) return null;
    if (trend > 0) return <TrendingUp className="h-3.5 w-3.5" />;
    if (trend < 0) return <TrendingDown className="h-3.5 w-3.5" />;
    return <Minus className="h-3.5 w-3.5" />;
  };

  const getTrendColor = () => {
    if (trend === null) return "";
    if (trend > 0) return "text-green-500 bg-green-500/10";
    if (trend < 0) return "text-red-500 bg-red-500/10";
    return "text-muted-foreground bg-muted";
  };

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: delay * 0.1, duration: 0.5 }}
    >
      <Card className="overflow-hidden hover:shadow-lg transition-all duration-300 group border-2 hover:border-primary/20">
        <CardContent className="p-6">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <p className="text-sm font-medium text-muted-foreground mb-2">
                {title}
              </p>
              <div className="flex items-baseline gap-2">
                <motion.span 
                  className="text-3xl font-bold tracking-tight"
                  key={displayValue}
                >
                  {prefix}{format === "currency" ? formatValue(displayValue) : displayValue}{suffix}
                </motion.span>
                
                {trend !== null && (
                  <motion.span 
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.5 }}
                    className={`inline-flex items-center gap-0.5 px-2 py-0.5 rounded-full text-xs font-medium ${getTrendColor()}`}
                  >
                    {getTrendIcon()}
                    {Math.abs(trend).toFixed(0)}%
                  </motion.span>
                )}
              </div>
              
              {description && (
                <p className="text-xs text-muted-foreground mt-2">
                  {description}
                </p>
              )}
            </div>
            
            <motion.div 
              className={`w-12 h-12 rounded-2xl flex items-center justify-center bg-gradient-to-br from-primary/10 to-primary/5 ${iconColor} group-hover:scale-110 transition-transform`}
              whileHover={{ rotate: 5 }}
            >
              <Icon className="h-6 w-6" />
            </motion.div>
          </div>
          
          {/* Progress bar animation */}
          <motion.div 
            className="mt-4 h-1.5 bg-muted rounded-full overflow-hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            <motion.div 
              className="h-full bg-gradient-to-r from-primary to-primary/70 rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${Math.min((displayValue / (value * 1.5)) * 100, 100)}%` }}
              transition={{ delay: 0.5, duration: 1, ease: "easeOut" }}
            />
          </motion.div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default AnimatedStatsCard;
