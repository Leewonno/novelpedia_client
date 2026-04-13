-- authors_history 테이블
create table public.authors_history (
  id                uuid        primary key default gen_random_uuid(),
  author_id         uuid        not null references public.authors(id) on delete cascade,
  name              text        not null,
  primary_name      text        not null,
  bio               text,
  profile_image_url text,
  content           text,
  changed_by        uuid        references auth.users(id) on delete set null,
  changed_at        timestamptz not null default now()
);

create index authors_history_author_id_idx on public.authors_history(author_id);
create index authors_history_changed_at_idx on public.authors_history(changed_at desc);

-- novels_history 테이블
create table public.novels_history (
  id             uuid        primary key default gen_random_uuid(),
  novel_id       uuid        not null references public.novels(id) on delete cascade,
  title          text        not null,
  primary_title  text        not null,
  author_id      uuid,
  genre          text        not null,
  synopsis       text,
  publisher      text,
  status         text        not null,
  thumbnail_url  text,
  tags           text[]      not null default '{}',
  content        text,
  changed_by     uuid        references auth.users(id) on delete set null,
  changed_at     timestamptz not null default now()
);

create index novels_history_novel_id_idx on public.novels_history(novel_id);
create index novels_history_changed_at_idx on public.novels_history(changed_at desc);

-- RLS: 누구나 읽기 가능, 쓰기는 트리거만 (직접 INSERT/UPDATE/DELETE 불가)
alter table public.authors_history enable row level security;
alter table public.novels_history enable row level security;

create policy "Public can read authors_history"
  on public.authors_history for select using (true);

create policy "Public can read novels_history"
  on public.novels_history for select using (true);

-- 직접 INSERT/UPDATE/DELETE 정책 없음 → 트리거만 가능 (SECURITY DEFINER 함수 사용)
