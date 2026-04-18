import { useState } from "react";
import { Star, Heart, CheckCircle, MapPin, Clock, Shield, List, MapIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

const walkers = [
  { id: 1, name: "Albane & Lisa R.", rating: 5.0, reviews: 65, price: 24, location: "Quiberon, 56170", badge: "Accompagnateur Star", recurring: 16, responseRate: 96, responseTime: "< 30 min", bio: "Passionnées par les Animaux depuis toujours", available: true, experience: "5 ans", verified: true, bookings: 142 },
  { id: 2, name: "Bruno J.", rating: 4.8, reviews: 48, price: 20, location: "Erdeven, 56410", badge: null, recurring: 9, responseRate: 80, responseTime: "< 1h", bio: "Amoureux des Animaux, grand jardin clôturé", available: true, experience: "3 ans", verified: true, bookings: 87 },
  { id: 3, name: "Laurian C.", rating: 5.0, reviews: 24, price: 20, location: "Landaul, 56690", badge: "Accompagnateur Star", recurring: 3, responseRate: 100, responseTime: "< 15 min", bio: "Éducateur canin de formation", available: false, experience: "8 ans", verified: true, bookings: 56 },
  { id: 4, name: "Chloé H.", rating: 5.0, reviews: 12, price: 18, location: "Quiberon, 56170", badge: null, recurring: 0, responseRate: 95, responseTime: "< 2h", bio: "24 ans d'expérience avec les Animaux", available: true, experience: "24 ans", verified: false, bookings: 23 },
  { id: 5, name: "Marina D.", rating: 4.9, reviews: 31, price: 16, location: "Auray, 56400", badge: null, recurring: 2, responseRate: 100, responseTime: "< 30 min", bio: "Bienveillance et adaptabilité", available: true, experience: "2 ans", verified: true, bookings: 45 },
  { id: 6, name: "Wanda T.", rating: 5.0, reviews: 2, price: 18, location: "Pluneret, 56400", badge: null, recurring: 0, responseRate: 100, responseTime: "< 1h", bio: "Amoureuse des Animaux, maison familiale", available: false, experience: "1 an", verified: false, bookings: 4 },
];

const SortOptions = ["Pertinence", "Prix ↑", "Prix ↓", "Note", "Distance"] as const;

const CardSkeleton = () => (
  <div className="bg-card rounded-xl border border-border p-4 animate-pulse">
    <div className="flex gap-4">
      <div className="w-[72px] h-[72px] rounded-xl bg-muted" />
      <div className="flex-1 space-y-3">
        <div className="h-4 bg-muted rounded w-1/3" />
        <div className="h-3 bg-muted rounded w-1/4" />
        <div className="flex gap-2"><div className="h-5 bg-muted rounded-full w-16" /><div className="h-5 bg-muted rounded-full w-20" /></div>
        <div className="h-8 bg-muted rounded-lg w-28" />
      </div>
    </div>
  </div>
);

const AccompagnateurCertifiesListe = () => {
  const navigate = useNavigate();
  const [filter, setFilter] = useState("tous");
  const [sort, setSort] = useState("Pertinence");
  const [favorites, setFavorites] = useState<number[]>([]);
  const [viewMode, setViewMode] = useState<"list" | "map">("list");
  const [loading, setLoading] = useState(false);

  const filtered = walkers.filter((w) => {
    if (filter === "star") return w.badge === "Accompagnateur Star";
    if (filter === "dispo") return w.available;
    return true;
  });

  const sorted = [...filtered].sort((a, b) => {
    if (sort === "Prix ↑") return a.price - b.price;
    if (sort === "Prix ↓") return b.price - a.price;
    if (sort === "Note") return b.rating - a.rating;
    return 0;
  });

  const toggleFav = (id: number) =>
    setFavorites((prev) => prev.includes(id) ? prev.filter((f) => f !== id) : [...prev, id]);

  const handleFilterChange = (key: string) => {
    setLoading(true);
    setFilter(key);
    setTimeout(() => setLoading(false), 400);
  };

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
        <div>
          <h2 className="text-lg font-extrabold text-foreground">Accompagnateurs Certifiés disponibles</h2>
          <p className="text-sm text-foreground/70 font-medium">
            <span className="font-bold text-primary">{sorted.length}</span> Accompagnateur{sorted.length > 1 ? "s" : ""} Certifié{sorted.length > 1 ? "s" : ""} trouvé{sorted.length > 1 ? "s" : ""} près de chez vous
          </p>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex bg-background border border-border rounded-lg p-0.5">
            <button onClick={() => setViewMode("list")}
              className={cn("p-1.5 rounded-md transition-all", viewMode === "list" ? "bg-primary text-primary-foreground" : "text-foreground/50 hover:text-foreground")}>
              <List className="h-4 w-4" />
            </button>
            <button onClick={() => setViewMode("map")}
              className={cn("p-1.5 rounded-md transition-all", viewMode === "map" ? "bg-primary text-primary-foreground" : "text-foreground/50 hover:text-foreground")}>
              <MapIcon className="h-4 w-4" />
            </button>
          </div>
          <select value={sort} onChange={(e) => setSort(e.target.value)}
            className="text-xs border border-border rounded-lg px-3 py-2 bg-card text-foreground font-semibold focus:border-primary focus:outline-none">
            {SortOptions.map((s) => (<option key={s} value={s}>Trier : {s}</option>))}
          </select>
        </div>
      </div>

      <div className="flex gap-2 mb-5">
        {[
          { key: "tous", label: "Tous" },
          { key: "star", label: "⭐ Accompagnateur Star" },
          { key: "dispo", label: "🟢 Disponibles" },
        ].map((f) => (
          <button key={f.key} onClick={() => handleFilterChange(f.key)}
            className={cn("px-3 py-1.5 rounded-lg text-xs font-bold transition-all border",
              filter === f.key ? "bg-accent border-accent text-primary-foreground" : "border-border text-foreground/70 hover:text-foreground hover:border-foreground/30"
            )}>{f.label}</button>
        ))}
      </div>

      {viewMode === "map" && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="bg-muted rounded-xl border border-border h-80 flex items-center justify-center mb-5">
          <div className="text-center">
            <MapIcon className="h-10 w-10 text-foreground/20 mx-auto mb-2" />
            <p className="text-sm font-bold text-foreground/40">Vue carte bientôt disponible</p>
          </div>
        </motion.div>
      )}

      {viewMode === "list" && (
        <>
          {loading ? (
            <div className="space-y-3">{[1, 2, 3].map((i) => <CardSkeleton key={i} />)}</div>
          ) : sorted.length === 0 ? (
            <div className="text-center py-12 bg-secondary/30 rounded-xl border border-border">
              <p className="text-lg font-bold text-foreground mb-2">Aucun résultat trouvé 😕</p>
              <p className="text-sm text-foreground/60 mb-4">Essayez de modifier vos filtres</p>
              <button onClick={() => { setFilter("tous"); setSort("Pertinence"); }} className="text-sm font-bold text-accent hover:underline">Réinitialiser les filtres</button>
            </div>
          ) : (
            <div className="space-y-3">
              {sorted.map((walker, i) => {
                const isTopProfile = walker.rating >= 4.9 && walker.reviews >= 20;
                return (
                  <motion.div key={walker.id} initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: i * 0.05 }}
                    onClick={() => navigate(`/walker/${walker.id}`)}
                    className={cn("bg-card rounded-xl border p-4 group relative cursor-pointer transition-all duration-200 hover:-translate-y-0.5",
                      isTopProfile ? "border-primary/30 shadow-sm hover:shadow-lg hover:shadow-primary/10" : "border-border hover:shadow-md hover:border-primary/20"
                    )}>
                    {isTopProfile && (
                      <div className="absolute -top-2.5 left-4 bg-primary text-primary-foreground text-[10px] font-bold px-3 py-0.5 rounded-full shadow-sm">⭐ Top Profil</div>
                    )}
                    <div className="flex gap-4">
                      <div className="shrink-0">
                        <div className={cn("rounded-xl bg-muted flex items-center justify-center text-3xl border-2 transition-colors w-[72px] h-[72px]",
                          isTopProfile ? "border-primary/40" : "border-border group-hover:border-primary/30"
                        )}>{walker.name.charAt(0)}</div>
                        {walker.verified && (
                          <div className="flex items-center justify-center -mt-2">
                            <span className="inline-flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded-full bg-accent/20 text-accent">
                              <Shield className="h-3 w-3" /> Certifié
                            </span>
                          </div>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2">
                          <div>
                            <div className="flex items-center gap-2 mb-0.5">
                              <h3 className="font-extrabold text-foreground text-sm group-hover:text-primary transition-colors">{walker.name}</h3>
                              {walker.badge && <span className="inline-flex items-center rounded-md px-2.5 py-0.5 text-[10px] font-bold bg-[hsl(var(--star))] text-foreground">⭐ {walker.badge}</span>}
                            </div>
                            <div className="flex items-center gap-1.5 mb-2">
                              <div className="flex items-center gap-0.5">
                                {Array.from({ length: 5 }).map((_, idx) => (
                                  <Star key={idx} className={cn("h-3 w-3", idx < Math.floor(walker.rating) ? "fill-[hsl(var(--star))] text-[hsl(var(--star))]" : "text-border")} />
                                ))}
                              </div>
                              <span className="text-xs font-bold text-foreground">{walker.rating}</span>
                              <span className="text-xs text-foreground/50">({walker.reviews} avis)</span>
                            </div>
                          </div>
                          <button onClick={(e) => { e.stopPropagation(); toggleFav(walker.id); }}
                            className={cn("p-2 rounded-full transition-all", favorites.includes(walker.id) ? "text-destructive" : "text-foreground/30 hover:text-destructive/60")}>
                            <Heart className={cn("h-5 w-5", favorites.includes(walker.id) && "fill-current")} />
                          </button>
                        </div>
                        <div className="flex flex-wrap items-center gap-2 mb-2">
                          <span className="inline-flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded-full bg-muted text-foreground/70">
                            <MapPin className="h-3 w-3" /> {walker.location}
                          </span>
                          <span className="inline-flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded-full bg-muted text-foreground/70">
                            <Clock className="h-3 w-3" /> {walker.responseTime}
                          </span>
                          {walker.available ? (
                            <span className="inline-flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded-full bg-primary/10 text-primary">
                              <CheckCircle className="h-3 w-3" /> Disponible
                            </span>
                          ) : (
                            <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-muted text-foreground/50">Indisponible</span>
                          )}
                        </div>
                        <p className="text-xs text-foreground/60 mb-3 line-clamp-1 font-medium">"{walker.bio}"</p>
                        <div className="flex items-center justify-between">
                          <div>
                            <span className="text-lg font-extrabold text-primary">{walker.price}€</span>
                            <span className="text-xs text-foreground/50 ml-1">/prestation</span>
                          </div>
                          <button className="bg-primary text-primary-foreground text-xs font-bold px-4 py-2 rounded-lg hover:bg-primary/90 transition-all active:scale-95">
                            Contacter
                          </button>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default AccompagnateurCertifiesListe;
