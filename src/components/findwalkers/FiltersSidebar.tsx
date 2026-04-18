import { useState } from "react";
import { SlidersHorizontal, ChevronDown, ChevronUp, RotateCcw } from "lucide-react";
import { cn } from "@/lib/utils";

const FiltersSidebar = () => {
  const [priceRange, setPriceRange] = useState([10, 40]);
  const [distance, setDistance] = useState("10");
  const [minRating, setMinRating] = useState("4");
  const [availability, setAvailability] = useState<string[]>([]);
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({
    price: true, distance: true, rating: false, availability: false,
  });

  const toggle = (key: string) => setOpenSections((prev) => ({ ...prev, [key]: !prev[key] }));
  const toggleAvailability = (opt: string) =>
    setAvailability((prev) => prev.includes(opt) ? prev.filter((a) => a !== opt) : [...prev, opt]);

  const resetFilters = () => { setPriceRange([10, 40]); setDistance("10"); setMinRating("4"); setAvailability([]); };
  const hasActiveFilters = distance !== "10" || minRating !== "4" || availability.length > 0 || priceRange[0] !== 10 || priceRange[1] !== 40;

  const Section = ({ id, title, count, children }: { id: string; title: string; count?: number; children: React.ReactNode }) => (
    <div className="border-b border-border last:border-0 py-4 first:pt-0">
      <button onClick={() => toggle(id)} className="flex items-center justify-between w-full text-sm font-bold text-foreground">
        <span className="flex items-center gap-2">
          {title}
          {count !== undefined && count > 0 && (
            <span className="w-5 h-5 rounded-full text-[10px] font-bold flex items-center justify-center text-primary-foreground bg-accent">{count}</span>
          )}
        </span>
        {openSections[id] ? <ChevronUp className="h-4 w-4 text-foreground/50" /> : <ChevronDown className="h-4 w-4 text-foreground/50" />}
      </button>
      {openSections[id] && <div className="mt-3">{children}</div>}
    </div>
  );

  const distances = [{ value: "5", label: "5 km" }, { value: "10", label: "10 km" }, { value: "25", label: "25 km" }, { value: "50", label: "50 km" }];
  const ratings = [{ value: "4.5", label: "4.5+" }, { value: "4", label: "4+" }, { value: "3.5", label: "3.5+" }, { value: "0", label: "Tous" }];

  return (
    <div className="bg-card rounded-xl border border-border p-5">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <SlidersHorizontal className="h-4 w-4 text-accent" />
          <h3 className="font-extrabold text-foreground text-sm">Filtres</h3>
        </div>
        {hasActiveFilters && (
          <button onClick={resetFilters} className="flex items-center gap-1 text-xs font-semibold text-accent hover:underline">
            <RotateCcw className="h-3 w-3" /> Réinitialiser
          </button>
        )}
      </div>

      <Section id="price" title="Budget">
        <div className="flex items-center gap-3">
          <div className="flex-1">
            <label className="text-xs font-semibold text-foreground/60">Min</label>
            <input type="number" value={priceRange[0]} onChange={(e) => setPriceRange([Number(e.target.value), priceRange[1]])}
              className="w-full mt-1 rounded-lg border border-border bg-background px-3 py-2 text-sm font-semibold text-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-ring/20" min={0} />
          </div>
          <span className="text-foreground/40 mt-4 font-bold">—</span>
          <div className="flex-1">
            <label className="text-xs font-semibold text-foreground/60">Max</label>
            <input type="number" value={priceRange[1]} onChange={(e) => setPriceRange([priceRange[0], Number(e.target.value)])}
              className="w-full mt-1 rounded-lg border border-border bg-background px-3 py-2 text-sm font-semibold text-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-ring/20" min={0} />
          </div>
          <span className="text-foreground/50 mt-4 text-sm font-bold">€</span>
        </div>
      </Section>

      <Section id="distance" title="Distance">
        <div className="flex flex-wrap gap-2">
          {distances.map((d) => (
            <button key={d.value} onClick={() => setDistance(d.value)}
              className={cn("px-3 py-1.5 rounded-lg text-xs font-bold border transition-all",
                distance === d.value ? "border-accent text-primary-foreground bg-accent" : "border-border text-foreground/70 hover:border-foreground/30"
              )}>{d.label}</button>
          ))}
        </div>
      </Section>

      <Section id="rating" title="Note minimum">
        <div className="flex flex-wrap gap-2">
          {ratings.map((r) => (
            <button key={r.value} onClick={() => setMinRating(r.value)}
              className={cn("px-3 py-1.5 rounded-lg text-xs font-bold border transition-all",
                minRating === r.value ? "border-[hsl(var(--star))] text-primary-foreground bg-[hsl(var(--star))]" : "border-border text-foreground/70 hover:border-foreground/30"
              )}>⭐ {r.label}</button>
          ))}
        </div>
      </Section>

      <Section id="availability" title="Disponibilité" count={availability.length}>
        <div className="space-y-2.5">
          {["Disponible aujourd'hui", "Cette semaine", "Ce mois"].map((opt) => (
            <label key={opt} className="flex items-center gap-2.5 cursor-pointer group/check">
              <div className={cn("w-[18px] h-[18px] rounded border-2 flex items-center justify-center transition-all",
                availability.includes(opt) ? "border-primary bg-primary" : "border-foreground/30 group-hover/check:border-primary/50"
              )}>
                {availability.includes(opt) && (
                  <svg className="w-3 h-3 text-primary-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                )}
              </div>
              <input type="checkbox" className="sr-only" checked={availability.includes(opt)} onChange={() => toggleAvailability(opt)} />
              <span className="text-xs font-semibold text-foreground">{opt}</span>
            </label>
          ))}
        </div>
      </Section>

      <button className="w-full mt-4 font-bold py-2.5 rounded-lg transition-all text-sm text-primary-foreground bg-accent shadow-md hover:shadow-lg hover:bg-accent/90">
        Appliquer les filtres
      </button>
    </div>
  );
};

export default FiltersSidebar;
