다음 기능 요청에 대해 Novelpedia 에이전트 팀 파이프라인을 실행한다:

**기능 요청**: $ARGUMENTS

## 실행 순서

### 1단계: planner
- 기능 요청을 분석하고 프론트엔드/Supabase 태스크로 분해한다
- `docs/superpowers/plans/YYYY-MM-DD-<feature-name>.md`에 구현 계획을 저장한다
- superpowers:writing-plans 스킬을 사용한다

### 2단계: designer
- planner가 작성한 계획을 바탕으로 UI/UX를 설계한다
- 컴포넌트 트리, TypeScript props 인터페이스, Tailwind 스타일 가이드를 산출한다

### 3단계: supabase-dev
- 필요한 DB 스키마, RLS 정책, 쿼리를 작성한다
- `supabase/migrations/` 파일과 TypeScript 타입을 산출한다

### 4단계: frontend-dev
- designer의 설계와 supabase-dev의 타입/쿼리를 사용해 컴포넌트를 구현한다
- superpowers:executing-plans 스킬을 사용한다

### 5단계: code-reviewer
- 구현된 코드를 리뷰하고 CRITICAL/HIGH 이슈를 수정한다
- superpowers:requesting-code-review 스킬을 사용한다
