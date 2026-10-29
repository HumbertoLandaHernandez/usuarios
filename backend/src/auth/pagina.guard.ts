import { CanActivate, ExecutionContext, ForbiddenException, Injectable, SetMetadata } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Perfil, UsuariosService } from '../usuarios/usuarios.service';

const PAGINA_KEY = 'pagina';

// Exige que el usuario tenga esta página (Pagina.PaginaDesc) entre sus páginas permitidas
export const RequierePagina = (paginaDesc: string) => SetMetadata(PAGINA_KEY, paginaDesc);

@Injectable()
export class PaginaGuard implements CanActivate {
  constructor(private readonly reflector: Reflector, private readonly usuarios: UsuariosService) {}

  async canActivate(ctx: ExecutionContext) {
    const pagina = this.reflector.getAllAndOverride<string>(PAGINA_KEY, [ctx.getHandler(), ctx.getClass()]);
    if (!pagina) return true;

    const usuario: Perfil = ctx.switchToHttp().getRequest().user;
    const paginas = await this.usuarios.paginasPermitidas(usuario.UsuarioPermisosPaginasId);
    if (!paginas.some((p) => p.PaginaDesc === pagina)) {
      throw new ForbiddenException(`No tienes permiso para ${pagina}`);
    }
    return true;
  }
}
