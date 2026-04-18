import React from 'react';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Bell, Settings, PawPrint } from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface DashboardHeaderProps {
  name: string;
  subtitle?: string;
  avatarUrl?: string;
  variant?: 'owner' | 'walker';
  unreadNotifications?: number;
  onSettingsClick?: () => void;
  onNotificationsClick?: () => void;
}

const DashboardHeader: React.FC<DashboardHeaderProps> = ({
  name,
  subtitle,
  avatarUrl,
  variant = 'owner',
  unreadNotifications = 0,
  onSettingsClick,
  onNotificationsClick
}) => {
  const isOwner = variant === 'owner';
  
  return (
    <motion.header 
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-2xl p-5 mb-4 relative overflow-hidden shadow-md bg-gradient-to-br from-primary to-primary/80"
    >
      {/* Subtle decorative circles */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -right-6 -top-6 w-28 h-28 bg-white/8 rounded-full" />
        <div className="absolute right-20 bottom--2 w-16 h-16 bg-white/5 rounded-full" />
      </div>
      
      <div className="flex items-center justify-between relative z-10">
        <div className="flex items-center gap-3">
          <div className="relative">
            <Avatar className="h-13 w-13 border-2 border-white/30 shadow-lg">
              <AvatarImage src={avatarUrl} alt={name} />
              <AvatarFallback className="bg-white/20 text-white font-bold text-lg">
                {name.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 bg-emerald-400 rounded-full border-2 border-white" />
          </div>
          <div className="text-white">
            <div className="flex items-center gap-1.5 mb-0.5">
              <PawPrint className="h-4 w-4 text-white/70" />
              <span className="text-xs font-medium text-white/70">
                {isOwner ? 'Mon espace' : 'Espace promeneur'}
              </span>
            </div>
            <h1 className="text-lg font-bold leading-tight">
              Bonjour, {name} !
            </h1>
            {subtitle && (
              <p className="text-xs text-white/60 mt-0.5">{subtitle}</p>
            )}
          </div>
        </div>

        <div className="flex items-center gap-1.5">
          <Button 
            variant="ghost" 
            size="icon" 
            className="relative h-9 w-9 rounded-xl bg-white/10 hover:bg-white/20 text-white"
            onClick={onNotificationsClick}
          >
            <Bell className="h-4.5 w-4.5" />
            {unreadNotifications > 0 && (
              <motion.span 
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="absolute -top-1 -right-1 w-4.5 h-4.5 bg-destructive text-white text-[9px] font-bold rounded-full flex items-center justify-center"
              >
                {unreadNotifications > 9 ? '9+' : unreadNotifications}
              </motion.span>
            )}
          </Button>
          <Button 
            variant="ghost" 
            size="icon" 
            className="h-9 w-9 rounded-xl bg-white/10 hover:bg-white/20 text-white"
            onClick={onSettingsClick}
          >
            <Settings className="h-4.5 w-4.5" />
          </Button>
        </div>
      </div>
    </motion.header>
  );
};

export default DashboardHeader;
