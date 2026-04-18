import { Button } from "@/components/ui/button";
import { Gift, Sparkles } from "lucide-react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

interface ReferralBannerProps {
  onNavigate?: () => void;
}

const ReferralBanner = ({ onNavigate }: ReferralBannerProps) => {
  const navigate = useNavigate();

  const handleClick = () => {
    if (onNavigate) {
      onNavigate();
    } else {
      navigate('/referral');
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-primary via-primary/90 to-accent p-6 text-primary-foreground mb-6"
    >
      {/* Decorative elements */}
      <div className="absolute top-2 right-8 text-primary-foreground/20">
        <Sparkles className="h-6 w-6" />
      </div>
      <div className="absolute bottom-2 right-16 text-primary-foreground/20">
        <Sparkles className="h-4 w-4" />
      </div>
      <div className="absolute top-4 right-32 text-primary-foreground/20">
        <Sparkles className="h-3 w-3" />
      </div>
      
      <div className="flex items-center gap-4">
        <div className="w-16 h-16 rounded-2xl bg-primary-foreground/20 flex items-center justify-center flex-shrink-0">
          <Gift className="h-8 w-8" />
        </div>
        
        <div className="flex-1">
          <h3 className="text-xl font-bold mb-1">Parrainez vos amis!</h3>
          <p className="text-sm text-primary-foreground/80">
            Gagnez des récompenses ensemble!
          </p>
        </div>
      </div>
      
      <Button 
        onClick={handleClick}
        variant="secondary"
        className="w-full mt-4 bg-primary-foreground text-primary hover:bg-primary-foreground/90 font-semibold"
      >
        Inviter un ami
      </Button>
    </motion.div>
  );
};

export default ReferralBanner;
