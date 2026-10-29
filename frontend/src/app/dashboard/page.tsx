import { Suspense } from 'react';
import { redirect } from 'next/navigation';
import { logout } from '@/app/actions';
import { getCurrentUser } from '@/lib/api';

export default function DashboardPage() {
  return (
    <Suspense fallback={<div className="card">Cargando…</div>}>
      <Profile />
    </Suspense>
  );
}

async function Profile() {
  // Verificación real: el backend valida el JWT
  const user = await getCurrentUser();
  if (!user) redirect('/logout');

  return (
    <div className="card">
      <h1>Hola, {user.name} 👋</h1>
      <p>Email: {user.email}</p>
      <p>Miembro desde: {new Date(user.createdAt).toLocaleDateString('es')}</p>
      <form action={logout}>
        <button>Cerrar sesión</button>
      </form>
    </div>
  );
}
