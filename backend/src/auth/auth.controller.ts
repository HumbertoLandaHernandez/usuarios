import { Body, Controller, Get, HttpCode, Post, UseGuards } from '@nestjs/common';
import { Perfil, UsuariosService } from '../usuarios/usuarios.service';
import { AuthService } from './auth.service';
import { CurrentUser } from './current-user.decorator';
import { LoginDto } from './dto/login.dto';
import { JwtAuthGuard } from './jwt-auth.guard';

@Controller('auth')
export class AuthController {
  constructor(private readonly auth: AuthService, private readonly usuarios: UsuariosService) {}

  @Post('login')
  @HttpCode(200)
  login(@Body() dto: LoginDto) {
    return this.auth.login(dto);
  }

  @Get('profile')
  @UseGuards(JwtAuthGuard)
  async profile(@CurrentUser() usuario: Perfil) {
    return { ...usuario, Paginas: await this.usuarios.paginasPermitidas(usuario.UsuarioPermisosPaginasId) };
  }
}
