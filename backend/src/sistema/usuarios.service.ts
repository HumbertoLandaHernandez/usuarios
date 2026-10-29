import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Pagina } from './entities/pagina.entity';
import { Usuario } from './entities/usuario.entity';

@Injectable()
export class UsuariosService {
  constructor(@InjectRepository(Usuario) private readonly repo: Repository<Usuario>) {}

  // Sin distinguir mayúsculas, igual que la collation Modern_Spanish_CI_AS de SQL Server
  findByDescWithPassword(usuarioDesc: string) {
    return this.repo
      .createQueryBuilder('u')
      .addSelect('u.Contraseña')
      .where('lower(u.UsuarioDesc) = lower(:usuarioDesc)', { usuarioDesc })
      .getOne();
  }

  findById(id: number) {
    return this.repo.findOne({
      where: { UsuarioId: id },
      relations: { Rol: true, Permiso: true, Nombre: true, PaginaHome: true },
    });
  }

  // Usuario.UsuarioPermisosPaginasId -> PermisoLista -> ListaPaginaElemento -> Pagina
  paginasPermitidas(usuario: Usuario): Promise<Pagina[]> {
    return this.repo.manager.query(
      `SELECT DISTINCT p."PaginaId", p."PaginaDesc", p."Descripcion"
         FROM "Sistema"."PermisoLista" pl
         JOIN "Sistema"."ListaPaginaElemento" e ON e."ListaPaginaId" = pl."PermisoListaPaginaId"
         JOIN "Sistema"."Pagina" p ON p."PaginaId" = e."PaginaId"
        WHERE pl."PermisoListaId" = $1
        ORDER BY p."PaginaId"`,
      [usuario.UsuarioPermisosPaginasId],
    );
  }
}
