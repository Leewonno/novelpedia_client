# 메인 페이지 디자인 스펙

## 개요

Novelpedia 메인 페이지(`/`), 공통 헤더, 공통 푸터 디자인.  
레퍼런스: 왓챠피디아 — 카드 중심, 깔끔한 레이아웃.  
다크/라이트 모드 토글 지원.

---

## 전체 페이지 구조

```
[ 헤더 ]
[ 인기 작품 섹션 ]
[ 최신 작품 섹션 ]
[ 추천 게시판 섹션 ]
[ 푸터 ]
```

---

## 헤더

### 레이아웃

```
[ Novelpedia ]          [ 게시판  검색🔍  🌙/☀️  로그인  회원가입 ]
```

- 좌측: 로고 (브랜드 텍스트, 클릭 시 `/` 이동)
- 우측 (비로그인): 게시판, 검색 아이콘, 다크/라이트 토글, 로그인 버튼, 회원가입 버튼
- 우측 (로그인 후): 게시판, 검색 아이콘, 다크/라이트 토글, 프로필 이미지(원형)
- Sticky 없음 (스크롤 시 헤더가 사라짐)
- 하단 얇은 border로 콘텐츠 영역과 구분

### 검색

- 검색 아이콘(🔍) 클릭 시 헤더 우측에 검색창 인라인 확장
- 엔터 또는 검색 버튼 → `/search?q=...`로 이동
- 검색창 외부 클릭 또는 ESC → 검색창 닫힘

### 비로그인 상태

```
게시판  🔍  🌙  로그인  회원가입
```

- 로그인 → `/login`
- 회원가입 → `/signup`

### 로그인 상태

```
게시판  🔍  🌙  (프로필 이미지)
                     └ 드롭다운:
                       · 내 활동 → /my
                       · 내가 쓴 글 → /my
                       · 내 리뷰 → /my
                       · 로그아웃
```

- 프로필 이미지: 원형, 클릭 시 드롭다운 메뉴 열림
- 프로필 이미지 없으면 이니셜 원형 플레이스홀더
- 드롭다운은 클릭 외부 영역 클릭 시 닫힘

---

## 메인 페이지 섹션

### 인기 작품 섹션

```
인기 작품                              더보기 →
┌──────┐ ┌──────┐ ┌──────┐ ┌──────┐
│      │ │      │ │      │ │      │
│ 표지 │ │ 표지 │ │ 표지 │ │ 표지 │
│      │ │      │ │      │ │      │
├──────┤ ├──────┤ ├──────┤ ├──────┤
│ 제목 │ │ 제목 │ │ 제목 │ │ 제목 │
│ 작가 │ │ 작가 │ │ 작가 │ │ 작가 │
│ ★4.5│ │ ★4.2│ │ ★4.1│ │ ★4.0│
└──────┘ └──────┘ └──────┘ └──────┘
```

- 정렬 기준: `stars / stars_count` 내림차순 (별점 평균 높은 순)
- 4개 카드, 1행 가로 나열
- "더보기 →" → `/n/`
- 모바일: 2열 그리드

### 최신 작품 섹션

```
최근 등록                              더보기 →
┌──────┐ ┌──────┐ ┌──────┐ ┌──────┐
│ ...  │ │ ...  │ │ ...  │ │ ...  │
└──────┘ └──────┘ └──────┘ └──────┘
```

- 정렬 기준: `created_at` 내림차순
- 4개 카드, 인기 작품과 동일한 카드 구조
- "더보기 →" → `/n/`
- 모바일: 2열 그리드

### 작품 카드 공통 구조

| 요소 | 내용 |
|------|------|
| 표지 이미지 | 작품 이미지 (없으면 장르 이니셜 플레이스홀더) |
| 제목 | `novels.primary_title` |
| 작가명 | `authors.primary_name` |
| 별점 | `calcAverageRating(stars, stars_count)` 표시 (0일 경우 표시 안 함) |

- 카드 클릭 → `/n/[primary_title]`
- `is_delete = true` 또는 `is_block = true`인 작품 제외

### 추천 게시판 섹션

```
추천 게시판                            더보기 →
┌───────────────────────┐ ┌───────────────────────┐
│ (프사) 글 제목          │ │ (프사) 글 제목          │
│       username  ♥ 12  │ │       username  ♥ 8   │
└───────────────────────┘ └───────────────────────┘
┌───────────────────────┐ ┌───────────────────────┐
│ (프사) 글 제목          │ │ (프사) 글 제목          │
│       username  ♥ 21  │ │       username  ♥ 5   │
└───────────────────────┘ └───────────────────────┘
```

- 정렬 기준: `created_at` 내림차순 최신 4개
- 2×2 가로형 카드 그리드
- 카드 구성: 좌측 프로필 이미지(원형) + 우측 글 제목(위) / 사용자명 + 좋아요 수(아래)
- 프로필 이미지 없으면 이니셜 플레이스홀더
- 카드 클릭 → `/board/recommend/[id]`
- "더보기 →" → `/board/recommend/`
- `is_delete = true` 또는 `is_block = true`인 글 제외
- 모바일: 1열

---

## 푸터

```
─────────────────────────────────────
문의  신고  이용약관

© 2025 Novelpedia
```

| 링크 | 경로 |
|------|------|
| 문의 | `/board/ask/` |
| 신고 | `/board/report/` |
| 이용약관 | 추후 별도 페이지 |

---

## 다크/라이트 모드

- 헤더 우측 토글 아이콘으로 전환
- 라이트: 흰 배경 + 어두운 텍스트
- 다크: 어두운 배경 + 밝은 텍스트
- 선택값 `localStorage`에 저장 (새로고침 후 유지)
- Tailwind CSS `dark:` 클래스 활용
- 기본값: 시스템 설정(`prefers-color-scheme`) 따름

---

## 컴포넌트 구조

| 컴포넌트 | 위치 | 역할 |
|----------|------|------|
| `Header` | `src/shared/components/Header.tsx` | 공통 헤더 (Client Component) |
| `Footer` | `src/shared/components/Footer.tsx` | 공통 푸터 |
| `NovelCard` | `src/features/novels/components/NovelCard.tsx` | 작품 카드 |
| `RecommendPostCard` | `src/features/board/recommend/components/RecommendPostCard.tsx` | 추천 게시판 카드 |
| `ThemeToggle` | `src/shared/components/ThemeToggle.tsx` | 다크/라이트 토글 (Client Component) |
| `UserMenu` | `src/shared/components/UserMenu.tsx` | 로그인 후 프로필 드롭다운 (Client Component) |

### 레이아웃 변경

`src/app/(site)/layout.tsx`에 Header, Footer 추가:

```
RootLayout
  └── SiteLayout
        ├── Header
        ├── main > Container > {children}
        └── Footer
```

---

## 데이터 패칭

- 메인 페이지(`page.tsx`)는 Server Component
- 인기 작품: `src/features/novels/queries/getTopNovels.ts` — `novels` 테이블, `stars/stars_count` 내림차순, 4개
- 최신 작품: `src/features/novels/queries/getLatestNovels.ts` — `novels` 테이블, `created_at` 내림차순, 4개
- 추천 게시판: `src/features/board/recommend/queries/getLatestRecommendPosts.ts` — `recommend_posts` 테이블, `created_at` 내림차순, 4개
- 각 쿼리는 `is_delete = false AND is_block = false` 필터 적용
- 작가명은 `novels`와 `authors` JOIN으로 가져옴

---

## 모바일 반응형

| 섹션 | PC | 모바일 |
|------|----|--------|
| 인기/최신 작품 카드 | 4열 | 2열 |
| 추천 게시판 카드 | 2열 | 1열 |
| 헤더 | 전체 표시 | 로고 + 아이콘만 (텍스트 링크 숨김 또는 햄버거) |
