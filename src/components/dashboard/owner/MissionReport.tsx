import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  FileText, CheckCircle, Clock, MapPin, Dog, 
  User, Star, Download, Calendar, Camera
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { format } from "date-fns";
import { fr } from "date-fns/locale";

interface MissionReportProps {
  bookingId: string;
}

export const MissionReport: React.FC<MissionReportProps> = ({ bookingId }) => {
  const [booking, setBooking] = useState<any>(null);
  const [walker, setWalker] = useState<any>(null);
  const [proofs, setProofs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchReportData();
  }, [bookingId]);

  const fetchReportData = async () => {
    try {
      // Fetch booking details
      const { data: bookingData } = await supabase
        .from("bookings")
        .select("*, dogs(name, breed, photo_url)")
        .eq("id", bookingId)
        .single();

      if (bookingData) {
        setBooking(bookingData);

        // Fetch walker info
        if (bookingData.walker_id) {
          const { data: walkerData } = await supabase
            .from("profiles")
            .select("first_name, avatar_url")
            .eq("id", bookingData.walker_id)
            .single();
          
          const { data: walkerProfile } = await supabase
            .from("walker_profiles")
            .select("rating, total_reviews")
            .eq("user_id", bookingData.walker_id)
            .single();

          setWalker({ ...walkerData, ...walkerProfile });
        }

        // Fetch proofs
        const { data: proofsData } = await supabase
          .from("walk_proofs")
          .select("*")
          .eq("booking_id", bookingId)
          .order("uploaded_at", { ascending: true });

        setProofs(proofsData || []);
      }
    } catch (error) {
      console.error("Error fetching report:", error);
    } finally {
      setLoading(false);
    }
  };

  const calculateDuration = () => {
    if (!proofs.length || proofs.length < 2) return null;
    
    const startProof = proofs.find(p => p.photo_type === 'start');
    const endProof = proofs.find(p => p.photo_type === 'end');
    
    if (!startProof || !endProof) return null;
    
    const start = new Date(startProof.uploaded_at);
    const end = new Date(endProof.uploaded_at);
    const durationMinutes = Math.round((end.getTime() - start.getTime()) / 60000);
    
    return durationMinutes;
  };

  const downloadReport = () => {
    // Generate text report
    const actualDuration = calculateDuration();
    const report = `
RAPPORT DE MISSION - DOGWALKING
================================

Date : ${booking?.scheduled_date ? format(new Date(booking.scheduled_date), 'EEEE d MMMM yyyy', { locale: fr }) : 'N/A'}
Heure prévue : ${booking?.scheduled_time || 'N/A'}

CHIEN
-----
Nom : ${booking?.dogs?.name || 'N/A'}
Race : ${booking?.dogs?.breed || 'N/A'}

PROMENEUR
---------
Nom : ${walker?.first_name || 'N/A'}
Note moyenne : ${walker?.rating ? `${walker.rating.toFixed(1)}/5` : 'N/A'}

MISSION
-------
Type : ${booking?.service_type || 'Promenade'}
Durée prévue : ${booking?.duration_minutes || 60} minutes
Durée réelle : ${actualDuration ? `${actualDuration} minutes` : 'N/A'}
Lieu : ${booking?.address || 'N/A'}${booking?.city ? `, ${booking.city}` : ''}

PREUVES PHOTO
-------------
${proofs.map((p, i) => `${i + 1}. ${p.photo_type === 'start' ? 'Prise en charge' : p.photo_type === 'end' ? 'Fin de mission' : 'Pendant'} - ${format(new Date(p.uploaded_at), 'HH:mm', { locale: fr })}${p.caption ? ` : "${p.caption}"` : ''}`).join('\n')}

PAIEMENT
--------
Montant : ${booking?.price ? `${booking.price}€` : 'N/A'}
Statut : ${booking?.status === 'completed' ? 'Terminé' : booking?.status}

================================
Généré automatiquement par DogWalking
    `.trim();

    const blob = new Blob([report], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `rapport-mission-${bookingId.slice(0, 8)}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center py-8">
          <motion.div
            className="h-8 w-8 border-4 border-primary border-t-transparent rounded-full"
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          />
        </CardContent>
      </Card>
    );
  }

  if (!booking || booking.status !== 'completed') {
    return null;
  }

  const actualDuration = calculateDuration();

  return (
    <Card className="shadow-lg overflow-hidden">
      <CardHeader className="bg-gradient-to-r from-green-500/10 to-emerald-500/10">
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <FileText className="h-5 w-5 text-green-600" />
            Rapport de mission
          </div>
          <Badge className="bg-green-500 gap-1">
            <CheckCircle className="h-3 w-3" />
            Terminée
          </Badge>
        </CardTitle>
      </CardHeader>
      
      <CardContent className="pt-6 space-y-6">
        {/* Summary Stats */}
        <div className="grid grid-cols-3 gap-4">
          <div className="text-center p-3 bg-muted/50 rounded-xl">
            <Clock className="h-5 w-5 mx-auto mb-1 text-primary" />
            <p className="text-xl font-bold">
              {actualDuration ? `${actualDuration}` : booking?.duration_minutes || 60}
            </p>
            <p className="text-xs text-muted-foreground">minutes</p>
          </div>
          <div className="text-center p-3 bg-muted/50 rounded-xl">
            <Camera className="h-5 w-5 mx-auto mb-1 text-primary" />
            <p className="text-xl font-bold">{proofs.length}</p>
            <p className="text-xs text-muted-foreground">photos</p>
          </div>
          <div className="text-center p-3 bg-muted/50 rounded-xl">
            <Star className="h-5 w-5 mx-auto mb-1 text-amber-500" />
            <p className="text-xl font-bold">{walker?.rating?.toFixed(1) || '-'}</p>
            <p className="text-xs text-muted-foreground">note</p>
          </div>
        </div>

        {/* Timeline */}
        {proofs.length > 0 && (
          <div className="space-y-3">
            <h4 className="font-medium text-sm text-muted-foreground">Chronologie</h4>
            <div className="space-y-2">
              {proofs.map((proof, index) => (
                <div 
                  key={proof.id}
                  className="flex items-center gap-3 p-3 bg-muted/30 rounded-lg"
                >
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                    proof.photo_type === 'start' ? 'bg-green-500' :
                    proof.photo_type === 'end' ? 'bg-amber-500' : 'bg-blue-500'
                  }`}>
                    <span className="text-white text-sm font-bold">{index + 1}</span>
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-sm">
                      {proof.photo_type === 'start' ? 'Prise en charge' :
                       proof.photo_type === 'end' ? 'Fin de mission' : 'Pendant la promenade'}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {format(new Date(proof.uploaded_at), 'HH:mm', { locale: fr })}
                      {proof.caption && ` - ${proof.caption}`}
                    </p>
                  </div>
                  <img 
                    src={proof.photo_url} 
                    alt="" 
                    className="w-12 h-12 rounded object-cover"
                  />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Details */}
        <div className="space-y-3 pt-4 border-t">
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground flex items-center gap-2">
              <Dog className="h-4 w-4" />
              Chien
            </span>
            <span className="font-medium">{booking?.dogs?.name}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground flex items-center gap-2">
              <User className="h-4 w-4" />
              Accompagnateur Certifié
            </span>
            <span className="font-medium">{walker?.first_name}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              Date
            </span>
            <span className="font-medium">
              {format(new Date(booking.scheduled_date), 'd MMMM yyyy', { locale: fr })}
            </span>
          </div>
          {booking?.city && (
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground flex items-center gap-2">
                <MapPin className="h-4 w-4" />
                Lieu
              </span>
              <span className="font-medium">{booking.city}</span>
            </div>
          )}
        </div>

        {/* Download Button */}
        <Button
          variant="outline"
          className="w-full gap-2"
          onClick={downloadReport}
        >
          <Download className="h-4 w-4" />
          Télécharger le rapport
        </Button>
      </CardContent>
    </Card>
  );
};

export default MissionReport;
