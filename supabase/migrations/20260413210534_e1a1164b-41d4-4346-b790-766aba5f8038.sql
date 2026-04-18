
-- Fix 1: Restrict notifications INSERT to only own notifications
DROP POLICY IF EXISTS "Authenticated users can insert notifications" ON public.notifications;
CREATE POLICY "Authenticated users can insert own notifications" ON public.notifications
  FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Fix 2: Restrict profiles SELECT to own profile + public view for others
DROP POLICY IF EXISTS "Authenticated users can view profiles" ON public.profiles;
CREATE POLICY "Users can view own full profile" ON public.profiles
  FOR SELECT TO authenticated
  USING (auth.uid() = id);

-- Fix 3: Create a public_profiles view for safe public data (already exists, ensure it's usable)
-- The public_profiles view already exists and exposes only safe fields

-- Fix 4: Restrict dogs SELECT to authenticated users only
DROP POLICY IF EXISTS "Dogs are viewable by everyone" ON public.dogs;
CREATE POLICY "Dogs are viewable by authenticated users" ON public.dogs
  FOR SELECT TO authenticated
  USING (true);

-- Fix 5: Restrict walker_profiles SELECT to authenticated users
DROP POLICY IF EXISTS "Walker profiles are viewable by everyone" ON public.walker_profiles;
CREATE POLICY "Walker profiles are viewable by authenticated users" ON public.walker_profiles
  FOR SELECT TO authenticated
  USING (true);
