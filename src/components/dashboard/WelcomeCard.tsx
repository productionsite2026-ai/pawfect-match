import { motion } from "framer-motion";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { MapPin, Shield, ChevronRight, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

interface WelcomeCardProps {
  firstName?: string | null;
  lastName?: string | null;
  avatarUrl?: string | null;
  city?: string | null;
  isVerified?: boolean;
  userType?: 'owner' | 'walker' | 'both';
  notificationCount?: number;
  profileCompletion?: number;
  onCompleteProfile?: () => void;
  actions?: Array<{
    label: string;
    onClick: () => void;
    variant?: 'default' | 'outline';
    icon?: React.ReactNode;
  }>;
  backgroundImage?: string;
}

export const WelcomeCard = ({
  firstName,
  lastName,
  avatarUrl,
  city,
  isVerified,
  userType = 'owner',
  notificationCount = 0,
  profileCompletion = 100,
  onCompleteProfile,
  actions = [],
  backgroundImage
}: WelcomeCardProps) => {
  const initials = `${firstName?.[0] || ''}${lastName?.[0] || ''}`.toUpperCase() || 'U';
  const greeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Bonjour';
    if (hour < 18) return 'Bon après-midi';
    return 'Bonsoir';
  };

  const userTypeLabel = {
    owner: 'Propriétaire',
    walker: 'Accompagnateur Certifié',
    both: 'Propriétaire & Accompagnateur Certifié'
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="relative rounded-2xl bg-gradient-to-r from-primary/10 via-primary/5 to-transparent border border-primary/10 overflow-hidden"
    >
      {/* Background image */}
      {backgroundImage && (
        <div className="absolute inset-0 opacity-5">
          <img src={backgroundImage} alt="" className="w-full h-full object-cover" />
        </div>
      )}

      <div className="relative p-6 md:p-8">
        {/* Main content */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          {/* User info */}
          <div className="flex items-center gap-4">
            <div className="relative">
              <Avatar className="h-16 w-16 md:h-20 md:w-20 ring-4 ring-background shadow-lg">
                <AvatarImage src={avatarUrl || undefined} />
                <AvatarFallback className="bg-primary text-primary-foreground text-xl md:text-2xl font-bold">
                  {initials}
                </AvatarFallback>
              </Avatar>
              {notificationCount > 0 && (
                <motion.span 
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute -top-1 -right-1 w-6 h-6 bg-destructive text-destructive-foreground rounded-full text-xs flex items-center justify-center font-bold"
                >
                  {notificationCount > 9 ? '9+' : notificationCount}
                </motion.span>
              )}
            </div>
            <div>
              <h1 className="text-xl md:text-2xl lg:text-3xl font-bold text-foreground">
                {greeting()}, {firstName || 'Utilisateur'} 👋
              </h1>
              <div className="flex flex-wrap items-center gap-2 mt-1">
                <Badge variant={isVerified ? 'default' : 'secondary'} className="gap-1">
                  {isVerified && <Shield className="h-3 w-3" />}
                  {userTypeLabel[userType]}
                </Badge>
                {city && (
                  <span className="text-sm text-muted-foreground flex items-center gap-1">
                    <MapPin className="h-3 w-3" />
                    {city}
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Actions */}
          {actions.length > 0 && (
            <div className="flex flex-wrap gap-3">
              {actions.map((action, i) => (
                <Button 
                  key={i}
                  variant={action.variant || (i === 0 ? 'default' : 'outline')}
                  onClick={action.onClick}
                  className={cn(
                    "gap-2",
                    i === 0 && "shadow-lg"
                  )}
                >
                  {action.icon}
                  {action.label}
                </Button>
              ))}
            </div>
          )}
        </div>

        {/* Profile completion */}
        {profileCompletion < 100 && onCompleteProfile && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            className="mt-6 pt-6 border-t border-primary/10"
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center">
                  <Sparkles className="h-5 w-5 text-amber-600" />
                </div>
                <div>
                  <p className="font-medium text-sm">Complétez votre profil</p>
                  <p className="text-xs text-muted-foreground">Un profil complet inspire confiance</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Progress value={profileCompletion} className="w-24 h-2" />
                <span className="text-sm font-medium min-w-[2.5rem]">{profileCompletion}%</span>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={onCompleteProfile}
                  className="gap-1"
                >
                  Compléter <ChevronRight className="h-3 w-3" />
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
};

export default WelcomeCard;
