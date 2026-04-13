supabase-dev 에이전트를 호출하여 다음 작업을 처리한다:

**작업 요청**: $ARGUMENTS

supabase-dev 에이전트의 지침에 따라:
1. 요청에 맞는 PostgreSQL 스키마 또는 RLS 정책을 설계한다
2. `supabase/migrations/YYYYMMDDHHMMSS_<name>.sql` 마이그레이션 파일을 작성한다
3. frontend-dev가 사용할 TypeScript 타입과 쿼리 예시를 제공한다
