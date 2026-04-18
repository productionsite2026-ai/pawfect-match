import { motion } from "framer-motion";

interface DogCardProps {
  name: string;
  breed: string;
  image: string;
  emoji: string;
  status: "Actif" | "Disponible";
}

const DogCard = ({ name, breed, image, emoji, status }: DogCardProps) => (
  <motion.div
    whileHover={{ y: -3 }}
    className="bg-card rounded-2xl shadow-card overflow-hidden group"
  >
    <div className="relative">
      <img src={image} alt={name} className="w-full aspect-square object-cover group-hover:scale-105 transition-transform duration-300" loading="lazy" />
      <div className="absolute inset-0 gradient-hero opacity-30" />
    </div>
    <div className="p-3">
      <div className="flex items-center gap-1.5">
        <span className="text-base">{emoji}</span>
        <span className="font-extrabold text-foreground">{name}</span>
      </div>
      <p className="text-[11px] text-muted-foreground mt-0.5">{breed}</p>
      <span
        className={`inline-flex items-center gap-1 mt-2 text-[10px] font-bold px-2.5 py-1 rounded-full ${
          status === "Actif" ? "bg-primary/12 text-primary" : "bg-accent/12 text-accent"
        }`}
      >
        <span className={`w-1.5 h-1.5 rounded-full ${status === "Actif" ? "bg-primary" : "bg-accent"}`} />
        {status === "Actif" ? "En mission" : "Disponible"}
      </span>
    </div>
  </motion.div>
);

export default DogCard;
