import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { UsuariosService } from '../sistema/usuarios.service';

export interface JwtPayload {
  sub: number; // UsuarioId
  usuario: string; // UsuarioDesc
  rolId: number;
}

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(config: ConfigService, private readonly usuarios: UsuariosService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: config.getOrThrow<string>('JWT_SECRET'),
    });
  }

  // Lo que se devuelve aquí queda disponible como req.user
  async validate(payload: JwtPayload) {
    const usuario = await this.usuarios.findById(payload.sub);
    if (!usuario) throw new UnauthorizedException();
    return usuario;
  }
}
