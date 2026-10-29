import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ schema: 'Sistema', name: 'Permiso' })
export class Permiso {
  @Column({ select: false }) PermisosUsys: number;
  @Column({ select: false, insert: false, update: false }) PermisosRV: number;
  @PrimaryGeneratedColumn({ type: 'smallint' }) PermisoId: number;
  @Column() PermisoDesc: string;
}
