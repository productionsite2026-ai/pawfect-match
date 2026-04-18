import React, { useState } from 'react';
import { LucideIcon } from 'lucide-react';
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import WalkManagementSheet from './shared/WalkManagementSheet';

interface NavItem {
  id: string;
  label: string;
  icon: LucideIcon;
  badge?: number;
}

interface MobileBottomNavProps {
  items: NavItem[];
  activeItem: string;
  onItemChange: (id: string) => void;
  variant?: 'owner' | 'walker';
  showGoButton?: boolean;
  activeMission?: any;
}

const MobileBottomNav: React.FC<MobileBottomNavProps> = ({ 
  items, 
  activeItem, 
  onItemChange,
  variant = 'owner',
  showGoButton = true,
  activeMission
}) => {
  const [walkSheetOpen, setWalkSheetOpen] = useState(false);
  
  // Split items into left and right halves for GO button
  const midIndex = Math.floor(items.length / 2);
  const leftItems = items.slice(0, midIndex);
  const rightItems = items.slice(midIndex);

  return (
    <>
      <nav className="fixed bottom-0 left-0 right-0 bg-background/98 backdrop-blur-xl border-t border-border/40 z-50 pb-[env(safe-area-inset-bottom)]">
        <div className="flex justify-around items-end h-16 px-1 max-w-lg mx-auto relative">
          {/* Left items */}
          {leftItems.map((item) => {
            const isActive = activeItem === item.id;
            return (
              <motion.button
                key={item.id}
                whileTap={{ scale: 0.9 }}
                onClick={() => onItemChange(item.id)}
                className={cn(
                  "flex flex-col items-center justify-center gap-0.5 py-2 px-3 rounded-xl transition-all duration-200 relative min-w-[56px]",
                  isActive ? "bg-primary/8" : "hover:bg-muted/50"
                )}
              >
                <div className="relative">
                  <item.icon 
                    className={cn("h-5 w-5 transition-colors", isActive ? "text-primary" : "text-muted-foreground")} 
                    strokeWidth={isActive ? 2.5 : 1.8}
                  />
                  {item.badge && item.badge > 0 && (
                    <span className="absolute -top-1.5 -right-2.5 min-w-[16px] h-4 px-1 bg-destructive text-white text-[9px] font-bold rounded-full flex items-center justify-center">
                      {item.badge > 9 ? '9+' : item.badge}
                    </span>
                  )}
                </div>
                <span className={cn("text-[10px] font-medium", isActive ? "text-primary" : "text-muted-foreground")}>
                  {item.label}
                </span>
              </motion.button>
            );
          })}

          {/* Central GO Button */}
          {showGoButton && (
            <div className="flex flex-col items-center -mt-5 relative z-10">
              <motion.button
                whileTap={{ scale: 0.9 }}
                whileHover={{ scale: 1.05 }}
                onClick={() => setWalkSheetOpen(true)}
                className={cn(
                  "w-16 h-16 rounded-full flex items-center justify-center shadow-xl font-bold text-white text-xl",
                  "bg-gradient-to-br from-primary to-accent",
                  "ring-4 ring-background",
                  activeMission && "animate-pulse"
                )}
              >
                GO
              </motion.button>
              <span className="text-[9px] font-semibold text-primary mt-0.5">Promenade</span>
            </div>
          )}

          {/* Right items */}
          {rightItems.map((item) => {
            const isActive = activeItem === item.id;
            return (
              <motion.button
                key={item.id}
                whileTap={{ scale: 0.9 }}
                onClick={() => onItemChange(item.id)}
                className={cn(
                  "flex flex-col items-center justify-center gap-0.5 py-2 px-3 rounded-xl transition-all duration-200 relative min-w-[56px]",
                  isActive ? "bg-primary/8" : "hover:bg-muted/50"
                )}
              >
                <div className="relative">
                  <item.icon 
                    className={cn("h-5 w-5 transition-colors", isActive ? "text-primary" : "text-muted-foreground")} 
                    strokeWidth={isActive ? 2.5 : 1.8}
                  />
                  {item.badge && item.badge > 0 && (
                    <span className="absolute -top-1.5 -right-2.5 min-w-[16px] h-4 px-1 bg-destructive text-white text-[9px] font-bold rounded-full flex items-center justify-center">
                      {item.badge > 9 ? '9+' : item.badge}
                    </span>
                  )}
                </div>
                <span className={cn("text-[10px] font-medium", isActive ? "text-primary" : "text-muted-foreground")}>
                  {item.label}
                </span>
              </motion.button>
            );
          })}
        </div>
      </nav>
      
      <WalkManagementSheet 
        open={walkSheetOpen} 
        onOpenChange={setWalkSheetOpen}
        activeMission={activeMission}
      />
    </>
  );
};

export default MobileBottomNav;
