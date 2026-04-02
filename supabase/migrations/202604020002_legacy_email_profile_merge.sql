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

  update public.users
     set id = new.id,
         email = new.email,
         name = derived_name,
         updated_at = timezone('utc', now())
   where lower(email) = lower(new.email)
     and id <> new.id;

  insert into public.users (id, email, name, role, level, facilitator_id)
  values (new.id, new.email, derived_name, 'trainee', 'beginner', null)
  on conflict (id) do update
    set email = excluded.email,
        name = excluded.name,
        updated_at = timezone('utc', now());

  return new;
end;
$$;
