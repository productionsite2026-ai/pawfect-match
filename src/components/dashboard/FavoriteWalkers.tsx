import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Heart, Star, MapPin, MessageCircle, Calendar, Shield } from "lucide-react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

interface FavoriteWalker {
  id: string;
  name: string;
  photoUrl?: string;
  rating?: number;
  totalReviews?: number;
  city?: string;
  verified?: boolean;
  lastBooking?: string;
  hourlyRate?: number;
}

interface FavoriteWalkersProps {
  walkers: FavoriteWalker[];
  onRemoveFavorite?: (id: string) => void;
  onMessage?: (id: string) => void;
  onBook?: (id: string) => void;
}

export const FavoriteWalkers = ({
  walkers,
  onRemoveFavorite,
  onMessage,
  onBook
}: FavoriteWalkersProps) => {
  const navigate = useNavigate();

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Heart className="h-5 w-5 text-heart fill-heart-light" />
          Accompagnateur Certifiés favoris
        </CardTitle>
        <CardDescription>{walkers.length} promeneur(s) favori(s)</CardDescription>
      </CardHeader>
      <CardContent>
        {walkers.length === 0 ? (
          <div className="text-center py-8">
            <div className="w-16 h-16 rounded-full bg-heart-light mx-auto mb-4 flex items-center justify-center">
              <Heart className="h-8 w-8 text-heart/50" />
            </div>
            <h3 className="font-semibold mb-2">Aucun favori</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Ajoutez des promeneurs en favoris pour les retrouver facilement
            </p>
            <Button variant="outline" onClick={() => navigate('/walkers')}>
              Découvrir les promeneurs
            </Button>
          </div>
        ) : (
          <div className="space-y-3">
            {walkers.map((walker, index) => (
              <motion.div
                key={walker.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="flex items-center gap-4 p-3 rounded-lg border hover:bg-muted/30 transition-colors"
              >
                <div className="relative">
                  <Avatar className="h-12 w-12 ring-2 ring-background">
                    <AvatarImage src={walker.photoUrl} alt={walker.name} />
                    <AvatarFallback className="bg-primary/10 text-primary">
                      {walker.name.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                  {walker.verified && (
                    <div className="absolute -bottom-1 -right-1 bg-primary text-primary-foreground rounded-full p-0.5">
                      <Shield className="h-3 w-3" />
                    </div>
                  )}
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <h4 className="font-semibold">{walker.name}</h4>
                    {walker.rating && (
                      <span className="flex items-center gap-1 text-xs bg-amber-50 dark:bg-amber-950/30 px-2 py-0.5 rounded">
                        <Star className="h-3 w-3 fill-amber-500 text-amber-500" />
                        {walker.rating.toFixed(1)}
                      </span>
                    )}
                  </div>
                  {walker.city && (
                    <p className="text-xs text-muted-foreground flex items-center gap-1">
                      <MapPin className="h-3 w-3" />
                      {walker.city}
                    </p>
                  )}
                  {walker.lastBooking && (
                    <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
                      <Calendar className="h-3 w-3" />
                      Dernière réservation : {new Date(walker.lastBooking).toLocaleDateString('fr-FR')}
                    </p>
                  )}
                </div>

                <div className="flex flex-col gap-2">
                  {walker.hourlyRate && (
                    <Badge variant="outline" className="text-primary font-bold">
                      {walker.hourlyRate}€/h
                    </Badge>
                  )}
                  <div className="flex gap-1">
                    <Button 
                      size="icon" 
                      variant="ghost" 
                      className="h-8 w-8"
                      onClick={() => onMessage?.(walker.id)}
                    >
                      <MessageCircle className="h-4 w-4" />
                    </Button>
                    <Button 
                      size="sm" 
                      className="h-8"
                      onClick={() => onBook ? onBook(walker.id) : navigate(`/book/${walker.id}`)}
                    >
                      Réserver
                    </Button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default FavoriteWalkers;
