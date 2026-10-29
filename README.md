# Proyecto: Next.js + NestJS + PostgreSQL + JWT

```
proyecto/
├── docker-compose.yml   # PostgreSQL 16
├── backend/             # NestJS (puerto 3001) – TypeORM, Passport JWT, bcrypt
└── frontend/            # Next.js (puerto 3000) – App Router, Server Actions, cookie httpOnly
```

## Arranque

```bash
docker compose up -d                       # base de datos
cd backend && cp .env.example .env && npm install && npm run start:dev
cd frontend && cp .env.example .env.local && npm install && npm run dev
```

Abre http://localhost:3000

## API (backend)

| Método | Ruta             | Auth   | Body                          |
|--------|------------------|--------|-------------------------------|
| POST   | /auth/register   | –      | `{ email, name, password }`   |
| POST   | /auth/login      | –      | `{ email, password }`         |
| GET    | /auth/profile    | Bearer | –                             |

Login/registro devuelven `{ access_token, user }`.

Para proteger cualquier ruta nueva:

```ts
@UseGuards(JwtAuthGuard)
@Get('algo')
algo(@CurrentUser() user: User) { ... }
```

## Flujo de autenticación

1. El formulario llama a una Server Action (`frontend/src/app/actions.ts`), que hace POST a Nest.
2. El JWT se guarda en una cookie **httpOnly** (`access_token`): el JavaScript del navegador nunca lo ve.
3. `src/proxy.ts` hace un chequeo rápido (¿existe la cookie?) y redirige.
4. Las páginas del servidor llaman a Nest con `Authorization: Bearer <token>` (`src/lib/api.ts`); Nest valida el token de verdad.
5. Si el token es inválido o expiró, `/logout` borra la cookie y redirige a `/login`.

## Antes de producción

- Cambia `JWT_SECRET` por un valor largo y aleatorio.
- Cambia `synchronize: true` por migraciones de TypeORM.
- Considera añadir refresh tokens si necesitas sesiones largas.
