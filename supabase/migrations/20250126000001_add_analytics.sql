-- Create analytics table for tracking views and interactions
create table public.analytics (
  id uuid default uuid_generate_v4() primary key,
  event_type text not null check (event_type in ('view', 'download', 'click')),
  entity_type text not null check (entity_type in ('post', 'tender', 'document', 'page')),
  entity_id uuid not null,
  user_id uuid references auth.users(id) on delete set null,
  ip_address text,
  user_agent text,
  referrer text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS
alter table public.analytics enable row level security;

-- Only admins can view analytics
create policy "Only admins can view analytics" on public.analytics
  for select using (auth.jwt() ->> 'role' = 'admin' or auth.role() = 'authenticated');

-- Anyone can insert analytics (for tracking)
create policy "Anyone can insert analytics" on public.analytics
  for insert with check (true);

-- Create indexes for better performance
create index analytics_entity_type_id_idx on public.analytics(entity_type, entity_id);
create index analytics_event_type_idx on public.analytics(event_type);
create index analytics_created_at_idx on public.analytics(created_at desc);

-- Add view_count column to posts
alter table public.posts add column if not exists view_count integer default 0;

-- Add view_count column to tenders
alter table public.tenders add column if not exists view_count integer default 0;

-- Function to increment view count
create or replace function public.increment_view_count(
  p_entity_type text,
  p_entity_id uuid
)
returns void as $$
begin
  if p_entity_type = 'post' then
    update public.posts set view_count = view_count + 1 where id = p_entity_id;
  elsif p_entity_type = 'tender' then
    update public.tenders set view_count = view_count + 1 where id = p_entity_id;
  end if;
end;
$$ language plpgsql security definer;
