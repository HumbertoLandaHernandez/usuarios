import { ConflictException, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { User } from '../users/user.entity';
import { UsersService } from '../users/users.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { JwtPayload } from './jwt.strategy';

@Injectable()
export class AuthService {
  constructor(private readonly users: UsersService, private readonly jwt: JwtService) {}

  async register(dto: RegisterDto) {
    if (await this.users.findByEmailWithPassword(dto.email)) {
      throw new ConflictException('El email ya está registrado');
    }
    const password = await bcrypt.hash(dto.password, 10);
    const user = await this.users.create({ ...dto, password });
    return this.buildResponse(user);
  }

  async login(dto: LoginDto) {
    const user = await this.users.findByEmailWithPassword(dto.email);
    if (!user || !(await bcrypt.compare(dto.password, user.password))) {
      throw new UnauthorizedException('Credenciales inválidas');
    }
    return this.buildResponse(user);
  }

  private buildResponse(user: User) {
    const payload: JwtPayload = { sub: user.id, email: user.email };
    const { password, ...safeUser } = user;
    return { access_token: this.jwt.sign(payload), user: safeUser };
  }
}
