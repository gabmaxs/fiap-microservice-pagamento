import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class OrderModel {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  externalId: string;

  @Column()
  total: number;

  @Column()
  itens: string;

  @Column()
  status: number;
}
