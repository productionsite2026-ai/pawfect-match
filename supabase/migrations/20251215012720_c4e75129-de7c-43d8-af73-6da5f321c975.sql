-- Create storage buckets for the application

-- Bucket for dog photos
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES ('dog-photos', 'dog-photos', true, 5242880, ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/gif']);

-- Bucket for walker documents (private - only accessible by owner and admins)
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES ('walker-documents', 'walker-documents', false, 10485760, ARRAY['image/jpeg', 'image/png', 'image/webp', 'application/pdf']);

-- Bucket for user avatars
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES ('avatars', 'avatars', true, 2097152, ARRAY['image/jpeg', 'image/png', 'image/webp']);

-- Bucket for walk proof photos/videos
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES ('walk-proofs', 'walk-proofs', false, 52428800, ARRAY['image/jpeg', 'image/png', 'image/webp', 'video/mp4', 'video/quicktime']);

-- RLS Policies for dog-photos bucket
CREATE POLICY "Dog photos are publicly viewable"
ON storage.objects FOR SELECT
USING (bucket_id = 'dog-photos');

CREATE POLICY "Users can upload their dog photos"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'dog-photos' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can update their dog photos"
ON storage.objects FOR UPDATE
USING (bucket_id = 'dog-photos' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can delete their dog photos"
ON storage.objects FOR DELETE
USING (bucket_id = 'dog-photos' AND auth.uid()::text = (storage.foldername(name))[1]);

-- RLS Policies for walker-documents bucket (private)
CREATE POLICY "Walkers can view their own documents"
ON storage.objects FOR SELECT
USING (bucket_id = 'walker-documents' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Walkers can upload their documents"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'walker-documents' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Walkers can update their documents"
ON storage.objects FOR UPDATE
USING (bucket_id = 'walker-documents' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Admins can view all walker documents"
ON storage.objects FOR SELECT
USING (bucket_id = 'walker-documents' AND public.has_role(auth.uid(), 'admin'));

-- RLS Policies for avatars bucket
CREATE POLICY "Avatars are publicly viewable"
ON storage.objects FOR SELECT
USING (bucket_id = 'avatars');

CREATE POLICY "Users can upload their avatar"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'avatars' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can update their avatar"
ON storage.objects FOR UPDATE
USING (bucket_id = 'avatars' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can delete their avatar"
ON storage.objects FOR DELETE
USING (bucket_id = 'avatars' AND auth.uid()::text = (storage.foldername(name))[1]);

-- RLS Policies for walk-proofs bucket
CREATE POLICY "Walk proof owners can view"
ON storage.objects FOR SELECT
USING (bucket_id = 'walk-proofs' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Walkers can upload walk proofs"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'walk-proofs' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Admins can view all walk proofs"
ON storage.objects FOR SELECT
USING (bucket_id = 'walk-proofs' AND public.has_role(auth.uid(), 'admin'));