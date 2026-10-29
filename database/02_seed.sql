-- Datos mínimos para poder entrar. Usuario: admin / Contraseña: admin123 (cámbiala).

INSERT INTO "Sistema"."Pagina" ("PaginaDesc", "Descripcion") VALUES
  ('/dashboard', 'Inicio'),
  ('/usuarios',  'Administración de usuarios'),
  ('/roles',     'Administración de roles');

INSERT INTO "Sistema"."ListaPagina" ("ListaPaginaDesc", "ListaPaginaComentario") VALUES
  ('Administración', 'Todas las páginas de administración');

INSERT INTO "Sistema"."ListaPaginaElemento" ("ListaPaginaId", "PaginaId") VALUES (1, 1), (1, 2), (1, 3);

INSERT INTO "Sistema"."PermisoLista" ("PermisoListaId", "PermisoListaPaginaId") VALUES (1, 1);

INSERT INTO "Sistema"."Permiso" ("PermisosUsys", "PermisoDesc") VALUES (0, 'Total');

INSERT INTO "Sistema"."Rol" ("RolDesc", "RolPaginaHomeId", "RolPermisosId", "RolClassId") VALUES
  ('Administrador', 1, 1, 1);

INSERT INTO "Sistema"."NombreTipo" ("NombreTipoDesc") VALUES ('Nombre'), ('Apellido paterno'), ('Apellido materno');
INSERT INTO "Sistema"."NombreBase" ("NombreBaseDesc") VALUES ('Administrador'), ('Del'), ('Sistema');
INSERT INTO "Sistema"."NombrePersonal" ("NombrePersonalDesc") VALUES ('Administrador Del Sistema');
INSERT INTO "Sistema"."NombreLista" ("NombrePersonalId", "NombreTipoId", "NombreBaseId") VALUES (1, 1, 1), (1, 2, 2), (1, 3, 3);

-- Hash bcrypt de 'admin123'
INSERT INTO "Sistema"."Usuario"
  ("UsuarioDesc", "Contraseña", "UsuarioRolId", "UsuarioPermisosId", "UsuarioNombreId", "UsuarioPermisosPaginasId", "UsuarioPaginaHomeId")
VALUES
  ('admin', '$2b$10$NNwMDPWkugxCInsCm/LcuesOaq4qcyO8juYucsSULu9gWx0qSv/nG', 1, 1, 1, 1, 1);
