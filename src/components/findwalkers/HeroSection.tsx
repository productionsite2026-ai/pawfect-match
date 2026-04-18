import heroImg from "@/assets/hero-dogwalking.jpg";
import { useState } from "react";
import { MapPin, Search, PenLine, ChevronDown, Heart, Shield, Users, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

const FindWalkersHero = () => {
  const navigate = useNavigate();
  const [animal, setAnimal] = useState<"chien" | "chat">("chien");
  const [service, setService] = useState("hebergement");
  const [address, setAddress] = useState("");
  const [servicesOpen, setServicesOpen] = useState(false);

  const servicesAbsent = [
    { id: "hebergement", label: "Hébergement" },
    { id: "garde", label: "Garde à domicile" },
  ];
  const servicesTravail = [
    { id: "visite", label: "Visites à votre domicile" },
    { id: "garderie", label: "Garderie" },
    { id: "promenade", label: "Accompagnement" },
  ];
  const allServices = [...servicesAbsent, ...servicesTravail];
  const selectedLabel = allServices.find((s) => s.id === service)?.label ?? "Choisir";

  return (
    <section className="relative">
      <div className="relative h-72 md:h-80 flex items-center justify-center overflow-hidden">
        <img src={heroImg} alt="Accompagnateur d'Animaux" className="absolute inset-0 w-full h-full object-cover scale-105" />
        <div className="absolute inset-0 bg-gradient-to-b from-foreground/60 via-foreground/50 to-foreground/70" />
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="relative z-10 text-center px-4 -mt-8"
        >
          <h1 className="text-3xl md:text-5xl font-extrabold text-white mb-2 md:mb-3 leading-tight drop-shadow-lg">
            Trouvez un Accompagnateur<br className="hidden sm:block" /> Certifié 🐶
          </h1>
          <p className="text-white/85 text-sm md:text-lg mb-4 md:mb-5 max-w-xl mx-auto drop-shadow-sm">
            Des Accompagnateurs Certifiés sélectionnés manuellement près de chez vous.
          </p>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="flex items-center justify-center gap-4 md:gap-6 mb-4"
          >
            <div className="flex items-center gap-1.5 text-white/90 text-xs md:text-sm bg-white/10 backdrop-blur-sm rounded-full px-3 py-1.5">
              <Shield className="h-4 w-4 text-primary" />
              <span className="font-semibold">Profils Certifiés (35%)</span>
            </div>
            <div className="flex items-center gap-1.5 text-white/90 text-xs md:text-sm bg-white/10 backdrop-blur-sm rounded-full px-3 py-1.5">
              <Users className="h-4 w-4 text-primary" />
              <span className="font-semibold">+500 Accompagnateurs</span>
            </div>
            <div className="hidden sm:flex items-center gap-1.5 text-white/90 text-xs md:text-sm bg-white/10 backdrop-blur-sm rounded-full px-3 py-1.5">
              <Star className="h-4 w-4 text-[hsl(var(--star))]" />
              <span className="font-semibold">4.8/5 de moyenne</span>
            </div>
          </motion.div>

          <div className="flex justify-center">
            <Button size="sm" className="gap-2 text-sm font-bold px-5 py-2.5 shadow-lg hover:scale-105 transition-transform"
              onClick={() => navigate('/auth?redirect=/find-walkers')}>
              <PenLine className="h-4 w-4" /> Déposez une annonce personnalisée
            </Button>
          </div>
        </motion.div>
      </div>

      {/* Search form */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="relative z-10 max-w-5xl mx-auto px-4 -mt-10 pb-6"
      >
        <div className="bg-card/95 backdrop-blur-sm rounded-2xl border border-border shadow-2xl p-5 md:p-6">
          <p className="text-lg font-extrabold text-foreground mb-5 text-center">
            <Heart className="inline h-5 w-5 text-destructive fill-destructive mr-2 -mt-0.5" />
            Recherche rapide
          </p>
          <div className="flex flex-col md:flex-row md:items-end gap-4">
            {/* Animal */}
            <div className="shrink-0">
              <p className="text-xs font-bold text-foreground mb-2 uppercase tracking-wide">Animal</p>
              <div className="flex gap-4 border border-border rounded-xl bg-background px-5 py-3">
                {(["chien", "chat"] as const).map((a) => (
                  <label key={a} onClick={() => setAnimal(a)} className="flex items-center gap-2.5 cursor-pointer">
                    <div className={cn(
                      "w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all",
                      animal === a ? "border-primary bg-primary" : "border-muted-foreground/40"
                    )}>
                      {animal === a && <div className="w-2.5 h-2.5 bg-primary-foreground rounded-full" />}
                    </div>
                    <span className="text-sm font-bold text-foreground">
                      {a === "chien" ? "🐶 Chien" : "🐱 Chat"}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            {/* Service dropdown */}
            <div className="flex-1 min-w-0 relative">
              <p className="text-xs font-bold text-foreground mb-2 uppercase tracking-wide">Service</p>
              <Collapsible open={servicesOpen} onOpenChange={setServicesOpen}>
                <CollapsibleTrigger className="w-full flex items-center gap-2 justify-between rounded-xl border border-border bg-background px-4 py-3 text-sm font-semibold text-foreground hover:border-primary/40 transition-colors">
                  <span className="flex items-center gap-2">
                    <Heart className="h-4 w-4 text-destructive fill-destructive" />
                    {selectedLabel}
                  </span>
                  <ChevronDown className={cn("h-4 w-4 text-muted-foreground transition-transform", servicesOpen && "rotate-180")} />
                </CollapsibleTrigger>
                <CollapsibleContent className="absolute left-0 right-0 top-full mt-1 z-20 bg-card border border-border rounded-xl shadow-lg p-4">
                  <p className="text-xs font-bold text-muted-foreground mb-2 uppercase tracking-wide">Quand vous êtes absent</p>
                  <div className="space-y-1 mb-3">
                    {servicesAbsent.map((s) => (
                      <button key={s.id} onClick={() => { setService(s.id); setServicesOpen(false); }}
                        className={cn("w-full flex items-center gap-2.5 text-left px-3 py-2.5 rounded-lg text-sm transition-all",
                          service === s.id ? "bg-primary/10 text-primary font-semibold border border-primary/20" : "text-foreground hover:bg-secondary border border-transparent"
                        )}>
                        <Heart className={cn("h-4 w-4 shrink-0", service === s.id ? "text-destructive fill-destructive" : "text-destructive/50 fill-destructive/50")} />
                        {s.label}
                      </button>
                    ))}
                  </div>
                  <p className="text-xs font-bold text-muted-foreground mb-2 uppercase tracking-wide">Quand vous êtes au travail</p>
                  <div className="space-y-1">
                    {servicesTravail.map((s) => (
                      <button key={s.id} onClick={() => { setService(s.id); setServicesOpen(false); }}
                        className={cn("w-full flex items-center gap-2.5 text-left px-3 py-2.5 rounded-lg text-sm transition-all",
                          service === s.id ? "bg-primary/10 text-primary font-semibold border border-primary/20" : "text-foreground hover:bg-secondary border border-transparent"
                        )}>
                        <Heart className={cn("h-4 w-4 shrink-0", service === s.id ? "text-destructive fill-destructive" : "text-destructive/50 fill-destructive/50")} />
                        {s.label}
                      </button>
                    ))}
                  </div>
                </CollapsibleContent>
              </Collapsible>
            </div>

            {/* Location */}
            <div className="flex-1 min-w-0 md:max-w-[260px]">
              <p className="text-xs font-bold text-foreground mb-2 uppercase tracking-wide">Localisation</p>
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-destructive" />
                <input type="text" value={address} onChange={(e) => setAddress(e.target.value)} placeholder="Votre adresse"
                  className="w-full rounded-xl border border-border bg-background pl-10 pr-4 py-3 text-sm font-medium text-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-ring/20 transition-all placeholder:text-muted-foreground/60" />
              </div>
            </div>

            {/* Search button */}
            <button
              className="bg-primary text-primary-foreground font-bold py-3 px-8 rounded-xl hover:bg-primary/90 transition-all flex items-center justify-center gap-2 shrink-0 shadow-lg hover:shadow-xl hover:scale-[1.02] active:scale-[0.98]"
              onClick={() => document.getElementById('recherche')?.scrollIntoView({ behavior: 'smooth' })}
            >
              <Search className="h-5 w-5" />
              <span>Rechercher</span>
            </button>
          </div>
        </div>
      </motion.div>
    </section>
  );
};

export default FindWalkersHero;
