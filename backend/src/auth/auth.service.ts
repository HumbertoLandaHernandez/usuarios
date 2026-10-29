import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { UsuariosService } from '../usuarios/usuarios.service';
import { LoginDto } from './dto/login.dto';
import { JwtPayload } from './jwt.strategy';

@Injectable()
export class AuthService {
  constructor(private readonly usuarios: UsuariosService, private readonly jwt: JwtService) {}

  async login(dto: LoginDto) {
    const usuario = await this.usuarios.findByDescWithPassword(dto.usuario);
    if (!usuario || !(await bcrypt.compare(dto.password, usuario.Contrasena))) {
      throw new UnauthorizedException('Credenciales inválidas');
    }
    const payload: JwtPayload = { sub: usuario.UsuarioId, usuario: usuario.UsuarioDesc, rolId: usuario.UsuarioRolId };
    return { access_token: this.jwt.sign(payload) };
  }
}
