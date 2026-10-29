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
      <h1>Hola, {user.Nombre.NombrePersonalDesc} 👋</h1>
      <p>
        Usuario: <b>{user.UsuarioDesc}</b> · Rol: <b>{user.Rol.RolDesc}</b> · Permiso: <b>{user.Permiso.PermisoDesc}</b>
      </p>
      <p>Página de inicio: {user.PaginaHome.Descripcion}</p>
      <h2>Páginas permitidas</h2>
      <ul>
        {user.Paginas.map((p) => (
          <li key={p.PaginaId}>
            {p.Descripcion} <code>{p.PaginaDesc}</code>
          </li>
        ))}
      </ul>
      <form action={logout}>
        <button>Cerrar sesión</button>
      </form>
    </div>
  );
}
