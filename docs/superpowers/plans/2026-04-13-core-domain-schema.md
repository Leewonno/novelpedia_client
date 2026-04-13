# Core Domain Schema Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Novelpedia의 핵심 DB 스키마(authors, novels, reviews, history 테이블), RLS 정책, 트리거, TypeScript 타입, 정규화 유틸리티를 구축한다.

**Architecture:** Supabase CLI로 로컬 마이그레이션을 관리한다. 각 테이블을 별도 마이그레이션 파일로 분리하여 독립 적용이 가능하게 한다. 트리거는 별도 마이그레이션에 모아 의존 순서를 명확히 한다. TypeScript 타입은 스키마와 동기화된 수동 정의로 시작한다.

**Tech Stack:** Supabase CLI, PostgreSQL, `@supabase/ssr`, `@supabase/supabase-js`, TypeScript, Vitest

---

## 파일 구조

```
client/
├── supabase/
│   └── migrations/
│       ├── 20260413000001_create_authors.sql
│       ├── 20260413000002_create_novels.sql
│       ├── 20260413000003_create_reviews.sql
│       ├── 20260413000004_create_history_tables.sql
│       └── 20260413000005_create_triggers.sql
├── src/
│   └── lib/
│       ├── supabase/
│       │   ├── client.ts        ← 서버/클라이언트 Supabase 인스턴스
│       │   └── types.ts         ← DB 스키마 TypeScript 타입
│       └── utils/
│           ├── normalize.ts     ← primary_name/primary_title 정규화
│           └── normalize.test.ts
└── vitest.config.ts
```

---

## Task 1: Supabase CLI 설치 + 프로젝트 초기화

**Files:**
- Create: `client/supabase/` (디렉토리)

- [ ] **Step 1: Supabase CLI 설치**

```bash
brew install supabase/tap/supabase
```

설치 확인:
```bash
supabase --version
```
Expected: `2.x.x` 이상

- [ ] **Step 2: Supabase 패키지 설치**

```bash
cd /Users/lwn/Desktop/projects/novelpedia_release/client
npm install @supabase/supabase-js @supabase/ssr
```

Expected: `package.json`에 두 패키지 추가됨

- [ ] **Step 3: Supabase 프로젝트 초기화**

```bash
cd /Users/lwn/Desktop/projects/novelpedia_release/client
supabase init
```

Expected: `supabase/config.toml` 생성

- [ ] **Step 4: 로컬 Supabase 시작**

```bash
cd /Users/lwn/Desktop/projects/novelpedia_release/client
supabase start
```

Expected: 로컬 Supabase 실행, 아래와 유사한 출력:
```
API URL: http://localhost:54321
DB URL: postgresql://postgres:postgres@localhost:54322/postgres
Studio URL: http://localhost:54323
```

출력된 `anon key`와 `service_role key`를 `.env.local`에 저장한다:

```bash
cat > .env.local << 'EOF'
NEXT_PUBLIC_SUPABASE_URL=http://localhost:54321
NEXT_PUBLIC_SUPABASE_ANON_KEY=<출력된 anon key>
SUPABASE_SERVICE_ROLE_KEY=<출력된 service_role key>
EOF
```

- [ ] **Step 5: .gitignore에 .env.local 추가 확인**

```bash
grep ".env.local" .gitignore || echo ".env.local" >> .gitignore
```

- [ ] **Step 6: 커밋**

```bash
git add supabase/config.toml .gitignore package.json package-lock.json
git commit -m "chore: init supabase project and install supabase packages"
```

---

## Task 2: authors 테이블 마이그레이션

**Files:**
- Create: `client/supabase/migrations/20260413000001_create_authors.sql`

- [ ] **Step 1: 마이그레이션 파일 생성**

```bash
cd /Users/lwn/Desktop/projects/novelpedia_release/client
supabase migration new create_authors
```

Expected: `supabase/migrations/YYYYMMDDHHMMSS_create_authors.sql` 생성

생성된 파일명을 확인하고, 아래 내용으로 교체한다 (파일명은 실제 생성된 것을 사용):

- [ ] **Step 2: SQL 작성**

`supabase/migrations/<timestamp>_create_authors.sql`:

```sql
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
```

- [ ] **Step 3: 마이그레이션 적용**

```bash
cd /Users/lwn/Desktop/projects/novelpedia_release/client
supabase db reset
```

Expected: 에러 없이 완료

- [ ] **Step 4: 스키마 검증**

```bash
supabase db lint
```

Expected: 에러 없음 (경고는 무시 가능)

```bash
supabase status
```

테이블 생성 확인:
```bash
psql postgresql://postgres:postgres@localhost:54322/postgres -c "\d public.authors"
```

Expected: authors 테이블 컬럼 목록 출력

- [ ] **Step 5: 커밋**

```bash
git add supabase/migrations/
git commit -m "feat: add authors table with RLS policies"
```

---

## Task 3: novels 테이블 마이그레이션

**Files:**
- Create: `client/supabase/migrations/<timestamp>_create_novels.sql`

- [ ] **Step 1: 마이그레이션 파일 생성**

```bash
cd /Users/lwn/Desktop/projects/novelpedia_release/client
supabase migration new create_novels
```

- [ ] **Step 2: SQL 작성**

생성된 파일에 작성:

```sql
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
```

- [ ] **Step 3: 마이그레이션 적용 및 검증**

```bash
supabase db reset
psql postgresql://postgres:postgres@localhost:54322/postgres -c "\d public.novels"
```

Expected: novels 테이블 컬럼 목록 + check 제약 출력

- [ ] **Step 4: genre/status 제약 검증**

```bash
psql postgresql://postgres:postgres@localhost:54322/postgres -c "
insert into public.novels (title, primary_title, genre, status)
values ('테스트', '테스트', 'invalid_genre', 'ongoing');
"
```

Expected: `ERROR: new row for relation "novels" violates check constraint "novels_genre_check"`

- [ ] **Step 5: 커밋**

```bash
git add supabase/migrations/
git commit -m "feat: add novels table with RLS policies and constraints"
```

---

## Task 4: reviews 테이블 마이그레이션

**Files:**
- Create: `client/supabase/migrations/<timestamp>_create_reviews.sql`

- [ ] **Step 1: 마이그레이션 파일 생성**

```bash
supabase migration new create_reviews
```

- [ ] **Step 2: SQL 작성**

```sql
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
```

- [ ] **Step 3: 마이그레이션 적용 및 rating 제약 검증**

```bash
supabase db reset
```

rating 0.3 거부 확인 (SQL로 직접 테스트하려면 user 없이 안 되므로 제약 구조 확인):
```bash
psql postgresql://postgres:postgres@localhost:54322/postgres -c "\d public.reviews"
```

Expected: rating 컬럼에 check 제약 표시됨

- [ ] **Step 4: 커밋**

```bash
git add supabase/migrations/
git commit -m "feat: add reviews table with RLS and 0.5-step rating constraint"
```

---

## Task 5: 히스토리 테이블 마이그레이션

**Files:**
- Create: `client/supabase/migrations/<timestamp>_create_history_tables.sql`

- [ ] **Step 1: 마이그레이션 파일 생성**

```bash
supabase migration new create_history_tables
```

- [ ] **Step 2: SQL 작성**

```sql
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
```

- [ ] **Step 3: 마이그레이션 적용**

```bash
supabase db reset
psql postgresql://postgres:postgres@localhost:54322/postgres -c "\dt public.*"
```

Expected: authors, novels, reviews, authors_history, novels_history 5개 테이블 출력

- [ ] **Step 4: 커밋**

```bash
git add supabase/migrations/
git commit -m "feat: add authors_history and novels_history tables"
```

---

## Task 6: 트리거 마이그레이션 (history + version + stars 캐시)

**Files:**
- Create: `client/supabase/migrations/<timestamp>_create_triggers.sql`

- [ ] **Step 1: 마이그레이션 파일 생성**

```bash
supabase migration new create_triggers
```

- [ ] **Step 2: SQL 작성**

```sql
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
```

> **Note on stars storage**: `stars`는 `rating * 10` 정수로 저장하여 소수점 누적 오차를 방지한다. 표시 시 `stars / stars_count / 10`으로 평균을 구한다. (예: rating 3.5 → stars에 35 누적)

- [ ] **Step 3: 마이그레이션 적용**

```bash
supabase db reset
```

Expected: 에러 없이 완료

- [ ] **Step 4: 트리거 등록 확인**

```bash
psql postgresql://postgres:postgres@localhost:54322/postgres -c "
select trigger_name, event_manipulation, event_object_table
from information_schema.triggers
where trigger_schema = 'public'
order by event_object_table, trigger_name;
"
```

Expected:
```
        trigger_name         | event_manipulation | event_object_table
-----------------------------+--------------------+-------------------
 authors_history_trigger     | UPDATE             | authors
 authors_updated_at          | UPDATE             | authors
 novels_history_trigger      | UPDATE             | novels
 novels_updated_at           | UPDATE             | novels
 reviews_stars_cache_trigger | DELETE             | reviews
 reviews_stars_cache_trigger | INSERT             | reviews
 reviews_stars_cache_trigger | UPDATE             | reviews
 reviews_updated_at          | UPDATE             | reviews
```

- [ ] **Step 5: 커밋**

```bash
git add supabase/migrations/
git commit -m "feat: add history, version, and stars cache triggers"
```

---

## Task 7: 정규화 유틸리티 (TDD)

**Files:**
- Create: `client/vitest.config.ts`
- Create: `client/src/lib/utils/normalize.ts`
- Create: `client/src/lib/utils/normalize.test.ts`

- [ ] **Step 1: Vitest 설치**

```bash
cd /Users/lwn/Desktop/projects/novelpedia_release/client
npm install -D vitest
```

- [ ] **Step 2: vitest.config.ts 작성**

```typescript
import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    environment: 'node',
  },
})
```

- [ ] **Step 3: package.json에 test 스크립트 추가**

`package.json`의 `scripts`에 추가:
```json
"test": "vitest run",
"test:watch": "vitest"
```

- [ ] **Step 4: 실패하는 테스트 먼저 작성**

`src/lib/utils/normalize.test.ts`:

```typescript
import { describe, expect, it } from 'vitest'
import { normalizePrimary } from './normalize'

describe('normalizePrimary', () => {
  it('소문자로 변환한다', () => {
    expect(normalizePrimary('Solo Leveling')).toBe('sololeveling')
  })

  it('공백을 모두 제거한다', () => {
    expect(normalizePrimary('나 혼자만 레벨업')).toBe('나혼자만레벨업')
  })

  it('특수문자를 제거한다', () => {
    expect(normalizePrimary('나 혼자만 레벨업!')).toBe('나혼자만레벨업')
  })

  it('탭과 줄바꿈도 제거한다', () => {
    expect(normalizePrimary('Solo\tLeveling\n')).toBe('sololeveling')
  })

  it('여러 특수문자를 모두 제거한다', () => {
    expect(normalizePrimary('Re:Zero ~Starting Life~')).toBe('rezerostartinglife')
  })

  it('빈 문자열을 반환한다 (입력이 빈 문자열인 경우)', () => {
    expect(normalizePrimary('')).toBe('')
  })

  it('이미 정규화된 문자열은 그대로 반환한다', () => {
    expect(normalizePrimary('sololeveling')).toBe('sololeveling')
  })

  it('숫자는 유지한다', () => {
    expect(normalizePrimary('86 - Eighty Six')).toBe('86eightysix')
  })
})
```

- [ ] **Step 5: 테스트 실행 — 실패 확인**

```bash
npm test
```

Expected: FAIL — `normalizePrimary` 함수를 찾을 수 없음

- [ ] **Step 6: 구현 작성**

`src/lib/utils/normalize.ts`:

```typescript
/**
 * primary_name / primary_title 정규화 함수
 * 규칙: 소문자 변환 → 공백 전체 제거 → 특수문자 전체 제거
 * 목적: DB UNIQUE 제약으로 중복을 방지하기 위한 정규화 키 생성
 */
export function normalizePrimary(value: string): string {
  return value
    .toLowerCase()
    .replace(/\s+/g, '')           // 공백(탭, 줄바꿈 포함) 제거
    .replace(/[^\p{L}\p{N}]/gu, '') // 문자(유니코드)와 숫자 외 모두 제거
}
```

- [ ] **Step 7: 테스트 실행 — 통과 확인**

```bash
npm test
```

Expected:
```
✓ src/lib/utils/normalize.test.ts (8 tests) 
Test Files  1 passed (1)
Tests       8 passed (8)
```

- [ ] **Step 8: 커밋**

```bash
git add vitest.config.ts src/lib/utils/normalize.ts src/lib/utils/normalize.test.ts package.json package-lock.json
git commit -m "feat: add normalizePrimary utility with tests"
```

---

## Task 8: Supabase 클라이언트 + TypeScript 타입

**Files:**
- Create: `client/src/lib/supabase/client.ts`
- Create: `client/src/lib/supabase/types.ts`

- [ ] **Step 1: src/lib/supabase 디렉토리 생성 확인**

```bash
mkdir -p /Users/lwn/Desktop/projects/novelpedia_release/client/src/lib/supabase
```

- [ ] **Step 2: Supabase 클라이언트 작성**

`src/lib/supabase/client.ts`:

```typescript
import { createBrowserClient, createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import type { Database } from './types'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables')
}

/** 클라이언트 컴포넌트에서 사용 ('use client' 필요) */
export function createClient() {
  return createBrowserClient<Database>(supabaseUrl, supabaseAnonKey)
}

/** 서버 컴포넌트 / Server Action에서 사용 */
export async function createServerSupabaseClient() {
  const cookieStore = await cookies()
  return createServerClient<Database>(supabaseUrl, supabaseAnonKey, {
    cookies: {
      getAll() {
        return cookieStore.getAll()
      },
      setAll(cookiesToSet) {
        try {
          cookiesToSet.forEach(({ name, value, options }) =>
            cookieStore.set(name, value, options)
          )
        } catch {
          // Server Components에서는 쿠키 설정 불가 — Middleware에서 처리
        }
      },
    },
  })
}
```

- [ ] **Step 3: TypeScript 타입 작성**

`src/lib/supabase/types.ts`:

```typescript
export type Genre = 'novel' | 'webnovel' | 'manga' | 'webtoon'
export type Status = 'ongoing' | 'completed' | 'hiatus'

export interface Author {
  id: string
  name: string
  primary_name: string
  bio: string | null
  profile_image_url: string | null
  content: string | null
  is_delete: boolean
  is_block: boolean
  stars: number
  stars_count: number
  version: number
  views: number
  created_at: string
  updated_at: string
}

export interface Novel {
  id: string
  title: string
  primary_title: string
  author_id: string | null
  genre: Genre
  synopsis: string | null
  publisher: string | null
  status: Status
  thumbnail_url: string | null
  tags: string[]
  content: string | null
  is_delete: boolean
  is_block: boolean
  stars: number
  stars_count: number
  version: number
  views: number
  created_at: string
  updated_at: string
}

export interface Review {
  id: string
  novel_id: string
  user_id: string
  rating: number
  body: string
  created_at: string
  updated_at: string
}

export interface AuthorHistory {
  id: string
  author_id: string
  name: string
  primary_name: string
  bio: string | null
  profile_image_url: string | null
  content: string | null
  changed_by: string | null
  changed_at: string
}

export interface NovelHistory {
  id: string
  novel_id: string
  title: string
  primary_title: string
  author_id: string | null
  genre: Genre
  synopsis: string | null
  publisher: string | null
  status: Status
  thumbnail_url: string | null
  tags: string[]
  content: string | null
  changed_by: string | null
  changed_at: string
}

/** 평균 별점 계산 (stars는 rating*10 합산값) */
export function calcAverageRating(stars: number, starsCount: number): number {
  if (starsCount === 0) return 0
  return Math.round((stars / starsCount / 10) * 10) / 10
}

export interface Database {
  public: {
    Tables: {
      authors: {
        Row: Author
        Insert: Omit<Author, 'id' | 'created_at' | 'updated_at' | 'stars' | 'stars_count' | 'version' | 'views' | 'is_delete' | 'is_block'>
        Update: Partial<Omit<Author, 'id' | 'created_at'>>
      }
      novels: {
        Row: Novel
        Insert: Omit<Novel, 'id' | 'created_at' | 'updated_at' | 'stars' | 'stars_count' | 'version' | 'views' | 'is_delete' | 'is_block'>
        Update: Partial<Omit<Novel, 'id' | 'created_at'>>
      }
      reviews: {
        Row: Review
        Insert: Omit<Review, 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Pick<Review, 'rating' | 'body'>>
      }
      authors_history: {
        Row: AuthorHistory
        Insert: never  // 트리거만 INSERT
        Update: never
      }
      novels_history: {
        Row: NovelHistory
        Insert: never  // 트리거만 INSERT
        Update: never
      }
    }
  }
}
```

- [ ] **Step 4: TypeScript 타입 체크**

```bash
cd /Users/lwn/Desktop/projects/novelpedia_release/client
npx tsc --noEmit
```

Expected: 에러 없음

- [ ] **Step 5: 커밋**

```bash
git add src/lib/supabase/
git commit -m "feat: add supabase client and TypeScript types for core domain"
```

---

## Task 9: AGENTS.md 도메인 섹션 업데이트

**Files:**
- Modify: `client/AGENTS.md`

- [ ] **Step 1: AGENTS.md의 핵심 도메인 섹션 업데이트**

`AGENTS.md`의 `## 핵심 도메인` 섹션을 다음으로 교체한다:

```markdown
## 핵심 도메인

### 테이블

| 테이블 | 설명 |
|--------|------|
| `authors` | 작가 (name, primary_name UNIQUE, bio, content markdown, stars 캐시, version) |
| `novels` | 작품 (title, primary_title UNIQUE, author_id FK, genre, status, tags text[], content markdown, stars 캐시, version) |
| `reviews` | 리뷰 (novel_id FK, user_id FK, rating numeric 1.0-5.0 0.5단위, body) — 1인 1리뷰 |
| `authors_history` | 작가 편집 이력 (트리거 자동 기록, 직접 쓰기 불가) |
| `novels_history` | 작품 편집 이력 (트리거 자동 기록, 직접 쓰기 불가) |

### 핵심 규칙
- `primary_name` / `primary_title`: `normalizePrimary()` 함수로 저장 전 변환 (`src/lib/utils/normalize.ts`)
- `stars`: rating*10 합산 정수. 평균 = `stars / stars_count / 10` (`calcAverageRating()` in `src/lib/supabase/types.ts`)
- `genre` enum: `novel | webnovel | manga | webtoon`
- `status` enum: `ongoing | completed | hiatus`
- `is_delete = true`: 소프트 삭제 (공개 읽기 차단)
- `is_block = true`: 관리자 차단 (공개 읽기 차단, 관리자만 변경 가능)
- 히스토리: UPDATE 시 트리거가 이전 상태 자동 스냅샷, `version` 자동 +1

### TypeScript 타입 위치
`src/lib/supabase/types.ts` — Author, Novel, Review, AuthorHistory, NovelHistory, Database
```

- [ ] **Step 2: 커밋**

```bash
git add AGENTS.md
git commit -m "docs: update AGENTS.md with confirmed core domain"
```
