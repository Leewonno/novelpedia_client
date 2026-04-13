-- novels 테이블
create table public.novels (
  id               uuid        primary key default gen_random_uuid(),
  title            text        not null,
  primary_title    text        not null unique,
  author_id        uuid        references public.authors(id) on delete set null,
  genre            text        not null check (genre in ('novel', 'webnovel', 'manga', 'webtoon')),
  synopsis         text,
  publisher        text,
  status           text        not null check (status in ('ongoing', 'completed', 'hiatus')),
  thumbnail_url    text,
  tags             text[]      not null default '{}',
  content          text,
  is_delete        boolean     not null default false,
  is_block         boolean     not null default false,
  stars            integer     not null default 0,
  stars_count      integer     not null default 0,
  version          integer     not null default 1,
  views            integer     not null default 0,
  created_at       timestamptz not null default now(),
  updated_at       timestamptz not null default now()
);

create trigger novels_updated_at
  before update on public.novels
  for each row execute function public.set_updated_at();

-- 인덱스
create index novels_author_id_idx on public.novels(author_id);
create index novels_genre_idx on public.novels(genre);
create index novels_status_idx on public.novels(status);
create index novels_tags_idx on public.novels using gin(tags);
create index novels_active_idx on public.novels(is_delete, is_block);

-- RLS 활성화
alter table public.novels enable row level security;

create policy "Public can read active novels"
  on public.novels
  for select
  using (is_delete = false and is_block = false);

create policy "Admin can read all novels"
  on public.novels
  for select
  using ((auth.jwt() -> 'user_metadata' ->> 'is_admin')::boolean = true);

create policy "Authenticated users can insert novels"
  on public.novels
  for insert
  to authenticated
  with check (true);

create policy "Authenticated users can update novels"
  on public.novels
  for update
  to authenticated
  using (true)
  with check (
    is_block = (select is_block from public.novels where id = novels.id)
  );

create policy "Admin can update all novels fields"
  on public.novels
  for update
  using ((auth.jwt() -> 'user_metadata' ->> 'is_admin')::boolean = true)
  with check (true);
