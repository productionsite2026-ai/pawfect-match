import { SEOHead } from "@/components/seo/SEOHead";
import walkerHeroImg from "@/assets/walker-hero.jpg";
import avatarWalker from "@/assets/avatar-walker.jpg";
import dogGolden from "@/assets/dog-golden.jpg";
import DogCard from "@/components/dashboard-v2/DogCard";
import BottomNav from "@/components/dashboard-v2/BottomNav";
import DashboardHeader from "@/components/dashboard-v2/DashboardHeader";
import WeatherWidget from "@/components/dashboard-v2/WeatherWidget";
import QuickActions from "@/components/dashboard-v2/QuickActions";
import NearbyWalkerCard from "@/components/dashboard-v2/NearbyWalkerCard";
import UpcomingBookings from "@/components/dashboard-v2/UpcomingBookings";
import FavoritesTab from "@/components/dashboard-v2/tabs/FavoritesTab";
import ReferralTab from "@/components/dashboard/owner/ReferralTab";
import ReviewsTab from "@/components/dashboard-v2/tabs/ReviewsTab";
import ProfileTab from "@/components/dashboard-v2/tabs/ProfileTab";
import BookingsTab from "@/components/dashboard-v2/tabs/BookingsTab";
import DogsTab from "@/components/dashboard-v2/tabs/DogsTab";
import MessagesTab from "@/components/dashboard-v2/tabs/MessagesTab";
import { CheckCircle2, TrendingUp, Plus } from "lucide-react";
import { motion } from "framer-motion";
import { useAuth } from "@/contexts/AuthContext";
import { useProfile } from "@/hooks/useProfile";
import { useDogs, useAddDog } from "@/hooks/useNewDogs";
import { useBookings } from "@/hooks/useNewBookings";
import { useNearbyWalkers } from "@/hooks/useNearbyWalkers";
import { useState } from "react";
import { toast } from "sonner";
import { useNavigate, useSearchParams } from "react-router-dom";
import { mockDogs, mockBookings, mockNearbyWalkers, mockProfile, mockUpcomingBookings } from "@/data/demoData";

const OwnerDashboard = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const activeTab = searchParams.get("tab") || "home";
  const { user } = useAuth();
  const { data: profile } = useProfile();
  const { data: realDogs = [], isLoading: dogsLoading } = useDogs();
  const { data: realBookings = [] } = useBookings("owner");
  const { data: realWalkers = [] } = useNearbyWalkers();
  const addDog = useAddDog();
  const [showAddDog, setShowAddDog] = useState(false);
  const [newDogName, setNewDogName] = useState("");
  const [newDogBreed, setNewDogBreed] = useState("");

  const isDemo = !user;
  const dogs = isDemo ? mockDogs : realDogs;
  const bookings = isDemo ? mockBookings : realBookings;
  const nearbyWalkers = isDemo ? mockNearbyWalkers : realWalkers;
  const displayProfile = isDemo ? mockProfile : profile;
  const displayName = displayProfile?.first_name || "Propriétaire";

  const activeMission = isDemo ? null : bookings.find((b: any) => b.status === "in_progress");
  const activeMissionData = activeMission ? {
    id: (activeMission as any).id,
    dogName: (activeMission as any).dogs?.name || "Chien",
    dogPhoto: (activeMission as any).dogs?.photo_url || undefined,
    ownerName: displayName,
    duration: (activeMission as any).duration_minutes || 30,
    status: "in_progress",
  } : null;

  const upcomingBookings = isDemo
    ? mockUpcomingBookings
    : bookings
        .filter((b: any) => b.status === "confirmed" || b.status === "pending")
        .slice(0, 3)
        .map((b: any) => ({
          id: b.id,
          dogName: b.dogs?.name || "Chien",
          date: b.scheduled_date,
          time: b.scheduled_time,
          duration: `${b.duration_minutes || 30} min`,
          status: (b.status === "confirmed" ? "confirmée" : "en_attente") as "confirmée" | "en_attente",
        }));

  const handleAddDog = async () => {
    if (!user) return toast.error("Connectez-vous pour ajouter un chien");
    if (!newDogName.trim()) return toast.error("Nom du chien requis");
    try {
      await addDog.mutateAsync({ name: newDogName, breed: newDogBreed || null });
      toast.success(`${newDogName} ajouté !`);
      setNewDogName(""); setNewDogBreed(""); setShowAddDog(false);
    } catch { toast.error("Erreur lors de l'ajout"); }
  };

  const completedBookings = bookings.filter((b: any) => b.status === "completed").length;

  if (activeTab === "favoris") return (<div className="min-h-screen bg-background max-w-lg mx-auto"><FavoritesTab /><BottomNav role="owner" activeMission={activeMissionData} /></div>);
  if (activeTab === "profil") return (<div className="min-h-screen bg-background max-w-lg mx-auto"><ProfileTab role="owner" /><BottomNav role="owner" activeMission={activeMissionData} /></div>);
  if (activeTab === "reservations") return (<div className="min-h-screen bg-background max-w-lg mx-auto"><BookingsTab role="owner" /><BottomNav role="owner" activeMission={activeMissionData} /></div>);
  if (activeTab === "chiens") return (<div className="min-h-screen bg-background max-w-lg mx-auto"><DogsTab /><BottomNav role="owner" activeMission={activeMissionData} /></div>);
  if (activeTab === "messages") return (<div className="min-h-screen bg-background max-w-lg mx-auto"><MessagesTab /><BottomNav role="owner" activeMission={activeMissionData} /></div>);
  if (activeTab === "parrainage") return (<div className="min-h-screen bg-background max-w-lg mx-auto p-4"><ReferralTab /><BottomNav role="owner" activeMission={activeMissionData} /></div>);
  if (activeTab === "avis") return (<div className="min-h-screen bg-background max-w-lg mx-auto"><ReviewsTab /><BottomNav role="owner" activeMission={activeMissionData} /></div>);

  return (
    <div className="min-h-screen bg-background pb-24 max-w-lg mx-auto">
      <SEOHead title="Mon Espace Propriétaire | DogWalking" description="Gérez vos réservations, vos animaux et vos Accompagnateurs Certifiés depuis votre tableau de bord DogWalking." canonical="https://dogwalking.fr/dashboard" noindex={true} />
      {isDemo && (
        <div className="bg-amber-500/10 border-b border-amber-500/20 px-4 py-2 text-center">
          <span className="text-xs font-bold text-amber-600">🎭 Mode Démo — Connectez-vous pour vos vraies données</span>
        </div>
      )}

      <div className="relative">
        <DashboardHeader title="🐾 Espace Propriétaire" role="owner" notificationCount={bookings.filter((b: any) => b.status === "pending").length} />
        <div className="w-full h-56 bg-gradient-to-br from-[hsl(200,80%,35%)] to-[hsl(220,60%,40%)] flex items-end">
          <div className="w-full h-full relative overflow-hidden">
            <img src={walkerHeroImg} alt="Mes chiens" className="w-full h-full object-cover opacity-30" width={800} height={512} />
          </div>
        </div>
        <div className="absolute bottom-0 left-0 right-0 translate-y-1/2 px-4">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            className="bg-card rounded-2xl shadow-elevated p-4 flex items-center gap-4">
            <div className="relative">
              <img src={displayProfile?.avatar_url || avatarWalker} alt={displayName} className="w-16 h-16 rounded-full object-cover ring-4 ring-accent/20" />
              <div className="absolute -bottom-0.5 -right-0.5 w-5 h-5 rounded-full bg-accent border-2 border-card flex items-center justify-center">
                <span className="text-[8px] text-white">🐾</span>
              </div>
            </div>
            <div>
              <h1 className="text-xl font-black text-foreground">{displayName}</h1>
              <p className="text-sm text-muted-foreground font-semibold">Propriétaire de {dogs.length} animal{dogs.length > 1 ? "s" : ""} (Vérifié)</p>
            </div>
          </motion.div>
        </div>
      </div>

      <div className="px-4 mt-14 space-y-4">
        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
          className="bg-accent/10 border border-accent/20 text-accent rounded-2xl p-3.5 flex items-center justify-center gap-2 font-bold">
          <CheckCircle2 className="w-5 h-5" />
          {displayProfile?.bio ? "Profil Complet 100%" : "Complétez votre profil"}
        </motion.div>

        <QuickActions role="owner" />

        <div className="space-y-2">
          <div className="flex items-center justify-between px-1">
            <h3 className="font-bold text-foreground">🐕 Mes Animaux (Vérifiés)</h3>
            <button onClick={() => setShowAddDog(!showAddDog)} className="text-accent text-xs font-bold flex items-center gap-1">
              <Plus className="w-3.5 h-3.5" /> Ajouter
            </button>
          </div>
          {showAddDog && (
            <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }}
              className="bg-card rounded-2xl shadow-card p-4 space-y-2">
              <input value={newDogName} onChange={e => setNewDogName(e.target.value)} placeholder="Nom du chien"
                className="w-full px-3 py-2 rounded-xl bg-muted text-sm focus:outline-none focus:ring-2 focus:ring-accent/30" />
              <input value={newDogBreed} onChange={e => setNewDogBreed(e.target.value)} placeholder="Race (optionnel)"
                className="w-full px-3 py-2 rounded-xl bg-muted text-sm focus:outline-none focus:ring-2 focus:ring-accent/30" />
              <div className="flex gap-2">
                <button onClick={() => setShowAddDog(false)} className="flex-1 py-2 rounded-xl border border-border text-sm font-bold">Annuler</button>
                <button onClick={handleAddDog} disabled={addDog.isPending}
                  className="flex-1 py-2 rounded-xl bg-accent text-white text-sm font-bold disabled:opacity-50">
                  {addDog.isPending ? "..." : "Ajouter"}
                </button>
              </div>
            </motion.div>
          )}
          <div className="grid grid-cols-2 gap-3">
            {!isDemo && dogsLoading && <div className="col-span-2 text-center text-muted-foreground text-sm py-4">Chargement...</div>}
            {dogs.map((dog: any) => (
              <DogCard key={dog.id} name={dog.name} breed={dog.breed || "Race inconnue"} image={dog.photo_url || dogGolden} emoji="🐕" status="Actif" />
            ))}
          </div>
        </div>

        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="bg-card rounded-2xl shadow-card p-4">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-bold text-foreground">📊 Activité</h3>
            <div className="flex items-center gap-1 px-2 py-1 rounded-full bg-accent/10 text-accent text-xs font-bold">
              <TrendingUp className="w-3.5 h-3.5" /> Cette semaine
            </div>
          </div>
          <div className="grid grid-cols-3 gap-2">
            {[
              { value: isDemo ? "12" : String(completedBookings), label: "Missions" },
              { value: `${dogs.length}`, label: "Chiens" },
              { value: String(upcomingBookings.length), label: "À venir" },
            ].map((s) => (
              <div key={s.label} className="bg-muted/50 rounded-xl p-3 flex flex-col items-center gap-1">
                <span className="text-lg font-black text-foreground">{s.value}</span>
                <span className="text-[9px] text-muted-foreground font-semibold">{s.label}</span>
              </div>
            ))}
          </div>
        </motion.div>

        <WeatherWidget temp={18} condition="sunny" recommendation="Parfait pour sortir vos animaux !" />

        <UpcomingBookings bookings={upcomingBookings} />

        <div className="space-y-2.5">
          <h3 className="font-bold text-foreground px-1">🏃 Accompagnateurs Certifiés à proximité</h3>
          {nearbyWalkers.slice(0, 3).map((w: any) => (
            <NearbyWalkerCard
              key={w.id}
              name={`${w.profiles?.first_name || "Accompagnateur"} ${(w.profiles?.last_name || "")[0] || ""}.`}
              rating={Number(w.rating || 0)}
              reviews={w.total_reviews || 0}
              distance="~2 km"
              price={`${w.hourly_rate || 15}€`}
              avatar={w.profiles?.avatar_url || undefined}
              badges={w.verified ? ["Certifié"] : []}
            />
          ))}
        </div>

        <motion.button whileTap={{ scale: 0.97 }} onClick={() => navigate("/walkers")}
          className="w-full py-4 rounded-2xl bg-accent text-white font-black text-lg shadow-glow-primary hover:opacity-90 transition-opacity">
          🐕 Réserver un Accompagnateur Certifié
        </motion.button>
      </div>

      <BottomNav role="owner" activeMission={activeMissionData} />
    </div>
  );
};

export default OwnerDashboard;
