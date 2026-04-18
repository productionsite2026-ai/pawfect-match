import { useState } from "react";
import { 
  Bell, Check, Trash2, ExternalLink, MessageCircle, Calendar, 
  Star, CreditCard, Camera, Filter, CheckCheck, Settings,
  Volume2, VolumeX, Dog, Gift, AlertTriangle, Euro
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { useNavigate } from "react-router-dom";
import { useRealtimeNotifications } from "@/hooks/useRealtimeNotifications";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "@/hooks/use-toast";
import type { LucideIcon } from "lucide-react";

const notificationIcons: Record<string, LucideIcon> = {
  booking: Calendar,
  message: MessageCircle,
  payment: CreditCard,
  review: Star,
  proof: Camera,
  dog: Dog,
  referral: Gift,
  alert: AlertTriangle,
  earning: Euro,
  default: Bell
};

const notificationColors: Record<string, string> = {
  booking: 'bg-blue-500/10 text-blue-500',
  message: 'bg-purple-500/10 text-purple-500',
  payment: 'bg-green-500/10 text-green-500',
  review: 'bg-amber-500/10 text-amber-500',
  proof: 'bg-pink-500/10 text-pink-500',
  dog: 'bg-orange-500/10 text-orange-500',
  referral: 'bg-emerald-500/10 text-emerald-500',
  alert: 'bg-red-500/10 text-red-500',
  earning: 'bg-teal-500/10 text-teal-500',
  default: 'bg-muted text-muted-foreground'
};

type NotificationFilter = "all" | "unread" | "booking" | "message" | "payment";

export const NotificationCenter = () => {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [filter, setFilter] = useState<NotificationFilter>("all");
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [showSettings, setShowSettings] = useState(false);
  
  const { 
    notifications, 
    unreadCount, 
    loading, 
    markAsRead, 
    markAllAsRead, 
    deleteNotification 
  } = useRealtimeNotifications();

  const filteredNotifications = notifications.filter(n => {
    if (filter === "all") return true;
    if (filter === "unread") return !n.read;
    return n.type === filter;
  });

  const getTimeAgo = (dateString: string | null) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 1) return "À l'instant";
    if (minutes < 60) return `Il y a ${minutes}min`;
    if (hours < 24) return `Il y a ${hours}h`;
    if (days === 1) return "Hier";
    if (days < 7) return `Il y a ${days}j`;
    return date.toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' });
  };

  const handleNotificationClick = (notification: any) => {
    if (!notification.read) {
      markAsRead(notification.id);
    }
    if (notification.link) {
      navigate(notification.link);
      setOpen(false);
    }
  };

  const handleDeleteAll = () => {
    notifications.forEach(n => deleteNotification(n.id));
    toast({ title: "Toutes les notifications supprimées" });
  };

  const Icon = (type: string | null) => notificationIcons[type || 'default'] || notificationIcons.default;

  const filterTabs = [
    { id: "all", label: "Tout", count: notifications.length },
    { id: "unread", label: "Non lues", count: unreadCount },
    { id: "booking", label: "Réservations", count: notifications.filter(n => n.type === "booking").length },
    { id: "message", label: "Messages", count: notifications.filter(n => n.type === "message").length },
  ];

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="icon" className="relative group">
          <Bell className="h-5 w-5 group-hover:scale-110 transition-transform" />
          <AnimatePresence>
            {unreadCount > 0 && (
              <motion.span
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0 }}
                className="absolute -top-1 -right-1 w-5 h-5 bg-destructive text-destructive-foreground rounded-full text-xs flex items-center justify-center font-bold shadow-lg"
              >
                {unreadCount > 9 ? '9+' : unreadCount}
              </motion.span>
            )}
          </AnimatePresence>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[420px] p-0" align="end">
        {/* Header */}
        <div className="p-4 border-b bg-gradient-to-r from-muted/50 to-transparent">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <Bell className="h-5 w-5 text-primary" />
              <h3 className="font-semibold text-lg">Notifications</h3>
              {unreadCount > 0 && (
                <Badge className="bg-primary/10 text-primary border-0">
                  {unreadCount}
                </Badge>
              )}
            </div>
            <div className="flex items-center gap-1">
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8"
                onClick={() => setShowSettings(!showSettings)}
              >
                <Settings className={`h-4 w-4 transition-transform ${showSettings ? 'rotate-90' : ''}`} />
              </Button>
              {unreadCount > 0 && (
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="text-xs h-8 gap-1"
                  onClick={markAllAsRead}
                >
                  <CheckCheck className="h-3.5 w-3.5" />
                  Tout lire
                </Button>
              )}
            </div>
          </div>

          {/* Settings Panel */}
          <AnimatePresence>
            {showSettings && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="overflow-hidden"
              >
                <div className="flex items-center justify-between py-2 border-t border-dashed">
                  <div className="flex items-center gap-2">
                    {soundEnabled ? <Volume2 className="h-4 w-4" /> : <VolumeX className="h-4 w-4" />}
                    <span className="text-sm">Sons de notification</span>
                  </div>
                  <Switch 
                    checked={soundEnabled} 
                    onCheckedChange={setSoundEnabled}
                  />
                </div>
                {notifications.length > 0 && (
                  <Button
                    variant="ghost"
                    size="sm"
                    className="w-full text-xs text-destructive hover:text-destructive hover:bg-destructive/10 mt-2"
                    onClick={handleDeleteAll}
                  >
                    <Trash2 className="h-3.5 w-3.5 mr-1" />
                    Supprimer toutes les notifications
                  </Button>
                )}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Filter Tabs */}
          <div className="flex gap-1 mt-2 overflow-x-auto pb-1">
            {filterTabs.map(tab => (
              <Button
                key={tab.id}
                variant={filter === tab.id ? "secondary" : "ghost"}
                size="sm"
                className={`text-xs h-7 gap-1 whitespace-nowrap ${
                  filter === tab.id ? 'bg-primary/10 text-primary' : ''
                }`}
                onClick={() => setFilter(tab.id as NotificationFilter)}
              >
                {tab.label}
                {tab.count > 0 && (
                  <span className="text-[10px] opacity-70">({tab.count})</span>
                )}
              </Button>
            ))}
          </div>
        </div>

        {/* Notifications List */}
        <ScrollArea className="h-[380px]">
          {loading ? (
            <div className="p-4 space-y-3">
              {[1, 2, 3].map(i => (
                <div key={i} className="flex gap-3 animate-pulse">
                  <div className="w-10 h-10 rounded-xl bg-muted" />
                  <div className="flex-1 space-y-2">
                    <div className="h-4 bg-muted rounded w-3/4" />
                    <div className="h-3 bg-muted rounded w-1/2" />
                  </div>
                </div>
              ))}
            </div>
          ) : filteredNotifications.length === 0 ? (
            <div className="p-8 text-center">
              <motion.div 
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="w-16 h-16 rounded-full bg-gradient-to-br from-muted to-muted/50 mx-auto mb-3 flex items-center justify-center"
              >
                <Bell className="h-8 w-8 text-muted-foreground/50" />
              </motion.div>
              <p className="text-muted-foreground text-sm font-medium">
                {filter === "unread" ? "Aucune notification non lue" : "Aucune notification"}
              </p>
              <p className="text-xs text-muted-foreground/70 mt-1">
                {filter === "all" 
                  ? "Les nouvelles notifications apparaîtront ici"
                  : "Changez de filtre pour voir plus de notifications"
                }
              </p>
            </div>
          ) : (
            <div className="divide-y">
              <AnimatePresence initial={false} mode="popLayout">
                {filteredNotifications.map((notification, index) => {
                  const IconComponent = Icon(notification.type);
                  const colorClass = notificationColors[notification.type || 'default'];
                  
                  return (
                    <motion.div
                      key={notification.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 20, height: 0 }}
                      transition={{ delay: index * 0.02 }}
                      layout
                      className={`p-4 hover:bg-muted/50 cursor-pointer transition-all group relative ${
                        !notification.read ? 'bg-primary/5 border-l-2 border-l-primary' : ''
                      }`}
                      onClick={() => handleNotificationClick(notification)}
                    >
                      <div className="flex gap-3">
                        <motion.div 
                          className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${colorClass}`}
                          whileHover={{ scale: 1.1, rotate: 5 }}
                        >
                          <IconComponent className="h-5 w-5" />
                        </motion.div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-2">
                            <p className={`text-sm font-medium line-clamp-1 ${
                              !notification.read ? 'text-foreground' : 'text-muted-foreground'
                            }`}>
                              {notification.title}
                            </p>
                            {!notification.read && (
                              <motion.span 
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                className="w-2 h-2 bg-primary rounded-full flex-shrink-0 mt-1.5 animate-pulse" 
                              />
                            )}
                          </div>
                          <p className="text-xs text-muted-foreground line-clamp-2 mt-0.5">
                            {notification.message}
                          </p>
                          <div className="flex items-center justify-between mt-2">
                            <p className="text-[11px] text-muted-foreground/70">
                              {getTimeAgo(notification.created_at)}
                            </p>
                            {notification.link && (
                              <span className="flex items-center gap-1 text-[10px] text-primary/70">
                                Voir <ExternalLink className="h-2.5 w-2.5" />
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                      
                      {/* Actions on hover */}
                      <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        {!notification.read && (
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-7 w-7"
                            onClick={(e) => {
                              e.stopPropagation();
                              markAsRead(notification.id);
                            }}
                            title="Marquer comme lu"
                          >
                            <Check className="h-3.5 w-3.5 text-muted-foreground hover:text-primary" />
                          </Button>
                        )}
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-7 w-7"
                          onClick={(e) => {
                            e.stopPropagation();
                            deleteNotification(notification.id);
                          }}
                          title="Supprimer"
                        >
                          <Trash2 className="h-3.5 w-3.5 text-muted-foreground hover:text-destructive" />
                        </Button>
                      </div>
                    </motion.div>
                  );
                })}
              </AnimatePresence>
            </div>
          )}
        </ScrollArea>

        {/* Footer */}
        <Separator />
        <div className="p-2 bg-muted/30">
          <Button 
            variant="ghost" 
            className="w-full text-sm h-9"
            onClick={() => {
              navigate('/notifications');
              setOpen(false);
            }}
          >
            Voir l'historique complet
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
};