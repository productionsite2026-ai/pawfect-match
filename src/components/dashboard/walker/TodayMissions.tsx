import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { MapPin, Clock, Camera, CheckCircle } from "lucide-react";
import { motion } from "framer-motion";
import MissionStartButton from "./MissionStartButton";
import MissionTimer from "./MissionTimer";

interface Mission {
  id: string;
  startTime: string;
  endTime: string;
  dogName: string;
  serviceType: string;
  ownerName: string;
  ownerPhoto?: string;
  address: string;
  status: 'pending' | 'confirmed' | 'in_progress' | 'completed';
  walker_id?: string;
  duration_minutes?: number;
  started_at?: string;
}

interface TodayMissionsProps {
  missions: Mission[];
  onStartMission: (missionId: string) => void;
  selectedDate: Date;
  onRefresh?: () => void;
}

const serviceLabels: Record<string, string> = {
  promenade: "Balade",
  visite: "Visite",
  garde: "Garde",
  veterinaire: "Vétérinaire"
};

const TodayMissions = ({ missions, onStartMission, selectedDate, onRefresh }: TodayMissionsProps) => {
  const dateLabel = selectedDate.toLocaleDateString('fr-FR', { 
    weekday: 'long', 
    day: 'numeric', 
    month: 'long' 
  });

  const activeMission = missions.find(m => m.status === 'in_progress');

  return (
    <div className="mb-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold capitalize">
          Missions du {dateLabel}
        </h2>
        {missions.length > 0 && (
          <Badge variant="secondary" className="gap-1">
            {missions.length} mission{missions.length > 1 ? 's' : ''}
          </Badge>
        )}
      </div>

      {/* Timer for active mission */}
      {activeMission && (
        <MissionTimer
          missionId={activeMission.id}
          dogName={activeMission.dogName}
          startTime={activeMission.started_at}
          isActive={true}
          estimatedDuration={activeMission.duration_minutes || 60}
        />
      )}
      
      {missions.length === 0 ? (
        <Card className="border-dashed">
          <CardContent className="text-center py-12">
            <div className="text-4xl mb-3">📅</div>
            <p className="font-medium text-muted-foreground">Aucune mission prévue</p>
            <p className="text-sm text-muted-foreground/70 mt-1">Profitez de votre journée libre !</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {missions.map((mission, index) => (
            <motion.div
              key={mission.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className={`overflow-hidden transition-all ${
                mission.status === 'in_progress' 
                  ? 'ring-2 ring-primary border-primary shadow-lg' 
                  : 'hover:shadow-md'
              }`}>
                <CardContent className="p-0">
                  {/* Status indicator bar */}
                  {mission.status === 'in_progress' && (
                    <div className="h-1 bg-gradient-to-r from-primary to-accent" />
                  )}
                  
                  <div className="p-4">
                    {/* Status Badge */}
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Clock className="h-4 w-4" />
                        <span className="font-medium text-foreground">
                          {mission.startTime} - {mission.endTime}
                        </span>
                      </div>
                      {mission.status === 'in_progress' && (
                        <Badge className="bg-primary gap-1 animate-pulse">
                          <span className="w-2 h-2 rounded-full bg-white" />
                          En cours
                        </Badge>
                      )}
                      {mission.status === 'confirmed' && (
                        <Badge variant="secondary" className="gap-1">
                          <Clock className="h-3 w-3" />
                          À venir
                        </Badge>
                      )}
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        {/* Mission title */}
                        <h3 className="font-bold text-lg mb-1">
                          {serviceLabels[mission.serviceType] || mission.serviceType} avec {mission.dogName}
                        </h3>
                        
                        {/* Owner */}
                        <div className="flex items-center gap-2 mb-2">
                          <Avatar className="h-6 w-6">
                            <AvatarImage src={mission.ownerPhoto} />
                            <AvatarFallback className="text-xs bg-primary/10 text-primary">
                              {mission.ownerName.charAt(0)}
                            </AvatarFallback>
                          </Avatar>
                          <span className="text-sm text-muted-foreground">{mission.ownerName}</span>
                        </div>
                        
                        {/* Address */}
                        <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                          <MapPin className="h-3.5 w-3.5" />
                          <span className="truncate">{mission.address}</span>
                        </div>
                      </div>
                      
                      {/* Action buttons */}
                      <div className="ml-4">
                        {(mission.status === 'confirmed' || mission.status === 'in_progress') && mission.walker_id && (
                          <MissionStartButton
                            bookingId={mission.id}
                            walkerId={mission.walker_id}
                            dogName={mission.dogName}
                            ownerName={mission.ownerName}
                            status={mission.status}
                            onMissionStarted={onRefresh}
                            onMissionEnded={onRefresh}
                          />
                        )}
                      </div>
                    </div>

                    {/* Photo reminder for in_progress */}
                    {mission.status === 'in_progress' && (
                      <div className="mt-4 p-3 bg-primary/5 rounded-lg border border-primary/20 flex items-center gap-3">
                        <Camera className="h-5 w-5 text-primary shrink-0" />
                        <div className="text-sm">
                          <strong>Rappel :</strong> Envoyez une photo de fin de mission pour terminer et débloquer le paiement.
                        </div>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};

export default TodayMissions;
