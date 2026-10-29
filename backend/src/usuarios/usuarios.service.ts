import { BadRequestException, ConflictException, Injectable } from '@nestjs/common';
import * as bcrypt from 'bcryptjs';
import { Prisma } from '../generated/prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { CrearUsuarioDto } from './dto/crear-usuario.dto';

export type Pagina = { PaginaId: number; PaginaDesc: string; Descripcion: string };

const perfil = {
  omit: { UsuarioUsys: true },
  include: {
    Rol: { select: { RolId: true, RolDesc: true } },
    Permiso: { select: { PermisoId: true, PermisoDesc: true } },
    Nombre: { select: { NombrePersonalId: true, NombrePersonalDesc: true } },
    PaginaHome: { select: { PaginaId: true, PaginaDesc: true, Descripcion: true } },
  },
} satisfies Prisma.UsuarioDefaultArgs;

export type Perfil = Prisma.UsuarioGetPayload<typeof perfil>;

@Injectable()
export class UsuariosService {
  constructor(private readonly prisma: PrismaService) {}

  // Sin distinguir mayúsculas, como Modern_Spanish_CI_AS; usa el índice sobre lower("UsuarioDesc")
  async findByDescWithPassword(usuarioDesc: string) {
    const [fila] = await this.prisma.$queryRaw<{ UsuarioId: number; UsuarioDesc: string; UsuarioRolId: number; Contrasena: string }[]>`
      SELECT "UsuarioId", "UsuarioDesc", "UsuarioRolId", "Contraseña" AS "Contrasena"
        FROM "Sistema"."Usuario"
       WHERE lower("UsuarioDesc") = lower(${usuarioDesc})`;
    return fila;
  }

  findPerfil(id: number) {
    return this.prisma.usuario.findUnique({ where: { UsuarioId: id }, ...perfil });
  }

  listar() {
    return this.prisma.usuario.findMany({ ...perfil, orderBy: { UsuarioId: 'asc' } });
  }

  // Usuario.UsuarioPermisosPaginasId -> PermisoLista -> ListaPaginaElemento -> Pagina
  paginasPermitidas(permisosPaginasId: number) {
    return this.prisma.$queryRaw<Pagina[]>`
      SELECT DISTINCT p."PaginaId", p."PaginaDesc", p."Descripcion"
        FROM "Sistema"."PermisoLista" pl
        JOIN "Sistema"."ListaPaginaElemento" e ON e."ListaPaginaId" = pl."PermisoListaPaginaId"
        JOIN "Sistema"."Pagina" p ON p."PaginaId" = e."PaginaId"
       WHERE pl."PermisoListaId" = ${permisosPaginasId}
       ORDER BY p."PaginaId"`;
  }

  async crear(dto: CrearUsuarioDto, creadoPor: string) {
    if (await this.findByDescWithPassword(dto.usuario)) {
      throw new ConflictException(`El usuario "${dto.usuario}" ya existe`);
    }
    const rol = await this.prisma.rol.findUnique({ where: { RolId: dto.rolId } });
    if (!rol) throw new BadRequestException(`No existe el rol ${dto.rolId}`);

    // genSalt crea un salt aleatorio; bcrypt lo guarda dentro del hash ($2b$10$<salt><hash>)
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(dto.password, salt);

    try {
      return await this.prisma.usuario.create({
        data: {
          UsuarioUsys: creadoPor,
          UsuarioDesc: dto.usuario,
          Contrasena: hash,
          Rol: { connect: { RolId: rol.RolId } },
          Permiso: { connect: { PermisoId: dto.permisoId } },
          PaginaHome: { connect: { PaginaId: dto.paginaHomeId ?? rol.RolPaginaHomeId } },
          UsuarioPermisosPaginasId: dto.permisosPaginasId ?? rol.RolPermisosId,
          // Usuario y nombre se crean en la misma transacción
          Nombre: { create: { NombrePersonalDesc: dto.nombre, NombrePersonalUsys: creadoPor } },
        },
        ...perfil,
      });
    } catch (e) {
      if (e instanceof Prisma.PrismaClientKnownRequestError) {
        // P2002: otra petición creó el mismo usuario a la vez
        if (e.code === 'P2002') throw new ConflictException(`El usuario "${dto.usuario}" ya existe`);
        // P2025: no existe el permiso o la página indicada
        if (e.code === 'P2025') throw new BadRequestException('El permiso o la página de inicio no existen');
      }
      throw e;
    }
  }
}
