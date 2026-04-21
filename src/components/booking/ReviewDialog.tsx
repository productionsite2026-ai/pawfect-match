import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Star, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { motion } from "framer-motion";

interface ReviewDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  bookingId: string;
  reviewedId: string;
  dogName?: string;
  /** 'owner_to_walker' (par défaut) ou 'walker_to_owner' */
  reviewType?: 'owner_to_walker' | 'walker_to_owner';
  onSuccess?: () => void;
}

export const ReviewDialog = ({
  open,
  onOpenChange,
  bookingId,
  reviewedId,
  dogName,
  reviewType = 'owner_to_walker',
  onSuccess,
}: ReviewDialogProps) => {
  const [rating, setRating] = useState(0);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [comment, setComment] = useState("");
  const [loading, setLoading] = useState(false);

  const isWalkerReview = reviewType === 'walker_to_owner';

  const handleSubmit = async () => {
    if (rating === 0) {
      toast({
        title: "Note requise",
        description: "Veuillez sélectionner une note de 1 à 5 étoiles",
        variant: "destructive"
      });
      return;
    }

    setLoading(true);

    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) throw new Error("Non authentifié");

      const { error } = await supabase.from('reviews').insert({
        booking_id: bookingId,
        reviewer_id: session.user.id,
        reviewed_id: reviewedId,
        rating,
        comment: comment.trim() || null,
        review_type: reviewType,
      } as any);

      if (error) throw error;

      toast({
        title: "Avis envoyé !",
        description: "Merci pour votre retour 🎉"
      });

      setRating(0);
      setComment("");
      onOpenChange(false);
      onSuccess?.();
    } catch (error: any) {
      toast({
        title: "Erreur",
        description: error.message,
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const ratingLabels = [
    "", // 0
    "Décevant",
    "Passable",
    "Bien",
    "Très bien",
    "Excellent !"
  ];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-xl">
            {isWalkerReview ? "Noter le propriétaire" : "Laisser un avis"}
          </DialogTitle>
          <DialogDescription>
            {isWalkerReview
              ? "Comment s'est passé le contact avec le propriétaire ?"
              : `Comment s'est passée la prestation${dogName ? ` pour ${dogName}` : ""} ?`}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Star Rating */}
          <div className="text-center">
            <div className="flex justify-center gap-2 mb-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <motion.button
                  key={star}
                  type="button"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setRating(star)}
                  onMouseEnter={() => setHoveredRating(star)}
                  onMouseLeave={() => setHoveredRating(0)}
                  className="focus:outline-none"
                >
                  <Star
                    className={`h-10 w-10 transition-colors ${
                      star <= (hoveredRating || rating)
                        ? "fill-amber-500 text-amber-500"
                        : "text-muted-foreground/30"
                    }`}
                  />
                </motion.button>
              ))}
            </div>
            <p className="text-sm font-medium text-muted-foreground h-5">
              {ratingLabels[hoveredRating || rating]}
            </p>
          </div>

          {/* Comment */}
          <div>
            <Textarea
              placeholder="Partagez votre expérience (optionnel)..."
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              rows={4}
              className="resize-none"
            />
            <p className="text-xs text-muted-foreground mt-1.5">
              Votre avis aide les autres Propriétaires à choisir leur Accompagnateur Certifié
            </p>
          </div>

          {/* Actions */}
          <div className="flex gap-3">
            <Button
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="flex-1"
              disabled={loading}
            >
              Annuler
            </Button>
            <Button
              onClick={handleSubmit}
              className="flex-1 gap-2"
              disabled={loading || rating === 0}
            >
              {loading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Star className="h-4 w-4" />
              )}
              Publier
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ReviewDialog;
