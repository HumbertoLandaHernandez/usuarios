import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { CurrentUser } from '../auth/current-user.decorator';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { PaginaGuard, RequierePagina } from '../auth/pagina.guard';
import { CrearUsuarioDto } from './dto/crear-usuario.dto';
import { Perfil, UsuariosService } from './usuarios.service';

// Solo para usuarios que tengan la página /usuarios entre sus páginas permitidas
@Controller('usuarios')
@UseGuards(JwtAuthGuard, PaginaGuard)
@RequierePagina('/usuarios')
export class UsuariosController {
  constructor(private readonly usuarios: UsuariosService) {}

  @Get()
  listar() {
    return this.usuarios.listar();
  }

  @Post()
  crear(@Body() dto: CrearUsuarioDto, @CurrentUser() actual: Perfil) {
    return this.usuarios.crear(dto, actual.UsuarioDesc);
  }
}
