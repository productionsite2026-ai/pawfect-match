import { Bell, Settings } from "lucide-react";
import { motion } from "framer-motion";
import { useNavigate, useLocation } from "react-router-dom";
import { useUnreadCount } from "@/hooks/useNewNotifications";
import { usePushNotifications } from "@/hooks/usePushNotifications";
import { useEffect, useState } from "react";
import { NotificationBell } from "@/components/NotificationBell";

interface DashboardHeaderProps {
  title: string;
  notificationCount?: number;
  role?: "owner" | "walker";
}

const DashboardHeader = ({ title, notificationCount: propCount, role }: DashboardHeaderProps) => {
  const navigate = useNavigate();
  const location = useLocation();
  const unreadCount = useUnreadCount();
  const count = propCount ?? unreadCount;
  const { permission, requestPermission, isSupported } = usePushNotifications();
  const [showPrompt, setShowPrompt] = useState(false);

  // Détection du rôle basée sur l'URL ou prop
  const isWalker = role === "walker" || location.pathname.includes("walker");

  // Show push notification prompt after 3s if not yet granted
  useEffect(() => {
    if (isSupported && permission === 'default') {
      const timer = setTimeout(() => setShowPrompt(true), 3000);
      return () => clearTimeout(timer);
    }
  }, [isSupported, permission]);

  const handleEnableNotifs = async () => {
    await requestPermission();
    setShowPrompt(false);
  };

  return (
    <>
      <div className="absolute top-0 left-0 right-0 z-10 flex items-center justify-between px-4 pt-4 pb-3">
        <motion.h2
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          className="text-lg font-black text-white drop-shadow-lg"
        >
          {title.includes("Accompagnateur") ? "🐾 Espace Accompagnateur" : title.includes("Propriétaire") ? "🐾 Espace Propriétaire" : title}
        </motion.h2>
        <div className="flex items-center gap-2">
          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={() => navigate(role === "walker" ? "/walker/dashboard?tab=messages" : "/dashboard?tab=messages")}
            className="relative w-10 h-10 rounded-full bg-card/20 backdrop-blur-md flex items-center justify-center border border-white/20"
          >
            <Bell className="w-[18px] h-[18px] text-white" />
            {count > 0 && (
              <motion.span
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="absolute -top-1 -right-1 w-5 h-5 rounded-full gradient-cta text-white text-[10px] font-black flex items-center justify-center shadow-glow-cta"
              >
                {count}
              </motion.span>
            )}
          </motion.button>
          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={() => navigate(role === "walker" ? "/walker/dashboard?tab=profil" : "/dashboard?tab=profil")}
            className="w-10 h-10 rounded-full bg-card/20 backdrop-blur-md flex items-center justify-center border border-white/20"
          >
            <Settings className="w-[18px] h-[18px] text-white" />
          </motion.button>
        </div>
      </div>

      {/* Push notification prompt */}
      {showPrompt && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="absolute top-16 left-4 right-4 z-20 bg-card rounded-2xl shadow-elevated p-4 flex items-center gap-3"
        >
          <div className="w-10 h-10 rounded-xl gradient-primary flex items-center justify-center shrink-0">
            <Bell className="w-5 h-5 text-white" />
          </div>
          <div className="flex-1">
            <p className="text-sm font-bold text-foreground">Activer les notifications ?</p>
            <p className="text-[10px] text-muted-foreground">Soyez alerté des missions et messages en temps réel</p>
          </div>
          <div className="flex gap-1.5 shrink-0">
            <button onClick={() => setShowPrompt(false)} className="px-2 py-1.5 text-[10px] font-bold text-muted-foreground">Plus tard</button>
            <button onClick={handleEnableNotifs} className="px-3 py-1.5 rounded-full gradient-primary text-white text-[10px] font-bold">Activer</button>
          </div>
        </motion.div>
      )}
    </>
  );
};

export default DashboardHeader;
