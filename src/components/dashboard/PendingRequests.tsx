import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  Bell, Calendar, Clock, Phone, Dog, MapPin, 
  CheckCircle, XCircle, ChevronRight
} from "lucide-react";
import { motion } from "framer-motion";

interface PendingRequest {
  id: string;
  ownerName: string;
  ownerPhoto?: string;
  ownerPhone?: string;
  dogName: string;
  dogBreed?: string;
  dogPhoto?: string;
  date: string;
  time: string;
  service: string;
  duration?: number;
  price: number;
  location?: string;
}

interface PendingRequestsProps {
  requests: PendingRequest[];
  onAccept: (id: string) => void;
  onDecline: (id: string) => void;
  onViewDetails?: (id: string) => void;
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

export const PendingRequests = ({
  requests,
  onAccept,
  onDecline,
  onViewDetails
}: PendingRequestsProps) => {
  if (requests.length === 0) return null;

  return (
    <Card className="border-2 border-primary/30 bg-gradient-to-br from-primary/5 to-transparent overflow-hidden">
      <CardHeader className="bg-primary/5">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2 text-primary">
              <Bell className="h-5 w-5 animate-pulse" />
              Nouvelles demandes
            </CardTitle>
            <CardDescription>
              {requests.length} demande(s) en attente de réponse
            </CardDescription>
          </div>
          <Badge className="bg-primary text-primary-foreground text-lg px-3 py-1">
            {requests.length}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="p-0 divide-y">
        {requests.map((request, index) => (
          <motion.div
            key={request.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
            className="p-4 md:p-6 hover:bg-muted/30 transition-colors"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <Avatar className="h-12 w-12 ring-2 ring-background shadow">
                  <AvatarImage src={request.ownerPhoto} />
                  <AvatarFallback className="bg-primary/10 text-primary font-semibold">
                    {request.ownerName?.charAt(0) || '?'}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-semibold">{request.ownerName}</span>
                    {request.ownerPhone && (
                      <Button variant="ghost" size="icon" className="h-6 w-6">
                        <Phone className="h-3 w-3" />
                      </Button>
                    )}
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Dog className="h-4 w-4" />
                    <span>{request.dogName}</span>
                    {request.dogBreed && <span className="text-xs">• {request.dogBreed}</span>}
                  </div>
                </div>
              </div>
              <Badge variant="outline" className="font-semibold text-primary">
                {request.price}€
              </Badge>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4 text-sm">
              <div className="flex items-center gap-2 text-muted-foreground">
                <Calendar className="h-4 w-4" />
                <span>{new Date(request.date).toLocaleDateString('fr-FR', { weekday: 'short', day: 'numeric', month: 'short' })}</span>
              </div>
              <div className="flex items-center gap-2 text-muted-foreground">
                <Clock className="h-4 w-4" />
                <span>{request.time}</span>
                {request.duration && <span>• {request.duration}min</span>}
              </div>
              <div className="flex items-center gap-2">
                <Badge variant="secondary">{serviceLabels[request.service] || request.service}</Badge>
              </div>
              {request.location && (
                <div className="flex items-center gap-2 text-muted-foreground">
                  <MapPin className="h-4 w-4" />
                  <span className="truncate">{request.location}</span>
                </div>
              )}
            </div>
            
            <div className="flex gap-2">
              <Button 
                className="flex-1 gap-2"
                onClick={() => onAccept(request.id)}
              >
                <CheckCircle className="h-4 w-4" />
                Accepter
              </Button>
              <Button 
                variant="outline" 
                className="flex-1 gap-2"
                onClick={() => onDecline(request.id)}
              >
                <XCircle className="h-4 w-4" />
                Refuser
              </Button>
              {onViewDetails && (
                <Button 
                  variant="ghost" 
                  size="icon"
                  onClick={() => onViewDetails(request.id)}
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              )}
            </div>
          </motion.div>
        ))}
      </CardContent>
    </Card>
  );
};

export default PendingRequests;
