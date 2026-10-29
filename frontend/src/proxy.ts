import { NextRequest, NextResponse } from 'next/server';

const protectedRoutes = ['/dashboard'];
const authRoutes = ['/login'];

// Chequeo optimista: solo mira si existe la cookie. La validación real del JWT la hace Nest.
export default function proxy(req: NextRequest) {
  const path = req.nextUrl.pathname;
  const hasToken = req.cookies.has('access_token');

  if (!hasToken && protectedRoutes.some((r) => path.startsWith(r))) {
    return NextResponse.redirect(new URL('/login', req.nextUrl));
  }
  if (hasToken && authRoutes.includes(path)) {
    return NextResponse.redirect(new URL('/dashboard', req.nextUrl));
  }
  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};
