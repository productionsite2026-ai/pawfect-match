import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { motion } from "framer-motion";
import QuickSearchBar from "./QuickSearchBar";
import RecommendedWalkers from "./RecommendedWalkers";
import ReferralBanner from "./ReferralBanner";
import MyPets from "./MyPets";
import ActiveWalk from "./ActiveWalk";
import UpcomingBookingsWidget from "./UpcomingBookingsWidget";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar, Dog, Euro, Heart, TrendingUp } from "lucide-react";

interface OverviewTabProps {
  stats: {
    totalBookings: number;
    upcomingBookings: number;
    completedBookings: number;
    totalDogs: number;
    totalSpent: number;
    totalFavorites: number;
    unreadNotifications: number;
    unreadMessages: number;
  };
  profile: any;
  onNavigate: (tab: string) => void;
}

const OverviewTab = ({ stats, profile, onNavigate }: OverviewTabProps) => {
  const [dogs, setDogs] = useState<any[]>([]);
  const [walkers, setWalkers] = useState<any[]>([]);
  const [activeBooking, setActiveBooking] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) return;

    const [dogsRes, walkersRes, bookingsRes] = await Promise.all([
      supabase.from('dogs').select('*').eq('owner_id', session.user.id).limit(5),
      supabase.from('walker_profiles')
        .select('*')
        .eq('verified', true)
        .order('rating', { ascending: false })
        .limit(4),
      supabase.from('bookings')
        .select('*, dogs(name, photo_url)')
        .eq('owner_id', session.user.id)
        .eq('status', 'in_progress')
        .limit(1)
    ]);

    setDogs(dogsRes.data?.map(d => ({
      id: d.id,
      name: d.name,
      photoUrl: d.photo_url
    })) || []);

    // Fetch profiles for walkers
    if (walkersRes.data && walkersRes.data.length > 0) {
      const walkerUserIds = walkersRes.data.map(w => w.user_id);
      const { data: profilesData } = await supabase
        .from('profiles')
        .select('id, first_name, avatar_url, city')
        .in('id', walkerUserIds);
      
      const profileMap = new Map(profilesData?.map(p => [p.id, p]) || []);
      
      setWalkers(walkersRes.data.map(w => {
        const profile = profileMap.get(w.user_id);
        return {
          id: w.user_id,
          name: profile?.first_name || 'Accompagnateur',
          photoUrl: profile?.avatar_url,
          rating: w.rating || 5.0,
          verified: w.verified,
          city: profile?.city
        };
      }));
    }

    if (bookingsRes.data?.[0]) {
      setActiveBooking(bookingsRes.data[0]);
    }

    setLoading(false);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <motion.div 
          className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full"
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
        />
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-6"
    >
      {/* Stats rapides */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <Card className="shadow-sm hover:shadow-md transition-shadow">
          <CardContent className="pt-4 pb-3 px-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl font-bold">{stats.totalBookings}</p>
                <p className="text-xs text-muted-foreground">Réservations</p>
              </div>
              <Calendar className="h-8 w-8 text-primary/20" />
            </div>
          </CardContent>
        </Card>
        <Card className="shadow-sm hover:shadow-md transition-shadow">
          <CardContent className="pt-4 pb-3 px-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl font-bold">{stats.totalDogs}</p>
                <p className="text-xs text-muted-foreground">Animaux</p>
              </div>
              <Dog className="h-8 w-8 text-primary/20" />
            </div>
          </CardContent>
        </Card>
        <Card className="shadow-sm hover:shadow-md transition-shadow">
          <CardContent className="pt-4 pb-3 px-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl font-bold">{stats.totalSpent.toFixed(0)}€</p>
                <p className="text-xs text-muted-foreground">Dépensé</p>
              </div>
              <Euro className="h-8 w-8 text-primary/20" />
            </div>
          </CardContent>
        </Card>
        <Card className="shadow-sm hover:shadow-md transition-shadow">
          <CardContent className="pt-4 pb-3 px-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl font-bold">{stats.totalFavorites}</p>
                <p className="text-xs text-muted-foreground">Favoris</p>
              </div>
              <Heart className="h-8 w-8 text-heart/20 fill-heart/10" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Barre de recherche rapide */}
      <QuickSearchBar />

      {/* Accompagnement en cours (si active) */}
      {activeBooking && (
        <ActiveWalk
          dogName={activeBooking.dogs?.name || 'Votre animal'}
          dogPhoto={activeBooking.dogs?.photo_url}
          walkerName="Accompagnateur"
          duration={18}
          distance={1.2}
          speed={3.8}
        />
      )}

      {/* Prochaines réservations */}
      <UpcomingBookingsWidget 
        limit={3} 
        onViewAll={() => onNavigate('reservations')} 
      />

      {/* Accompagnateurs recommandés */}
      <RecommendedWalkers walkers={walkers} />

      {/* Mes animaux */}
      <MyPets 
        pets={dogs}
        onAddPet={() => onNavigate('animaux')}
        onViewAll={() => onNavigate('animaux')}
      />

      {/* Bannière parrainage */}
      <ReferralBanner onNavigate={() => onNavigate('parrainage')} />
    </motion.div>
  );
};

export default OverviewTab;
