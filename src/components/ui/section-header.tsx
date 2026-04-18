import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { ReactNode } from "react";
import { AnimatedIcon } from "./animated-icon";
import { LucideIcon } from "lucide-react";

interface SectionHeaderProps {
  title: string;
  subtitle?: string;
  icon?: LucideIcon;
  iconVariant?: "primary" | "accent" | "success" | "warning";
  align?: "left" | "center" | "right";
  className?: string;
  children?: ReactNode;
  badge?: string;
}

export const SectionHeader = ({
  title,
  subtitle,
  icon,
  iconVariant = "primary",
  align = "center",
  className,
  children,
  badge,
}: SectionHeaderProps) => {
  const alignClasses = {
    left: "text-left",
    center: "text-center mx-auto",
    right: "text-right ml-auto",
  };

  return (
    <motion.div
      className={cn(
        "max-w-3xl mb-12",
        alignClasses[align],
        className
      )}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
    >
      {badge && (
        <motion.span
          className="inline-block px-4 py-1.5 rounded-full text-sm font-medium bg-primary/10 text-primary mb-4"
          initial={{ opacity: 0, scale: 0.8 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1 }}
        >
          {badge}
        </motion.span>
      )}
      
      {icon && (
        <div className={cn(
          "mb-6",
          align === "center" && "flex justify-center",
          align === "right" && "flex justify-end"
        )}>
          <AnimatedIcon icon={icon} size="lg" variant={iconVariant} float />
        </div>
      )}
      
      <motion.h2
        className="text-3xl md:text-4xl font-bold mb-4"
        initial={{ opacity: 0, y: 10 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay: 0.2 }}
      >
        {title}
      </motion.h2>
      
      {subtitle && (
        <motion.p
          className="text-muted-foreground text-lg leading-relaxed"
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3 }}
        >
          {subtitle}
        </motion.p>
      )}
      
      {children}
    </motion.div>
  );
};
