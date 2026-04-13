# Frontend Base Setup Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 폴더 구조 마이그레이션, 반응형 레이아웃(최대 950px), 아이콘 라이브러리(lucide-react), proxy.ts 기반을 세팅한다.

**Architecture:** `src/lib/`을 spec 기준 `src/shared/lib/`로 이동한다. `src/app/(site)/`와 `src/app/admin/` route group을 만들고, Container 컴포넌트로 레이아웃 너비 제약을 적용한다. proxy.ts로 `admin.novelpedia.com` 서브도메인을 `/admin/*`으로 리라이트한다.

**Tech Stack:** Next.js 16 (App Router), React 19, Tailwind CSS 4, TypeScript, lucide-react

---

## File Structure

| 파일 | 상태 | 역할 |
|------|------|------|
| `src/shared/lib/supabase/client.ts` | 이동 | Supabase 클라이언트 (기존 `src/lib/supabase/client.ts`) |
| `src/shared/lib/supabase/types.ts` | 이동 | 도메인 타입 정의 (기존 `src/lib/supabase/types.ts`) |
| `src/shared/lib/utils/normalize.ts` | 이동 | normalizePrimary 유틸 (기존 `src/lib/utils/normalize.ts`) |
| `src/shared/lib/utils/normalize.test.ts` | 이동 | normalize 테스트 (기존 `src/lib/utils/normalize.test.ts`) |
| `src/shared/components/Container.tsx` | 생성 | 950px 최대 너비, 모바일 px-5 래퍼 |
| `src/app/globals.css` | 수정 | Tailwind 기본 설정 정리 |
| `src/app/layout.tsx` | 수정 | Novelpedia 메타데이터, `lang="ko"` |
| `src/app/page.tsx` | 삭제 | (site)/page.tsx로 대체 |
| `src/app/(site)/layout.tsx` | 생성 | 사이트 전용 레이아웃 (Container 적용) |
| `src/app/(site)/page.tsx` | 생성 | 홈 페이지 placeholder |
| `src/app/admin/layout.tsx` | 생성 | admin 전용 레이아웃 |
| `src/app/admin/page.tsx` | 생성 | 대시보드 placeholder |
| `src/app/admin/login/page.tsx` | 생성 | 관리자 로그인 placeholder |
| `src/proxy.ts` | 생성 | admin 서브도메인 리라이트 |

---

## Task 1: lucide-react 설치

**Files:**
- Modify: `package.json` (npm install로 자동 업데이트)

- [ ] **Step 1: 패키지 설치**

```bash
cd /path/to/client
npm install lucide-react
```

- [ ] **Step 2: 설치 확인**

`package.json`의 `dependencies`에 `lucide-react`가 추가됐는지 확인:

```bash
grep lucide-react package.json
```

Expected: `"lucide-react": "^x.x.x"` 라인 출력

- [ ] **Step 3: 설치 확인**

```bash
ls node_modules/lucide-react/dist/lucide-react.js && echo "OK"
```

Expected: `OK` (파일 경로 출력 + OK)

- [ ] **Step 4: commit**

```bash
git add package.json package-lock.json
git commit -m "chore: add lucide-react"
```

---

## Task 2: lib → shared/lib 마이그레이션

**Files:**
- Move: `src/lib/supabase/` → `src/shared/lib/supabase/`
- Move: `src/lib/utils/` → `src/shared/lib/utils/`

> **주의:** `src/lib/`의 파일들이 현재 `@/lib/...` 경로로 import되어 있으므로,  
> 이동 후 `@/shared/lib/...`로 경로를 업데이트해야 한다.  
> 현재 외부 import는 `normalize.test.ts` 하나뿐이다.

- [ ] **Step 1: 디렉토리 생성 및 파일 이동**

```bash
mkdir -p src/shared/lib/supabase src/shared/lib/utils
mv src/lib/supabase/client.ts src/shared/lib/supabase/client.ts
mv src/lib/supabase/types.ts src/shared/lib/supabase/types.ts
mv src/lib/utils/normalize.ts src/shared/lib/utils/normalize.ts
mv src/lib/utils/normalize.test.ts src/shared/lib/utils/normalize.test.ts
rm -rf src/lib
```

- [ ] **Step 2: normalize.test.ts import 경로 수정**

`src/shared/lib/utils/normalize.test.ts`를 열어 import 경로 수정:

```typescript
// 변경 전
import { normalizePrimary } from '@/lib/utils/normalize'

// 변경 후
import { normalizePrimary } from '@/shared/lib/utils/normalize'
```

- [ ] **Step 3: 테스트 통과 확인**

```bash
npm test
```

Expected:
```
✓ src/shared/lib/utils/normalize.test.ts (8)
Test Files  1 passed (1)
Tests  8 passed (8)
```

- [ ] **Step 4: commit**

```bash
git add -A
git commit -m "refactor: migrate lib/ to shared/lib/"
```

---

## Task 3: globals.css 정리

**Files:**
- Modify: `src/app/globals.css`

현재 globals.css에는 `body { font-family: Arial }` 오버라이드와 불필요한 다크모드 기본값이 있다. Next.js 폰트와 Tailwind가 처리하므로 제거한다.

- [ ] **Step 1: globals.css 교체**

`src/app/globals.css`를 다음 내용으로 교체:

```css
@import "tailwindcss";

:root {
  --background: #ffffff;
  --foreground: #171717;
}

@theme inline {
  --color-background: var(--background);
  --color-foreground: var(--foreground);
  --font-sans: var(--font-geist-sans);
  --font-mono: var(--font-geist-mono);
}

body {
  background: var(--background);
  color: var(--foreground);
}
```

> 다크모드 지원은 향후 디자인 결정 시 추가한다.

- [ ] **Step 2: commit**

```bash
git add src/app/globals.css
git commit -m "style: clean up globals.css"
```

---

## Task 4: Root layout 업데이트

**Files:**
- Modify: `src/app/layout.tsx`

- [ ] **Step 1: layout.tsx 업데이트**

`src/app/layout.tsx`를 다음 내용으로 교체:

```typescript
import type { Metadata } from 'next'
import { Geist } from 'next/font/google'
import './globals.css'

const geist = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
})

export const metadata: Metadata = {
  title: {
    default: 'Novelpedia',
    template: '%s | Novelpedia',
  },
  description: '소설·만화 정보 위키 + 리뷰 플랫폼',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="ko" className={`${geist.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  )
}
```

> `Geist_Mono`는 코드 블록 등 필요 시점에 추가한다. 지금은 본문 폰트만 로드한다.

- [ ] **Step 2: commit**

```bash
git add src/app/layout.tsx
git commit -m "feat: update root layout for Novelpedia"
```

---

## Task 5: Container 컴포넌트

**Files:**
- Create: `src/shared/components/Container.tsx`

Container는 사이트 전체에서 사용하는 너비 제약 래퍼다:
- PC: `max-w-237.5` (950px) + `mx-auto` (중앙 정렬)
- 모바일: `w-full` + `px-5` (20px 좌우 패딩)
- `px-5`는 PC에서도 유지된다 (950px 내부 여백).

UI-only 컴포넌트이므로 단위 테스트 없이 시각 확인(`next dev`)으로 검증한다.

- [ ] **Step 1: 파일 생성**

`src/shared/components/Container.tsx`:

```typescript
interface ContainerProps {
  children: React.ReactNode
  className?: string
}

export function Container({ children, className }: ContainerProps) {
  return (
    <div className={`mx-auto w-full max-w-237.5 px-5${className ? ` ${className}` : ''}`}>
      {children}
    </div>
  )
}
```

- [ ] **Step 2: dev 서버 실행하여 시각 확인**

```bash
npm run dev
```

브라우저에서 `http://localhost:3000` 열고:
- 창을 넓혀서 950px 이상이 되면 내용이 중앙에 고정되는지 확인
- 창을 좁혀서 모바일 너비가 되면 좌우 20px 패딩이 생기는지 확인

> 아직 (site)/page.tsx가 없어서 404가 뜰 수 있다. Task 6 완료 후 확인한다.

- [ ] **Step 3: commit**

```bash
git add src/shared/components/Container.tsx
git commit -m "feat: add Container component (max-w 950px, mobile px-5)"
```

---

## Task 6: (site) Route Group

**Files:**
- Create: `src/app/(site)/layout.tsx`
- Create: `src/app/(site)/page.tsx`
- Delete: `src/app/page.tsx`

`(site)` route group은 URL에 영향을 주지 않는다. `/` → `(site)/page.tsx`가 렌더된다.

- [ ] **Step 1: (site) 디렉토리 생성**

```bash
mkdir -p src/app/\(site\)
```

- [ ] **Step 2: 기존 page.tsx 삭제**

```bash
rm src/app/page.tsx
```

- [ ] **Step 3: (site)/layout.tsx 생성**

`src/app/(site)/layout.tsx`:

```typescript
import { Container } from '@/shared/components/Container'

export default function SiteLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen">
      <main>
        <Container>{children}</Container>
      </main>
    </div>
  )
}
```

- [ ] **Step 4: (site)/page.tsx 생성**

`src/app/(site)/page.tsx`:

```typescript
export default function HomePage() {
  return (
    <div className="py-10">
      <h1 className="text-2xl font-bold">Novelpedia</h1>
      <p className="mt-2 text-gray-600">소설·만화 정보 위키 + 리뷰 플랫폼</p>
    </div>
  )
}
```

- [ ] **Step 5: 빌드 오류 없는지 확인**

```bash
npm run build
```

Expected: `✓ Compiled successfully` (오류 없음)

- [ ] **Step 6: 시각 확인**

```bash
npm run dev
```

`http://localhost:3000` 에서:
- "Novelpedia" 제목이 보이는지 확인
- 창 너비 950px 이상에서 내용이 중앙에 고정되는지 확인
- 모바일 너비에서 좌우 20px 패딩이 있는지 확인 (브라우저 개발자도구 반응형 모드)

- [ ] **Step 7: commit**

```bash
git add src/app/\(site\)/layout.tsx src/app/\(site\)/page.tsx
git rm src/app/page.tsx
git commit -m "feat: add (site) route group with Container layout"
```

---

## Task 7: admin Route Group

**Files:**
- Create: `src/app/admin/layout.tsx`
- Create: `src/app/admin/page.tsx`
- Create: `src/app/admin/login/page.tsx`

admin 레이아웃은 Container를 쓰지 않는다. 관리자 패널은 별도 디자인으로 운영한다.

- [ ] **Step 1: admin 디렉토리 생성**

```bash
mkdir -p src/app/admin/login
```

- [ ] **Step 2: admin/layout.tsx 생성**

`src/app/admin/layout.tsx`:

```typescript
export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen bg-gray-50">
      <main>{children}</main>
    </div>
  )
}
```

- [ ] **Step 3: admin/page.tsx 생성**

`src/app/admin/page.tsx`:

```typescript
export default function AdminDashboardPage() {
  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold">관리자 대시보드</h1>
    </div>
  )
}
```

- [ ] **Step 4: admin/login/page.tsx 생성**

`src/app/admin/login/page.tsx`:

```typescript
export default function AdminLoginPage() {
  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="w-full max-w-sm p-8">
        <h1 className="text-2xl font-bold">관리자 로그인</h1>
      </div>
    </div>
  )
}
```

- [ ] **Step 5: 빌드 확인**

```bash
npm run build
```

Expected: `✓ Compiled successfully`

- [ ] **Step 6: 시각 확인**

`http://localhost:3000/admin` — "관리자 대시보드" 확인  
`http://localhost:3000/admin/login` — "관리자 로그인" 확인

- [ ] **Step 7: commit**

```bash
git add src/app/admin/
git commit -m "feat: add admin route group with layout and placeholder pages"
```

---

## Task 8: proxy.ts (admin 서브도메인 리라이트)

**Files:**
- Create: `src/proxy.ts`

`admin.novelpedia.com`으로 들어오는 요청을 `/admin/*`으로 리라이트한다.  
세션/is_admin 검증은 인증 기능 구현 시 추가한다.

Next.js 16에서 proxy.ts는 `src/` 내부에 위치한다 (`src/app/`과 같은 레벨).

- [ ] **Step 1: proxy.ts 생성**

`src/proxy.ts`:

```typescript
import { NextRequest, NextResponse } from 'next/server'

export function proxy(request: NextRequest) {
  const hostname = request.nextUrl.hostname

  if (hostname === 'admin.novelpedia.com') {
    const pathname = request.nextUrl.pathname

    if (pathname === '/login') {
      return NextResponse.rewrite(new URL('/admin/login', request.url))
    }

    // TODO: 인증 구현 시 세션 + is_admin 검증 추가
    return NextResponse.rewrite(new URL(`/admin${pathname}`, request.url))
  }
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
}
```

- [ ] **Step 2: 빌드 확인**

```bash
npm run build
```

Expected: `✓ Compiled successfully`

- [ ] **Step 3: commit**

```bash
git add src/proxy.ts
git commit -m "feat: add proxy.ts for admin subdomain rewrite"
```

---

## 완료 후 확인 사항

- `npm test` — normalize 테스트 8개 통과
- `npm run build` — 빌드 성공
- `http://localhost:3000` — 홈 페이지, 950px 최대 너비, 모바일 20px 패딩
- `http://localhost:3000/admin` — 관리자 대시보드 placeholder
- `http://localhost:3000/admin/login` — 관리자 로그인 placeholder
