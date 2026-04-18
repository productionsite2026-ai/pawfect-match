import React from 'react';
import { motion } from "framer-motion";
import { 
  Check, Clock, MessageCircle, Star, Euro, 
  Calendar, Dog, Camera, AlertTriangle, Heart
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

export interface ActivityItem {
  id: string;
  type: 'booking_confirmed' | 'booking_completed' | 'message_received' | 
        'review_received' | 'payment_received' | 'mission_started' | 
        'photo_uploaded' | 'incident_reported' | 'favorite_added';
  title: string;
  description: string;
  time: string;
  metadata?: {
    amount?: number;
    rating?: number;
    dogName?: string;
    walkerName?: string;
  };
}

interface ActivityFeedProps {
  activities: ActivityItem[];
  variant?: 'owner' | 'walker';
  maxItems?: number;
}

const getActivityIcon = (type: ActivityItem['type']) => {
  const icons: Record<ActivityItem['type'], { icon: any; bg: string; color: string }> = {
    booking_confirmed: { icon: Calendar, bg: 'bg-stat-blue/20', color: 'text-stat-blue' },
    booking_completed: { icon: Check, bg: 'bg-stat-green/20', color: 'text-stat-green' },
    message_received: { icon: MessageCircle, bg: 'bg-stat-purple/20', color: 'text-stat-purple' },
    review_received: { icon: Star, bg: 'bg-stat-yellow/20', color: 'text-stat-yellow' },
    payment_received: { icon: Euro, bg: 'bg-stat-green/20', color: 'text-stat-green' },
    mission_started: { icon: Dog, bg: 'bg-stat-cyan/20', color: 'text-stat-cyan' },
    photo_uploaded: { icon: Camera, bg: 'bg-stat-blue/20', color: 'text-stat-blue' },
    incident_reported: { icon: AlertTriangle, bg: 'bg-stat-red/20', color: 'text-stat-red' },
    favorite_added: { icon: Heart, bg: 'bg-heart/20', color: 'text-heart' }
  };
  return icons[type] || icons.booking_confirmed;
};

export const ActivityFeed: React.FC<ActivityFeedProps> = ({ 
  activities, 
  variant = 'owner',
  maxItems = 5 
}) => {
  const displayedActivities = activities.slice(0, maxItems);

  if (displayedActivities.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        <Clock className="h-8 w-8 mx-auto mb-2 opacity-50" />
        <p className="text-sm">Aucune activité récente</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {displayedActivities.map((activity, index) => {
        const { icon: Icon, bg, color } = getActivityIcon(activity.type);
        
        return (
          <motion.div
            key={activity.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            className="flex items-start gap-3 p-3 rounded-xl hover:bg-muted/50 transition-colors group cursor-pointer"
          >
            {/* Icon */}
            <div className={cn(
              "w-10 h-10 rounded-xl flex items-center justify-center shrink-0 transition-transform group-hover:scale-110",
              bg
            )}>
              <Icon className={cn("h-5 w-5", color)} />
            </div>

            {/* Content */}
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <p className="font-medium text-sm leading-tight">{activity.title}</p>
                  <p className="text-xs text-muted-foreground mt-0.5 line-clamp-1">
                    {activity.description}
                  </p>
                </div>
                <span className="text-[10px] text-muted-foreground shrink-0">
                  {activity.time}
                </span>
              </div>

              {/* Metadata badges */}
              {activity.metadata && (
                <div className="flex items-center gap-2 mt-2">
                  {activity.metadata.amount && (
                    <Badge className="bg-stat-green/20 text-stat-green text-[10px] px-2 py-0">
                      +€{activity.metadata.amount.toFixed(2)}
                    </Badge>
                  )}
                  {activity.metadata.rating && (
                    <Badge className="bg-stat-yellow/20 text-stat-yellow text-[10px] px-2 py-0">
                      ⭐ {activity.metadata.rating}
                    </Badge>
                  )}
                  {activity.metadata.dogName && (
                    <Badge variant="secondary" className="text-[10px] px-2 py-0">
                      🐕 {activity.metadata.dogName}
                    </Badge>
                  )}
                </div>
              )}
            </div>
          </motion.div>
        );
      })}
    </div>
  );
};

export default ActivityFeed;
