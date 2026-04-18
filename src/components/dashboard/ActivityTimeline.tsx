import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";
import { Clock, CheckCircle, AlertCircle, Bell, Star, Euro, Dog } from "lucide-react";

interface Activity {
  id: string;
  type: 'booking' | 'review' | 'payment' | 'notification' | 'dog';
  title: string;
  description: string;
  time: string;
  status?: 'success' | 'warning' | 'info';
}

interface ActivityTimelineProps {
  activities: Activity[];
  title?: string;
  description?: string;
  emptyMessage?: string;
  maxItems?: number;
}

const activityIcons = {
  booking: Clock,
  review: Star,
  payment: Euro,
  notification: Bell,
  dog: Dog
};

const statusColors = {
  success: 'bg-green-100 text-green-600 dark:bg-green-900/30',
  warning: 'bg-amber-100 text-amber-600 dark:bg-amber-900/30',
  info: 'bg-blue-100 text-blue-600 dark:bg-blue-900/30'
};

export const ActivityTimeline = ({
  activities,
  title = "Activité récente",
  description,
  emptyMessage = "Aucune activité récente",
  maxItems = 5
}: ActivityTimelineProps) => {
  const displayActivities = activities.slice(0, maxItems);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Clock className="h-5 w-5 text-primary" />
          {title}
        </CardTitle>
        {description && <CardDescription>{description}</CardDescription>}
      </CardHeader>
      <CardContent>
        {displayActivities.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <Bell className="h-12 w-12 mx-auto mb-3 opacity-30" />
            <p>{emptyMessage}</p>
          </div>
        ) : (
          <div className="space-y-4">
            {displayActivities.map((activity, index) => {
              const Icon = activityIcons[activity.type] || Bell;
              return (
                <motion.div
                  key={activity.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="flex items-start gap-3"
                >
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${
                    activity.status ? statusColors[activity.status] : 'bg-muted'
                  }`}>
                    <Icon className="h-5 w-5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm">{activity.title}</p>
                    <p className="text-xs text-muted-foreground truncate">{activity.description}</p>
                  </div>
                  <span className="text-xs text-muted-foreground whitespace-nowrap">{activity.time}</span>
                </motion.div>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ActivityTimeline;
