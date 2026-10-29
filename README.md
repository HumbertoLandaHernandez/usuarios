# Proyecto: Next.js + NestJS + PostgreSQL + JWT

```
proyecto/
├── docker-compose.yml   # PostgreSQL 16 (ejecuta /database al crear el volumen)
├── database/            # 01_schema.sql (esquema "Sistema") y 02_seed.sql (datos iniciales)
├── backend/             # NestJS (puerto 3001) – TypeORM, Passport JWT, bcrypt
└── frontend/            # Next.js (puerto 3000) – App Router, Server Actions, cookie httpOnly
```

## Arranque

```bash
docker compose up -d                       # base de datos
cd backend && cp .env.example .env && npm install && npm run start:dev
cd frontend && cp .env.example .env.local && npm install && npm run dev
```

Abre http://localhost:3000 y entra con **admin / admin123** (cámbiala).

> Los scripts de `database/` solo se ejecutan cuando el volumen está vacío.
> Si ya tenías la base anterior: `docker compose down -v && docker compose up -d`.

## Esquema `Sistema` (convertido de SQL Server)

| SQL Server                 | PostgreSQL                                               |
|----------------------------|----------------------------------------------------------|
| `tinyint`                  | `smallint`                                               |
| `datetime2(7)`             | `timestamp(6)`, se actualiza solo con un trigger         |
| `timestamp` (rowversion)   | `integer`, se incrementa solo con un trigger             |
| `Modern_Spanish_CI_AS`     | índice único sobre `lower("UsuarioDesc")`                |

Relaciones:

```
Usuario.UsuarioRolId             -> Rol
Usuario.UsuarioPermisosId        -> Permiso
Usuario.UsuarioNombreId          -> NombrePersonal
Usuario.UsuarioPaginaHomeId      -> Pagina
Usuario.UsuarioPermisosPaginasId -> PermisoLista.PermisoListaId (grupo)
Rol.RolPaginaHomeId              -> Pagina
Rol.RolPermisosId                -> PermisoLista.PermisoListaId (grupo)
PermisoLista.PermisoListaPaginaId -> ListaPagina
ListaPaginaElemento              -> ListaPagina + Pagina
NombreLista                      -> NombrePersonal + NombreTipo + NombreBase
```

Las páginas a las que accede un usuario salen de:
`UsuarioPermisosPaginasId → PermisoLista → ListaPaginaElemento → Pagina`.

## API (backend)

| Método | Ruta             | Auth   | Body                          |
|--------|------------------|--------|-------------------------------|
| POST   | /auth/login      | –      | `{ usuario, password }`       |
| GET    | /auth/profile    | Bearer | –                             |

`usuario` es `UsuarioDesc` (sin distinguir mayúsculas). El login devuelve `{ access_token }`.
`/auth/profile` devuelve el usuario con `Rol`, `Permiso`, `Nombre`, `PaginaHome` y `Paginas`.

Para proteger cualquier ruta nueva:

```ts
@UseGuards(JwtAuthGuard)
@Get('algo')
algo(@CurrentUser() usuario: Usuario) { ... }
```

## Flujo de autenticación

1. El formulario llama a una Server Action (`frontend/src/app/actions.ts`), que hace POST a Nest.
2. El JWT se guarda en una cookie **httpOnly** (`access_token`): el JavaScript del navegador nunca lo ve.
3. `src/proxy.ts` hace un chequeo rápido (¿existe la cookie?) y redirige.
4. Las páginas del servidor llaman a Nest con `Authorization: Bearer <token>` (`src/lib/api.ts`); Nest valida el token de verdad.
5. Si el token es inválido o expiró, `/logout` borra la cookie y redirige a `/login`.

## Antes de producción

- Cambia `JWT_SECRET` por un valor largo y aleatorio.
- `Contraseña` guarda un hash bcrypt. Si migras usuarios desde SQL Server con contraseñas en texto plano, hay que hashearlas.
- Considera añadir refresh tokens si necesitas sesiones largas.
