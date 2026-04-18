import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Calendar, Clock, MapPin, ChevronRight, Dog, Star } from "lucide-react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

interface Booking {
  id: string;
  dogName: string;
  dogBreed?: string;
  dogPhoto?: string;
  walkerName?: string;
  walkerPhoto?: string;
  walkerRating?: number;
  ownerName?: string;
  ownerPhoto?: string;
  date: string;
  time: string;
  service: string;
  status: string;
  price?: number;
  location?: string;
}

interface UpcomingBookingsProps {
  bookings: Booking[];
  type: 'owner' | 'walker';
  onViewAll?: () => void;
  onBookingClick?: (id: string) => void;
}

const serviceLabels: Record<string, string> = {
  promenade: "Promenade",
  visite: "Visite",
  garde: "Garde",
  veterinaire: "Vétérinaire",
  dog_sitting: "Dog Sitting",
  pet_sitting: "Pet Sitting",
  marche_reguliere: "Marche régulière"
};

const statusBadges: Record<string, { label: string; className: string }> = {
  pending: { label: 'En attente', className: 'bg-amber-100 text-amber-700 border-amber-200' },
  confirmed: { label: 'Confirmée', className: 'bg-primary/10 text-primary border-primary/20' },
  completed: { label: 'Terminée', className: 'bg-green-100 text-green-700 border-green-200' },
  cancelled: { label: 'Annulée', className: 'bg-red-100 text-red-700 border-red-200' },
};

export const UpcomingBookings = ({
  bookings,
  type,
  onViewAll,
  onBookingClick
}: UpcomingBookingsProps) => {
  const navigate = useNavigate();

  return (
    <Card className="overflow-hidden">
      <CardHeader className="flex flex-row items-center justify-between bg-muted/30">
        <div>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5 text-primary" />
            {type === 'owner' ? 'Prochaines réservations' : 'Missions à venir'}
          </CardTitle>
          <CardDescription>
            {bookings.length} {type === 'owner' ? 'réservation(s)' : 'mission(s)'} à venir
          </CardDescription>
        </div>
        {onViewAll && (
          <Button variant="ghost" size="sm" onClick={onViewAll} className="gap-1">
            Voir tout <ChevronRight className="h-4 w-4" />
          </Button>
        )}
      </CardHeader>
      <CardContent className="p-0">
        {bookings.length === 0 ? (
          <div className="text-center py-12 px-4">
            <div className="w-16 h-16 rounded-full bg-muted mx-auto mb-4 flex items-center justify-center">
              <Calendar className="h-8 w-8 text-muted-foreground/50" />
            </div>
            <h3 className="font-semibold mb-2">
              {type === 'owner' ? 'Aucune réservation à venir' : 'Aucune mission à venir'}
            </h3>
            <p className="text-sm text-muted-foreground mb-4">
              {type === 'owner' 
                ? 'Trouvez un promeneur pour votre compagnon' 
                : 'Les nouvelles demandes apparaîtront ici'}
            </p>
            {type === 'owner' && (
              <Button onClick={() => navigate('/walkers')}>
                Trouver un promeneur
              </Button>
            )}
          </div>
        ) : (
          <div className="divide-y">
            {bookings.map((booking, index) => (
              <motion.div
                key={booking.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="p-4 hover:bg-muted/30 transition-colors cursor-pointer"
                onClick={() => onBookingClick?.(booking.id)}
              >
                <div className="flex items-start gap-4">
                  <Avatar className="h-12 w-12 ring-2 ring-background">
                    <AvatarImage src={type === 'owner' ? booking.walkerPhoto : booking.ownerPhoto} />
                    <AvatarFallback className="bg-primary/10 text-primary">
                      {type === 'owner' 
                        ? booking.walkerName?.charAt(0) 
                        : booking.ownerName?.charAt(0) || '?'}
                    </AvatarFallback>
                  </Avatar>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-semibold">
                        {type === 'owner' ? booking.walkerName : booking.ownerName}
                      </span>
                      {type === 'owner' && booking.walkerRating && (
                        <span className="flex items-center gap-1 text-xs text-amber-600">
                          <Star className="h-3 w-3 fill-amber-500" />
                          {booking.walkerRating.toFixed(1)}
                        </span>
                      )}
                    </div>
                    
                    <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                      <Dog className="h-4 w-4" />
                      <span>{booking.dogName}</span>
                      {booking.dogBreed && (
                        <span className="text-xs">• {booking.dogBreed}</span>
                      )}
                    </div>

                    <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        {new Date(booking.date).toLocaleDateString('fr-FR', { 
                          weekday: 'short', 
                          day: 'numeric', 
                          month: 'short' 
                        })}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {booking.time}
                      </span>
                      {booking.location && (
                        <span className="flex items-center gap-1">
                          <MapPin className="h-3 w-3" />
                          {booking.location}
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="text-right">
                    <Badge className={statusBadges[booking.status]?.className || ''}>
                      {statusBadges[booking.status]?.label || booking.status}
                    </Badge>
                    <div className="mt-2">
                      <Badge variant="outline" className="text-xs">
                        {serviceLabels[booking.service] || booking.service}
                      </Badge>
                    </div>
                    {booking.price && (
                      <p className="text-sm font-bold text-primary mt-2">{booking.price}€</p>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default UpcomingBookings;
