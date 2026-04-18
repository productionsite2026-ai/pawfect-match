import { Badge } from "@/components/ui/badge";
import { 
  Shield, Star, Clock, Award, Heart, Zap, ThumbsUp, CheckCircle 
} from 'lucide-react';
import { motion } from "framer-motion";

interface BadgeData {
  id: string;
  name: string;
  icon: any;
  color: string;
  bgColor: string;
  earned: boolean;
  description?: string;
}

interface BadgesDisplayProps {
  totalWalks: number;
  averageRating: number;
  isVerified: boolean;
  totalReviews: number;
  onTime?: number; // Percentage of on-time arrivals
  acceptanceRate?: number; // Percentage of accepted requests
}

const BadgesDisplay = ({ 
  totalWalks, 
  averageRating, 
  isVerified, 
  totalReviews,
  onTime = 100,
  acceptanceRate = 100 
}: BadgesDisplayProps) => {
  
  const badges: BadgeData[] = [
    {
      id: 'verified',
      name: 'Vérifié',
      icon: Shield,
      color: 'text-green-600',
      bgColor: 'bg-green-100 dark:bg-green-900/30',
      earned: isVerified,
      description: 'Identité vérifiée par DogWalking'
    },
    {
      id: 'expert',
      name: 'Expert',
      icon: Award,
      color: 'text-amber-600',
      bgColor: 'bg-amber-100 dark:bg-amber-900/30',
      earned: totalWalks >= 50,
      description: 'Plus de 50 promenades réalisées'
    },
    {
      id: 'top-rated',
      name: 'Top Noté',
      icon: Star,
      color: 'text-yellow-600',
      bgColor: 'bg-yellow-100 dark:bg-yellow-900/30',
      earned: averageRating >= 4.8 && totalReviews >= 10,
      description: 'Note moyenne ≥ 4.8 avec 10+ avis'
    },
    {
      id: 'punctual',
      name: 'Ponctuel',
      icon: Clock,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100 dark:bg-blue-900/30',
      earned: onTime >= 95 && totalWalks >= 10,
      description: '95%+ d\'arrivées à l\'heure'
    },
    {
      id: 'reliable',
      name: 'Fiable',
      icon: ThumbsUp,
      color: 'text-purple-600',
      bgColor: 'bg-purple-100 dark:bg-purple-900/30',
      earned: acceptanceRate >= 90 && totalWalks >= 20,
      description: '90%+ de missions acceptées'
    },
    {
      id: 'loved',
      name: 'Adoré',
      icon: Heart,
      color: 'text-heart',
      bgColor: 'bg-heart/10',
      earned: totalReviews >= 25,
      description: '25+ avis positifs reçus'
    },
    {
      id: 'rising',
      name: 'En Essor',
      icon: Zap,
      color: 'text-orange-600',
      bgColor: 'bg-orange-100 dark:bg-orange-900/30',
      earned: totalWalks >= 10 && totalWalks < 50,
      description: 'Nouveau promeneur prometteur'
    },
    {
      id: 'complete',
      name: 'Profil Complet',
      icon: CheckCircle,
      color: 'text-emerald-600',
      bgColor: 'bg-emerald-100 dark:bg-emerald-900/30',
      earned: isVerified, // Would need more profile checks
      description: 'Profil 100% complété'
    }
  ];

  const earnedBadges = badges.filter(b => b.earned);
  const unearnedBadges = badges.filter(b => !b.earned);

  if (earnedBadges.length === 0) {
    return (
      <div className="text-center py-4 text-muted-foreground text-sm">
        Complétez des missions pour débloquer vos premiers badges !
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Earned badges */}
      <div className="flex flex-wrap gap-2">
        {earnedBadges.map((badge, index) => {
          const Icon = badge.icon;
          return (
            <motion.div
              key={badge.id}
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: index * 0.1, type: "spring" }}
            >
              <Badge 
                variant="outline" 
                className={`${badge.bgColor} ${badge.color} border-transparent gap-1.5 py-1.5 px-3 cursor-help`}
                title={badge.description}
              >
                <Icon className="h-3.5 w-3.5" />
                {badge.name}
              </Badge>
            </motion.div>
          );
        })}
      </div>

      {/* Progress to next badges */}
      {unearnedBadges.length > 0 && (
        <div className="pt-2 border-t">
          <p className="text-xs text-muted-foreground mb-2">Prochains badges à débloquer :</p>
          <div className="flex flex-wrap gap-2">
            {unearnedBadges.slice(0, 3).map((badge) => {
              const Icon = badge.icon;
              return (
                <Badge 
                  key={badge.id}
                  variant="outline" 
                  className="bg-muted/50 text-muted-foreground gap-1.5 py-1 px-2 opacity-60 cursor-help"
                  title={badge.description}
                >
                  <Icon className="h-3 w-3" />
                  {badge.name}
                </Badge>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default BadgesDisplay;
