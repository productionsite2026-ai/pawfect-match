import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, Clock, CheckCircle } from "lucide-react";
import { motion } from "framer-motion";

interface AvailabilityCalendarProps {
  availableDays: string[] | null;
  availableHoursStart: string | null;
  availableHoursEnd: string | null;
}

const dayNames: Record<string, string> = {
  monday: "Lun",
  tuesday: "Mar",
  wednesday: "Mer",
  thursday: "Jeu",
  friday: "Ven",
  saturday: "Sam",
  sunday: "Dim",
};

const dayOrder = ["monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday"];

export const AvailabilityCalendar = ({
  availableDays,
  availableHoursStart,
  availableHoursEnd,
}: AvailabilityCalendarProps) => {
  const formatTime = (time: string | null) => {
    if (!time) return "";
    return time.slice(0, 5);
  };

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-lg">
          <Calendar className="h-5 w-5 text-primary" />
          Disponibilités
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Visual Week Calendar */}
        <div className="grid grid-cols-7 gap-1">
          {dayOrder.map((day, index) => {
            const isAvailable = availableDays?.includes(day);
            return (
              <motion.div
                key={day}
                className={`
                  flex flex-col items-center justify-center p-2 rounded-lg text-center
                  ${isAvailable 
                    ? "bg-primary/10 border-2 border-primary/30" 
                    : "bg-muted/50 border border-border opacity-50"
                  }
                `}
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: index * 0.05 }}
                whileHover={isAvailable ? { scale: 1.05 } : {}}
              >
                <span className={`text-xs font-medium ${isAvailable ? "text-primary" : "text-muted-foreground"}`}>
                  {dayNames[day]}
                </span>
                {isAvailable && (
                  <CheckCircle className="h-4 w-4 text-primary mt-1" />
                )}
              </motion.div>
            );
          })}
        </div>

        {/* Time Slot */}
        {(availableHoursStart || availableHoursEnd) && (
          <div className="flex items-center justify-center gap-2 p-3 bg-muted/30 rounded-lg">
            <Clock className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm">
              <span className="font-medium">{formatTime(availableHoursStart) || "08:00"}</span>
              <span className="text-muted-foreground mx-1">→</span>
              <span className="font-medium">{formatTime(availableHoursEnd) || "20:00"}</span>
            </span>
          </div>
        )}

        {/* Legend */}
        <div className="flex flex-wrap gap-2 justify-center pt-2 border-t">
          <Badge variant="outline" className="gap-1 bg-primary/5">
            <CheckCircle className="h-3 w-3 text-primary" />
            Disponible
          </Badge>
          <Badge variant="outline" className="gap-1 opacity-50">
            Indisponible
          </Badge>
        </div>
      </CardContent>
    </Card>
  );
};

export default AvailabilityCalendar;
