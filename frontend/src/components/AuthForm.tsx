'use client';

import Link from 'next/link';
import { useActionState } from 'react';
import { login, register } from '@/app/actions';

export function AuthForm({ mode }: { mode: 'login' | 'register' }) {
  const isLogin = mode === 'login';
  const [state, action, pending] = useActionState(isLogin ? login : register, undefined);

  return (
    <form action={action} className="card">
      <h1>{isLogin ? 'Iniciar sesión' : 'Crear cuenta'}</h1>
      {!isLogin && <input name="name" placeholder="Nombre" required minLength={2} defaultValue={state?.values?.name} />}
      <input name="email" type="email" placeholder="Email" required defaultValue={state?.values?.email} />
      <input name="password" type="password" placeholder="Contraseña" required minLength={isLogin ? 1 : 6} />
      {state?.error && <p className="error">{state.error}</p>}
      <button disabled={pending}>{pending ? 'Enviando…' : isLogin ? 'Entrar' : 'Registrarme'}</button>
      <p>
        {isLogin ? '¿No tienes cuenta? ' : '¿Ya tienes cuenta? '}
        <Link href={isLogin ? '/register' : '/login'}>{isLogin ? 'Regístrate' : 'Inicia sesión'}</Link>
      </p>
    </form>
  );
}
