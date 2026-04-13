-- reviews 테이블
create table public.reviews (
  id         uuid           primary key default gen_random_uuid(),
  novel_id   uuid           not null references public.novels(id) on delete cascade,
  user_id    uuid           not null references auth.users(id) on delete cascade,
  rating     numeric(2,1)   not null check (rating >= 1.0 and rating <= 5.0 and (rating * 2) = floor(rating * 2)),
  body       text           not null,
  created_at timestamptz    not null default now(),
  updated_at timestamptz    not null default now(),
  unique (novel_id, user_id)
);

-- rating check 설명: (rating * 2) = floor(rating * 2) 는 0.5 단위만 허용
-- 1.0, 1.5, 2.0, 2.5, 3.0, 3.5, 4.0, 4.5, 5.0 만 유효

create trigger reviews_updated_at
  before update on public.reviews
  for each row execute function public.set_updated_at();

create index reviews_novel_id_idx on public.reviews(novel_id);
create index reviews_user_id_idx on public.reviews(user_id);

-- RLS 활성화
alter table public.reviews enable row level security;

create policy "Public can read reviews"
  on public.reviews
  for select
  using (true);

create policy "Authenticated users can insert reviews"
  on public.reviews
  for insert
  to authenticated
  with check (auth.uid() = user_id);

create policy "Users can update own reviews"
  on public.reviews
  for update
  to authenticated
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create policy "Users can delete own reviews"
  on public.reviews
  for delete
  to authenticated
  using (auth.uid() = user_id);
