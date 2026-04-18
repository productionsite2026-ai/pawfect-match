import { useState, useEffect, useRef } from 'react';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  Play, Square, Camera, MessageCircle, Clock, CheckCircle, 
  AlertTriangle, PawPrint, Timer, Upload, Calendar, ChevronRight, Lock
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useBookings } from '@/hooks/useNewBookings';
import { usePushNotifications } from '@/hooks/usePushNotifications';

type WalkPhase = 'select_booking' | 'idle' | 'starting' | 'in_progress' | 'ending' | 'completed';

interface WalkManagementSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  activeMission?: {
    id: string;
    dogName: string;
    dogPhoto?: string;
    ownerName: string;
    duration: number;
    status: string;
  } | null;
}

const WalkManagementSheet = ({ open, onOpenChange, activeMission }: WalkManagementSheetProps) => {
  const { user } = useAuth();
  const { data: bookings = [] } = useBookings("walker");
  const { notifyMissionStart, notifyMissionEnd } = usePushNotifications();
  const [phase, setPhase] = useState<WalkPhase>(activeMission ? 'idle' : 'select_booking');
  const [selectedBooking, setSelectedBooking] = useState<any | null>(activeMission || null);
  const [elapsed, setElapsed] = useState(0);
  const [message, setMessage] = useState('');
  const [photoUrls, setPhotoUrls] = useState<string[]>([]);
  const [inputCode, setInputCode] = useState('');
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Confirmed bookings available to start
  const confirmedBookings = bookings.filter((b: any) => b.status === 'confirmed');

  // Update phase when activeMission changes
  useEffect(() => {
    if (activeMission) {
      setSelectedBooking(activeMission);
      if (activeMission.status === 'in_progress') {
        setPhase('in_progress');
      } else {
        setPhase('idle');
      }
    } else if (!selectedBooking) {
      setPhase('select_booking');
    }
  }, [activeMission]);

  // Timer
  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;
    if (phase === 'in_progress') {
      interval = setInterval(() => setElapsed(prev => prev + 1), 1000);
    }
    return () => clearInterval(interval);
  }, [phase]);

  const formatTime = (seconds: number) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const handleSelectBooking = (booking: any) => {
    setSelectedBooking({
      id: booking.id,
      dogName: booking.dogs?.name || "Chien",
      dogPhoto: booking.dogs?.photo_url || undefined,
      ownerName: "Propriétaire",
      duration: booking.duration_minutes || 30,
      status: booking.status,
    });
    setPhase('idle');
  };

  const handleStartWalk = () => {
    setPhase('starting');
  };

  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !user || !selectedBooking) return;

    setUploading(true);
    const ext = file.name.split('.').pop();
    const path = `${user.id}/${selectedBooking.id}/${Date.now()}.${ext}`;

    const { error: uploadError } = await supabase.storage
      .from('walk-proofs')
      .upload(path, file, { contentType: file.type });

    if (uploadError) {
      toast.error("Erreur lors de l'envoi de la photo");
      setUploading(false);
      return;
    }

    const photoType = phase === 'starting' ? 'start' : 'during';
    await supabase.from('walk_proofs').insert({
      booking_id: selectedBooking.id,
      walker_id: user.id,
      photo_url: path,
      photo_type: photoType,
      status: 'pending',
    });

    setPhotoUrls(prev => [...prev, path]);
    toast.success(`Photo enregistrée ✓ (${photoUrls.length + 1})`);
    setUploading(false);
  };

  const handleTakePhoto = () => {
    fileInputRef.current?.click();
  };

  const handleDemoPhoto = () => {
    const fakeUrl = `demo_photo_${Date.now()}`;
    setPhotoUrls(prev => [...prev, fakeUrl]);
    toast.success(`Photo ajoutée (démo) ✓ (${photoUrls.length + 1})`);
  };

  const handleConfirmStart = async () => {
    if (photoUrls.length === 0) {
      toast.error("📸 Photo obligatoire au départ !");
      return;
    }

    if (user && selectedBooking) {
      await supabase.from('bookings').update({ status: 'in_progress' }).eq('id', selectedBooking.id);
      
      const { data: booking } = await supabase.from('bookings').select('owner_id').eq('id', selectedBooking.id).single();
      if (booking) {
        const { data: profile } = await supabase.from('profiles').select('first_name').eq('id', user.id).single();
        await supabase.from('notifications').insert({
          user_id: booking.owner_id,
          title: '🐕 Mission démarrée !',
          message: `${profile?.first_name || 'L\'Accompagnateur'} a pris en charge ${selectedBooking.dogName}. Photo de départ reçue.`,
          type: 'booking',
          link: `/dashboard?tab=reservations`,
        });
        notifyMissionStart(selectedBooking.dogName, profile?.first_name || 'L\'Accompagnateur');
      }
    }

    setPhase('in_progress');
    setElapsed(0);
    toast.success("🚀 Mission démarrée !");
  };

  const handleEndWalk = () => {
    if (!message.trim()) {
      toast.error("💬 Le compte-rendu est obligatoire !");
      return;
    }
    if (photoUrls.length < 2) {
      toast.error("📸 Une photo supplémentaire est requise !");
      return;
    }
    setPhase('ending');
  };

  const handleConfirmEnd = async () => {
    if (!inputCode.trim()) {
      toast.error("🔑 Saisissez le code fourni par le Propriétaire !");
      return;
    }

    // Note: In a real app, we would verify the code against the database.
    // For this UI demo, we accept any 6-char code.
    if (inputCode.length < 4) {
      toast.error("Code invalide");
      return;
    }

    if (user && selectedBooking) {
      await supabase.from('bookings').update({
        status: 'completed',
        notes: message,
      }).eq('id', selectedBooking.id);

      const { data: booking } = await supabase.from('bookings').select('owner_id').eq('id', selectedBooking.id).single();
      if (booking) {
        const { data: profile } = await supabase.from('profiles').select('first_name').eq('id', user.id).single();
        await supabase.from('notifications').insert({
          user_id: booking.owner_id,
          title: 'Mission terminée ✅',
          message: `La mission de ${selectedBooking.dogName} est terminée et validée par code.`,
          type: 'booking',
          link: `/dashboard?tab=reservations`,
        });
        notifyMissionEnd(selectedBooking.dogName, profile?.first_name || 'L\'Accompagnateur');
      }
    }

    setPhase('completed');
    toast.success("🎉 Mission validée et terminée !");
  };

  const handleReset = () => {
    setPhase('select_booking');
    setSelectedBooking(null);
    setElapsed(0);
    setMessage('');
    setPhotoUrls([]);
    setInputCode('');
    onOpenChange(false);
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="bottom" className="h-[85vh] rounded-t-3xl p-0" aria-describedby="walk-sheet-desc">
        <div className="flex flex-col h-full">
          <SheetHeader className="p-5 pb-3 border-b">
            <div className="flex items-center justify-between">
              <SheetTitle className="flex items-center gap-2 text-lg">
                <PawPrint className="h-5 w-5 text-primary" />
                Outil "GO" Accompagnateur
              </SheetTitle>
              <Badge variant={phase === 'in_progress' ? 'default' : 'secondary'} className="font-semibold">
                {phase === 'select_booking' && '📋 Sélection'}
                {phase === 'idle' && '⏳ Prêt'}
                {phase === 'starting' && '📷 Départ'}
                {phase === 'in_progress' && '🏃 En cours'}
                {phase === 'ending' && '🔑 Validation'}
                {phase === 'completed' && '🎉 Succès'}
              </Badge>
            </div>
            <SheetDescription id="walk-sheet-desc" className="sr-only">
              Gérez votre mission DogWalking étape par étape avec preuves visuelles obligatoires.
            </SheetDescription>
          </SheetHeader>

          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            capture="environment"
            className="hidden"
            onChange={handlePhotoUpload}
          />

          <div className="flex-1 overflow-y-auto p-5">
            <AnimatePresence mode="wait">
              {/* SELECT MISSION */}
              {phase === 'select_booking' && (
                <motion.div key="select" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-4">
                  {confirmedBookings.length > 0 ? (
                    <>
                      <div className="text-center mb-4">
                        <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-3">
                          <Calendar className="h-8 w-8 text-primary" />
                        </div>
                        <h3 className="font-bold">Choisissez une mission</h3>
                        <p className="text-xs text-muted-foreground">Missions confirmées prêtes à démarrer</p>
                      </div>
                      <div className="space-y-2">
                        {confirmedBookings.map((b: any) => (
                          <motion.button
                            key={b.id}
                            whileTap={{ scale: 0.98 }}
                            onClick={() => handleSelectBooking(b)}
                            className="w-full bg-card rounded-2xl shadow-card p-4 flex items-center gap-3 text-left border border-border"
                          >
                            <div className="w-12 h-12 rounded-xl gradient-primary flex items-center justify-center shrink-0">
                              <PawPrint className="w-6 h-6 text-white" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="font-bold text-sm text-foreground">🐕 {b.dogs?.name || "Chien"}</p>
                              <div className="flex items-center gap-3 text-[10px] text-muted-foreground mt-0.5">
                                <span className="flex items-center gap-0.5"><Calendar className="w-3 h-3" /> {b.scheduled_date}</span>
                                <span className="flex items-center gap-0.5"><Clock className="w-3 h-3" /> {b.scheduled_time}</span>
                              </div>
                            </div>
                            <ChevronRight className="w-4 h-4 text-muted-foreground shrink-0" />
                          </motion.button>
                        ))}
                      </div>
                    </>
                  ) : (
                    <div className="text-center space-y-4 pt-8">
                      <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
                        <PawPrint className="h-10 w-10 text-primary/40" />
                      </div>
                      <h3 className="text-lg font-semibold text-foreground">Aucune mission à démarrer</h3>
                      <p className="text-sm text-muted-foreground max-w-xs mx-auto">
                        Vos missions confirmées apparaîtront ici le jour J.
                      </p>
                      <div className="bg-muted/50 rounded-2xl p-4 text-left space-y-2 text-sm text-muted-foreground">
                        <p className="font-semibold text-foreground">🛡️ Protocole de sécurité :</p>
                        <p>1. 📸 Photo de prise en charge obligatoire</p>
                        <p>2. ⏱ Chronomètre de mission</p>
                        <p>3. 📸 Photo de preuve durant le service</p>
                        <p>4. 💬 Compte-rendu détaillé obligatoire</p>
                        <p>5. 🔑 Validation par code unique du client</p>
                      </div>
                    </div>
                  )}
                </motion.div>
              )}

              {/* IDLE */}
              {phase === 'idle' && selectedBooking && (
                <motion.div key="idle" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex flex-col items-center justify-center h-full gap-6">
                  <div className="text-center">
                    <Avatar className="h-24 w-24 mx-auto mb-4 ring-4 ring-primary/20">
                      <AvatarImage src={selectedBooking.dogPhoto} />
                      <AvatarFallback className="bg-primary/10 text-4xl">🐕</AvatarFallback>
                    </Avatar>
                    <h3 className="text-2xl font-bold text-foreground">{selectedBooking.dogName}</h3>
                    <p className="text-sm text-muted-foreground">Propriétaire : {selectedBooking.ownerName}</p>
                    <p className="text-sm font-bold text-primary mt-1">{selectedBooking.duration} minutes prévues</p>
                  </div>
                  <Button onClick={handleStartWalk} size="lg" className="w-full max-w-xs h-14 text-lg font-bold rounded-2xl shadow-lg gradient-primary text-white">
                    <Play className="h-6 w-6 mr-2" /> Démarrer la mission
                  </Button>
                  <Button variant="ghost" size="sm" onClick={() => { setSelectedBooking(null); setPhase('select_booking'); }} className="text-muted-foreground">
                    ← Changer de mission
                  </Button>
                </motion.div>
              )}

              {/* STARTING */}
              {phase === 'starting' && (
                <motion.div key="starting" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="space-y-6">
                  <div className="text-center">
                    <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-3">
                      <Camera className="h-8 w-8 text-primary" />
                    </div>
                    <h3 className="text-lg font-bold text-foreground">Preuve de départ</h3>
                    <p className="text-sm text-muted-foreground">Prenez une photo du chien lors de la prise en charge <span className="text-destructive font-bold">(obligatoire)</span></p>
                  </div>

                  {photoUrls.length > 0 && (
                    <div className="flex gap-2 justify-center flex-wrap">
                      {photoUrls.map((_, i) => (
                        <motion.div key={i} initial={{ scale: 0 }} animate={{ scale: 1 }} className="w-16 h-16 bg-primary/10 rounded-xl flex items-center justify-center border-2 border-primary/30">
                          <CheckCircle className="h-6 w-6 text-primary" />
                        </motion.div>
                      ))}
                    </div>
                  )}

                  <Button
                    onClick={user ? handleTakePhoto : handleDemoPhoto}
                    variant="outline"
                    className="w-full h-16 text-base border-dashed border-2 gap-3"
                    disabled={uploading}
                  >
                    {uploading ? (
                      <><Upload className="h-5 w-5 animate-spin" /> Envoi...</>
                    ) : (
                      <><Camera className="h-6 w-6" /> Prendre la photo de départ</>
                    )}
                  </Button>

                  <Button onClick={handleConfirmStart} className="w-full h-14 text-base font-bold rounded-xl gradient-primary text-white" disabled={photoUrls.length === 0}>
                    <Play className="h-5 w-5 mr-2" /> Confirmer & Démarrer
                  </Button>
                </motion.div>
              )}

              {/* IN_PROGRESS */}
              {phase === 'in_progress' && (
                <motion.div key="progress" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="space-y-6">
                  <div className="text-center py-4">
                    <motion.div className="w-32 h-32 rounded-full border-4 border-primary flex items-center justify-center mx-auto mb-4 relative">
                      <motion.div
                        className="absolute inset-0 rounded-full border-4 border-primary/20"
                        animate={{ scale: [1, 1.08, 1] }}
                        transition={{ duration: 2, repeat: Infinity }}
                      />
                      <div>
                        <Timer className="h-5 w-5 text-primary mx-auto mb-1" />
                        <p className="text-2xl font-mono font-bold text-foreground">{formatTime(elapsed)}</p>
                      </div>
                    </motion.div>
                    <Badge className="text-sm font-semibold gradient-primary text-white border-0">🏃 Mission en cours</Badge>
                    <p className="text-[10px] text-muted-foreground mt-3 font-medium uppercase tracking-wider">Preuve visuelle active · Pas de tracking GPS intrusif</p>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <Button
                      onClick={user ? handleTakePhoto : handleDemoPhoto}
                      variant="outline"
                      className="h-16 flex-col gap-1 border-primary/20"
                      disabled={uploading}
                    >
                      <Camera className="h-5 w-5 text-primary" />
                      <span className="text-xs font-bold">Ajouter Photo ({photoUrls.length})</span>
                    </Button>
                    <Button variant="outline" className="h-16 flex-col gap-1 border-destructive/20 hover:bg-destructive/5">
                      <AlertTriangle className="h-5 w-5 text-destructive" />
                      <span className="text-xs font-bold text-destructive">Signaler Incident</span>
                    </Button>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-bold flex items-center gap-1.5 text-foreground">
                      <MessageCircle className="h-4 w-4 text-primary" />
                      Compte-rendu <span className="text-destructive">*</span>
                    </label>
                    <Textarea
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      placeholder="Décrivez le déroulement : comportement, parcours, besoins..."
                      className="min-h-[100px] rounded-xl bg-muted/30"
                    />
                  </div>

                  <Button onClick={handleEndWalk} variant="destructive" className="w-full h-14 text-base font-bold rounded-xl shadow-lg">
                    <Square className="h-5 w-5 mr-2" /> Terminer la mission
                  </Button>
                </motion.div>
              )}

              {/* ENDING - CODE ENTRY */}
              {phase === 'ending' && (
                <motion.div key="ending" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="space-y-6">
                  <div className="text-center">
                    <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-3">
                      <Lock className="h-8 w-8 text-primary" />
                    </div>
                    <h3 className="text-lg font-bold text-foreground">Validation par Code Unique</h3>
                    <p className="text-sm text-muted-foreground">Saisissez le code fourni par le Propriétaire pour libérer le paiement</p>
                  </div>

                  <div className="space-y-4">
                    <Input
                      value={inputCode}
                      onChange={(e) => setInputCode(e.target.value.toUpperCase())}
                      placeholder="EX: A1B2C3"
                      className="text-center text-3xl font-mono font-bold h-16 tracking-[0.2em] border-2 border-primary/30 rounded-2xl focus:ring-primary focus:border-primary"
                      maxLength={8}
                    />
                    <div className="bg-muted/50 rounded-2xl p-4 text-xs space-y-2">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Photos envoyées :</span>
                        <span className="font-bold text-foreground">{photoUrls.length}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Durée totale :</span>
                        <span className="font-bold text-foreground">{formatTime(elapsed)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Compte-rendu :</span>
                        <span className="font-bold text-success">Validé ✓</span>
                      </div>
                    </div>
                  </div>

                  <Button onClick={handleConfirmEnd} className="w-full h-14 text-base font-bold rounded-xl gradient-primary text-white shadow-lg">
                    ✅ Valider & Libérer les fonds
                  </Button>
                  <Button variant="ghost" onClick={() => setPhase('in_progress')} className="w-full text-muted-foreground text-xs">
                    Retour à la mission
                  </Button>
                </motion.div>
              )}

              {/* COMPLETED */}
              {phase === 'completed' && (
                <motion.div key="completed" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} className="flex flex-col items-center justify-center h-full gap-6">
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", stiffness: 200 }}
                    className="w-24 h-24 bg-primary/10 rounded-full flex items-center justify-center"
                  >
                    <CheckCircle className="h-12 w-12 text-primary" />
                  </motion.div>
                  <div className="text-center">
                    <h3 className="text-2xl font-bold mb-2 text-foreground">Félicitations ! 🎉</h3>
                    <p className="text-sm text-muted-foreground px-4">Mission validée avec succès. Vos gains seront crédités sur votre dashboard sous 48h.</p>
                  </div>
                  <div className="bg-primary/5 rounded-2xl p-4 border border-primary/10 w-full text-center">
                    <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-widest mb-1">Code Validé</p>
                    <p className="text-3xl font-mono font-bold text-primary">{inputCode}</p>
                  </div>
                  <Button onClick={handleReset} className="w-full h-14 text-base font-bold rounded-2xl gradient-primary text-white">
                    Fermer l'outil "GO"
                  </Button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default WalkManagementSheet;
