alter table public.users
  alter column role set default 'trainee',
  alter column level set default 'beginner';

create or replace function public.handle_auth_user_profile()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  derived_name text;
begin
  derived_name := nullif(trim(coalesce(new.raw_user_meta_data ->> 'name', '')), '');

  if derived_name is null then
    derived_name := split_part(new.email, '@', 1);
  end if;

  insert into public.users (id, email, name, role, level, facilitator_id)
  values (new.id, new.email, derived_name, 'trainee', 'beginner', null)
  on conflict (id) do update
    set email = excluded.email;

  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
after insert or update of email, raw_user_meta_data
on auth.users
for each row
execute function public.handle_auth_user_profile();

create or replace function public.promote_user_to_facilitator(target_email text)
returns public.users
language plpgsql
security definer
set search_path = public
as $$
declare
  promoted public.users;
begin
  update public.users
    set role = 'facilitator',
        updated_at = timezone('utc', now())
  where email = lower(trim(target_email))
  returning * into promoted;

  if promoted.id is null then
    raise exception 'No public.users row found for email %', target_email;
  end if;

  return promoted;
end;
$$;

revoke all on function public.promote_user_to_facilitator(text) from public;
