import { motion } from "framer-motion";
import { MapPin, ChevronDown, ChevronUp, Dog, Home, Eye, PawPrint, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";

interface Zone {
  name: string;
  description: string;
  depts: string;
  color: string;
  icon: React.ElementType;
  active: boolean;
}

const activeZones: Zone[] = [
  { name: "Paris", description: "Tous les arrondissements couverts. Accompagnateurs Certifiés disponibles 7j/7 pour vos compagnons.", depts: "20 arrondissements", color: "bg-primary/5 border-primary/20", icon: Dog, active: true },
  { name: "Île-de-France", description: "Réseau dense de Accompagnateurs Certifiés vérifiés dans toute la région parisienne.", depts: "77, 78, 91, 92, 93, 94, 95", color: "bg-emerald-500/5 border-emerald-500/20", icon: PawPrint, active: true },
  { name: "Petite Couronne", description: "Hauts-de-Seine, Seine-Saint-Denis, Val-de-Marne : couverture rapide.", depts: "92, 93, 94", color: "bg-orange-500/5 border-orange-500/20", icon: Home, active: true },
  { name: "Grande Couronne", description: "Yvelines, Essonne, Val-d'Oise, Seine-et-Marne : service en expansion.", depts: "77, 78, 91, 95", color: "bg-violet-500/5 border-violet-500/20", icon: Eye, active: true },
];

const futureZones: Zone[] = [
  { name: "Lyon & Rhône-Alpes", description: "Prochainement disponible dans la métropole lyonnaise et sa région.", depts: "69, 01, 38, 42, 73, 74", color: "bg-blue-500/5 border-blue-500/20", icon: Dog, active: false },
  { name: "Marseille & PACA", description: "En cours de déploiement sur la côte méditerranéenne.", depts: "13, 06, 83, 84", color: "bg-cyan-500/5 border-cyan-500/20", icon: PawPrint, active: false },
  { name: "Bordeaux & Nouvelle-Aquitaine", description: "Bientôt disponible dans la métropole bordelaise.", depts: "33, 64, 40, 17", color: "bg-rose-500/5 border-rose-500/20", icon: Home, active: false },
  { name: "Lille & Hauts-de-France", description: "Ouverture prévue prochainement dans le Nord.", depts: "59, 62, 80, 02", color: "bg-amber-500/5 border-amber-500/20", icon: Users, active: false },
  { name: "Nantes & Pays de la Loire", description: "Expansion en cours vers l'Ouest.", depts: "44, 49, 53, 72, 85", color: "bg-teal-500/5 border-teal-500/20", icon: Eye, active: false },
  { name: "Toulouse & Occitanie", description: "Lancement prévu dans la ville rose et sa région.", depts: "31, 34, 30, 11", color: "bg-indigo-500/5 border-indigo-500/20", icon: Dog, active: false },
  { name: "Strasbourg & Grand Est", description: "Déploiement en préparation à l'Est.", depts: "67, 68, 57, 54", color: "bg-emerald-500/5 border-emerald-500/20", icon: PawPrint, active: false },
  { name: "Rennes & Bretagne", description: "Bientôt en Bretagne.", depts: "35, 29, 22, 56", color: "bg-purple-500/5 border-purple-500/20", icon: Home, active: false },
];

const ZoneCard = ({ zone, index }: { zone: Zone; index: number }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, amount: 0.15 }}
    transition={{ duration: 0.6, delay: index * 0.06 }}
    className="group flex flex-col"
  >
    <div className={`flex-1 p-6 rounded-2xl border transition-all duration-500 hover:shadow-lg ${zone.color}`}>
      <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
        <zone.icon className="h-6 w-6 text-primary" />
      </div>
      <h3 className="text-lg font-bold text-foreground mb-2">{zone.name}</h3>
      <p className="text-sm text-muted-foreground leading-relaxed mb-3">{zone.description}</p>
      <span className="inline-block text-xs text-muted-foreground font-medium px-2 py-1 rounded-md bg-muted/50">
        {zone.depts}
      </span>
      {zone.active && (
        <div className="mt-3 flex items-center gap-2 text-xs font-semibold text-primary">
          <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
          Actif — Accompagnateurs Certifiés disponibles
        </div>
      )}
      {!zone.active && (
        <div className="mt-3 flex items-center gap-2 text-xs font-semibold text-muted-foreground">
          <span className="w-2 h-2 rounded-full bg-amber-400" />
          Bientôt disponible
        </div>
      )}
    </div>
  </motion.div>
);

const ZonesRegionsSection = () => {
  const [showFuture, setShowFuture] = useState(false);

  return (
    <section className="py-16 bg-muted/30 relative overflow-hidden">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center max-w-2xl mx-auto mb-12"
        >
          <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-semibold border border-primary/20 mb-4">
            <MapPin className="h-3.5 w-3.5" /> Nos Zones Actives
          </span>
          <h2 className="text-3xl font-bold text-foreground mt-2 mb-4">
            Nos Zones d'Intervention en France
          </h2>
          <p className="text-muted-foreground">
            DogWalking couvre prioritairement Paris et toute l'Île-de-France, avec des Accompagnateurs Certifiés vérifiés et disponibles 7 jours sur 7.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {activeZones.map((zone, i) => (
            <ZoneCard key={zone.name} zone={zone} index={i} />
          ))}
        </div>

        {!showFuture ? (
          <div className="text-center">
            <Button onClick={() => setShowFuture(true)} variant="outline" className="rounded-full">
              Voir les zones en cours de déploiement ({futureZones.length}) <ChevronDown className="ml-1 h-4 w-4" />
            </Button>
          </div>
        ) : (
          <>
            <motion.h3
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-xl font-bold text-foreground text-center mb-6"
            >
              🚀 Zones en cours de déploiement
            </motion.h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
              {futureZones.map((zone, i) => (
                <ZoneCard key={zone.name} zone={zone} index={i} />
              ))}
            </div>
            <div className="text-center">
              <Button onClick={() => setShowFuture(false)} variant="outline" size="sm" className="rounded-full">
                Masquer <ChevronUp className="ml-1 h-4 w-4" />
              </Button>
            </div>
          </>
        )}
      </div>
    </section>
  );
};

export default ZonesRegionsSection;
