import { Button } from "@/components/ui/button";
import { LucideIcon } from "lucide-react";
import { motion } from "framer-motion";

interface QuickAction {
  icon: LucideIcon;
  label: string;
  onClick: () => void;
  variant?: 'default' | 'primary';
  badge?: string;
}

interface QuickActionsProps {
  actions: QuickAction[];
  columns?: number;
}

export const QuickActions = ({ actions, columns = 5 }: QuickActionsProps) => {
  return (
    <div className={`grid grid-cols-2 md:grid-cols-${columns} gap-3`}>
      {actions.map((action, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.05 }}
        >
          <Button
            onClick={action.onClick}
            variant={action.variant === 'primary' ? 'default' : 'outline'}
            className="h-auto py-4 flex flex-col gap-2 hover:border-primary hover:bg-primary/5 transition-all duration-300 group w-full relative"
          >
            {action.badge && (
              <span className="absolute -top-2 -right-2 bg-destructive text-destructive-foreground text-xs px-2 py-0.5 rounded-full">
                {action.badge}
              </span>
            )}
            <action.icon className="h-6 w-6 text-primary group-hover:scale-110 transition-transform" />
            <span className="text-sm font-medium">{action.label}</span>
          </Button>
        </motion.div>
      ))}
    </div>
  );
};

export default QuickActions;
