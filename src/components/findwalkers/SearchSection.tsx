import { useState } from "react";
import { SlidersHorizontal, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

import FiltersSidebar from "@/components/findwalkers/FiltersSidebar";
import AnnoncesLibresBlock from "@/components/findwalkers/AnnoncesLibresBlock";
import AccompagnateurCertifiesListe from "@/components/findwalkers/PromeneursListe";

const SearchSection = () => {
  const [filtersOpen, setFiltersOpen] = useState(false);

  return (
    <section className="py-8 bg-background" id="recherche">
      <div className="max-w-7xl mx-auto px-4">
        <motion.div initial={{ opacity: 0, y: 15 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.4 }} className="mb-8 text-center">
          <h2 className="text-2xl font-extrabold text-foreground mb-2">Nos Accompagnateurs Certifiés</h2>
          <p className="text-sm text-foreground/60 max-w-2xl mx-auto font-medium leading-relaxed">
            Sélectionnez directement l'Accompagnateur idéal pour votre demande de prestation parmi nos profils vérifiés.
          </p>
        </motion.div>

        {/* Mobile: filter toggle */}
        <div className="lg:hidden mb-4">
          <button onClick={() => setFiltersOpen(true)}
            className="flex items-center gap-2 bg-card border border-border rounded-lg px-4 py-2.5 text-sm font-bold text-foreground hover:bg-secondary transition-colors active:scale-95">
            <SlidersHorizontal className="h-4 w-4 text-accent" /> Filtrer
          </button>
        </div>

        {/* Mobile: filter drawer */}
        <AnimatePresence>
          {filtersOpen && (
            <div className="fixed inset-0 z-50 lg:hidden">
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 bg-foreground/50" onClick={() => setFiltersOpen(false)} />
              <motion.div initial={{ x: "-100%" }} animate={{ x: 0 }} exit={{ x: "-100%" }}
                transition={{ type: "spring", damping: 25, stiffness: 300 }}
                className="absolute inset-y-0 left-0 w-[85%] max-w-sm bg-background overflow-y-auto p-4">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="font-extrabold text-foreground text-lg">Filtres</h2>
                  <button onClick={() => setFiltersOpen(false)} className="p-2 rounded-lg hover:bg-secondary transition-colors"><X className="h-5 w-5" /></button>
                </div>
                <FiltersSidebar />
              </motion.div>
            </div>
          )}
        </AnimatePresence>

        {/* Mobile: stacked */}
        <div className="lg:hidden space-y-6">
          <AccompagnateurCertifiesListe />
          <AnnoncesLibresBlock />
        </div>

        {/* Desktop: 3-col */}
        <div className="hidden lg:grid lg:grid-cols-12 gap-6">
          <div className="lg:col-span-3">
            <div className="sticky top-20 space-y-4">
              <FiltersSidebar />
              <AnnoncesLibresBlock />
            </div>
          </div>
          <div className="lg:col-span-9">
            <AccompagnateurCertifiesListe />
          </div>
        </div>
      </div>
    </section>
  );
};

export default SearchSection;
