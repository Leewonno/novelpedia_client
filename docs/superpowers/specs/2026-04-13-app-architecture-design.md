# Novelpedia 앱 아키텍처 설계

## 개요

Novelpedia의 라우팅 구조, 폴더 구조, 게시판 스키마, 관리자 서브도메인 설계를 정의한다.

---

## 라우팅 구조

### 일반 사이트 (novelpedia.com)

```
app/
├── (site)/
│   ├── page.tsx                              # 홈: 랜딩 + 최근 작품 목록
│   ├── n/
│   │   ├── page.tsx                          # 작품 목록 (장르/상태 필터)
│   │   ├── new/page.tsx                      # 작품 등록
│   │   └── [primary_title]/
│   │       ├── page.tsx                      # 작품 상세 + 리뷰 목록
│   │       ├── edit/page.tsx                 # 작품 편집
│   │       └── history/
│   │           ├── page.tsx                  # 편집 이력 목록
│   │           └── compare/page.tsx          # 버전 비교 (?from=1&to=10)
│   ├── a/
│   │   ├── page.tsx                          # 작가 목록
│   │   ├── new/page.tsx                      # 작가 등록
│   │   └── [primary_name]/
│   │       ├── page.tsx                      # 작가 상세 + 작품 목록
│   │       ├── edit/page.tsx                 # 작가 편집
│   │       └── history/
│   │           ├── page.tsx                  # 편집 이력 목록
│   │           └── compare/page.tsx          # 버전 비교 (?from=1&to=10)
│   ├── board/
│   │   ├── report/
│   │   │   ├── page.tsx                      # 신고게시판 목록
│   │   │   ├── new/page.tsx                  # 신고 작성
│   │   │   └── [id]/page.tsx                 # 신고 상세 + 관리자 댓글
│   │   ├── recommend/
│   │   │   ├── page.tsx                      # 추천게시판 목록
│   │   │   ├── new/page.tsx                  # 추천 작성
│   │   │   └── [id]/page.tsx                 # 추천 상세 + 댓글 + 좋아요
│   │   └── ask/
│   │       ├── page.tsx                      # 문의게시판 목록
│   │       ├── new/page.tsx                  # 문의 작성
│   │       └── [id]/page.tsx                 # 문의 상세 + 관리자 댓글
│   ├── search/page.tsx                       # 통합 검색 (novels / authors 탭)
│   ├── my/page.tsx                           # 내 리뷰, 내 편집이력
│   ├── login/page.tsx
│   └── signup/page.tsx
└── admin/                                    # admin.novelpedia.com → /admin/* 리라이트
    ├── login/page.tsx                        # 관리자 전용 로그인
    ├── layout.tsx                            # 관리자 전용 레이아웃
    ├── page.tsx                              # 대시보드
    ├── n/page.tsx                            # 작품 관리 (차단/삭제/되돌리기)
    ├── a/page.tsx                            # 작가 관리 (차단/삭제/되돌리기)
    ├── users/page.tsx                        # 사용자 관리 (차단)
    └── board/
        ├── report/page.tsx
        ├── recommend/page.tsx
        └── ask/page.tsx
```

### URL 규칙

- **Slug**: `primary_title` / `primary_name` 그대로 사용 (이미 정규화된 UNIQUE 값)
  - 예: `novelpedia.com/n/나혼자만레벨업`, `novelpedia.com/a/전민희`
- **버전 비교**: 쿼리 파라미터 사용 — `/history/compare?from=1&to=10`

---

## 관리자 서브도메인

### proxy.ts

`admin.novelpedia.com`으로 들어오는 요청을 `/admin/*`으로 리라이트한다.
인증 가드도 함께 처리한다.

```typescript
// proxy.ts
export function proxy(request: NextRequest) {
  const hostname = request.nextUrl.hostname

  if (hostname === 'admin.novelpedia.com') {
    const pathname = request.nextUrl.pathname

    // 로그인 페이지는 통과
    if (pathname === '/admin/login') {
      return NextResponse.rewrite(new URL(`/admin/login`, request.url))
    }

    // 세션 + is_admin 체크 → 없으면 /admin/login 리다이렉트
    // (실제 구현 시 Supabase 세션 검증 추가)

    return NextResponse.rewrite(new URL(`/admin${pathname}`, request.url))
  }
}
```

### 관리자 인증 흐름

```
admin.novelpedia.com 접근
    ↓
proxy.ts: 세션 있음?
    ├── 없음 → /admin/login 리다이렉트
    └── 있음 → is_admin = true?
            ├── 아님 → /admin/login 리다이렉트 (권한 없음)
            └── 맞음 → 통과
```

- 관리자 로그인은 일반 사이트 세션과 쿠키 도메인을 분리한다 (`admin.novelpedia.com`)
- `is_admin` 판별: `auth.jwt() -> 'user_metadata' ->> 'is_admin'` (Supabase Auth admin API로 설정)

---

## 폴더 구조

```
src/
├── app/                              # 라우팅만 담당
├── features/
│   ├── novels/
│   │   ├── components/
│   │   ├── actions/                  # Server Actions
│   │   └── queries/                  # Supabase 쿼리
│   ├── authors/
│   │   ├── components/
│   │   ├── actions/
│   │   └── queries/
│   ├── reviews/
│   │   ├── components/
│   │   ├── actions/
│   │   └── queries/
│   ├── board/
│   │   ├── report/
│   │   │   ├── components/
│   │   │   ├── actions/
│   │   │   └── queries/
│   │   ├── recommend/
│   │   │   ├── components/
│   │   │   ├── actions/
│   │   │   └── queries/
│   │   └── ask/
│   │       ├── components/
│   │       ├── actions/
│   │       └── queries/
│   └── auth/
│       ├── components/
│       └── actions/
├── shared/
│   ├── components/                   # Button, Modal, Card 등 공통 UI
│   ├── lib/
│   │   ├── supabase/                 # client.ts, types.ts
│   │   └── utils/                    # normalize.ts
│   └── types/
└── proxy.ts
```

---

## 게시판 DB 스키마

### report_posts — 신고게시판

| 컬럼 | 타입 | 설명 |
|------|------|------|
| `id` | uuid PK | |
| `title` | text NOT NULL | |
| `body` | text NOT NULL | 마크다운 (이미지 인라인 포함) |
| `user_id` | uuid FK → auth.users | |
| `is_delete` | boolean NOT NULL DEFAULT false | |
| `is_block` | boolean NOT NULL DEFAULT false | |
| `created_at` | timestamptz | |
| `updated_at` | timestamptz | |

### report_comments — 신고 댓글 (관리자만 작성)

| 컬럼 | 타입 | 설명 |
|------|------|------|
| `id` | uuid PK | |
| `post_id` | uuid FK → report_posts | |
| `user_id` | uuid FK → auth.users | |
| `body` | text NOT NULL | |
| `is_delete` | boolean NOT NULL DEFAULT false | |
| `created_at` | timestamptz | |
| `updated_at` | timestamptz | |

### recommend_posts — 추천게시판

report_posts와 동일한 컬럼 구조.

### recommend_comments — 추천 댓글 (누구나 작성)

report_comments와 동일한 컬럼 구조.

### recommend_likes — 추천 좋아요

| 컬럼 | 타입 | 설명 |
|------|------|------|
| `id` | uuid PK | |
| `post_id` | uuid FK → recommend_posts | |
| `user_id` | uuid FK → auth.users | |
| `created_at` | timestamptz | |
| UNIQUE | (post_id, user_id) | 1인 1좋아요 |

### ask_posts — 문의게시판

report_posts와 동일한 컬럼 구조.

### ask_comments — 문의 댓글 (관리자만 작성)

report_comments와 동일한 컬럼 구조.

---

## 사용자 차단 스키마

### user_bans

| 컬럼 | 타입 | 설명 |
|------|------|------|
| `id` | uuid PK | |
| `user_id` | uuid FK → auth.users | 차단 대상 |
| `reason` | text NOT NULL | 차단 사유 |
| `banned_by` | uuid FK → auth.users | 차단한 관리자 |
| `banned_at` | timestamptz NOT NULL DEFAULT now() | |
| `unbanned_at` | timestamptz | 차단 해제 시점 (null이면 현재 차단 중) |

---

## 버전 비교 (compare)

`novels_history` / `authors_history` 테이블의 스냅샷 두 개를 가져와 필드별 diff를 표시한다.

- URL: `/n/[primary_title]/history/compare?from=1&to=10`
- `from`, `to`: 버전 번호 (`novels.version` 기준)
- 변경된 필드만 하이라이트해서 표시

---

## RLS 정책 요약 (게시판)

| 테이블 | SELECT | INSERT | UPDATE | DELETE |
|--------|--------|--------|--------|--------|
| `report_posts` | 누구나 | 로그인 사용자 | 본인 | 본인 (소프트) |
| `report_comments` | 누구나 | 관리자만 | 관리자만 | 불가 |
| `recommend_posts` | 누구나 | 로그인 사용자 | 본인 | 본인 (소프트) |
| `recommend_comments` | 누구나 | 로그인 사용자 | 본인 | 본인 (소프트) |
| `recommend_likes` | 누구나 | 로그인 사용자 | 불가 | 본인 |
| `ask_posts` | 본인 + 관리자 | 로그인 사용자 | 본인 | 본인 (소프트) |
| `ask_comments` | 본인 + 관리자 | 관리자만 | 관리자만 | 불가 |
| `user_bans` | 관리자만 | 관리자만 | 관리자만 | 불가 |
