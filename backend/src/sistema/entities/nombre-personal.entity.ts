import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ schema: 'Sistema', name: 'NombrePersonal' })
export class NombrePersonal {
  @Column({ select: false }) NombrePersonalUsys: string;
  @Column({ select: false, insert: false, update: false }) NombrePersonalRV: number;
  @PrimaryGeneratedColumn() NombrePersonalId: number;
  @Column() NombrePersonalDesc: string;
}
