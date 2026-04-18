import React from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { 
  Star, Clock, ThumbsUp, MessageCircle, 
  Trophy, Target, Zap, Award, TrendingUp
} from "lucide-react";
import { cn } from "@/lib/utils";

interface PerformanceStatsProps {
  averageRating: number;
  totalReviews: number;
  responseTime: string;
  acceptanceRate: number;
  completionRate: number;
  repeatClientRate: number;
  totalWalks: number;
  walksThisMonth: number;
  rank?: number;
  badges?: { name: string; icon: string; earned: boolean }[];
}

export const PerformanceStats: React.FC<PerformanceStatsProps> = ({
  averageRating,
  totalReviews,
  responseTime,
  acceptanceRate,
  completionRate,
  repeatClientRate,
  totalWalks,
  walksThisMonth,
  rank,
  badges = []
}) => {
  const getPerformanceLevel = () => {
    const avgScore = (acceptanceRate + completionRate + (averageRating / 5) * 100) / 3;
    if (avgScore >= 90) return { level: "Excellent", color: "text-green-500", bg: "bg-green-500" };
    if (avgScore >= 75) return { level: "Très bien", color: "text-blue-500", bg: "bg-blue-500" };
    if (avgScore >= 60) return { level: "Bien", color: "text-amber-500", bg: "bg-amber-500" };
    return { level: "À améliorer", color: "text-red-500", bg: "bg-red-500" };
  };

  const performance = getPerformanceLevel();

  const stats = [
    {
      label: "Taux d'acceptation",
      value: acceptanceRate,
      icon: ThumbsUp,
      color: "primary",
      target: 90,
      description: "Objectif: 90%"
    },
    {
      label: "Taux de complétion",
      value: completionRate,
      icon: Target,
      color: "green",
      target: 95,
      description: "Objectif: 95%"
    },
    {
      label: "Clients réguliers",
      value: repeatClientRate,
      icon: Star,
      color: "amber",
      target: 40,
      description: "Objectif: 40%"
    }
  ];

  return (
    <div className="space-y-6">
      {/* Performance Overview */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <Card className="overflow-hidden">
          <div className={cn("h-2", performance.bg)} />
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <Trophy className="h-5 w-5 text-amber-500" />
                Performance globale
              </CardTitle>
              <Badge className={cn(performance.color, "bg-opacity-10")}>
                {performance.level}
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {/* Rating */}
              <div className="text-center">
                <div className="w-16 h-16 rounded-full bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center mx-auto mb-2">
                  <div className="flex items-center">
                    <span className="text-2xl font-bold text-amber-600">
                      {averageRating > 0 ? averageRating.toFixed(1) : '-'}
                    </span>
                    <Star className="h-4 w-4 text-amber-500 fill-amber-500 ml-1" />
                  </div>
                </div>
                <p className="text-sm font-medium">Note moyenne</p>
                <p className="text-xs text-muted-foreground">{totalReviews} avis</p>
              </div>

              {/* Response Time */}
              <div className="text-center">
                <div className="w-16 h-16 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center mx-auto mb-2">
                  <Clock className="h-6 w-6 text-blue-600" />
                </div>
                <p className="text-sm font-medium">Temps de réponse</p>
                <p className="text-lg font-bold text-blue-600">{responseTime}</p>
              </div>

              {/* Total Walks */}
              <div className="text-center">
                <div className="w-16 h-16 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center mx-auto mb-2">
                  <span className="text-2xl font-bold text-green-600">{totalWalks}</span>
                </div>
                <p className="text-sm font-medium">Promenades totales</p>
                <p className="text-xs text-muted-foreground">{walksThisMonth} ce mois</p>
              </div>

              {/* Rank */}
              {rank && (
                <div className="text-center">
                  <div className="w-16 h-16 rounded-full bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center mx-auto mb-2">
                    <span className="text-2xl font-bold text-purple-600">#{rank}</span>
                  </div>
                  <p className="text-sm font-medium">Classement</p>
                  <p className="text-xs text-muted-foreground">dans votre zone</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Detailed Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {stats.map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 * (index + 1) }}
          >
            <Card className="h-full">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <stat.icon className={cn("h-5 w-5", `text-${stat.color}-500`)} />
                    <span className="font-medium">{stat.label}</span>
                  </div>
                  <span className="text-2xl font-bold">{stat.value}%</span>
                </div>
                <Progress 
                  value={stat.value} 
                  className="h-2 mb-2"
                />
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <span>{stat.description}</span>
                  {stat.value >= stat.target && (
                    <Badge variant="outline" className="text-green-600 border-green-200">
                      <Zap className="h-3 w-3 mr-1" />
                      Objectif atteint
                    </Badge>
                  )}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Badges Section */}
      {badges.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Award className="h-5 w-5 text-primary" />
                Badges & Récompenses
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-4">
                {badges.map((badge, index) => (
                  <motion.div
                    key={badge.name}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.1 * index }}
                    className={cn(
                      "flex flex-col items-center p-4 rounded-lg border-2",
                      badge.earned 
                        ? "border-primary bg-primary/5" 
                        : "border-dashed border-muted opacity-50"
                    )}
                  >
                    <div className={cn(
                      "w-12 h-12 rounded-full flex items-center justify-center mb-2",
                      badge.earned ? "bg-primary/20" : "bg-muted"
                    )}>
                      <span className="text-2xl">{badge.icon}</span>
                    </div>
                    <span className="text-sm font-medium text-center">{badge.name}</span>
                    {!badge.earned && (
                      <span className="text-xs text-muted-foreground mt-1">Non obtenu</span>
                    )}
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}

      {/* Tips Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
      >
        <Card className="bg-gradient-to-br from-primary/5 to-accent/5 border-primary/20">
          <CardContent className="pt-6">
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0">
                <TrendingUp className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h4 className="font-semibold mb-1">Conseils pour améliorer vos stats</h4>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• Répondez aux demandes dans l'heure pour un meilleur classement</li>
                  <li>• Envoyez des photos pendant chaque promenade pour rassurer les Propriétaires</li>
                  <li>• Soyez ponctuel et respectez les horaires convenus</li>
                  <li>• Demandez un avis à la fin de chaque service</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};

export default PerformanceStats;
