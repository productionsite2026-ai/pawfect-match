import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Star, MapPin, Clock, Heart, CheckCircle, MessageCircle, Shield, Repeat } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface WalkerCardProps {
  walker: {
    id: string;
    user_id: string;
    first_name?: string;
    avatar_url?: string;
    city?: string;
    bio?: string;
    hourly_rate: number | null;
    rating: number | null;
    total_reviews: number | null;
    verified: boolean | null;
    services: string[] | null;
    experience_years: number | null;
    response_rate?: number;
    recurring_clients?: number;
  };
  index: number;
  onBook: (walkerId: string) => void;
  onFavorite?: (walkerId: string) => void;
  isFavorite?: boolean;
  isStarSitter?: boolean;
  matchScore?: number;
  matchReasons?: string[];
}

const serviceLabels: Record<string, string> = {
  promenade: "Promenade",
  visite: "Visite",
  garde: "Garde",
  veterinaire: "Vétérinaire"
};

export const WalkerCard = ({ 
  walker, 
  index, 
  onBook, 
  onFavorite, 
  isFavorite = false,
  isStarSitter = false,
  matchScore,
  matchReasons = []
}: WalkerCardProps) => {
  const navigate = useNavigate();
  const responseRate = walker.response_rate || Math.floor(Math.random() * 20 + 80);
  const recurringClients = walker.recurring_clients || Math.floor(Math.random() * 10);
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      whileHover={{ y: -4 }}
      className="h-full"
    >
      <Card className={`h-full overflow-hidden group hover:shadow-xl transition-all duration-300 border-border/60 hover:border-primary/30 ${matchScore ? 'ring-2 ring-primary/20' : ''}`}>
        <CardContent className="p-0">
          {/* Header avec numéro de rang ou score */}
          <div className="relative">
            {/* Rank/Score badge */}
            <div className="absolute top-3 left-3 z-10">
              {matchScore ? (
                <Badge className="bg-primary text-primary-foreground">
                  {matchScore}% match
                </Badge>
              ) : (
                <span className="text-lg font-bold text-muted-foreground">{index + 1}.</span>
              )}
            </div>
            
            {/* Favorite button */}
            <Button
              variant="ghost"
              size="icon"
              className={`absolute top-3 right-3 z-10 rounded-full transition-all ${
                isFavorite 
                  ? 'text-heart bg-heart-light hover:bg-heart/20' 
                  : 'text-muted-foreground hover:text-heart hover:bg-heart-light'
              }`}
              onClick={(e) => {
                e.stopPropagation();
                onFavorite?.(walker.user_id);
              }}
            >
              <Heart className={`h-5 w-5 ${isFavorite ? 'fill-heart' : ''}`} />
            </Button>
            
            {/* Content */}
            <div 
              className="p-6 pb-4 cursor-pointer"
              onClick={() => navigate(`/walker/${walker.user_id}`)}
            >
              <div className="flex gap-4">
                {/* Avatar */}
                <div className="relative flex-shrink-0">
                  <Avatar className="h-20 w-20 ring-2 ring-border shadow-md group-hover:ring-primary/50 transition-all">
                    <AvatarImage src={walker.avatar_url} className="object-cover" />
                    <AvatarFallback className="bg-primary/10 text-primary text-2xl font-bold">
                      {walker.first_name?.charAt(0) || '?'}
                    </AvatarFallback>
                  </Avatar>
                  {walker.verified && (
                    <div className="absolute -bottom-1 -right-1 bg-primary text-primary-foreground rounded-full p-1 shadow-lg">
                      <Shield className="h-3 w-3" />
                    </div>
                  )}
                </div>
                
                {/* Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-bold text-lg truncate">
                          {walker.first_name || 'Accompagnateur'} {walker.first_name?.charAt(0)}.
                        </h3>
                        {isStarSitter && (
                          <Badge className="bg-accent text-accent-foreground text-xs">
                            Star Sitter
                          </Badge>
                        )}
                      </div>
                      {walker.city && (
                        <p className="text-sm text-muted-foreground flex items-center gap-1 mt-0.5">
                          <MapPin className="h-3 w-3" />
                          {walker.city}
                        </p>
                      )}
                    </div>
                    <div className="text-right flex-shrink-0">
                      <p className="text-xs text-muted-foreground">à partir de</p>
                      <p className="text-xl font-bold text-primary">{walker.hourly_rate || 15}€</p>
                      <p className="text-xs text-muted-foreground">par mission</p>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Rating & Reviews */}
              <div className="flex items-center gap-3 mt-3">
                <div className="flex items-center gap-1">
                  <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
                  <span className="font-bold">{walker.rating?.toFixed(1) || '5.0'}</span>
                </div>
                <span className="text-sm text-muted-foreground">
                  • {walker.total_reviews || 0} avis
                </span>
                {recurringClients > 0 && (
                  <span className="text-sm text-muted-foreground flex items-center gap-1">
                    <Repeat className="h-3 w-3" />
                    {recurringClients} Propriétaires satisfaits
                  </span>
                )}
              </div>
              
              {/* Bio excerpt */}
              {walker.bio && (
                <div className="mt-3 relative">
                  <p className="text-sm text-muted-foreground line-clamp-3 italic">
                    "{walker.bio}"
                  </p>
                  <button className="text-primary text-sm font-medium mt-1 hover:underline">
                    En savoir plus
                  </button>
                </div>
              )}
              
              {/* Match reasons */}
              {matchReasons.length > 0 && (
                <div className="flex flex-wrap gap-1.5 mt-3">
                  {matchReasons.slice(0, 3).map((reason, i) => (
                    <Badge key={i} variant="secondary" className="text-xs">
                      {reason}
                    </Badge>
                  ))}
                </div>
              )}
              
              {/* Response rate indicator */}
              <div className={`flex items-center gap-1.5 mt-3 text-sm ${
                responseRate >= 90 
                  ? 'text-green-600' 
                  : responseRate >= 70 
                    ? 'text-amber-600' 
                    : 'text-muted-foreground'
              }`}>
                <MessageCircle className="h-3.5 w-3.5" />
                <span>Taux de réponse de {responseRate}%</span>
              </div>
            </div>
          </div>
          
          {/* Footer with CTA */}
          <div className="px-6 pb-6 pt-2">
            <div className="flex gap-2">
              <Button
                variant="outline"
                className="flex-1"
                onClick={() => navigate(`/walker/${walker.user_id}`)}
              >
                Voir profil
              </Button>
              <Button 
                className="flex-1 shadow-lg"
                onClick={(e) => {
                  e.stopPropagation();
                  onBook(walker.user_id);
                }}
              >
                Réserver
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};
