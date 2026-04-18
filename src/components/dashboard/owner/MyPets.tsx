import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Plus, ChevronRight } from "lucide-react";
import { motion } from "framer-motion";

interface Pet {
  id: string;
  name: string;
  photoUrl?: string;
}

interface MyPetsProps {
  pets: Pet[];
  onAddPet: () => void;
  onViewAll?: () => void;
}

const MyPets = ({ pets, onAddPet, onViewAll }: MyPetsProps) => {
  return (
    <div className="mb-6">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-xl font-bold">Mes Animaux (Vérifiés)</h2>
          <p className="text-sm text-muted-foreground">Surveillés & heureux</p>
        </div>
        {pets.length > 0 && onViewAll && (
          <button 
            onClick={onViewAll}
            className="text-sm text-primary flex items-center gap-1 hover:underline"
          >
            Voir tout <ChevronRight className="h-4 w-4" />
          </button>
        )}
      </div>
      
      <div className="flex items-center gap-4 overflow-x-auto pb-2">
        {pets.map((pet, index) => (
          <motion.div
            key={pet.id}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.1 }}
            className="flex flex-col items-center flex-shrink-0"
          >
            <Avatar className="h-16 w-16 ring-2 ring-primary/20 shadow-md mb-2">
              <AvatarImage src={pet.photoUrl} alt={pet.name} className="object-cover" />
              <AvatarFallback className="bg-gradient-to-br from-primary/20 to-accent/20 text-xl">
                🐕
              </AvatarFallback>
            </Avatar>
            <span className="text-sm font-medium text-center">{pet.name}</span>
          </motion.div>
        ))}
        
        {/* Bouton Ajouter */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: pets.length * 0.1 }}
          className="flex flex-col items-center flex-shrink-0"
        >
          <Button
            onClick={onAddPet}
            size="icon"
            className="h-16 w-16 rounded-full bg-primary hover:bg-primary/90 shadow-lg"
          >
            <Plus className="h-6 w-6" />
          </Button>
          <span className="text-sm font-medium text-center mt-2 text-muted-foreground">Ajouter</span>
        </motion.div>
      </div>
    </div>
  );
};

export default MyPets;
