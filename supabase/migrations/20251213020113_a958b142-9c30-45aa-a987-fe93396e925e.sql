-- =============================================
-- DOGWALKING - COMPLETE DATABASE SCHEMA
-- =============================================

-- 1. ENUM TYPES
create type public.app_role as enum ('admin', 'moderator', 'user');
create type public.user_type as enum ('owner', 'walker', 'both');
create type public.booking_status as enum ('pending', 'confirmed', 'in_progress', 'completed', 'cancelled');
create type public.dog_size as enum ('small', 'medium', 'large', 'giant');
create type public.service_type as enum ('promenade', 'garde', 'visite', 'veterinaire');

-- 2. PROFILES TABLE (User profiles linked to auth.users)
create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text,
  first_name text,
  last_name text,
  phone text,
  avatar_url text,
  address text,
  city text,
  postal_code text,
  user_type user_type default 'owner',
  bio text,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

-- 3. USER ROLES TABLE (Separate table for security)
create table public.user_roles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade not null,
  role app_role not null default 'user',
  unique (user_id, role)
);

-- 4. DOGS TABLE
create table public.dogs (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid references auth.users(id) on delete cascade not null,
  name text not null,
  breed text,
  age integer,
  size dog_size default 'medium',
  weight numeric(5,2),
  photo_url text,
  special_needs text,
  vaccinations_up_to_date boolean default true,
  is_neutered boolean default false,
  temperament text,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

-- 5. WALKER PROFILES (Extended info for walkers)
create table public.walker_profiles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade not null unique,
  hourly_rate numeric(10,2) default 15.00,
  experience_years integer default 0,
  max_dogs integer default 3,
  service_radius_km integer default 5,
  services service_type[] default '{promenade}',
  available_days text[] default '{Monday,Tuesday,Wednesday,Thursday,Friday}',
  available_hours_start time default '08:00',
  available_hours_end time default '20:00',
  latitude numeric(10,8),
  longitude numeric(11,8),
  verified boolean default false,
  rating numeric(3,2) default 0,
  total_reviews integer default 0,
  total_walks integer default 0,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

-- 6. BOOKINGS TABLE
create table public.bookings (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid references auth.users(id) on delete cascade not null,
  walker_id uuid references auth.users(id) on delete set null,
  dog_id uuid references public.dogs(id) on delete cascade not null,
  service_type service_type not null default 'promenade',
  status booking_status default 'pending',
  scheduled_date date not null,
  scheduled_time time not null,
  duration_minutes integer default 60,
  price numeric(10,2),
  address text,
  city text,
  latitude numeric(10,8),
  longitude numeric(11,8),
  notes text,
  owner_confirmed boolean default false,
  walker_confirmed boolean default false,
  cancelled_by uuid references auth.users(id),
  cancellation_reason text,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

-- 7. REVIEWS TABLE
create table public.reviews (
  id uuid primary key default gen_random_uuid(),
  booking_id uuid references public.bookings(id) on delete cascade not null unique,
  reviewer_id uuid references auth.users(id) on delete cascade not null,
  reviewed_id uuid references auth.users(id) on delete cascade not null,
  rating integer not null check (rating >= 1 and rating <= 5),
  comment text,
  created_at timestamp with time zone default now()
);

-- 8. MESSAGES TABLE
create table public.messages (
  id uuid primary key default gen_random_uuid(),
  sender_id uuid references auth.users(id) on delete cascade not null,
  receiver_id uuid references auth.users(id) on delete cascade not null,
  booking_id uuid references public.bookings(id) on delete set null,
  content text not null,
  read boolean default false,
  created_at timestamp with time zone default now()
);

-- 9. NOTIFICATIONS TABLE
create table public.notifications (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade not null,
  title text not null,
  message text not null,
  type text default 'info',
  read boolean default false,
  link text,
  created_at timestamp with time zone default now()
);

-- 10. REFERRALS TABLE
create table public.referrals (
  id uuid primary key default gen_random_uuid(),
  referrer_id uuid references auth.users(id) on delete cascade not null,
  referred_id uuid references auth.users(id) on delete cascade,
  referral_code text unique not null,
  status text default 'pending',
  reward_amount numeric(10,2) default 10.00,
  created_at timestamp with time zone default now(),
  completed_at timestamp with time zone
);

-- 11. WALKER EARNINGS TABLE
create table public.walker_earnings (
  id uuid primary key default gen_random_uuid(),
  walker_id uuid references auth.users(id) on delete cascade not null,
  booking_id uuid references public.bookings(id) on delete set null,
  amount numeric(10,2) not null,
  commission numeric(10,2) default 0,
  net_amount numeric(10,2) not null,
  status text default 'pending',
  paid_at timestamp with time zone,
  created_at timestamp with time zone default now()
);

-- 12. FAVORITES TABLE
create table public.favorites (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade not null,
  walker_id uuid references auth.users(id) on delete cascade not null,
  created_at timestamp with time zone default now(),
  unique (user_id, walker_id)
);

-- =============================================
-- ENABLE ROW LEVEL SECURITY
-- =============================================
alter table public.profiles enable row level security;
alter table public.user_roles enable row level security;
alter table public.dogs enable row level security;
alter table public.walker_profiles enable row level security;
alter table public.bookings enable row level security;
alter table public.reviews enable row level security;
alter table public.messages enable row level security;
alter table public.notifications enable row level security;
alter table public.referrals enable row level security;
alter table public.walker_earnings enable row level security;
alter table public.favorites enable row level security;

-- =============================================
-- SECURITY DEFINER FUNCTION FOR ROLES
-- =============================================
create or replace function public.has_role(_user_id uuid, _role app_role)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.user_roles
    where user_id = _user_id
      and role = _role
  )
$$;

-- =============================================
-- RLS POLICIES
-- =============================================

-- PROFILES POLICIES
create policy "Profiles are viewable by everyone"
  on public.profiles for select
  using (true);

create policy "Users can update their own profile"
  on public.profiles for update
  using (auth.uid() = id);

create policy "Users can insert their own profile"
  on public.profiles for insert
  with check (auth.uid() = id);

-- USER ROLES POLICIES
create policy "Users can view their own roles"
  on public.user_roles for select
  using (auth.uid() = user_id);

create policy "Admins can manage all roles"
  on public.user_roles for all
  using (public.has_role(auth.uid(), 'admin'));

-- DOGS POLICIES
create policy "Dogs are viewable by everyone"
  on public.dogs for select
  using (true);

create policy "Owners can manage their own dogs"
  on public.dogs for all
  using (auth.uid() = owner_id);

-- WALKER PROFILES POLICIES
create policy "Walker profiles are viewable by everyone"
  on public.walker_profiles for select
  using (true);

create policy "Walkers can manage their own profile"
  on public.walker_profiles for all
  using (auth.uid() = user_id);

-- BOOKINGS POLICIES
create policy "Users can view their own bookings"
  on public.bookings for select
  using (auth.uid() = owner_id or auth.uid() = walker_id);

create policy "Owners can create bookings"
  on public.bookings for insert
  with check (auth.uid() = owner_id);

create policy "Booking participants can update"
  on public.bookings for update
  using (auth.uid() = owner_id or auth.uid() = walker_id);

-- REVIEWS POLICIES
create policy "Reviews are viewable by everyone"
  on public.reviews for select
  using (true);

create policy "Users can create reviews for their bookings"
  on public.reviews for insert
  with check (auth.uid() = reviewer_id);

-- MESSAGES POLICIES
create policy "Users can view their own messages"
  on public.messages for select
  using (auth.uid() = sender_id or auth.uid() = receiver_id);

create policy "Users can send messages"
  on public.messages for insert
  with check (auth.uid() = sender_id);

create policy "Receivers can update messages (mark read)"
  on public.messages for update
  using (auth.uid() = receiver_id);

-- NOTIFICATIONS POLICIES
create policy "Users can view their own notifications"
  on public.notifications for select
  using (auth.uid() = user_id);

create policy "Users can update their own notifications"
  on public.notifications for update
  using (auth.uid() = user_id);

-- REFERRALS POLICIES
create policy "Users can view their own referrals"
  on public.referrals for select
  using (auth.uid() = referrer_id or auth.uid() = referred_id);

create policy "Users can create referrals"
  on public.referrals for insert
  with check (auth.uid() = referrer_id);

-- WALKER EARNINGS POLICIES
create policy "Walkers can view their own earnings"
  on public.walker_earnings for select
  using (auth.uid() = walker_id);

-- FAVORITES POLICIES
create policy "Users can view their own favorites"
  on public.favorites for select
  using (auth.uid() = user_id);

create policy "Users can manage their own favorites"
  on public.favorites for all
  using (auth.uid() = user_id);

-- =============================================
-- FUNCTIONS & TRIGGERS
-- =============================================

-- Function to update updated_at timestamp
create or replace function public.update_updated_at_column()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

-- Apply updated_at triggers
create trigger update_profiles_updated_at
  before update on public.profiles
  for each row execute function public.update_updated_at_column();

create trigger update_dogs_updated_at
  before update on public.dogs
  for each row execute function public.update_updated_at_column();

create trigger update_walker_profiles_updated_at
  before update on public.walker_profiles
  for each row execute function public.update_updated_at_column();

create trigger update_bookings_updated_at
  before update on public.bookings
  for each row execute function public.update_updated_at_column();

-- Function to create profile on user signup
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (id, email, first_name, last_name)
  values (
    new.id,
    new.email,
    new.raw_user_meta_data ->> 'first_name',
    new.raw_user_meta_data ->> 'last_name'
  );
  
  -- Also create default user role
  insert into public.user_roles (user_id, role)
  values (new.id, 'user');
  
  return new;
end;
$$;

-- Trigger for new user signup
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- Function to update walker rating
create or replace function public.update_walker_rating()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  update public.walker_profiles
  set 
    rating = (
      select avg(r.rating)::numeric(3,2)
      from public.reviews r
      join public.bookings b on r.booking_id = b.id
      where b.walker_id = new.reviewed_id
    ),
    total_reviews = (
      select count(*)
      from public.reviews r
      join public.bookings b on r.booking_id = b.id
      where b.walker_id = new.reviewed_id
    )
  where user_id = new.reviewed_id;
  
  return new;
end;
$$;

-- Trigger to update walker rating on new review
create trigger on_review_created
  after insert on public.reviews
  for each row execute function public.update_walker_rating();

-- Function to generate unique referral code
create or replace function public.generate_referral_code()
returns trigger
language plpgsql
as $$
begin
  if new.referral_code is null then
    new.referral_code = upper(substring(md5(random()::text) from 1 for 8));
  end if;
  return new;
end;
$$;

create trigger set_referral_code
  before insert on public.referrals
  for each row execute function public.generate_referral_code();

-- =============================================
-- ENABLE REALTIME
-- =============================================
alter publication supabase_realtime add table public.messages;
alter publication supabase_realtime add table public.notifications;
alter publication supabase_realtime add table public.bookings;