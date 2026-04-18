import { Star } from "lucide-react";

const StarRating = ({ rating }: { rating: number }) => (
  <div className="flex items-center gap-0.5">
    {[1, 2, 3, 4, 5].map((i) => (
      <Star
        key={i}
        className={`w-3 h-3 ${i <= rating ? "text-amber-400 fill-amber-400" : "text-muted-foreground/30"}`}
      />
    ))}
  </div>
);

export default StarRating;
