import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MapPin, Shield } from "lucide-react";
import { motion } from "framer-motion";
import { LucideIcon } from "lucide-react";

interface WelcomeHeroProps {
  firstName: string;
  lastName?: string;
  avatarUrl?: string;
  city?: string;
  verified?: boolean;
  userType: 'owner' | 'walker';
  heroImage?: string;
  unreadNotifications?: number;
  actions?: Array<{
    label: string;
    icon: LucideIcon;
    onClick: () => void;
    variant?: 'default' | 'outline';
  }>;
}

export const WelcomeHero = ({
  firstName,
  lastName,
  avatarUrl,
  city,
  verified,
  userType,
  heroImage,
  unreadNotifications = 0,
  actions = []
}: WelcomeHeroProps) => {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="relative mb-8 p-6 md:p-8 rounded-2xl bg-gradient-to-r from-primary/10 via-primary/5 to-transparent border border-primary/10 overflow-hidden"
    >
      {heroImage && (
        <div className="absolute inset-0 opacity-5">
          <img src={heroImage} alt="" className="w-full h-full object-cover" />
        </div>
      )}
      
      <div className="relative flex flex-col md:flex-row md:items-center md:justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="relative">
            <Avatar className="h-20 w-20 ring-4 ring-background shadow-lg">
              <AvatarImage src={avatarUrl} />
              <AvatarFallback className="bg-primary text-primary-foreground text-2xl font-bold">
                {firstName?.charAt(0)}{lastName?.charAt(0)}
              </AvatarFallback>
            </Avatar>
            {unreadNotifications > 0 && (
              <span className="absolute -top-1 -right-1 w-6 h-6 bg-destructive text-destructive-foreground rounded-full text-xs flex items-center justify-center font-bold animate-pulse">
                {unreadNotifications}
              </span>
            )}
            {verified && (
              <div className="absolute -bottom-1 -right-1 w-7 h-7 bg-primary rounded-full flex items-center justify-center ring-2 ring-background">
                <Shield className="h-4 w-4 text-primary-foreground" />
              </div>
            )}
          </div>
          
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h1 className="text-2xl md:text-3xl font-bold text-foreground">
                Bonjour {firstName} 👋
              </h1>
              {verified && (
                <Badge className="bg-primary text-primary-foreground gap-1">
                  <Shield className="h-3 w-3" />
                  Vérifié
                </Badge>
              )}
            </div>
            <p className="text-muted-foreground">
              {userType === 'owner' 
                ? 'Bienvenue sur votre espace Propriétaire' 
                : 'Tableau de bord promeneur'}
            </p>
            {city && (
              <p className="text-sm text-muted-foreground flex items-center gap-1 mt-1">
                <MapPin className="h-3 w-3" />
                {city}
              </p>
            )}
          </div>
        </div>
        
        {actions.length > 0 && (
          <div className="flex flex-wrap gap-3">
            {actions.map((action, index) => (
              <Button 
                key={index}
                variant={action.variant || 'outline'}
                onClick={action.onClick}
                className="gap-2"
              >
                <action.icon className="h-4 w-4" />
                {action.label}
              </Button>
            ))}
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default WelcomeHero;
