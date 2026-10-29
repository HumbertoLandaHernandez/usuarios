'use server';

import { redirect } from 'next/navigation';
import { api, ApiError } from '@/lib/api';
import { clearToken, setToken } from '@/lib/session';

export type FormState = { error?: string; usuario?: string } | undefined;

export async function login(_: FormState, formData: FormData): Promise<FormState> {
  const usuario = formData.get('usuario')?.toString() ?? '';
  try {
    const { access_token } = await api<{ access_token: string }>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ usuario, password: formData.get('password') }),
    });
    await setToken(access_token);
  } catch (e) {
    // Devolvemos el usuario para no vaciar el formulario (la contraseña no)
    return { error: e instanceof ApiError ? e.message : 'No se pudo conectar con el servidor', usuario };
  }
  redirect('/dashboard');
}

export async function logout() {
  await clearToken();
  redirect('/login');
}
