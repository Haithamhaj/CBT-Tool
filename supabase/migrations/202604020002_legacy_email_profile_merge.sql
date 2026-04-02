create or replace function public.handle_auth_user_profile()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  derived_name text;
  legacy_user_id uuid;
  legacy_role text;
  legacy_level text;
  legacy_facilitator_id uuid;
begin
  derived_name := nullif(trim(coalesce(new.raw_user_meta_data ->> 'name', '')), '');

  if derived_name is null then
    derived_name := split_part(new.email, '@', 1);
  end if;

  select id
       , role
       , level
       , facilitator_id
    into legacy_user_id, legacy_role, legacy_level, legacy_facilitator_id
  from public.users
  where lower(email) = lower(new.email)
    and id <> new.id
  limit 1;

  if legacy_user_id is not null then
    update public.users
       set email = concat('__legacy__', id::text, '__', email),
           updated_at = timezone('utc', now())
     where id = legacy_user_id;

    insert into public.users (id, email, name, role, level, facilitator_id)
    values (
      new.id,
      new.email,
      derived_name,
      legacy_role,
      legacy_level,
      legacy_facilitator_id
    )
    on conflict (id) do update
      set email = excluded.email,
          name = excluded.name,
          updated_at = timezone('utc', now());

    update public.sessions
       set user_id = new.id
     where user_id = legacy_user_id;

    update public.progress_snapshots
       set user_id = new.id
     where user_id = legacy_user_id;

    update public.users
       set facilitator_id = new.id
     where facilitator_id = legacy_user_id;

    delete from public.users
     where id = legacy_user_id;
  end if;

  insert into public.users (id, email, name, role, level, facilitator_id)
  values (new.id, new.email, derived_name, 'trainee', 'beginner', null)
  on conflict (id) do update
    set email = excluded.email,
        name = excluded.name,
        updated_at = timezone('utc', now());

  return new;
end;
$$;
