import { useEffect, useState } from "react";
import { ArrowRight, PlusCircle, CheckCircle, Search, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import { useLocation, useNavigate } from "react-router-dom";
import { ServiceRequestFormNew } from "@/components/hub/ServiceRequestFormNew";
import { toast } from "@/hooks/use-toast";

const ads = [
  { id: 1, title: "Garde pour Max (Labrador)", status: "Urgent", desc: "Besoin d'une garde ce weekend pour mon Labrador adorable.", location: "Paris 15", price: "25€/nuit", user: "Jean-Pierre D.", type: "Libre" },
  { id: 2, title: "Accompagnement quotidien Luna", status: "Actif", desc: "Cherche quelqu'un pour accompagner Luna tous les midis.", location: "Lyon 03", price: "15€/prestation", user: "Sophie M.", type: "Libre" },
  { id: 3, title: "Visite à domicile Chat", status: "Actif", desc: "Passage 1 fois par jour pour nourrir mon chat Oscar.", location: "Bordeaux", price: "12€/visite", user: "Lucas G.", type: "Libre" },
  { id: 4, title: "Garderie pour Rocky", status: "Urgent", desc: "Rocky a besoin de compagnie pendant que je travaille.", location: "Nantes", price: "18€/jour", user: "Marie L.", type: "Libre" },
];

const DemandesSection = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [filter, setFilter] = useState("tous");
  const [showDepositForm, setShowDepositForm] = useState(false);
  const filters = ["Tous", "Urgent", "Actif"];
  const filtered = ads.filter(a => filter === "tous" || a.status.toLowerCase() === filter);

  // Auto-open deposit form when arriving with #deposer-annonce
  useEffect(() => {
    if (location.hash === "#deposer-annonce") {
      setShowDepositForm(true);
      setTimeout(() => {
        document.getElementById("deposer-annonce")?.scrollIntoView({ behavior: "smooth", block: "start" });
      }, 100);
    }
  }, [location.hash]);

  const handleDepositSubmit = (data: any) => {
    console.log("Annonce libre déposée:", data);
    toast({
      title: "Annonce déposée avec succès",
      description: "Vous recevrez bientôt des propositions d'Accompagnateurs Certifiés.",
    });
    setShowDepositForm(false);
  };

  return (
    <section className="py-12 bg-secondary/50 border-t border-border" id="annonces">
      <div className="max-w-7xl mx-auto px-4">
        {/* Bloc Déposer une Annonce Libre (Propriétaires) */}
        <div id="deposer-annonce" className="mb-10 scroll-mt-24">
          <div className="bg-card rounded-2xl border-2 border-primary/20 overflow-hidden shadow-sm">
            <button
              onClick={() => setShowDepositForm(v => !v)}
              className="w-full flex items-center justify-between gap-4 p-5 md:p-6 text-left hover:bg-secondary/40 transition-colors"
            >
              <div className="flex items-center gap-4">
                <div className="h-11 w-11 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                  <PlusCircle className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h2 className="text-base md:text-lg font-extrabold text-foreground">
                    Déposer une Annonce Libre
                  </h2>
                  <p className="text-xs md:text-sm text-foreground/60 font-medium">
                    Décrivez votre besoin et recevez des propositions d'Accompagnateurs Certifiés.
                  </p>
                </div>
              </div>
              <ChevronDown className={cn("h-5 w-5 text-foreground/60 transition-transform shrink-0", showDepositForm && "rotate-180")} />
            </button>
            <AnimatePresence initial={false}>
              {showDepositForm && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.25 }}
                  className="overflow-hidden border-t border-border"
                >
                  <div className="p-5 md:p-6">
                    <ServiceRequestFormNew onSubmit={handleDepositSubmit} />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        <motion.div initial={{ opacity: 0, y: 15 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.4 }} className="text-center mb-8">
          <div className="inline-flex items-center gap-2 bg-accent/10 text-accent text-xs font-bold px-3 py-1.5 rounded-full mb-3">
            <Search className="h-3.5 w-3.5" />
            Pour les Accompagnateurs Certifiés
          </div>
          <h2 className="text-2xl font-extrabold text-foreground mb-2">Demandes des Propriétaires</h2>
          <p className="text-sm text-foreground/60 max-w-xl mx-auto font-medium leading-relaxed">
            Parcourez les demandes des Propriétaires et postulez à celles qui vous intéressent.
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-12 gap-8">
          <div className="lg:col-span-8">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-5">
              <p className="text-sm font-bold text-foreground">
                <span className="text-primary">{filtered.length}</span> demande{filtered.length > 1 ? "s" : ""} disponible{filtered.length > 1 ? "s" : ""}
              </p>
              <div className="flex bg-card p-0.5 rounded-lg border border-border text-xs">
                {filters.map(f => (
                  <button key={f} onClick={() => setFilter(f.toLowerCase())}
                    className={cn("px-3 py-1.5 rounded-md font-bold transition-all",
                      filter === f.toLowerCase() ? "text-primary-foreground bg-accent" : "text-foreground/60 hover:text-foreground"
                    )}>{f}</button>
                ))}
              </div>
            </div>

            <div className="space-y-3">
              {filtered.map((ad, i) => (
                <motion.div key={ad.id} initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
                  transition={{ duration: 0.3, delay: i * 0.05 }}
                  className="bg-card rounded-xl border border-border p-5 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md group cursor-pointer">
                  <div className="flex flex-col sm:flex-row gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <span className={cn("text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase",
                          ad.status === "Urgent" ? "bg-destructive/10 text-destructive" : "bg-primary/10 text-primary"
                        )}>{ad.status}</span>
                        <span className="text-xs font-semibold text-foreground/50">{ad.location}</span>
                      </div>
                      <h3 className="text-sm font-extrabold text-foreground group-hover:text-primary transition-colors mb-1">{ad.title}</h3>
                      <p className="text-xs text-foreground/50 line-clamp-1 font-medium">"{ad.desc}"</p>
                      <div className="flex items-center gap-2 mt-2">
                        <div className="h-6 w-6 rounded-full bg-muted flex items-center justify-center text-[10px] font-bold text-foreground/50">{ad.user.charAt(0)}</div>
                        <span className="text-xs font-bold text-foreground">{ad.user}</span>
                      </div>
                    </div>
                    <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-between gap-2 sm:min-w-[100px]">
                      <div className="text-right">
                        <p className="text-lg font-extrabold text-primary">{ad.price}</p>
                        <p className="text-[10px] text-foreground/50 font-medium">{ad.type}</p>
                      </div>
                      <Button size="sm" className="text-xs rounded-lg font-bold active:scale-95 transition-transform">
                        Postuler
                      </Button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* CTA sidebar */}
          <div className="lg:col-span-4" id="devenir">
            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5 }}
              className="bg-primary rounded-xl p-6 text-primary-foreground sticky top-20">
              <div className="space-y-5">
                <div className="h-12 w-12 bg-primary-foreground/20 rounded-xl flex items-center justify-center">
                  <PlusCircle className="h-6 w-6 text-primary-foreground" />
                </div>
                <div>
                  <h3 className="text-lg font-extrabold mb-2">Gagnez de l'argent en vous faisant plaisir !</h3>
                  <p className="text-primary-foreground/70 text-sm font-medium">Devenez Accompagnateur Certifié et profitez de moments uniques.</p>
                </div>
                <div className="space-y-2.5">
                  {["Inscription 100% gratuite", "Paiements sécurisés", "Label Certifié (35%)", "Flexibilité totale"].map(item => (
                    <div key={item} className="flex items-center gap-2.5 text-xs font-semibold text-primary-foreground/90">
                      <CheckCircle className="h-3.5 w-3.5 text-primary-foreground shrink-0" /> {item}
                    </div>
                  ))}
                </div>
                <Button className="w-full bg-primary-foreground text-primary hover:bg-primary-foreground/90 font-bold gap-2 hover:scale-[1.02] active:scale-95 transition-transform"
                  onClick={() => navigate('/walker/register')}>
                  Devenir Accompagnateur <ArrowRight className="h-4 w-4" />
                </Button>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default DemandesSection;
