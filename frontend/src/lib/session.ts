import 'server-only';
import { cookies } from 'next/headers';

const COOKIE = 'access_token';

export async function setToken(token: string) {
  (await cookies()).set(COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: 60 * 60, // igual que JWT_EXPIRES_IN del backend
  });
}

export async function getToken() {
  return (await cookies()).get(COOKIE)?.value;
}

export async function clearToken() {
  (await cookies()).delete(COOKIE);
}
