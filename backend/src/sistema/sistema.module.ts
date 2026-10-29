import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { NombrePersonal } from './entities/nombre-personal.entity';
import { Pagina } from './entities/pagina.entity';
import { Permiso } from './entities/permiso.entity';
import { Rol } from './entities/rol.entity';
import { Usuario } from './entities/usuario.entity';
import { UsuariosService } from './usuarios.service';

@Module({
  imports: [TypeOrmModule.forFeature([Usuario, Rol, Permiso, Pagina, NombrePersonal])],
  providers: [UsuariosService],
  exports: [UsuariosService],
})
export class SistemaModule {}
