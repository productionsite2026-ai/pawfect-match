import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { 
  Calendar, MessageCircle, Star, DollarSign, Dog, 
  UserCheck, MapPin, Clock, ChevronDown, ChevronUp,
  CheckCircle, XCircle, AlertCircle, Eye
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { formatDistanceToNow, format } from "date-fns";
import { fr } from "date-fns/locale";
import type { LucideIcon } from "lucide-react";

export interface ActivityItem {
  id: string;
  type: "booking" | "message" | "review" | "payment" | "dog" | "verification" | "location" | "other";
  action: string;
  title: string;
  description?: string;
  timestamp: Date;
  status?: "success" | "warning" | "error" | "info" | "pending";
  metadata?: Record<string, any>;
  link?: string;
}

interface ActivityTimelineProps {
  activities: ActivityItem[];
  maxItems?: number;
  title?: string;
  showViewAll?: boolean;
  onViewAll?: () => void;
}

const activityIcons: Record<ActivityItem["type"], LucideIcon> = {
  booking: Calendar,
  message: MessageCircle,
  review: Star,
  payment: DollarSign,
  dog: Dog,
  verification: UserCheck,
  location: MapPin,
  other: Clock
};

const activityColors: Record<ActivityItem["type"], string> = {
  booking: "bg-blue-500/10 text-blue-500 border-blue-500/20",
  message: "bg-purple-500/10 text-purple-500 border-purple-500/20",
  review: "bg-yellow-500/10 text-yellow-500 border-yellow-500/20",
  payment: "bg-green-500/10 text-green-500 border-green-500/20",
  dog: "bg-amber-500/10 text-amber-500 border-amber-500/20",
  verification: "bg-emerald-500/10 text-emerald-500 border-emerald-500/20",
  location: "bg-cyan-500/10 text-cyan-500 border-cyan-500/20",
  other: "bg-muted text-muted-foreground border-muted"
};

const statusIcons: Record<string, LucideIcon> = {
  success: CheckCircle,
  warning: AlertCircle,
  error: XCircle,
  info: Eye,
  pending: Clock
};

const statusColors: Record<string, string> = {
  success: "text-green-500",
  warning: "text-yellow-500",
  error: "text-red-500",
  info: "text-blue-500",
  pending: "text-muted-foreground"
};

const ActivityTimeline = ({
  activities,
  maxItems = 5,
  title = "Activité récente",
  showViewAll = true,
  onViewAll
}: ActivityTimelineProps) => {
  const [expanded, setExpanded] = useState(false);
  const [selectedActivity, setSelectedActivity] = useState<string | null>(null);
  
  const displayedActivities = expanded ? activities : activities.slice(0, maxItems);
  const hasMore = activities.length > maxItems;

  return (
    <Card className="border-2">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-lg">
            <Clock className="h-5 w-5 text-primary" />
            {title}
          </CardTitle>
          {showViewAll && hasMore && (
            <Button 
              variant="ghost" 
              size="sm"
              onClick={() => setExpanded(!expanded)}
              className="gap-1 text-xs"
            >
              {expanded ? (
                <>Réduire <ChevronUp className="h-3.5 w-3.5" /></>
              ) : (
                <>Voir tout ({activities.length}) <ChevronDown className="h-3.5 w-3.5" /></>
              )}
            </Button>
          )}
        </div>
      </CardHeader>
      
      <CardContent className="pt-0">
        {activities.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center mb-3">
              <Clock className="h-6 w-6 text-muted-foreground" />
            </div>
            <p className="text-muted-foreground text-sm">Aucune activité récente</p>
          </div>
        ) : (
          <ScrollArea className={expanded ? "max-h-[400px]" : ""}>
            <div className="relative">
              {/* Timeline line */}
              <div className="absolute left-[19px] top-3 bottom-3 w-0.5 bg-gradient-to-b from-primary/50 via-muted to-transparent" />
              
              <AnimatePresence mode="popLayout">
                {displayedActivities.map((activity, index) => {
                  const Icon = activityIcons[activity.type];
                  const colorClass = activityColors[activity.type];
                  const StatusIcon = activity.status ? statusIcons[activity.status] : null;
                  const statusColor = activity.status ? statusColors[activity.status] : "";
                  const isSelected = selectedActivity === activity.id;
                  
                  return (
                    <motion.div
                      key={activity.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 20 }}
                      transition={{ delay: index * 0.05 }}
                      layout
                      className="relative pl-12 pb-6 last:pb-0 group"
                    >
                      {/* Icon */}
                      <motion.div 
                        className={`absolute left-0 top-0 w-10 h-10 rounded-xl border flex items-center justify-center ${colorClass} group-hover:scale-110 transition-transform`}
                        whileHover={{ rotate: 5 }}
                      >
                        <Icon className="h-4 w-4" />
                      </motion.div>
                      
                      {/* Content */}
                      <div 
                        className={`cursor-pointer rounded-xl p-3 transition-all ${
                          isSelected 
                            ? "bg-primary/5 border border-primary/20" 
                            : "hover:bg-muted/50"
                        }`}
                        onClick={() => setSelectedActivity(isSelected ? null : activity.id)}
                      >
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 flex-wrap">
                              <p className="font-medium text-sm">{activity.title}</p>
                              {activity.status && StatusIcon && (
                                <StatusIcon className={`h-3.5 w-3.5 ${statusColor}`} />
                              )}
                            </div>
                            {activity.description && (
                              <p className="text-sm text-muted-foreground mt-0.5 line-clamp-2">
                                {activity.description}
                              </p>
                            )}
                          </div>
                          <p className="text-xs text-muted-foreground whitespace-nowrap">
                            {formatDistanceToNow(activity.timestamp, { 
                              addSuffix: true,
                              locale: fr 
                            })}
                          </p>
                        </div>
                        
                        {/* Expanded details */}
                        <AnimatePresence>
                          {isSelected && activity.metadata && (
                            <motion.div
                              initial={{ opacity: 0, height: 0 }}
                              animate={{ opacity: 1, height: "auto" }}
                              exit={{ opacity: 0, height: 0 }}
                              className="mt-3 pt-3 border-t border-dashed"
                            >
                              <div className="flex flex-wrap gap-2">
                                {Object.entries(activity.metadata).map(([key, value]) => (
                                  <Badge key={key} variant="secondary" className="text-xs">
                                    {key}: {String(value)}
                                  </Badge>
                                ))}
                              </div>
                              <p className="text-xs text-muted-foreground mt-2">
                                {format(activity.timestamp, "EEEE d MMMM yyyy 'à' HH:mm", { locale: fr })}
                              </p>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    </motion.div>
                  );
                })}
              </AnimatePresence>
            </div>
          </ScrollArea>
        )}
        
        {onViewAll && activities.length > 0 && (
          <Button 
            variant="outline" 
            className="w-full mt-4"
            onClick={onViewAll}
          >
            Voir tout l'historique
          </Button>
        )}
      </CardContent>
    </Card>
  );
};

export default ActivityTimeline;
