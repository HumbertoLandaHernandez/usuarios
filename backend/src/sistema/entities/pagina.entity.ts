import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ schema: 'Sistema', name: 'Pagina' })
export class Pagina {
  @Column({ select: false }) PaginaUsys: string;
  @Column({ type: 'timestamp', select: false, insert: false, update: false }) PaginaDT: Date;
  @PrimaryGeneratedColumn({ type: 'smallint' }) PaginaId: number;
  @Column() PaginaDesc: string;
  @Column() Descripcion: string;
}
