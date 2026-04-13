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
