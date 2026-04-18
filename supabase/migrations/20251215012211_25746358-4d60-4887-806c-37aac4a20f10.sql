-- Create walker_documents table for document verification
CREATE TABLE public.walker_documents (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  walker_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  document_type TEXT NOT NULL, -- 'id_card', 'criminal_record', 'insurance', 'diploma'
  file_url TEXT,
  verification_status TEXT DEFAULT 'pending', -- 'pending', 'approved', 'rejected'
  rejection_reason TEXT,
  submitted_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  verified_at TIMESTAMP WITH TIME ZONE,
  verified_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(walker_id, document_type)
);

-- Enable RLS
ALTER TABLE public.walker_documents ENABLE ROW LEVEL SECURITY;

-- Walkers can view and manage their own documents
CREATE POLICY "Walkers can view their own documents"
ON public.walker_documents
FOR SELECT
USING (auth.uid() = walker_id);

CREATE POLICY "Walkers can insert their own documents"
ON public.walker_documents
FOR INSERT
WITH CHECK (auth.uid() = walker_id);

CREATE POLICY "Walkers can update their own documents"
ON public.walker_documents
FOR UPDATE
USING (auth.uid() = walker_id);

-- Admins can manage all documents
CREATE POLICY "Admins can manage all documents"
ON public.walker_documents
FOR ALL
USING (public.has_role(auth.uid(), 'admin'));

-- Create walker_badges table for achievements
CREATE TABLE public.walker_badges (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  walker_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  badge_type TEXT NOT NULL, -- 'first_walk', 'five_star', 'top_walker', 'veteran', 'super_host'
  badge_name TEXT NOT NULL,
  badge_description TEXT,
  earned_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(walker_id, badge_type)
);

-- Enable RLS
ALTER TABLE public.walker_badges ENABLE ROW LEVEL SECURITY;

-- Badges are viewable by everyone
CREATE POLICY "Badges are viewable by everyone"
ON public.walker_badges
FOR SELECT
USING (true);

-- Only system can insert badges (via admin or trigger)
CREATE POLICY "Admins can manage badges"
ON public.walker_badges
FOR ALL
USING (public.has_role(auth.uid(), 'admin'));

-- Add verified column to walker_profiles if not exists
ALTER TABLE public.walker_profiles ADD COLUMN IF NOT EXISTS verified BOOLEAN DEFAULT false;

-- Create trigger for updated_at
CREATE TRIGGER update_walker_documents_updated_at
BEFORE UPDATE ON public.walker_documents
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();