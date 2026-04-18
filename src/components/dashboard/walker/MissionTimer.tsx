import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Clock, Play, Pause, MapPin, Dog } from "lucide-react";

interface MissionTimerProps {
  missionId: string;
  dogName: string;
  startTime?: string;
  isActive: boolean;
  estimatedDuration?: number; // in minutes
}

export const MissionTimer: React.FC<MissionTimerProps> = ({
  missionId,
  dogName,
  startTime,
  isActive,
  estimatedDuration = 60
}) => {
  const [elapsed, setElapsed] = useState(0);

  useEffect(() => {
    if (!isActive || !startTime) return;

    const start = new Date(startTime).getTime();
    
    const interval = setInterval(() => {
      const now = Date.now();
      setElapsed(Math.floor((now - start) / 1000));
    }, 1000);

    return () => clearInterval(interval);
  }, [isActive, startTime]);

  const formatTime = (seconds: number) => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;

    if (hrs > 0) {
      return `${hrs}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const progress = Math.min((elapsed / 60 / estimatedDuration) * 100, 100);
  const isOvertime = elapsed > estimatedDuration * 60;

  if (!isActive) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="mb-4"
    >
      <Card className={`overflow-hidden ${isOvertime ? 'border-amber-500' : 'border-primary'}`}>
        <div 
          className={`h-1 ${isOvertime ? 'bg-amber-500' : 'bg-primary'}`}
          style={{ width: `${progress}%`, transition: 'width 1s linear' }}
        />
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            {/* Left: Status */}
            <div className="flex items-center gap-3">
              <motion.div
                className={`w-12 h-12 rounded-full flex items-center justify-center ${
                  isOvertime ? 'bg-amber-500/10' : 'bg-primary/10'
                }`}
                animate={{ scale: [1, 1.05, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <Play className={`h-5 w-5 ${isOvertime ? 'text-amber-600' : 'text-primary'}`} />
              </motion.div>
              <div>
                <p className="font-medium flex items-center gap-1">
                  <Dog className="h-4 w-4" />
                  {dogName}
                </p>
                <p className="text-sm text-muted-foreground">
                  Mission en cours
                </p>
              </div>
            </div>
            
            {/* Right: Timer */}
            <div className="text-right">
              <motion.p 
                className={`text-2xl font-mono font-bold ${isOvertime ? 'text-amber-600' : 'text-primary'}`}
                animate={{ opacity: [1, 0.7, 1] }}
                transition={{ duration: 1, repeat: Infinity }}
              >
                {formatTime(elapsed)}
              </motion.p>
              <p className="text-xs text-muted-foreground flex items-center justify-end gap-1">
                <Clock className="h-3 w-3" />
                {isOvertime 
                  ? `+${Math.floor((elapsed - estimatedDuration * 60) / 60)} min` 
                  : `${estimatedDuration} min prévues`
                }
              </p>
            </div>
          </div>

          {/* Progress bar text */}
          <div className="flex items-center justify-between mt-3 text-xs text-muted-foreground">
            <span>Début {startTime ? new Date(startTime).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }) : '--:--'}</span>
            <span>{Math.round(progress)}% effectué</span>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default MissionTimer;
