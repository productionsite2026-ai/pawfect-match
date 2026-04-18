import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { motion } from "framer-motion";
import { format } from "date-fns";
import WeekCalendar from "./WeekCalendar";
import TodayMissions from "./TodayMissions";
import WalkerProfileHeader from "./WalkerProfileHeader";
import WalkerQuickStats from "./WalkerQuickStats";
import BadgesDisplay from "./BadgesDisplay";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Award } from "lucide-react";

interface OverviewTabProps {
  stats: { 
    monthlyEarnings: number; 
    pendingEarnings: number; 
    totalWalks: number; 
    completedThisMonth: number; 
    averageRating: number; 
    totalReviews: number; 
    pendingRequests: number; 
    upcomingMissions: number; 
  };
  walkerProfile: any;
  onNavigate: (tab: string) => void;
}

const WalkerOverviewTab = ({ stats, walkerProfile, onNavigate }: OverviewTabProps) => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [missions, setMissions] = useState<any[]>([]);
  const [missionsByDate, setMissionsByDate] = useState<Map<string, number>>(new Map());
  const [profile, setProfile] = useState<any>(null);

  useEffect(() => { 
    fetchData();
  }, [selectedDate]);

  const fetchData = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) return;

    // Fetch profile info
    const { data: profileData } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', session.user.id)
      .single();
    
    setProfile(profileData);

    // Fetch bookings
    const { data: bookings } = await supabase
      .from('bookings')
      .select('*, dogs(name, breed, photo_url)')
      .eq('walker_id', session.user.id)
      .in('status', ['confirmed', 'in_progress'])
      .order('scheduled_date', { ascending: true });
    
    if (bookings) {
      // Count missions by date
      const countMap = new Map<string, number>();
      bookings.forEach(b => {
        const dateKey = b.scheduled_date;
        countMap.set(dateKey, (countMap.get(dateKey) || 0) + 1);
      });
      setMissionsByDate(countMap);

      // Get owners info
      const ownerIds = [...new Set(bookings.map(b => b.owner_id))];
      const { data: owners } = await supabase
        .from('profiles')
        .select('id, first_name, avatar_url')
        .in('id', ownerIds);
      
      const ownerMap = new Map(owners?.map(o => [o.id, o]) || []);
      
      // Filter missions for selected date
      const selectedDateStr = format(selectedDate, 'yyyy-MM-dd');
      const todayMissions = bookings
        .filter(b => b.scheduled_date === selectedDateStr)
        .map(b => ({
          id: b.id,
          startTime: b.scheduled_time?.slice(0, 5) || '09:00',
          endTime: calculateEndTime(b.scheduled_time, b.duration_minutes),
          dogName: b.dogs?.name || 'Animal',
          serviceType: b.service_type,
          ownerName: ownerMap.get(b.owner_id)?.first_name || 'Propriétaire',
          ownerPhoto: ownerMap.get(b.owner_id)?.avatar_url,
          address: b.address || 'Adresse non spécifiée',
          status: b.status,
          walker_id: session.user.id,
          duration_minutes: b.duration_minutes || 60,
          started_at: b.status === 'in_progress' ? b.updated_at : undefined
        }));
      
      setMissions(todayMissions);
    }
  };

  const calculateEndTime = (startTime: string | null, duration: number | null) => {
    if (!startTime) return '10:00';
    const [hours, minutes] = startTime.split(':').map(Number);
    const totalMinutes = hours * 60 + minutes + (duration || 60);
    const endHours = Math.floor(totalMinutes / 60);
    const endMinutes = totalMinutes % 60;
    return `${String(endHours).padStart(2, '0')}:${String(endMinutes).padStart(2, '0')}`;
  };

  const handleStartMission = async (missionId: string) => {
    // Navigate to mission start flow
    onNavigate('missions');
  };

  const profileCompletion = () => {
    if (!walkerProfile) return 0;
    let score = 0;
    if (profile?.first_name) score += 20;
    if (profile?.avatar_url) score += 20;
    if (walkerProfile.services?.length > 0) score += 20;
    if (walkerProfile.hourly_rate) score += 20;
    if (walkerProfile.verified) score += 20;
    return score;
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-4"
    >
      {/* En-tête profil avec progression */}
      <WalkerProfileHeader
        name={profile?.first_name || 'Accompagnateur'}
        photoUrl={profile?.avatar_url}
        profileCompletion={profileCompletion()}
        isVerified={walkerProfile?.verified}
        isExpert={stats.totalWalks >= 50}
      />

      {/* Stats rapides */}
      <WalkerQuickStats
        monthlyEarnings={stats.monthlyEarnings}
        totalWalks={stats.totalWalks}
        averageRating={stats.averageRating || 5}
        totalReviews={stats.totalReviews}
        pendingRequests={stats.pendingRequests}
      />

      {/* Badges de certification */}
      <Card className="shadow-lg">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg flex items-center gap-2">
            <Award className="h-5 w-5 text-amber-500" />
            Mes Badges
          </CardTitle>
        </CardHeader>
        <CardContent>
          <BadgesDisplay
            totalWalks={stats.totalWalks}
            averageRating={stats.averageRating}
            isVerified={walkerProfile?.verified || false}
            totalReviews={stats.totalReviews}
          />
        </CardContent>
      </Card>

      {/* Calendrier semaine */}
      <WeekCalendar
        selectedDate={selectedDate}
        onDateSelect={setSelectedDate}
        missionsByDate={missionsByDate}
      />

      {/* Missions du jour */}
      <TodayMissions
        missions={missions}
        onStartMission={handleStartMission}
        selectedDate={selectedDate}
        onRefresh={fetchData}
      />
    </motion.div>
  );
};

export default WalkerOverviewTab;
