import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Pagina } from './pagina.entity';

@Entity({ schema: 'Sistema', name: 'Rol' })
export class Rol {
  @Column({ select: false }) RolUsys: string;
  @Column({ select: false, insert: false, update: false }) RolDT: number;
  @PrimaryGeneratedColumn({ type: 'smallint' }) RolId: number;
  @Column() RolDesc: string;
  @Column({ type: 'smallint' }) RolPaginaHomeId: number;
  @Column() RolPermisosId: number;
  @Column({ type: 'smallint' }) RolClassId: number;

  @ManyToOne(() => Pagina)
  @JoinColumn({ name: 'RolPaginaHomeId' })
  PaginaHome: Pagina;
}
