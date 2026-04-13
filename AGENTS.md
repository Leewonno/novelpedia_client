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

> 도메인 엔티티와 스키마는 확정되는 시점에 이 섹션에 추가한다.

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
