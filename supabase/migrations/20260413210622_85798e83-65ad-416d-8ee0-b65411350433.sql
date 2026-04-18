
-- Allow booking participants to view each other's profiles
CREATE POLICY "Booking participants can view profiles" ON public.profiles
  FOR SELECT TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.bookings b
      WHERE (b.owner_id = auth.uid() AND b.walker_id = profiles.id)
         OR (b.walker_id = auth.uid() AND b.owner_id = profiles.id)
    )
  );

-- Allow viewing walker profiles (public listing)
CREATE POLICY "Walker profiles are publicly viewable" ON public.profiles
  FOR SELECT TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.walker_profiles wp
      WHERE wp.user_id = profiles.id
    )
  );
