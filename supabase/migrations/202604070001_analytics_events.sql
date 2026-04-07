create table if not exists public.analytics_events (
  id uuid primary key default gen_random_uuid(),
  event_name text not null check (
    event_name in (
      'page_view',
      'lecture_pdf_opened',
      'lecture_print_clicked'
    )
  ),
  route text not null,
  lecture_slug text,
  reference_section text,
  user_id uuid references public.users(id) on delete set null,
  visitor_key text not null,
  created_at timestamptz not null default timezone('utc', now())
);

create index if not exists idx_analytics_events_created_at
  on public.analytics_events(created_at desc);

create index if not exists idx_analytics_events_event_name_created_at
  on public.analytics_events(event_name, created_at desc);

create index if not exists idx_analytics_events_route_created_at
  on public.analytics_events(route, created_at desc);

create index if not exists idx_analytics_events_lecture_slug_created_at
  on public.analytics_events(lecture_slug, created_at desc)
  where lecture_slug is not null;
