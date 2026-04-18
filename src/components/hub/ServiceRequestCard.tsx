import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { MapPin, Calendar, Clock, Dog, MessageSquare, PawPrint } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { fr } from "date-fns/locale";

export interface ServiceRequest {
  id: string;
  owner_name: string;
  owner_avatar?: string;
  service_type: string;
  description: string;
  city: string;
  postal_code?: string;
  date_needed?: string;
  time_slot?: string;
  pet_type?: string;
  pet_name?: string;
  created_at: string;
  responses_count?: number;
}

interface ServiceRequestCardProps {
  request: ServiceRequest;
  index: number;
  onRespond: (requestId: string) => void;
}

const serviceLabels: Record<string, { label: string; color: string }> = {
  promenade: { label: "Promenade", color: "bg-green-100 text-green-800" },
  garde: { label: "Garde", color: "bg-blue-100 text-blue-800" },
  visite: { label: "Visite à domicile", color: "bg-purple-100 text-purple-800" },
  veterinaire: { label: "Accompagnement véto", color: "bg-orange-100 text-orange-800" },
};

export const ServiceRequestCard = ({ request, index, onRespond }: ServiceRequestCardProps) => {
  const serviceInfo = serviceLabels[request.service_type] || { 
    label: request.service_type, 
    color: "bg-gray-100 text-gray-800" 
  };

  const timeAgo = formatDistanceToNow(new Date(request.created_at), { 
    addSuffix: true, 
    locale: fr 
  });

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
    >
      <Card className="hover:shadow-lg transition-all duration-300 border-border/60 hover:border-primary/30">
        <CardContent className="p-5">
          <div className="flex flex-col gap-4">
            {/* Header */}
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-center gap-3">
                <Avatar className="h-12 w-12 ring-2 ring-border">
                  <AvatarImage src={request.owner_avatar} />
                  <AvatarFallback className="bg-primary/10 text-primary font-bold">
                    {request.owner_name.charAt(0)}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="font-semibold text-foreground">
                    {request.owner_name}
                  </h3>
                  <p className="text-xs text-muted-foreground">{timeAgo}</p>
                </div>
              </div>
              <Badge className={serviceInfo.color}>
                {serviceInfo.label}
              </Badge>
            </div>

            {/* Description */}
            <p className="text-sm text-foreground line-clamp-3">
              {request.description}
            </p>

            {/* Details Grid */}
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div className="flex items-center gap-2 text-muted-foreground">
                <MapPin className="h-4 w-4 flex-shrink-0" />
                <span className="truncate">{request.city} {request.postal_code}</span>
              </div>
              {request.date_needed && (
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Calendar className="h-4 w-4 flex-shrink-0" />
                  <span>{request.date_needed}</span>
                </div>
              )}
              {request.time_slot && (
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Clock className="h-4 w-4 flex-shrink-0" />
                  <span>{request.time_slot}</span>
                </div>
              )}
              {request.pet_name && (
                <div className="flex items-center gap-2 text-muted-foreground">
                  <PawPrint className="h-4 w-4 flex-shrink-0" />
                  <span>{request.pet_name} ({request.pet_type || 'Chien'})</span>
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="flex items-center justify-between pt-3 border-t">
              <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                <MessageSquare className="h-4 w-4" />
                <span>{request.responses_count || 0} réponse{(request.responses_count || 0) !== 1 ? 's' : ''}</span>
              </div>
              <Button 
                onClick={() => onRespond(request.id)}
                className="shadow-sm"
              >
                Répondre à cette demande
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};
