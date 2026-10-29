'use server';

import { redirect } from 'next/navigation';
import { api, ApiError, User } from '@/lib/api';
import { clearToken, setToken } from '@/lib/session';

export type FormState = { error?: string; values?: { name?: string; email?: string } } | undefined;

type AuthResponse = { access_token: string; user: User };

async function authenticate(path: string, payload: Record<string, FormDataEntryValue | null>): Promise<FormState> {
  try {
    const { access_token } = await api<AuthResponse>(path, {
      method: 'POST',
      body: JSON.stringify(payload),
    });
    await setToken(access_token);
  } catch (e) {
    return {
      error: e instanceof ApiError ? e.message : 'No se pudo conectar con el servidor',
      // Devolvemos lo escrito para no vaciar el formulario (la contraseña no)
      values: { name: payload.name?.toString(), email: payload.email?.toString() },
    };
  }
  redirect('/dashboard');
}

export async function login(_: FormState, formData: FormData) {
  return authenticate('/auth/login', {
    email: formData.get('email'),
    password: formData.get('password'),
  });
}

export async function register(_: FormState, formData: FormData) {
  return authenticate('/auth/register', {
    name: formData.get('name'),
    email: formData.get('email'),
    password: formData.get('password'),
  });
}

export async function logout() {
  await clearToken();
  redirect('/login');
}
