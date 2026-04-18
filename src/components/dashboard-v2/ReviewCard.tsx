import StarRating from "./StarRating";

interface ReviewProps {
  name: string;
  avatar: string;
  rating: number;
  text: string;
  date?: string;
}

const ReviewCard = ({ name, avatar, rating, text, date }: ReviewProps) => (
  <div className="flex items-start gap-3 py-3">
    <img src={avatar} alt={name} className="w-10 h-10 rounded-full object-cover ring-2 ring-primary/20" loading="lazy" />
    <div className="flex-1 min-w-0">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="font-bold text-sm text-foreground">{name}</span>
          <StarRating rating={rating} />
        </div>
        {date && <span className="text-[9px] text-muted-foreground">{date}</span>}
      </div>
      <p className="text-sm text-muted-foreground mt-1 leading-relaxed">{text}</p>
    </div>
  </div>
);

export default ReviewCard;
