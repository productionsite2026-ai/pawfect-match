import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Clock, Calendar, Save, Loader2, CheckCircle } from 'lucide-react';
import { motion } from "framer-motion";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

interface AvailabilityTabProps { 
  walkerProfile: any; 
}

interface DaySchedule {
  enabled: boolean;
  start: string;
  end: string;
}

type WeekSchedule = Record<string, DaySchedule>;

const DAYS = [
  { id: 'Monday', label: 'Lundi', short: 'Lun' },
  { id: 'Tuesday', label: 'Mardi', short: 'Mar' },
  { id: 'Wednesday', label: 'Mercredi', short: 'Mer' },
  { id: 'Thursday', label: 'Jeudi', short: 'Jeu' },
  { id: 'Friday', label: 'Vendredi', short: 'Ven' },
  { id: 'Saturday', label: 'Samedi', short: 'Sam' },
  { id: 'Sunday', label: 'Dimanche', short: 'Dim' },
];

const DEFAULT_SCHEDULE: WeekSchedule = {
  Monday: { enabled: true, start: '08:00', end: '18:00' },
  Tuesday: { enabled: true, start: '08:00', end: '18:00' },
  Wednesday: { enabled: true, start: '08:00', end: '18:00' },
  Thursday: { enabled: true, start: '08:00', end: '18:00' },
  Friday: { enabled: true, start: '08:00', end: '18:00' },
  Saturday: { enabled: false, start: '09:00', end: '14:00' },
  Sunday: { enabled: false, start: '09:00', end: '14:00' },
};

function buildScheduleFromProfile(walkerProfile: any): WeekSchedule {
  // If profile has detailed schedule JSON, use it
  if (walkerProfile?.schedule_details) {
    try {
      const parsed = typeof walkerProfile.schedule_details === 'string' 
        ? JSON.parse(walkerProfile.schedule_details) 
        : walkerProfile.schedule_details;
      // Validate structure
      if (parsed && typeof parsed === 'object' && parsed.Monday) return parsed;
    } catch {}
  }
  
  // Fallback: build from available_days + global hours
  const days = walkerProfile?.available_days || ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
  const globalStart = walkerProfile?.available_hours_start || '08:00';
  const globalEnd = walkerProfile?.available_hours_end || '18:00';
  
  const schedule: WeekSchedule = {};
  DAYS.forEach(day => {
    schedule[day.id] = {
      enabled: days.includes(day.id),
      start: globalStart,
      end: globalEnd,
    };
  });
  return schedule;
}

const WalkerAvailabilityTab = ({ walkerProfile }: AvailabilityTabProps) => {
  const [saving, setSaving] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);
  const [schedule, setSchedule] = useState<WeekSchedule>(() => buildScheduleFromProfile(walkerProfile));
  const [originalSchedule, setOriginalSchedule] = useState<WeekSchedule>(() => buildScheduleFromProfile(walkerProfile));

  useEffect(() => {
    const s = buildScheduleFromProfile(walkerProfile);
    setSchedule(s);
    setOriginalSchedule(s);
  }, [walkerProfile]);

  useEffect(() => {
    setHasChanges(JSON.stringify(schedule) !== JSON.stringify(originalSchedule));
  }, [schedule, originalSchedule]);

  const toggleDay = (dayId: string) => {
    setSchedule(prev => ({
      ...prev,
      [dayId]: { ...prev[dayId], enabled: !prev[dayId].enabled }
    }));
  };

  const updateTime = (dayId: string, field: 'start' | 'end', value: string) => {
    setSchedule(prev => ({
      ...prev,
      [dayId]: { ...prev[dayId], [field]: value }
    }));
  };

  const applyToAll = (dayId: string) => {
    const source = schedule[dayId];
    setSchedule(prev => {
      const updated = { ...prev };
      DAYS.forEach(d => {
        if (updated[d.id].enabled) {
          updated[d.id] = { ...updated[d.id], start: source.start, end: source.end };
        }
      });
      return updated;
    });
    toast({ title: "Horaires appliqués", description: "Les horaires ont été copiés sur tous les jours actifs" });
  };

  const handleSave = async () => {
    // Validate: end must be after start for enabled days
    for (const day of DAYS) {
      const s = schedule[day.id];
      if (s.enabled && s.start >= s.end) {
        toast({ title: "Erreur d'horaire", description: `${day.label} : l'heure de fin doit être après l'heure de début`, variant: "destructive" });
        return;
      }
    }

    setSaving(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        toast({ title: "Erreur", description: "Vous devez être connecté", variant: "destructive" });
        return;
      }

      const availableDays = DAYS.filter(d => schedule[d.id].enabled).map(d => d.id);
      // Use first enabled day's hours as global fallback
      const firstEnabled = DAYS.find(d => schedule[d.id].enabled);
      const globalStart = firstEnabled ? schedule[firstEnabled.id].start : '08:00';
      const globalEnd = firstEnabled ? schedule[firstEnabled.id].end : '18:00';

      const { data: existingProfile } = await supabase
        .from('walker_profiles')
        .select('id')
        .eq('user_id', session.user.id)
        .maybeSingle();

      const updateData = {
        available_days: availableDays,
        available_hours_start: globalStart,
        available_hours_end: globalEnd,
        updated_at: new Date().toISOString()
      };

      if (existingProfile) {
        const { error } = await supabase
          .from('walker_profiles')
          .update(updateData)
          .eq('user_id', session.user.id);
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('walker_profiles')
          .insert({ user_id: session.user.id, ...updateData });
        if (error) throw error;
      }

      toast({ title: "Disponibilités enregistrées ✓", description: "Vos horaires détaillés ont été mis à jour" });
      setOriginalSchedule(schedule);
      setHasChanges(false);
    } catch (error: any) {
      console.error('Error saving availability:', error);
      toast({ title: "Erreur", description: error.message || "Impossible de sauvegarder", variant: "destructive" });
    } finally {
      setSaving(false);
    }
  };

  const totalHours = DAYS.reduce((acc, day) => {
    const s = schedule[day.id];
    if (!s.enabled) return acc;
    const start = parseInt(s.start.split(':')[0]) + parseInt(s.start.split(':')[1]) / 60;
    const end = parseInt(s.end.split(':')[0]) + parseInt(s.end.split(':')[1]) / 60;
    return acc + Math.max(0, end - start);
  }, 0);

  const activeDays = DAYS.filter(d => schedule[d.id].enabled).length;

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold flex items-center gap-2">
          <Clock className="h-6 w-6 text-primary" />
          Disponibilités
        </h2>
        <Button 
          onClick={handleSave} 
          disabled={saving || !hasChanges}
          className="gap-2"
        >
          {saving ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : hasChanges ? (
            <Save className="h-4 w-4" />
          ) : (
            <CheckCircle className="h-4 w-4" />
          )}
          {saving ? 'Enregistrement...' : hasChanges ? 'Enregistrer' : 'Sauvegardé'}
        </Button>
      </div>

      {/* Summary Card */}
      <Card className="bg-gradient-to-br from-primary/5 to-primary/10 border-primary/20 mb-6">
        <CardContent className="pt-6">
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <p className="text-2xl font-black text-primary">{activeDays}</p>
              <p className="text-xs text-muted-foreground font-semibold">jour(s) actif(s)</p>
            </div>
            <div>
              <p className="text-2xl font-black text-primary">{totalHours.toFixed(0)}h</p>
              <p className="text-xs text-muted-foreground font-semibold">par semaine</p>
            </div>
            <div>
              <p className="text-2xl font-black text-primary">{activeDays > 0 ? (totalHours / activeDays).toFixed(1) : 0}h</p>
              <p className="text-xs text-muted-foreground font-semibold">par jour</p>
            </div>
          </div>
          {hasChanges && (
            <p className="text-amber-600 text-sm mt-4 font-medium text-center">
              ⚠️ Modifications non enregistrées
            </p>
          )}
        </CardContent>
      </Card>

      {/* Per-day schedule */}
      <div className="space-y-3">
        {DAYS.map((day, index) => {
          const daySchedule = schedule[day.id];
          return (
            <motion.div
              key={day.id}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.04 }}
            >
              <Card className={`shadow-sm transition-all ${
                daySchedule.enabled 
                  ? 'bg-primary/[0.03] border-primary/20 hover:shadow-md' 
                  : 'opacity-60 hover:opacity-80'
              }`}>
                <CardContent className="py-3 px-4">
                  <div className="flex items-center gap-3">
                    {/* Day toggle */}
                    <div 
                      className="flex items-center gap-3 cursor-pointer min-w-[120px]"
                      onClick={() => toggleDay(day.id)}
                    >
                      <Switch 
                        checked={daySchedule.enabled} 
                        onCheckedChange={() => toggleDay(day.id)}
                      />
                      <span className={`text-sm font-bold ${daySchedule.enabled ? 'text-foreground' : 'text-muted-foreground'}`}>
                        {day.label}
                      </span>
                    </div>

                    {/* Time inputs */}
                    {daySchedule.enabled ? (
                      <div className="flex items-center gap-2 flex-1 justify-end">
                        <input 
                          type="time" 
                          value={daySchedule.start}
                          onChange={(e) => updateTime(day.id, 'start', e.target.value)}
                          className="px-2 py-1.5 rounded-lg border bg-background text-sm font-medium focus:ring-2 focus:ring-primary focus:border-primary transition-all w-[100px]" 
                        />
                        <span className="text-muted-foreground text-xs font-bold">→</span>
                        <input 
                          type="time" 
                          value={daySchedule.end}
                          onChange={(e) => updateTime(day.id, 'end', e.target.value)}
                          className="px-2 py-1.5 rounded-lg border bg-background text-sm font-medium focus:ring-2 focus:ring-primary focus:border-primary transition-all w-[100px]" 
                        />
                        <button
                          onClick={() => applyToAll(day.id)}
                          className="text-[9px] text-primary font-bold px-2 py-1 rounded-md bg-primary/10 hover:bg-primary/20 transition-colors whitespace-nowrap"
                          title="Appliquer ces horaires à tous les jours actifs"
                        >
                          Copier
                        </button>
                      </div>
                    ) : (
                      <p className="text-xs text-muted-foreground italic flex-1 text-right">Jour de repos</p>
                    )}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </div>
    </motion.div>
  );
};

export default WalkerAvailabilityTab;
