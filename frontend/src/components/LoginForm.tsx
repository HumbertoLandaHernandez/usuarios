'use client';

import { useActionState } from 'react';
import { login } from '@/app/actions';

export function LoginForm() {
  const [state, action, pending] = useActionState(login, undefined);

  return (
    <form action={action} className="card">
      <h1>Iniciar sesión</h1>
      <input name="usuario" placeholder="Usuario" required maxLength={30} autoComplete="username" defaultValue={state?.usuario} />
      <input name="password" type="password" placeholder="Contraseña" required autoComplete="current-password" />
      {state?.error && <p className="error">{state.error}</p>}
      <button disabled={pending}>{pending ? 'Enviando…' : 'Entrar'}</button>
    </form>
  );
}
