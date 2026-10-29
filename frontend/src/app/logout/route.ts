import { NextRequest, NextResponse } from 'next/server';

// Borra la cookie (p. ej. JWT expirado) y manda al login, evitando bucles con el proxy
export function GET(req: NextRequest) {
  const res = NextResponse.redirect(new URL('/login', req.nextUrl));
  res.cookies.delete('access_token');
  return res;
}
