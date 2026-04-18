import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";

const AnnoncesLibresBlock = () => (
  <div className="bg-card rounded-xl border-2 border-dashed border-primary/30 p-5">
    <div className="text-center">
      <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-3">
        <Search className="h-5 w-5 text-primary" />
      </div>
      <h3 className="text-sm font-extrabold text-foreground mb-1">Besoin d'un Accompagnateur ?</h3>
      <p className="text-xs text-foreground/60 mb-3 leading-relaxed font-medium">
        Consultez les annonces libres ou publiez la vôtre en tant que Propriétaire.
      </p>
      <Button size="sm" className="w-full font-bold text-sm gap-2" onClick={() => document.getElementById('annonces')?.scrollIntoView({ behavior: 'smooth' })}>
        Voir les annonces
      </Button>
    </div>
  </div>
);

export default AnnoncesLibresBlock;
