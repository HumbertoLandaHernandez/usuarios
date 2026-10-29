import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { NombrePersonal } from './nombre-personal.entity';
import { Pagina } from './pagina.entity';
import { Permiso } from './permiso.entity';
import { Rol } from './rol.entity';

@Entity({ schema: 'Sistema', name: 'Usuario' })
export class Usuario {
  @Column({ select: false }) UsuarioUsys: string;
  @Column({ type: 'timestamp', insert: false, update: false }) UsuarioDT: Date;
  @PrimaryGeneratedColumn({ type: 'smallint' }) UsuarioId: number;
  @Column() UsuarioDesc: string;
  @Column({ select: false }) Contraseña: string;
  @Column({ type: 'smallint' }) UsuarioRolId: number;
  @Column({ type: 'smallint' }) UsuarioPermisosId: number;
  @Column() UsuarioNombreId: number;
  @Column() UsuarioPermisosPaginasId: number;
  @Column({ type: 'smallint' }) UsuarioPaginaHomeId: number;

  @ManyToOne(() => Rol)
  @JoinColumn({ name: 'UsuarioRolId' })
  Rol: Rol;

  @ManyToOne(() => Permiso)
  @JoinColumn({ name: 'UsuarioPermisosId' })
  Permiso: Permiso;

  @ManyToOne(() => NombrePersonal)
  @JoinColumn({ name: 'UsuarioNombreId' })
  Nombre: NombrePersonal;

  @ManyToOne(() => Pagina)
  @JoinColumn({ name: 'UsuarioPaginaHomeId' })
  PaginaHome: Pagina;
}
