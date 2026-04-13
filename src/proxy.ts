import { NextRequest, NextResponse } from 'next/server'

export function proxy(request: NextRequest) {
  const hostname = request.nextUrl.hostname

  if (hostname === 'admin.novelpedia.com') {
    const pathname = request.nextUrl.pathname

    // 로그인 페이지는 인증 검사 없이 통과
    // TODO: 인증 구현 시 다른 경로에 세션 + is_admin 검증 추가
    if (pathname === '/login') {
      return NextResponse.rewrite(new URL('/admin/login', request.url))
    }

    return NextResponse.rewrite(new URL(`/admin${pathname}`, request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
}
