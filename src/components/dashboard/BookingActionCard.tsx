import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  Play, CheckCircle, Clock, MapPin, Phone, MessageCircle, 
  Calendar, Dog, Camera, Route
} from "lucide-react";
import { motion } from "framer-motion";
import { toast } from "@/hooks/use-toast";

interface BookingActionCardProps {
  booking: {
    id: string;
    scheduled_date: string;
    scheduled_time: string;
    status: string;
    service_type: string;
    address?: string;
    city?: string;
    duration_minutes?: number;
    price?: number;
    dogs?: {
      name: string;
      breed?: string;
      photo_url?: string;
    };
    owner?: {
      first_name?: string;
      avatar_url?: string;
      phone?: string;
    };
  };
  onStartWalk?: (bookingId: string) => void;
  onCompleteWalk?: (bookingId: string) => void;
  onUploadProof?: (bookingId: string) => void;
}

const serviceLabels: Record<string, string> = {
  promenade: "Promenade",
  visite: "Visite",
  garde: "Garde",
  veterinaire: "Vétérinaire",
};

const serviceIcons: Record<string, typeof Route> = {
  promenade: Route,
  visite: Dog,
  garde: Calendar,
  veterinaire: Clock,
};

export const BookingActionCard = ({ 
  booking, 
  onStartWalk, 
  onCompleteWalk,
  onUploadProof 
}: BookingActionCardProps) => {
  const ServiceIcon = serviceIcons[booking.service_type] || Route;
  const isInProgress = booking.status === "in_progress";
  const isConfirmed = booking.status === "confirmed";
  
  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString("fr-FR", {
      weekday: "short",
      day: "numeric",
      month: "short",
    });
  };

  const formatTime = (time: string) => {
    return time.slice(0, 5);
  };

  const handleStart = () => {
    if (onStartWalk) {
      onStartWalk(booking.id);
    } else {
      toast({
        title: "Mission démarrée ! 🚀",
        description: "N'oubliez pas de prendre des photos pendant la promenade.",
      });
    }
  };

  const handleComplete = () => {
    if (onCompleteWalk) {
      onCompleteWalk(booking.id);
    } else {
      toast({
        title: "Mission terminée ! 🎉",
        description: "Merci d'avoir pris soin de ce compagnon.",
      });
    }
  };

  const handleUploadProof = () => {
    if (onUploadProof) {
      onUploadProof(booking.id);
    } else {
      toast({
        title: "Preuve envoyée",
        description: "Le Propriétaire sera notifié.",
      });
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.01 }}
      transition={{ type: "spring", stiffness: 300 }}
    >
      <Card className={`overflow-hidden ${isInProgress ? "ring-2 ring-primary shadow-lg" : ""}`}>
        {/* Status bar for in-progress */}
        {isInProgress && (
          <div className="bg-primary px-4 py-1.5 flex items-center justify-between">
            <span className="text-sm font-medium text-primary-foreground flex items-center gap-2">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-white"></span>
              </span>
              Mission en cours
            </span>
            <Clock className="h-4 w-4 text-primary-foreground" />
          </div>
        )}

        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row sm:items-center gap-4">
            {/* Left - Dog info */}
            <div className="flex items-center gap-3 flex-1">
              <Avatar className="h-14 w-14 border-2 border-primary/20">
                <AvatarImage src={booking.dogs?.photo_url || ""} />
                <AvatarFallback className="bg-primary/10 text-primary">
                  <Dog className="h-6 w-6" />
                </AvatarFallback>
              </Avatar>
              <div>
                <div className="flex items-center gap-2">
                  <h4 className="font-semibold">{booking.dogs?.name || "Animal"}</h4>
                  <Badge variant="outline" className="text-xs gap-1">
                    <ServiceIcon className="h-3 w-3" />
                    {serviceLabels[booking.service_type] || booking.service_type}
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground">
                  {booking.dogs?.breed || "Race non précisée"}
                </p>
                <div className="flex items-center gap-3 mt-1 text-xs text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <Calendar className="h-3 w-3" />
                    {formatDate(booking.scheduled_date)}
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    {formatTime(booking.scheduled_time)}
                  </span>
                </div>
              </div>
            </div>

            {/* Right - Actions */}
            <div className="flex flex-col sm:flex-row gap-2">
              {/* Contact buttons */}
              <div className="flex gap-1">
                {booking.owner?.phone && (
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="h-9 w-9"
                    onClick={() => window.open(`tel:${booking.owner?.phone}`)}
                  >
                    <Phone className="h-4 w-4" />
                  </Button>
                )}
                <Button variant="ghost" size="icon" className="h-9 w-9">
                  <MessageCircle className="h-4 w-4" />
                </Button>
              </div>

              {/* Main action buttons */}
              {isConfirmed && (
                <Button onClick={handleStart} className="gap-2 shadow-lg">
                  <Play className="h-4 w-4" />
                  Démarrer
                </Button>
              )}

              {isInProgress && (
                <div className="flex gap-2">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="gap-1"
                    onClick={handleUploadProof}
                  >
                    <Camera className="h-4 w-4" />
                    Photo
                  </Button>
                  <Button 
                    onClick={handleComplete} 
                    className="gap-2 bg-green-600 hover:bg-green-700"
                  >
                    <CheckCircle className="h-4 w-4" />
                    Terminer
                  </Button>
                </div>
              )}
            </div>
          </div>

          {/* Location info */}
          {(booking.address || booking.city) && (
            <div className="mt-3 pt-3 border-t flex items-center gap-2 text-sm text-muted-foreground">
              <MapPin className="h-4 w-4 flex-shrink-0" />
              <span>{booking.address || booking.city}</span>
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default BookingActionCard;
