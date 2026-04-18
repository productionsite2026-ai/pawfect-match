import { LucideIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
  emoji?: string;
  variant?: 'default' | 'minimal' | 'card';
  className?: string;
}

export const EmptyState = ({
  icon: Icon,
  title,
  description,
  actionLabel,
  onAction,
  emoji,
  variant = 'default',
  className
}: EmptyStateProps) => {
  const content = (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={cn(
        "flex flex-col items-center text-center",
        variant === 'minimal' ? 'py-6' : 'py-12 px-4',
        className
      )}
    >
      <div className={cn(
        "rounded-full flex items-center justify-center mb-4",
        variant === 'minimal' ? 'w-14 h-14 bg-muted' : 'w-20 h-20 bg-muted/80'
      )}>
        {emoji ? (
          <span className={variant === 'minimal' ? 'text-2xl' : 'text-4xl'}>{emoji}</span>
        ) : (
          <Icon className={cn(
            "text-muted-foreground/50",
            variant === 'minimal' ? 'h-7 w-7' : 'h-10 w-10'
          )} />
        )}
      </div>
      <h3 className={cn(
        "font-semibold mb-2",
        variant === 'minimal' ? 'text-base' : 'text-lg'
      )}>
        {title}
      </h3>
      <p className={cn(
        "text-muted-foreground max-w-sm mx-auto",
        variant === 'minimal' ? 'text-sm' : 'text-base',
        actionLabel ? 'mb-6' : ''
      )}>
        {description}
      </p>
      {actionLabel && onAction && (
        <Button 
          onClick={onAction}
          variant={variant === 'minimal' ? 'outline' : 'default'}
          size={variant === 'minimal' ? 'sm' : 'default'}
        >
          {actionLabel}
        </Button>
      )}
    </motion.div>
  );

  if (variant === 'card') {
    return (
      <div className={cn("border border-dashed rounded-xl", className)}>
        {content}
      </div>
    );
  }

  return content;
};

export default EmptyState;
