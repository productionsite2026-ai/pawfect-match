import { Star, Euro, Dog, Clock } from "lucide-react";
import StatCard from "@/components/dashboard/shared/StatCard";

interface WalkerQuickStatsProps {
  monthlyEarnings: number;
  totalWalks: number;
  averageRating: number;
  totalReviews: number;
  pendingRequests: number;
}

const WalkerQuickStats = ({ 
  monthlyEarnings, 
  totalWalks, 
  averageRating, 
  totalReviews,
  pendingRequests 
}: WalkerQuickStatsProps) => {
  return (
    <div className="grid grid-cols-2 gap-3 mb-6">
      <StatCard
        icon={Euro}
        label="Gains Mensuels"
        value={`${monthlyEarnings.toLocaleString()}€`}
        sublabel="Ce mois-ci"
        variant="primary"
      />
      <StatCard
        icon={Dog}
        label="Missions"
        value={totalWalks}
        sublabel="Total effectuées"
        variant="green"
      />
      <StatCard
        icon={Star}
        label="Note Moyenne"
        value={averageRating.toFixed(1)}
        sublabel={`${totalReviews} avis`}
        variant="yellow"
      />
      <StatCard
        icon={Clock}
        label="En Attente"
        value={pendingRequests}
        sublabel="Nouvelles demandes"
        variant={pendingRequests > 0 ? 'warning' : 'muted'}
      />
    </div>
  );
};

export default WalkerQuickStats;
