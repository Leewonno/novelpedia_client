# Novelpedia 에이전트 팀 설계

## 개요

Novelpedia(소설/만화 위키 + 리뷰 플랫폼) 개발을 위한 Claude Code 멀티 에이전트 워크플로우 구성.
역할별 전문화된 에이전트와 superpowers 파이프라인을 조합하여, 단독 호출과 자동 파이프라인 두 가지 모드로 운영한다.

## 파일 구조

```
novelpedia_release/
└── client/
    ├── AGENTS.md                      ← 프로젝트 컨텍스트 (모든 에이전트 공유)
    ├── .claude/
    │   ├── agents/
    │   │   ├── planner.md             ← 기능 분해 & 구현 계획
    │   │   ├── designer.md            ← UI/UX 설계, 디자인 시스템
    │   │   ├── frontend-dev.md        ← Next.js 컴포넌트 구현
    │   │   ├── supabase-dev.md        ← 스키마, RLS, 쿼리
    │   │   └── code-reviewer.md       ← 코드 리뷰, 품질 검사
    │   └── commands/
    │       ├── feature.md             ← 전체 파이프라인 실행
    │       ├── schema.md              ← supabase-dev 단독 호출
    │       └── design.md              ← designer 단독 호출
    └── docs/
        └── superpowers/
            └── specs/
                └── 2026-04-13-agent-team-design.md
```

## 에이전트 역할 정의

### planner
새 기능 요청이 들어오면 가장 먼저 실행된다. Novelpedia 도메인(Work, Review, User)을 이해하고, 요청을 프론트엔드/Supabase 작업으로 분해하여 구현 계획을 작성한다. superpowers `writing-plans` 스킬을 활용한다.

### designer
UI/UX 전담 에이전트. 위키 특유의 정보 밀도 높은 레이아웃, 리뷰 카드 디자인, 색상/타이포그래피 등 Tailwind CSS 4 기반 디자인 방향을 결정한다. `frontend-dev`가 구현하기 전에 컴포넌트 구조와 스타일 가이드를 산출한다.

### frontend-dev
Next.js 16 App Router + React 19 + Tailwind CSS 4 구현 전담. Server Components / Client Components 경계 판단, Supabase 클라이언트 연동, `designer`의 설계를 코드로 옮기는 역할.

### supabase-dev
Supabase 전담 에이전트. 테이블 스키마 설계, RLS(Row Level Security) 정책 작성, Edge Functions, 쿼리 최적화를 담당한다. "리뷰어만 자기 리뷰를 수정할 수 있어야 해" 같은 도메인 요구사항을 SQL로 변환한다.

### code-reviewer
코드 작성 완료 후 자동 호출된다. TypeScript 타입 안전성, Supabase 쿼리 효율성, RLS 누락 여부, `console.log` 잔존, 코딩 컨벤션 준수를 검사한다.

## 워크플로우

### 단독 호출 모드
특정 에이전트를 직접 지목하여 단일 작업 처리.
```
"supabase-dev: 리뷰 테이블 스키마 짜줘"
"designer: 리뷰 카드 컴포넌트 디자인해줘"
```

### 자동 파이프라인 모드 (`/feature`)
새 기능 개발 시 전체 에이전트 체인이 순서대로 실행된다.

```
사용자: "/feature 소설 검색 기능 만들어줘"
    ↓
planner      → 기능 분해, 구현 계획 작성 (writing-plans)
    ↓
designer     → UI 설계 (검색 바, 결과 카드 레이아웃)
    ↓
supabase-dev → full-text search 스키마/쿼리 설계
    ↓
frontend-dev → 컴포넌트 구현 (executing-plans)
    ↓
code-reviewer → 리뷰 후 완료 (requesting-code-review)
```

superpowers 스킬 체인: `writing-plans` → `executing-plans` → `requesting-code-review`

## AGENTS.md 내용 구조

모든 에이전트가 공유하는 프로젝트 컨텍스트:

- **서비스 설명**: 소설/만화 정보 위키 + 리뷰 플랫폼
- **기술 스택**: Next.js 16, React 19, Tailwind CSS 4, TypeScript, Supabase, Biome
- **핵심 도메인**: Work(작품), Review(리뷰), User(사용자)
- **에이전트 참조 가이드**: 상황별 어느 에이전트를 먼저 호출할지 안내

## 커스텀 슬래시 커맨드

| 커맨드 | 동작 |
|--------|------|
| `/feature <설명>` | 전체 파이프라인 실행 (planner → designer → supabase-dev → frontend-dev → code-reviewer) |
| `/schema <설명>` | supabase-dev 단독 호출, 스키마/RLS 작업 |
| `/design <설명>` | designer 단독 호출, UI/UX 설계 |

## 기술 결정 사항

- **백엔드**: Supabase (BaaS) — 위키/리뷰 서비스의 읽기 중심 트래픽에 비용 효율적, Free tier로 시작
- **에이전트 위치**: `client/.claude/agents/` — 현재 프로젝트가 client 단일 구조이므로 내부에 배치
- **워크플로우 엔진**: superpowers 스킬 체인 활용 — 자체 구현 없이 기존 인프라 재사용
