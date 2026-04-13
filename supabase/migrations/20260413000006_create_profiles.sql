create table public.profiles (
  id         uuid        primary key references auth.users(id) on delete cascade,
  username   text,
  avatar_url text,
  updated_at timestamptz not null default now()
);

-- RLS enabled immediately; INSERT is intentionally omitted — only the
-- handle_new_user SECURITY DEFINER trigger inserts rows, bypassing RLS.
alter table public.profiles enable row level security;

-- Requires public.set_updated_at() from a prior migration
create trigger profiles_updated_at
  before update on public.profiles
  for each row execute function public.set_updated_at();

-- 가입 시 프로필 자동 생성
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, username)
  values (
    new.id,
    coalesce(new.raw_user_meta_data ->> 'username', split_part(new.email, '@', 1))
  );
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

create policy "Profiles are viewable by everyone"
  on public.profiles
  for select
  using (true);

create policy "Users can update own profile"
  on public.profiles
  for update
  to authenticated
  using (auth.uid() = id)
  with check (auth.uid() = id);
