import StarRating from "./StarRating";
import avatarWalker from "@/assets/avatar-walker.jpg";
import { motion } from "framer-motion";
import { MapPin } from "lucide-react";

interface NearbyWalkerProps {
  name: string;
  rating: number;
  reviews: number;
  distance: string;
  price: string;
  avatar?: string;
  badges?: string[];
}

const NearbyWalkerCard = ({ name, rating, reviews, distance, price, avatar, badges = [] }: NearbyWalkerProps) => (
  <motion.div
    whileHover={{ y: -2 }}
    className="bg-card rounded-2xl shadow-card p-3.5 flex items-center gap-3"
  >
    <div className="relative">
      <img
        src={avatar || avatarWalker}
        alt={name}
        className="w-13 h-13 rounded-full object-cover ring-2 ring-primary/20"
        style={{ width: 52, height: 52 }}
        loading="lazy"
      />
      <div className="absolute -bottom-0.5 -right-0.5 w-4 h-4 rounded-full gradient-accent border-2 border-card" />
    </div>
    <div className="flex-1 min-w-0">
      <div className="flex items-center gap-1.5 flex-wrap">
        <span className="font-bold text-sm text-foreground">{name}</span>
        {badges.map((b) => (
          <span key={b} className="text-[8px] font-bold px-1.5 py-0.5 rounded-full gradient-primary text-white">
            {b}
          </span>
        ))}
      </div>
      <div className="flex items-center gap-1.5 mt-1">
        <StarRating rating={rating} />
        <span className="text-[10px] text-muted-foreground font-semibold">({reviews})</span>
      </div>
      <div className="flex items-center gap-1 mt-0.5 text-[10px] text-muted-foreground">
        <MapPin className="w-3 h-3" />
        <span>{distance}</span>
      </div>
    </div>
    <div className="text-right">
      <span className="text-base font-black text-foreground">{price}</span>
      <p className="text-[9px] text-muted-foreground font-semibold">/mission</p>
    </div>
  </motion.div>
);

export default NearbyWalkerCard;
