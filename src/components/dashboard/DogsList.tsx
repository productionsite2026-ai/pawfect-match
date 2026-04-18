import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Dog, Plus, ChevronRight, Calendar, Heart } from "lucide-react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

interface DogInfo {
  id: string;
  name: string;
  breed: string;
  age?: number;
  weight?: number;
  photoUrl?: string;
  lastWalk?: string;
  totalWalks?: number;
}

interface DogsListProps {
  dogs: DogInfo[];
  onAddDog?: () => void;
  onDogClick?: (id: string) => void;
}

export const DogsList = ({ dogs, onAddDog, onDogClick }: DogsListProps) => {
  const navigate = useNavigate();

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle className="flex items-center gap-2">
            <Dog className="h-5 w-5 text-primary" />
            Mes chiens
          </CardTitle>
          <CardDescription>{dogs.length} chien(s) enregistré(s)</CardDescription>
        </div>
        <Button size="sm" variant="outline" onClick={onAddDog || (() => navigate('/dogs/add'))}>
          <Plus className="h-4 w-4 mr-1" />
          Ajouter
        </Button>
      </CardHeader>
      <CardContent>
        {dogs.length === 0 ? (
          <div className="text-center py-8">
            <div className="w-16 h-16 rounded-full bg-muted mx-auto mb-4 flex items-center justify-center">
              <Dog className="h-8 w-8 text-muted-foreground/50" />
            </div>
            <h3 className="font-semibold mb-2">Aucun chien enregistré</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Ajoutez votre compagnon pour commencer
            </p>
            <Button onClick={onAddDog || (() => navigate('/dogs/add'))}>
              <Plus className="h-4 w-4 mr-2" />
              Ajouter un chien
            </Button>
          </div>
        ) : (
          <div className="space-y-3">
            {dogs.map((dog, index) => (
              <motion.div
                key={dog.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                className="flex items-center gap-4 p-3 rounded-lg border hover:bg-muted/30 transition-colors cursor-pointer group"
                onClick={() => onDogClick?.(dog.id)}
              >
                <Avatar className="h-14 w-14 ring-2 ring-background">
                  <AvatarImage src={dog.photoUrl} alt={dog.name} />
                  <AvatarFallback className="bg-primary/10 text-primary text-lg">
                    {dog.name.charAt(0)}
                  </AvatarFallback>
                </Avatar>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <h4 className="font-semibold">{dog.name}</h4>
                    <Heart className="h-4 w-4 text-primary fill-primary/20" />
                  </div>
                  <p className="text-sm text-muted-foreground">{dog.breed}</p>
                  <div className="flex flex-wrap gap-2 mt-1">
                    {dog.age && (
                      <Badge variant="secondary" className="text-xs">
                        {dog.age} an{dog.age > 1 ? 's' : ''}
                      </Badge>
                    )}
                    {dog.weight && (
                      <Badge variant="secondary" className="text-xs">
                        {dog.weight} kg
                      </Badge>
                    )}
                  </div>
                </div>

                <div className="text-right">
                  {dog.totalWalks !== undefined && (
                    <p className="text-sm font-medium">{dog.totalWalks} promenades</p>
                  )}
                  {dog.lastWalk && (
                    <p className="text-xs text-muted-foreground flex items-center gap-1 justify-end">
                      <Calendar className="h-3 w-3" />
                      Dernière : {new Date(dog.lastWalk).toLocaleDateString('fr-FR')}
                    </p>
                  )}
                  <ChevronRight className="h-5 w-5 text-muted-foreground ml-auto mt-2 opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default DogsList;
