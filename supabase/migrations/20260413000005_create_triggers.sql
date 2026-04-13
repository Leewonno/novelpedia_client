-- =====================================================
-- 1. authors history + version 트리거
-- =====================================================
create or replace function public.record_authors_history()
returns trigger
security definer  -- 히스토리 테이블에 직접 INSERT 권한
set search_path = public
as $$
begin
  -- 변경 전 상태를 히스토리에 기록
  insert into public.authors_history (
    author_id, name, primary_name, bio,
    profile_image_url, content, changed_by, changed_at
  ) values (
    old.id, old.name, old.primary_name, old.bio,
    old.profile_image_url, old.content,
    auth.uid(), now()
  );

  -- version 증가
  new.version = old.version + 1;

  return new;
end;
$$ language plpgsql;

create trigger authors_history_trigger
  before update on public.authors
  for each row
  when (
    old.name is distinct from new.name or
    old.primary_name is distinct from new.primary_name or
    old.bio is distinct from new.bio or
    old.profile_image_url is distinct from new.profile_image_url or
    old.content is distinct from new.content
  )
  execute function public.record_authors_history();

-- =====================================================
-- 2. novels history + version 트리거
-- =====================================================
create or replace function public.record_novels_history()
returns trigger
security definer
set search_path = public
as $$
begin
  insert into public.novels_history (
    novel_id, title, primary_title, author_id, genre,
    synopsis, publisher, status, thumbnail_url, tags,
    content, changed_by, changed_at
  ) values (
    old.id, old.title, old.primary_title, old.author_id, old.genre,
    old.synopsis, old.publisher, old.status, old.thumbnail_url, old.tags,
    old.content, auth.uid(), now()
  );

  new.version = old.version + 1;

  return new;
end;
$$ language plpgsql;

create trigger novels_history_trigger
  before update on public.novels
  for each row
  when (
    old.title is distinct from new.title or
    old.primary_title is distinct from new.primary_title or
    old.author_id is distinct from new.author_id or
    old.genre is distinct from new.genre or
    old.synopsis is distinct from new.synopsis or
    old.publisher is distinct from new.publisher or
    old.status is distinct from new.status or
    old.thumbnail_url is distinct from new.thumbnail_url or
    old.tags is distinct from new.tags or
    old.content is distinct from new.content
  )
  execute function public.record_novels_history();

-- =====================================================
-- 3. reviews 변경 시 novels.stars / stars_count 갱신
--    + authors.stars / stars_count 갱신
-- =====================================================
create or replace function public.update_stars_cache()
returns trigger
security definer
set search_path = public
as $$
declare
  v_novel_id uuid;
  v_author_id uuid;
  v_novel_stars integer;
  v_novel_stars_count integer;
begin
  -- INSERT 또는 UPDATE: new.novel_id 기준
  -- DELETE: old.novel_id 기준
  if (tg_op = 'DELETE') then
    v_novel_id = old.novel_id;
  else
    v_novel_id = new.novel_id;
  end if;

  -- novels.stars, stars_count 재집계
  select
    coalesce(sum((rating * 10)::integer), 0),  -- 소수점 누적 오차 방지
    count(*)::integer
  into v_novel_stars, v_novel_stars_count
  from public.reviews
  where novel_id = v_novel_id;

  update public.novels
  set
    stars = v_novel_stars,
    stars_count = v_novel_stars_count
  where id = v_novel_id
  returning author_id into v_author_id;

  -- authors.stars, stars_count 재집계 (해당 작가의 모든 소설 합)
  if v_author_id is not null then
    select
      coalesce(sum(stars), 0),
      coalesce(sum(stars_count), 0)
    into v_novel_stars, v_novel_stars_count
    from public.novels
    where author_id = v_author_id and is_delete = false;

    update public.authors
    set
      stars = v_novel_stars,
      stars_count = v_novel_stars_count
    where id = v_author_id;
  end if;

  if (tg_op = 'DELETE') then
    return old;
  end if;
  return new;
end;
$$ language plpgsql;

create trigger reviews_stars_cache_trigger
  after insert or update of rating or delete on public.reviews
  for each row execute function public.update_stars_cache();
