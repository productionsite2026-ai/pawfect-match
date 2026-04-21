import { useState } from "react";
import { motion } from "framer-motion";
import { MapPin, ChevronDown, ChevronUp, Building2, Star, Dog } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface CityCard {
  name: string;
  description: string;
  highlight: string;
}

const parisCities: CityCard[] = [
  { name: "Paris 1er", description: "Quartier du Louvre — promenades dans les Tuileries et le Palais-Royal.", highlight: "Tuileries" },
  { name: "Paris 2e", description: "Sentier et Grands Boulevards — promenades urbaines pour chiens actifs.", highlight: "Grands Boulevards" },
  { name: "Paris 3e", description: "Haut Marais — promenades dans le Square du Temple.", highlight: "Marais" },
  { name: "Paris 4e", description: "Île Saint-Louis — balades le long de la Seine et dans le Marais.", highlight: "Île Saint-Louis" },
  { name: "Paris 5e", description: "Quartier Latin — promenades au Jardin des Plantes et Luxembourg.", highlight: "Jardin des Plantes" },
  { name: "Paris 6e", description: "Saint-Germain — balades au Luxembourg et dans les rues historiques.", highlight: "Luxembourg" },
  { name: "Paris 7e", description: "Tour Eiffel — promenades au Champ-de-Mars et les Invalides.", highlight: "Champ-de-Mars" },
  { name: "Paris 8e", description: "Champs-Élysées — balades au Parc Monceau et jardins alentour.", highlight: "Parc Monceau" },
  { name: "Paris 9e", description: "Opéra — promenades dans le Square Montholon et alentours.", highlight: "Opéra" },
  { name: "Paris 10e", description: "Canal Saint-Martin — balades le long du canal et les quais.", highlight: "Canal St-Martin" },
  { name: "Paris 11e", description: "Bastille — promenades au Square Maurice-Gardette et Oberkampf.", highlight: "Bastille" },
  { name: "Paris 12e", description: "Bois de Vincennes — grandes balades en forêt et autour du lac.", highlight: "Bois de Vincennes" },
  { name: "Paris 13e", description: "Butte-aux-Cailles — promenades dans les parcs du 13e.", highlight: "Butte-aux-Cailles" },
  { name: "Paris 14e", description: "Montparnasse — balades au Parc Montsouris.", highlight: "Parc Montsouris" },
  { name: "Paris 15e", description: "Plus grand arrondissement — Parc André Citroën et Georges Brassens.", highlight: "Parc Citroën" },
  { name: "Paris 16e", description: "Bois de Boulogne — grandes promenades en pleine nature.", highlight: "Bois de Boulogne" },
  { name: "Paris 17e", description: "Batignolles — balades au Parc Martin-Luther-King.", highlight: "Batignolles" },
  { name: "Paris 18e", description: "Montmartre — promenades avec vue sur tout Paris.", highlight: "Montmartre" },
  { name: "Paris 19e", description: "Buttes-Chaumont — le paradis des chiens avec ses grands espaces verts.", highlight: "Buttes-Chaumont" },
  { name: "Paris 20e", description: "Belleville — promenades au Parc de Belleville et Père-Lachaise.", highlight: "Belleville" },
];

const idfCities: CityCard[] = [
  { name: "Boulogne-Billancourt", description: "Accompagnateurs Certifiés disponibles dans les parcs et le long de la Seine.", highlight: "Hauts-de-Seine (92)" },
  { name: "Neuilly-sur-Seine", description: "Balades au Bois de Boulogne et dans les rues résidentielles.", highlight: "Hauts-de-Seine (92)" },
  { name: "Levallois-Perret", description: "Promenades dans les espaces verts du centre-ville.", highlight: "Hauts-de-Seine (92)" },
  { name: "Saint-Denis", description: "Balades autour du canal et des parcs urbains.", highlight: "Seine-St-Denis (93)" },
  { name: "Montreuil", description: "Promenades dans les parcs et jardins partagés.", highlight: "Seine-St-Denis (93)" },
  { name: "Créteil", description: "Balades autour du lac et dans les espaces verts.", highlight: "Val-de-Marne (94)" },
  { name: "Versailles", description: "Promenades royales dans les jardins et forêts alentour.", highlight: "Yvelines (78)" },
  { name: "Vincennes", description: "Le Bois de Vincennes : terrain de jeu idéal pour les chiens.", highlight: "Val-de-Marne (94)" },
  { name: "Saint-Germain-en-Laye", description: "Forêt et terrasse avec vue : promenades d'exception.", highlight: "Yvelines (78)" },
  { name: "Nanterre", description: "Parcs urbains et bords de Seine pour des balades variées.", highlight: "Hauts-de-Seine (92)" },
  { name: "Argenteuil", description: "Bords de Seine et parcs pour promenades quotidiennes.", highlight: "Val-d'Oise (95)" },
  { name: "Évry-Courcouronnes", description: "Espaces verts et parcs pour les balades canines.", highlight: "Essonne (91)" },
];

const testimonials = [
  { name: "Sophie M.", location: "Paris 15e", rating: 5, text: "Mon Golden Retriever adore ses promenades quotidiennes au Parc Citroën avec Maxime. Ponctuel, attentionné, je le recommande les yeux fermés !", service: "Promenade quotidienne" },
  { name: "Ahmed B.", location: "Boulogne-Billancourt (92)", rating: 5, text: "Garde à domicile pendant nos vacances : notre chienne n'a même pas remarqué notre absence ! Photos et vidéos chaque jour.", service: "Garde à domicile" },
  { name: "Claire D.", location: "Paris 12e", rating: 5, text: "Promenade au Bois de Vincennes 3 fois par semaine. Mon border collie revient épuisé et heureux. Service impeccable.", service: "Promenade Bois de Vincennes" },
];

const FIRST_ROW = 4;

const CityCardComponent = ({ city, index }: { city: CityCard; index: number }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, amount: 0.1 }}
    transition={{ duration: 0.6, delay: index * 0.04 }}
    className="group flex flex-col"
  >
    <div className="flex-1 p-5 rounded-2xl border bg-card hover:shadow-lg transition-all duration-300">
      <div className="flex items-center gap-3 mb-3">
        <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
          <Dog className="h-5 w-5 text-primary" />
        </div>
        <div>
          <h3 className="font-bold text-foreground text-sm">{city.name}</h3>
          <span className="text-xs text-muted-foreground">{city.highlight}</span>
        </div>
      </div>
      <p className="text-sm text-muted-foreground leading-relaxed">{city.description}</p>
    </div>
  </motion.div>
);

const ZonesCitiesSection = () => {
  const [showAllParis, setShowAllParis] = useState(false);
  const [showAllIdf, setShowAllIdf] = useState(false);

  const parisFirst = parisCities.slice(0, FIRST_ROW);
  const parisRest = parisCities.slice(FIRST_ROW);
  const idfFirst = idfCities.slice(0, FIRST_ROW);
  const idfRest = idfCities.slice(FIRST_ROW);

  return (
    <section className="py-16 bg-background relative overflow-hidden">
      <div className="container mx-auto px-4">
        {/* Paris */}
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center max-w-2xl mx-auto mb-10">
          <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-semibold border border-primary/20 mb-4">
            <Building2 className="h-3.5 w-3.5" /> Paris — 20 Arrondissements
          </span>
          <h2 className="text-3xl font-bold text-foreground mt-2 mb-4">Nos Accompagnateurs Certifiés à Paris</h2>
          <p className="text-muted-foreground">Des Accompagnateurs vérifiés dans chaque arrondissement, proches des plus beaux parcs et jardins de la capitale.</p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          {parisFirst.map((city, i) => <CityCardComponent key={city.name} city={city} index={i} />)}
        </div>
        {!showAllParis ? (
          <div className="text-center mb-16">
            <Button onClick={() => setShowAllParis(true)} variant="outline" className="rounded-full">
              Voir les 20 arrondissements <ChevronDown className="ml-1 h-4 w-4" />
            </Button>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
              {parisRest.map((city, i) => <CityCardComponent key={city.name} city={city} index={i} />)}
            </div>
            <div className="text-center mb-16">
              <Button onClick={() => setShowAllParis(false)} variant="outline" size="sm" className="rounded-full">
                Masquer <ChevronUp className="ml-1 h-4 w-4" />
              </Button>
            </div>
          </>
        )}

        {/* Île-de-France */}
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center max-w-2xl mx-auto mb-10">
          <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-600 text-sm font-semibold border border-emerald-500/20 mb-4">
            <MapPin className="h-3.5 w-3.5" /> Île-de-France
          </span>
          <h2 className="text-3xl font-bold text-foreground mt-2 mb-4">Nos Accompagnateurs Certifiés en Île-de-France</h2>
          <p className="text-muted-foreground">Un réseau de Accompagnateurs Certifiés de confiance dans les principales villes de la région parisienne.</p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          {idfFirst.map((city, i) => <CityCardComponent key={city.name} city={city} index={i} />)}
        </div>
        {!showAllIdf ? (
          <div className="text-center mb-16">
            <Button onClick={() => setShowAllIdf(true)} variant="outline" className="rounded-full">
              Voir toutes les villes ({idfCities.length}) <ChevronDown className="ml-1 h-4 w-4" />
            </Button>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
              {idfRest.map((city, i) => <CityCardComponent key={city.name} city={city} index={i} />)}
            </div>
            <div className="text-center mb-16">
              <Button onClick={() => setShowAllIdf(false)} variant="outline" size="sm" className="rounded-full">
                Masquer <ChevronUp className="ml-1 h-4 w-4" />
              </Button>
            </div>
          </>
        )}

        {/* Testimonials */}
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center max-w-2xl mx-auto mb-10">
          <h2 className="text-2xl font-bold text-foreground mb-4">Ce que disent nos clients</h2>
        </motion.div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {testimonials.map((t, i) => (
            <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }} className="bg-card rounded-2xl border p-6">
              <div className="flex items-center gap-1 mb-3">
                {Array.from({ length: t.rating }).map((_, j) => <Star key={j} className="h-4 w-4 fill-amber-400 text-amber-400" />)}
              </div>
              <p className="text-sm text-muted-foreground italic mb-4">"{t.text}"</p>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-bold text-foreground">{t.name}</p>
                  <p className="text-xs text-muted-foreground">{t.location}</p>
                </div>
                <Badge variant="secondary" className="text-xs">{t.service}</Badge>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ZonesCitiesSection;
