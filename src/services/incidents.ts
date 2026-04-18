/**
 * Service Incidents - Signalement et gestion des incidents
 * Utilise la table incident_reports de Supabase
 */

import { supabase } from "@/integrations/supabase/client";

export type IncidentSeverity = 'low' | 'medium' | 'high' | 'critical';
export type IncidentType = 
  | 'injury'
  | 'behavior'
  | 'lost_dog'
  | 'property_damage'
  | 'health'
  | 'other';

export const INCIDENT_TYPES: Record<IncidentType, string> = {
  injury: 'Blessure du chien',
  behavior: 'Problème de comportement',
  lost_dog: 'Chien perdu',
  property_damage: 'Dommage à la propriété',
  health: 'Problème de santé',
  other: 'Autre',
};

export const SEVERITY_LEVELS: Record<IncidentSeverity, string> = {
  low: 'Faible',
  medium: 'Moyen',
  high: 'Élevé',
  critical: 'Critique',
};

/**
 * Créer un rapport d'incident
 */
export async function createIncidentReport(data: {
  bookingId: string;
  reporterId: string;
  type: IncidentType;
  description: string;
}) {
  const { data: report, error } = await supabase
    .from('incident_reports')
    .insert({
      booking_id: data.bookingId,
      reporter_id: data.reporterId,
      type: data.type,
      description: data.description,
      status: 'pending',
    })
    .select()
    .single();

  if (error) throw error;

  // Also create a notification
  await supabase.from('notifications').insert({
    user_id: data.reporterId,
    type: 'incident',
    title: `🚨 Incident signalé`,
    message: `${INCIDENT_TYPES[data.type]}: ${data.description}`,
  });

  return report;
}

/**
 * Récupérer les incidents d'un utilisateur
 */
export async function getUserIncidents(userId: string) {
  const { data, error } = await supabase
    .from('incident_reports')
    .select('*')
    .eq('reporter_id', userId)
    .order('reported_at', { ascending: false });

  if (error) throw error;
  return data || [];
}

/**
 * Uploader une photo d'incident vers le bucket walk-proofs
 */
export async function uploadIncidentPhoto(file: File, incidentId: string): Promise<string | null> {
  const fileName = `incidents/${incidentId}/${Date.now()}-${file.name}`;
  
  const { error } = await supabase.storage
    .from('walk-proofs')
    .upload(fileName, file);

  if (error) {
    console.error('Erreur upload photo incident:', error);
    return null;
  }

  const { data: urlData } = supabase.storage
    .from('walk-proofs')
    .getPublicUrl(fileName);

  return urlData.publicUrl;
}
