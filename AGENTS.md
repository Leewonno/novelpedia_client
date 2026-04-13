<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.

<!-- END:nextjs-agent-rules -->

# Novelpedia

소설/만화 정보 위키 + 리뷰 플랫폼.

## 기술 스택

- **Frontend**: Next.js 16 (App Router), React 19, Tailwind CSS 4, TypeScript
- **Backend**: Supabase (PostgreSQL, Auth, Storage, RLS)
- **Linter/Formatter**: Biome

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
- `primary_name` / `primary_title`: `normalizePrimary()` 함수로 저장 전 변환 (`src/shared/lib/utils/normalize.ts`)
- `stars`: rating*10 합산 정수. 평균 = `stars / stars_count / 10` (`calcAverageRating()` in `src/shared/lib/supabase/types.ts`)
- `genre` enum: `novel | webnovel | manga | webtoon`
- `status` enum: `ongoing | completed | hiatus`
- `is_delete = true`: 소프트 삭제 (공개 읽기 차단)
- `is_block = true`: 관리자 차단 (공개 읽기 차단, 관리자만 변경 가능)
- 히스토리: UPDATE 시 트리거가 이전 상태 자동 스냅샷, `version` 자동 +1

### TypeScript 타입 위치
`src/shared/lib/supabase/types.ts` — Author, Novel, Review, AuthorHistory, NovelHistory, Profile, Database

### Supabase 클라이언트
- **브라우저 (Client Component)**: `createClient()` from `@/shared/lib/supabase/client`
- **서버 (Server Component / Server Action)**: `createServerSupabaseClient()` from `@/shared/lib/supabase/server`

## 코딩 규칙

- `console.log` 사용 금지
- Zod로 Server Action 입력값 검증
- 불변 업데이트 (spread operator, mutation 금지)
- async/await + try/catch 에러 처리
- 환경변수는 `process.env`에서만 참조, 하드코딩 금지
- TypeScript strict mode — `any` 사용 금지

## 에이전트 참조 가이드

| 상황 | 호출할 에이전트 |
|------|----------------|
| 새 기능 개발 시작 | `planner` 먼저 |
| UI/UX 설계 필요 | `designer` |
| 컴포넌트 구현 | `frontend-dev` |
| DB 스키마/RLS 작업 | `supabase-dev` |
| 코드 작성 완료 후 | `code-reviewer` |

## 슬래시 커맨드

- `/feature <설명>` — 전체 파이프라인 실행
- `/schema <설명>` — supabase-dev 단독 호출
- `/design <설명>` — designer 단독 호출
