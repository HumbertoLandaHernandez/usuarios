# Proyecto: Next.js + NestJS + PostgreSQL + JWT

```
proyecto/
├── docker-compose.yml   # PostgreSQL 16 (ejecuta /database al crear el volumen)
├── database/            # 01_schema.sql (esquema "Sistema") y 02_seed.sql (datos iniciales)
├── backend/             # NestJS (puerto 3001) – Prisma, Passport JWT, bcrypt
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
| GET    | /usuarios        | Bearer + página `/usuarios` | –        |
| POST   | /usuarios        | Bearer + página `/usuarios` | ver abajo |

`usuario` es `UsuarioDesc` (sin distinguir mayúsculas). El login devuelve `{ access_token }`.
`/auth/profile` devuelve el usuario con `Rol`, `Permiso`, `Nombre`, `PaginaHome` y `Paginas`.

### Crear usuario: `POST /usuarios`

```json
{
  "usuario": "jperez",
  "password": "MiClave123",
  "nombre": "Juan Pérez López",
  "rolId": 2,
  "permisoId": 1,
  "paginaHomeId": 1,
  "permisosPaginasId": 2
}
```

- `paginaHomeId` y `permisosPaginasId` son opcionales: si no se envían se toman del rol.
- La contraseña se guarda con bcrypt: `genSalt(10)` crea un salt aleatorio que queda **dentro** del hash
  (`$2b$10$<22 caracteres de salt><hash>`), así que no hace falta una columna aparte.
- Se crea también el `NombrePersonal`, en la misma transacción.
- `UsuarioUsys` y `NombrePersonalUsys` se llenan con el usuario que hizo la petición.
- Respuestas: `201` creado, `409` usuario repetido, `400` datos inválidos o rol/permiso/página inexistente, `403` sin la página `/usuarios`.

### Proteger rutas

```ts
@UseGuards(JwtAuthGuard, PaginaGuard)
@RequierePagina('/roles')        // exige esa página entre las permitidas del usuario
@Get('algo')
algo(@CurrentUser() usuario: Perfil) { ... }
```

## Prisma

- El cliente se genera solo con `npm install` (`postinstall`) en `backend/src/generated/prisma` (no se sube a git).
- `backend/prisma/schema.prisma` se obtiene **de la base** con `npx prisma db pull`. Las tablas se cambian en
  `database/*.sql` y luego se ejecuta `npm run prisma:pull` (no se usa `prisma migrate`).
- El hash nunca sale en las consultas: `PrismaService` omite `Contrasena` por defecto.
- Versión fijada a Prisma 7.10: `npm i prisma` sin versión puede instalar una 8.x en pruebas.

## Flujo de autenticación

1. El formulario llama a una Server Action (`frontend/src/app/actions.ts`), que hace POST a Nest.
2. El JWT se guarda en una cookie **httpOnly** (`access_token`): el JavaScript del navegador nunca lo ve.
3. `src/proxy.ts` hace un chequeo rápido (¿existe la cookie?) y redirige.
4. Las páginas del servidor llaman a Nest con `Authorization: Bearer <token>` (`src/lib/api.ts`); Nest valida el token de verdad.
5. Si el token es inválido o expiró, `/logout` borra la cookie y redirige a `/login`.

## Antes de producción

- Cambia `JWT_SECRET` por un valor largo y aleatorio.
- `Contraseña` guarda un hash bcrypt (con su salt). Si migras usuarios desde SQL Server con contraseñas en texto plano, hay que hashearlas.
- Considera añadir refresh tokens si necesitas sesiones largas.
