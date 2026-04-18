import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";
import { addDays, format, isToday, startOfWeek, isSameDay } from "date-fns";
import { fr } from "date-fns/locale";

interface DayInfo {
  date: Date;
  missionsCount: number;
}

interface WeekCalendarProps {
  selectedDate: Date;
  onDateSelect: (date: Date) => void;
  missionsByDate?: Map<string, number>;
}

const WeekCalendar = ({ selectedDate, onDateSelect, missionsByDate = new Map() }: WeekCalendarProps) => {
  const startOfCurrentWeek = startOfWeek(selectedDate, { weekStartsOn: 1 });
  
  const days: DayInfo[] = Array.from({ length: 7 }, (_, i) => {
    const date = addDays(startOfCurrentWeek, i);
    const dateKey = format(date, 'yyyy-MM-dd');
    return {
      date,
      missionsCount: missionsByDate.get(dateKey) || 0
    };
  });

  return (
    <div className="bg-card rounded-2xl border p-4 mb-6">
      <div className="grid grid-cols-7 gap-2">
        {days.map((day, index) => {
          const isSelected = isSameDay(day.date, selectedDate);
          const isDayToday = isToday(day.date);
          
          return (
            <motion.button
              key={index}
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              onClick={() => onDateSelect(day.date)}
              className={`flex flex-col items-center py-3 px-1 rounded-xl transition-all ${
                isSelected 
                  ? 'bg-primary text-primary-foreground' 
                  : 'hover:bg-muted'
              }`}
            >
              <span className={`text-xs uppercase ${isSelected ? 'text-primary-foreground/80' : 'text-muted-foreground'}`}>
                {format(day.date, 'EEE', { locale: fr })}
              </span>
              <span className={`text-lg font-bold ${isSelected ? '' : 'text-foreground'}`}>
                {format(day.date, 'd')}
              </span>
              {isDayToday && (
                <span className={`text-[10px] uppercase font-medium ${isSelected ? 'text-primary-foreground/80' : 'text-primary'}`}>
                  Auj.
                </span>
              )}
              {/* Indicateurs de missions */}
              {day.missionsCount > 0 && (
                <div className="flex gap-0.5 mt-1">
                  {Array.from({ length: Math.min(day.missionsCount, 3) }, (_, i) => (
                    <span 
                      key={i}
                      className={`w-1.5 h-1.5 rounded-full ${isSelected ? 'bg-primary-foreground' : 'bg-primary'}`}
                    />
                  ))}
                </div>
              )}
            </motion.button>
          );
        })}
      </div>
    </div>
  );
};

export default WeekCalendar;
