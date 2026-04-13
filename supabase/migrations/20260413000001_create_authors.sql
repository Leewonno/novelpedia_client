-- authors 테이블
create table public.authors (
  id               uuid        primary key default gen_random_uuid(),
  name             text        not null,
  primary_name     text        not null unique,
  bio              text,
  profile_image_url text,
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

-- updated_at 자동 갱신 함수 (한 번만 생성)
create or replace function public.set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger authors_updated_at
  before update on public.authors
  for each row execute function public.set_updated_at();

-- 인덱스 (RLS 필터 성능 최적화)
create index authors_active_idx on public.authors(is_delete, is_block);

-- RLS 활성화
alter table public.authors enable row level security;

-- 읽기: is_delete=false AND is_block=false인 경우 누구나
create policy "Public can read active authors"
  on public.authors
  for select
  using (is_delete = false and is_block = false);

-- 관리자는 모든 레코드 읽기 가능
create policy "Admin can read all authors"
  on public.authors
  for select
  using ((auth.jwt() -> 'user_metadata' ->> 'is_admin')::boolean = true);

-- 로그인 사용자는 INSERT 가능
create policy "Authenticated users can insert authors"
  on public.authors
  for insert
  to authenticated
  with check (true);

-- 로그인 사용자는 UPDATE 가능 (is_block 제외)
create policy "Authenticated users can update authors"
  on public.authors
  for update
  to authenticated
  using (true)
  with check (
    -- is_block은 변경 불가 (관리자 전용 정책에서 처리)
    is_block = (select is_block from public.authors where id = authors.id)
  );

-- 관리자는 is_block 포함 모든 필드 UPDATE 가능
create policy "Admin can update all authors fields"
  on public.authors
  for update
  using ((auth.jwt() -> 'user_metadata' ->> 'is_admin')::boolean = true)
  with check (true);
