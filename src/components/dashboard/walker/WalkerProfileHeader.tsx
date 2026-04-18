import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Star, Shield, Award } from "lucide-react";
import { motion } from "framer-motion";

interface WalkerProfileHeaderProps {
  name: string;
  photoUrl?: string;
  profileCompletion: number;
  isVerified?: boolean;
  isExpert?: boolean;
}

const WalkerProfileHeader = ({ 
  name, 
  photoUrl, 
  profileCompletion, 
  isVerified = false,
  isExpert = false 
}: WalkerProfileHeaderProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="mb-6"
    >
      <Card className="overflow-hidden bg-gradient-to-br from-primary/5 to-accent/5 border-0 shadow-lg">
        <CardContent className="p-6">
          <div className="flex items-center gap-4">
            {/* Avatar */}
            <div className="relative">
              <Avatar className="h-20 w-20 ring-4 ring-primary/20 shadow-xl">
                <AvatarImage src={photoUrl} alt={name} className="object-cover" />
                <AvatarFallback className="bg-primary/10 text-primary text-2xl font-bold">
                  {name.charAt(0)}
                </AvatarFallback>
              </Avatar>
              {isVerified && (
                <div className="absolute -bottom-1 -right-1 bg-primary text-primary-foreground rounded-full p-1.5 shadow-lg">
                  <Shield className="h-4 w-4" />
                </div>
              )}
            </div>
            
            {/* Infos */}
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-sm text-muted-foreground">Profil :</span>
                <span className="font-semibold">{profileCompletion}% complet</span>
              </div>
              <Progress value={profileCompletion} className="h-2 mb-3" />
              
              {/* Badges */}
              <div className="flex gap-2">
                {isExpert && (
                  <Badge className="bg-accent text-accent-foreground gap-1">
                    <Award className="h-3 w-3" />
                    Expert
                  </Badge>
                )}
                {isVerified && (
                  <Badge variant="outline" className="border-primary text-primary gap-1">
                    <Shield className="h-3 w-3" />
                    Vérifié
                  </Badge>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default WalkerProfileHeader;
