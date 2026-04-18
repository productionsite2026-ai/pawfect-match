import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { BarChart3, Star, TrendingUp, Clock, CheckCircle, Users, Award } from 'lucide-react';
import { motion } from "framer-motion";
import { PerformanceStats } from "@/components/dashboard/PerformanceStats";

interface PerformanceTabProps {
  stats: { averageRating: number; totalReviews: number; totalWalks: number; completedThisMonth?: number; completedThisWeek?: number; };
}

const WalkerPerformanceTab = ({ stats }: PerformanceTabProps) => {
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <div className="mb-6">
        <h2 className="text-2xl font-bold flex items-center gap-2"><BarChart3 className="h-6 w-6 text-primary" />Performance & Avis</h2>
      </div>

      <PerformanceStats
        averageRating={stats.averageRating}
        totalReviews={stats.totalReviews}
        responseTime="< 1h"
        acceptanceRate={95}
        completionRate={98}
        repeatClientRate={35}
        totalWalks={stats.totalWalks}
        walksThisMonth={stats.completedThisMonth || stats.completedThisWeek || 0}
        badges={[]}
      />

      {/* KPIs */}
      <div className="grid md:grid-cols-4 gap-4 mt-8">
        <Card>
          <CardContent className="pt-6 text-center">
            <Star className="h-8 w-8 mx-auto mb-2 text-amber-500" />
            <p className="text-3xl font-bold">{stats.averageRating > 0 ? stats.averageRating.toFixed(1) : '-'}</p>
            <p className="text-sm text-muted-foreground">Note moyenne</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6 text-center">
            <TrendingUp className="h-8 w-8 mx-auto mb-2 text-green-600" />
            <p className="text-3xl font-bold">95%</p>
            <p className="text-sm text-muted-foreground">Taux acceptation</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6 text-center">
            <Clock className="h-8 w-8 mx-auto mb-2 text-blue-600" />
            <p className="text-3xl font-bold">{"< 1h"}</p>
            <p className="text-sm text-muted-foreground">Temps réponse</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6 text-center">
            <Users className="h-8 w-8 mx-auto mb-2 text-purple-600" />
            <p className="text-3xl font-bold">35%</p>
            <p className="text-sm text-muted-foreground">Clients fidèles</p>
          </CardContent>
        </Card>
      </div>
    </motion.div>
  );
};

export default WalkerPerformanceTab;
