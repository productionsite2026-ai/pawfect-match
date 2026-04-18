import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Clock, MapPin, Activity } from "lucide-react";
import { motion } from "framer-motion";

interface ActiveWalkProps {
  dogName: string;
  dogPhoto?: string;
  walkerName: string;
  duration: number; // en minutes
  distance?: number; // en km
  speed?: number; // en km/h
}

const ActiveWalk = ({ dogName, dogPhoto, walkerName, duration, distance = 1.2, speed = 3.8 }: ActiveWalkProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="mb-6"
    >
      <Card className="overflow-hidden border-2 border-accent/30 bg-gradient-to-br from-accent/5 to-transparent">
        <CardContent className="p-0">
          <div className="p-4">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-lg font-bold">Mission en cours (Outil GO)</h3>
              <Badge className="bg-accent text-accent-foreground">
                En cours
              </Badge>
            </div>
            
            {/* Contenu visuel */}
            <div className="grid grid-cols-2 gap-3 mb-4">
              {/* Placeholder pour la carte (sans GPS réel) */}
              <div className="aspect-square rounded-xl bg-muted flex items-center justify-center">
                <MapPin className="h-8 w-8 text-primary" />
              </div>
              
              {/* Photo de l'animal */}
              {dogPhoto ? (
                <img 
                  src={dogPhoto} 
                  alt={dogName}
                  className="aspect-square rounded-xl object-cover"
                />
              ) : (
                <div className="aspect-square rounded-xl bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center text-4xl">
                  🐾
                </div>
              )}
            </div>
            
            {/* Stats */}
            <div className="grid grid-cols-3 gap-2 pt-3 border-t">
              <div className="text-center">
                <div className="flex items-center justify-center gap-1 text-muted-foreground mb-1">
                  <Clock className="h-4 w-4" />
                  <span className="text-xs">Durée</span>
                </div>
                <p className="font-bold">{duration} min</p>
              </div>
              <div className="text-center border-x">
                <div className="flex items-center justify-center gap-1 text-muted-foreground mb-1">
                  <MapPin className="h-4 w-4" />
                  <span className="text-xs">Distance</span>
                </div>
                <p className="font-bold">{distance} km</p>
              </div>
              <div className="text-center">
                <div className="flex items-center justify-center gap-1 text-muted-foreground mb-1">
                  <Activity className="h-4 w-4" />
                  <span className="text-xs">Vitesse</span>
                </div>
                <p className="font-bold">{speed} km/h</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default ActiveWalk;
