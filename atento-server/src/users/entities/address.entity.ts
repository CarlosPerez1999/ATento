import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';
import { IAddress, Pais, EstadoMx } from '@atento/shared';

@Entity('addresses')
export class Address implements IAddress {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  calle: string;

  @Column({ nullable: true })
  numInt?: string;

  @Column()
  numExt: string;

  @Column({
    type: 'enum',
    enum: EstadoMx,
  })
  estado: EstadoMx;

  @Column()
  municipio: string;

  @Column({
    type: 'enum',
    enum: Pais,
    default: Pais.MEXICO,
  })
  pais: Pais;

  @Column()
  codigoPostal: string;
}
