-- Enable necessary extensions
create extension if not exists "uuid-ossp";

-- Create posts table for announcements
create table public.posts (
  id uuid default uuid_generate_v4() primary key,
  title text not null,
  content text not null,
  excerpt text,
  status text default 'draft' check (status in ('draft', 'published', 'archived')),
  category text default 'announcement',
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null,
  published_at timestamp with time zone,
  author_id uuid references auth.users(id) on delete cascade,
  featured_image text,
  tags text[]
);

-- Create problems/issues table
create table public.problems (
  id uuid default uuid_generate_v4() primary key,
  title text not null,
  description text not null,
  location text,
  latitude numeric,
  longitude numeric,
  status text default 'reported' check (status in ('reported', 'investigating', 'in_progress', 'resolved', 'closed')),
  priority text default 'medium' check (priority in ('low', 'medium', 'high', 'critical')),
  category text default 'maintenance',
  reported_by uuid references auth.users(id) on delete set null,
  assigned_to uuid references auth.users(id) on delete set null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null,
  resolved_at timestamp with time zone,
  estimated_resolution timestamp with time zone,
  images text[],
  contact_phone text,
  contact_email text
);

-- Create subscribers table for email notifications
create table public.subscribers (
  id uuid default uuid_generate_v4() primary key,
  email text not null unique,
  name text,
  phone text,
  preferences jsonb default '{"posts": true, "problems": true, "maintenance": true}'::jsonb,
  subscribed_at timestamp with time zone default timezone('utc'::text, now()) not null,
  unsubscribed_at timestamp with time zone,
  is_active boolean default true,
  verification_token text,
  verified_at timestamp with time zone
);

-- Create notifications table for tracking sent emails
create table public.notifications (
  id uuid default uuid_generate_v4() primary key,
  type text not null check (type in ('post_published', 'problem_update', 'maintenance_alert')),
  subject text not null,
  content text not null,
  recipient_email text not null,
  recipient_name text,
  sent_at timestamp with time zone,
  status text default 'pending' check (status in ('pending', 'sent', 'failed')),
  error_message text,
  reference_id uuid, -- ID of the related post/problem
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Create user profiles table (extends auth.users)
create table public.profiles (
  id uuid references auth.users(id) on delete cascade primary key,
  email text,
  full_name text,
  avatar_url text,
  role text default 'user' check (role in ('user', 'admin', 'moderator')),
  phone text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Create problem updates/comments table
create table public.problem_updates (
  id uuid default uuid_generate_v4() primary key,
  problem_id uuid references public.problems(id) on delete cascade not null,
  author_id uuid references auth.users(id) on delete cascade not null,
  content text not null,
  status_change text check (status_change in ('reported', 'investigating', 'in_progress', 'resolved', 'closed')),
  internal_only boolean default false,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable Row Level Security (RLS)
alter table public.posts enable row level security;
alter table public.problems enable row level security;
alter table public.subscribers enable row level security;
alter table public.notifications enable row level security;
alter table public.profiles enable row level security;
alter table public.problem_updates enable row level security;

-- RLS Policies for posts
create policy "Posts are viewable by everyone" on public.posts
  for select using (status = 'published' or auth.jwt() ->> 'role' = 'admin');

create policy "Posts are insertable by authenticated users" on public.posts
  for insert with check (auth.role() = 'authenticated');

create policy "Posts are updatable by authors and admins" on public.posts
  for update using (auth.uid() = author_id or auth.jwt() ->> 'role' = 'admin');

create policy "Posts are deletable by authors and admins" on public.posts
  for delete using (auth.uid() = author_id or auth.jwt() ->> 'role' = 'admin');

-- RLS Policies for problems
create policy "Problems are viewable by everyone" on public.problems
  for select using (true);

create policy "Problems are insertable by authenticated users" on public.problems
  for insert with check (auth.role() = 'authenticated');

create policy "Problems are updatable by reporters, assignees and admins" on public.problems
  for update using (auth.uid() = reported_by or auth.uid() = assigned_to or auth.jwt() ->> 'role' = 'admin');

-- RLS Policies for subscribers
create policy "Subscribers can view their own data" on public.subscribers
  for select using (auth.jwt() ->> 'email' = email);

create policy "Anyone can subscribe" on public.subscribers
  for insert with check (true);

create policy "Users can update their own subscription" on public.subscribers
  for update using (auth.jwt() ->> 'email' = email);

create policy "Admins can manage all subscribers" on public.subscribers
  for all using (auth.jwt() ->> 'role' = 'admin');

-- RLS Policies for notifications
create policy "Only admins can view notifications" on public.notifications
  for select using (auth.jwt() ->> 'role' = 'admin');

create policy "Only admins can manage notifications" on public.notifications
  for all using (auth.jwt() ->> 'role' = 'admin');

-- RLS Policies for profiles
create policy "Users can view all profiles" on public.profiles
  for select using (true);

create policy "Users can insert their own profile" on public.profiles
  for insert with check (auth.uid() = id);

create policy "Users can update their own profile" on public.profiles
  for update using (auth.uid() = id);

create policy "Admins can manage all profiles" on public.profiles
  for all using (auth.jwt() ->> 'role' = 'admin');

-- RLS Policies for problem updates
create policy "Problem updates are viewable by everyone for public updates" on public.problem_updates
  for select using (internal_only = false or auth.jwt() ->> 'role' = 'admin');

create policy "Authenticated users can create updates" on public.problem_updates
  for insert with check (auth.role() = 'authenticated');

create policy "Authors and admins can update their updates" on public.problem_updates
  for update using (auth.uid() = author_id or auth.jwt() ->> 'role' = 'admin');

-- Create functions for updated_at timestamps
create or replace function public.handle_updated_at()
returns trigger as $$
begin
  new.updated_at = timezone('utc'::text, now());
  return new;
end;
$$ language plpgsql;

-- Create triggers for updated_at
create trigger handle_updated_at_posts
  before update on public.posts
  for each row execute procedure public.handle_updated_at();

create trigger handle_updated_at_problems
  before update on public.problems
  for each row execute procedure public.handle_updated_at();

create trigger handle_updated_at_profiles
  before update on public.problems
  for each row execute procedure public.handle_updated_at();

-- Create function to handle new user profiles
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, email, full_name)
  values (new.id, new.email, new.raw_user_meta_data->>'full_name');
  return new;
end;
$$ language plpgsql security definer;

-- Create trigger for new user profiles
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- Create indexes for better performance
create index posts_status_idx on public.posts(status);
create index posts_category_idx on public.posts(category);
create index posts_created_at_idx on public.posts(created_at desc);
create index problems_status_idx on public.problems(status);
create index problems_priority_idx on public.problems(priority);
create index problems_created_at_idx on public.problems(created_at desc);
create index subscribers_email_idx on public.subscribers(email);
create index subscribers_active_idx on public.subscribers(is_active);
create index notifications_status_idx on public.notifications(status);
create index notifications_type_idx on public.notifications(type);
create index problem_updates_problem_id_idx on public.problem_updates(problem_id);
