-- Table pour les preuves photo des promenades
CREATE TABLE IF NOT EXISTS public.walk_proofs (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  booking_id UUID NOT NULL REFERENCES public.bookings(id) ON DELETE CASCADE,
  walker_id UUID NOT NULL,
  photo_url TEXT NOT NULL,
  photo_type TEXT NOT NULL DEFAULT 'during',
  caption TEXT,
  location_lat NUMERIC,
  location_lng NUMERIC,
  status TEXT NOT NULL DEFAULT 'pending',
  uploaded_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  validated_at TIMESTAMP WITH TIME ZONE,
  validated_by UUID
);

-- Enable RLS
ALTER TABLE public.walk_proofs ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Walkers can insert their proofs" 
ON public.walk_proofs FOR INSERT 
WITH CHECK (auth.uid() = walker_id);

CREATE POLICY "Booking participants can view proofs" 
ON public.walk_proofs FOR SELECT 
USING (
  EXISTS (
    SELECT 1 FROM public.bookings b 
    WHERE b.id = walk_proofs.booking_id 
    AND (b.owner_id = auth.uid() OR b.walker_id = auth.uid())
  )
);

CREATE POLICY "Owners can update proofs to validate" 
ON public.walk_proofs FOR UPDATE 
USING (
  EXISTS (
    SELECT 1 FROM public.bookings b 
    WHERE b.id = walk_proofs.booking_id 
    AND b.owner_id = auth.uid()
  )
);

-- Table pour les litiges
CREATE TABLE IF NOT EXISTS public.disputes (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  booking_id UUID NOT NULL REFERENCES public.bookings(id) ON DELETE CASCADE,
  reporter_id UUID NOT NULL,
  reported_id UUID NOT NULL,
  type TEXT NOT NULL,
  reason TEXT NOT NULL,
  description TEXT,
  evidence_urls TEXT[],
  status TEXT NOT NULL DEFAULT 'open',
  admin_notes TEXT,
  resolved_by UUID,
  resolved_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.disputes ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Users can create disputes" 
ON public.disputes FOR INSERT 
WITH CHECK (auth.uid() = reporter_id);

CREATE POLICY "Participants can view their disputes" 
ON public.disputes FOR SELECT 
USING (auth.uid() = reporter_id OR auth.uid() = reported_id);

CREATE POLICY "Admins can manage all disputes" 
ON public.disputes FOR ALL 
USING (public.has_role(auth.uid(), 'admin'));

-- Table pour les signalements retards/absences
CREATE TABLE IF NOT EXISTS public.incident_reports (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  booking_id UUID NOT NULL REFERENCES public.bookings(id) ON DELETE CASCADE,
  reporter_id UUID NOT NULL,
  type TEXT NOT NULL,
  description TEXT,
  reported_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  acknowledged_at TIMESTAMP WITH TIME ZONE,
  resolved_at TIMESTAMP WITH TIME ZONE,
  resolution_notes TEXT,
  status TEXT NOT NULL DEFAULT 'pending'
);

-- Enable RLS
ALTER TABLE public.incident_reports ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Users can report incidents" 
ON public.incident_reports FOR INSERT 
WITH CHECK (auth.uid() = reporter_id);

CREATE POLICY "Participants can view incidents" 
ON public.incident_reports FOR SELECT 
USING (
  EXISTS (
    SELECT 1 FROM public.bookings b 
    WHERE b.id = incident_reports.booking_id 
    AND (b.owner_id = auth.uid() OR b.walker_id = auth.uid())
  )
);

CREATE POLICY "Admins can manage incidents" 
ON public.incident_reports FOR ALL 
USING (public.has_role(auth.uid(), 'admin'));

-- Trigger for updated_at on disputes
CREATE TRIGGER update_disputes_updated_at
BEFORE UPDATE ON public.disputes
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();