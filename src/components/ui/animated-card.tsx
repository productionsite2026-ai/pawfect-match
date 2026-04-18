import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { ReactNode } from "react";

interface AnimatedCardProps {
  children: ReactNode;
  className?: string;
  delay?: number;
  hover?: boolean;
  glow?: boolean;
}

export const AnimatedCard = ({
  children,
  className,
  delay = 0,
  hover = true,
  glow = false,
}: AnimatedCardProps) => {
  return (
    <motion.div
      className={cn(
        "bg-card rounded-2xl border border-border shadow-sm",
        hover && "transition-all duration-300",
        glow && "hover:shadow-[0_0_30px_hsl(var(--primary)/0.15)]",
        className
      )}
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.5, delay }}
      whileHover={hover ? { 
        y: -5, 
        scale: 1.02,
        boxShadow: "0 20px 40px -10px hsl(var(--primary) / 0.2)"
      } : undefined}
    >
      {children}
    </motion.div>
  );
};

interface AnimatedGridProps {
  children: ReactNode;
  className?: string;
  staggerDelay?: number;
}

export const AnimatedGrid = ({
  children,
  className,
  staggerDelay = 0.1,
}: AnimatedGridProps) => {
  return (
    <motion.div
      className={cn("grid", className)}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-50px" }}
      variants={{
        hidden: {},
        visible: {
          transition: {
            staggerChildren: staggerDelay,
          },
        },
      }}
    >
      {children}
    </motion.div>
  );
};

export const AnimatedGridItem = ({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) => {
  return (
    <motion.div
      className={className}
      variants={{
        hidden: { opacity: 0, y: 30, scale: 0.95 },
        visible: { 
          opacity: 1, 
          y: 0, 
          scale: 1,
          transition: { duration: 0.5 }
        },
      }}
    >
      {children}
    </motion.div>
  );
};
