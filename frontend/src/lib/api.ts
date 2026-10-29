import 'server-only';
import { getToken } from './session';

const API_URL = process.env.API_URL ?? 'http://localhost:3001';

export type User = { id: string; email: string; name: string; createdAt: string };

export class ApiError extends Error {
  constructor(public status: number, message: string) {
    super(message);
  }
}

// Llama al backend Nest adjuntando el JWT (si existe) como Bearer token
export async function api<T>(path: string, init: RequestInit = {}): Promise<T> {
  const token = await getToken();
  const res = await fetch(`${API_URL}${path}`, {
    ...init,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...init.headers,
    },
    cache: 'no-store',
  });
  const body = await res.json().catch(() => ({}));
  if (!res.ok) {
    const msg = Array.isArray(body.message) ? body.message.join(', ') : body.message;
    throw new ApiError(res.status, msg ?? 'Error de servidor');
  }
  return body as T;
}

export async function getCurrentUser() {
  try {
    return await api<User>('/auth/profile');
  } catch {
    return null;
  }
}
