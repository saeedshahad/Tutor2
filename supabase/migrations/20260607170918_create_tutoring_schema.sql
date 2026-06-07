-- Create users table extending auth.users
create table if not exists public.users (
  id uuid primary key references auth.users(id) on delete cascade,
  email text unique not null,
  name text not null,
  role text not null check (role in ('student', 'parent', 'tutor', 'admin')),
  avatar text,
  bio text,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

-- Create subjects table
create table if not exists public.subjects (
  id uuid primary key default gen_random_uuid(),
  name text unique not null,
  description text,
  created_at timestamp with time zone default now()
);

-- Create grades table
create table if not exists public.grades (
  id uuid primary key default gen_random_uuid(),
  level text unique not null,
  order_index integer,
  created_at timestamp with time zone default now()
);

-- Create tutor_profiles table
create table if not exists public.tutor_profiles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null unique references public.users(id) on delete cascade,
  is_approved boolean default false,
  approved_at timestamp with time zone,
  approved_hours numeric default 0,
  pending_hours numeric default 0,
  bio text,
  years_experience integer,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

-- Create tutor_subjects junction table
create table if not exists public.tutor_subjects (
  id uuid primary key default gen_random_uuid(),
  tutor_id uuid not null references public.tutor_profiles(id) on delete cascade,
  subject_id uuid not null references public.subjects(id) on delete cascade,
  created_at timestamp with time zone default now(),
  unique(tutor_id, subject_id)
);

-- Create student_profiles table
create table if not exists public.student_profiles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null unique references public.users(id) on delete cascade,
  grade_id uuid references public.grades(id),
  parent_id uuid references public.users(id),
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

-- Create tutor_applications table
create table if not exists public.tutor_applications (
  id uuid primary key default gen_random_uuid(),
  full_name text not null,
  email text not null,
  phone text not null,
  age integer,
  grade_id uuid references public.grades(id),
  status text default 'pending' check (status in ('pending', 'approved', 'rejected')),
  created_at timestamp with time zone default now(),
  reviewed_at timestamp with time zone,
  reviewed_by uuid references public.users(id)
);

-- Create application_subjects junction table
create table if not exists public.application_subjects (
  id uuid primary key default gen_random_uuid(),
  application_id uuid not null references public.tutor_applications(id) on delete cascade,
  subject_id uuid not null references public.subjects(id) on delete cascade,
  created_at timestamp with time zone default now(),
  unique(application_id, subject_id)
);

-- Create tutoring_sessions table
create table if not exists public.tutoring_sessions (
  id uuid primary key default gen_random_uuid(),
  student_id uuid not null references public.users(id) on delete cascade,
  tutor_id uuid not null references public.users(id) on delete cascade,
  subject_id uuid not null references public.subjects(id),
  status text default 'scheduled' check (status in ('scheduled', 'completed', 'cancelled')),
  scheduled_at timestamp with time zone not null,
  duration_minutes integer default 60,
  notes text,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

-- Create session_ratings table
create table if not exists public.session_ratings (
  id uuid primary key default gen_random_uuid(),
  session_id uuid not null unique references public.tutoring_sessions(id) on delete cascade,
  rating_by_user_id uuid not null references public.users(id),
  rating integer check (rating >= 1 and rating <= 5),
  review text,
  created_at timestamp with time zone default now()
);

-- Enable RLS on all tables
alter table public.users enable row level security;
alter table public.subjects enable row level security;
alter table public.grades enable row level security;
alter table public.tutor_profiles enable row level security;
alter table public.tutor_subjects enable row level security;
alter table public.student_profiles enable row level security;
alter table public.tutor_applications enable row level security;
alter table public.application_subjects enable row level security;
alter table public.tutoring_sessions enable row level security;
alter table public.session_ratings enable row level security;

-- RLS Policies for users table
create policy "users_select" on public.users for select
  to authenticated
  using (true);

create policy "users_insert_self" on public.users for insert
  to authenticated
  with check (auth.uid() = id);

create policy "users_update_self" on public.users for update
  to authenticated
  using (auth.uid() = id)
  with check (auth.uid() = id);

-- RLS Policies for subjects (public read)
create policy "subjects_select" on public.subjects for select
  to authenticated
  using (true);

-- RLS Policies for grades (public read)
create policy "grades_select" on public.grades for select
  to authenticated
  using (true);

-- RLS Policies for tutor_profiles
create policy "tutor_profiles_select" on public.tutor_profiles for select
  to authenticated
  using (true);

create policy "tutor_profiles_insert_self" on public.tutor_profiles for insert
  to authenticated
  with check (auth.uid() = user_id);

create policy "tutor_profiles_update_self" on public.tutor_profiles for update
  to authenticated
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- RLS Policies for tutor_subjects
create policy "tutor_subjects_select" on public.tutor_subjects for select
  to authenticated
  using (true);

create policy "tutor_subjects_insert_own" on public.tutor_subjects for insert
  to authenticated
  with check (
    exists (
      select 1 from public.tutor_profiles
      where id = tutor_id and user_id = auth.uid()
    )
  );

-- RLS Policies for student_profiles
create policy "student_profiles_select_own" on public.student_profiles for select
  to authenticated
  using (auth.uid() = user_id or auth.uid() = parent_id);

create policy "student_profiles_insert_self" on public.student_profiles for insert
  to authenticated
  with check (auth.uid() = user_id);

create policy "student_profiles_update_own" on public.student_profiles for update
  to authenticated
  using (auth.uid() = user_id or auth.uid() = parent_id)
  with check (auth.uid() = user_id or auth.uid() = parent_id);

-- RLS Policies for tutor_applications
create policy "applications_select_own" on public.tutor_applications for select
  to authenticated
  using (email = (select email from auth.users where id = auth.uid()));

create policy "applications_insert" on public.tutor_applications for insert
  to authenticated
  with check (true);

create policy "applications_admin_select" on public.tutor_applications for select
  to authenticated
  using (
    exists (
      select 1 from public.users
      where id = auth.uid() and role = 'admin'
    )
  );

-- RLS Policies for application_subjects
create policy "application_subjects_select" on public.application_subjects for select
  to authenticated
  using (true);

-- RLS Policies for tutoring_sessions
create policy "sessions_select_own" on public.tutoring_sessions for select
  to authenticated
  using (student_id = auth.uid() or tutor_id = auth.uid());

create policy "sessions_insert_student" on public.tutoring_sessions for insert
  to authenticated
  with check (student_id = auth.uid());

create policy "sessions_update_own" on public.tutoring_sessions for update
  to authenticated
  using (student_id = auth.uid() or tutor_id = auth.uid())
  with check (student_id = auth.uid() or tutor_id = auth.uid());

-- RLS Policies for session_ratings
create policy "ratings_select" on public.session_ratings for select
  to authenticated
  using (true);

create policy "ratings_insert_own" on public.session_ratings for insert
  to authenticated
  with check (rating_by_user_id = auth.uid());

-- Insert sample subjects
insert into public.subjects (name, description) values
  ('Mathematics', 'Algebra, Geometry, Calculus, and more'),
  ('Science', 'Physics, Chemistry, Biology'),
  ('ELA/English', 'English Language Arts and Literature'),
  ('Islamic Studies', 'Islamic history, theology, and culture'),
  ('Quran', 'Quranic recitation and memorization')
on conflict do nothing;

-- Insert sample grades
insert into public.grades (level, order_index) values
  ('6th Grade', 6),
  ('7th Grade', 7),
  ('8th Grade', 8),
  ('9th Grade', 9),
  ('10th Grade', 10),
  ('11th Grade', 11),
  ('12th Grade', 12)
on conflict do nothing;