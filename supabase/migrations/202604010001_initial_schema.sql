create extension if not exists "pgcrypto";

create table if not exists public.users (
  id uuid primary key,
  email text not null unique,
  name text not null,
  role text not null check (role in ('trainee', 'facilitator')),
  level text not null check (level in ('beginner', 'intermediate', 'advanced')),
  facilitator_id uuid references public.users(id) on delete set null,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.cases (
  id text primary key,
  title text not null,
  difficulty text not null check (difficulty in ('beginner', 'intermediate', 'advanced')),
  theme text not null,
  presenting_complaint text not null,
  trigger_events jsonb not null default '[]'::jsonb,
  sample_thoughts jsonb not null default '[]'::jsonb,
  sample_emotions jsonb not null default '[]'::jsonb,
  sample_behaviors jsonb not null default '[]'::jsonb,
  hidden_beliefs jsonb not null default '[]'::jsonb,
  recommended_tools jsonb not null default '[]'::jsonb,
  expected_drifts jsonb not null default '[]'::jsonb,
  homework_context_present boolean not null default false,
  stage_suitability jsonb not null default '[]'::jsonb,
  content_json jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.sessions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.users(id) on delete cascade,
  case_id text not null references public.cases(id) on delete restrict,
  state text not null check (
    state in (
      'draft',
      'ready',
      'in_progress',
      'blocked_validation',
      'review_pending',
      'reviewed',
      'needs_revision',
      'completed',
      'abandoned'
    )
  ),
  current_step text check (
    current_step in (
      'define_session_goal',
      'identify_stage',
      'select_tool',
      'guided_input',
      'summary_and_homework'
    )
  ),
  stage text not null check (
    stage in (
      'foundations',
      'session_structure',
      'core_tools',
      'deeper_formulation',
      'treatment_planning',
      'full_simulation'
    )
  ),
  selected_tool text not null check (
    selected_tool in (
      'agenda_setting',
      'thought_record',
      'emotion_labeling',
      'behavioral_activation',
      'cognitive_restructuring',
      'core_belief_work',
      'homework_planning',
      'session_summary'
    )
  ),
  session_goal text not null default '',
  revision_count integer not null default 0 check (revision_count >= 0),
  started_at timestamptz,
  finished_at timestamptz,
  last_activity_at timestamptz not null default timezone('utc', now()),
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.attempts (
  id uuid primary key default gen_random_uuid(),
  session_id uuid not null references public.sessions(id) on delete cascade,
  revision_number integer not null default 0 check (revision_number >= 0),
  step_name text not null check (
    step_name in (
      'define_session_goal',
      'identify_stage',
      'select_tool',
      'guided_input',
      'summary_and_homework'
    )
  ),
  input_payload jsonb not null default '{}'::jsonb,
  validation_output jsonb not null default '{}'::jsonb,
  evaluator_outputs jsonb not null default '[]'::jsonb,
  score_snapshot jsonb,
  created_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.drift_events (
  id uuid primary key default gen_random_uuid(),
  session_id uuid not null references public.sessions(id) on delete cascade,
  attempt_id uuid not null references public.attempts(id) on delete cascade,
  drift_id text not null,
  name text not null,
  description text not null,
  detection_mode text not null check (detection_mode in ('rule', 'ai', 'hybrid')),
  severity text not null check (severity in ('minor', 'moderate', 'major')),
  status text not null check (status in ('open', 'corrected', 'waived')),
  message text not null,
  corrective_action text not null,
  created_at timestamptz not null default timezone('utc', now()),
  corrected_at timestamptz
);

create table if not exists public.progress_snapshots (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.users(id) on delete cascade,
  date date not null,
  avg_score integer not null check (avg_score between 0 and 100),
  top_drift text not null,
  strongest_skill text not null,
  weakest_skill text not null,
  created_at timestamptz not null default timezone('utc', now())
);

create index if not exists idx_sessions_user_id on public.sessions(user_id);
create index if not exists idx_attempts_session_id on public.attempts(session_id);
create index if not exists idx_drift_events_session_id on public.drift_events(session_id);
create index if not exists idx_progress_snapshots_user_id_date on public.progress_snapshots(user_id, date desc);
