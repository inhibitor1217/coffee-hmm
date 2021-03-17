import {
  Column,
  Connection,
  CreateDateColumn,
  DeepPartial,
  Entity,
  getRepository,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import Cafe from './cafe';

@Entity('cafe_image_counts')
export default class CafeImageCount {
  @PrimaryGeneratedColumn('uuid', { name: 'id' })
  readonly id!: string;

  @CreateDateColumn({ type: 'timestamptz', name: 'created_at' })
  readonly createdAt!: Date;

  @UpdateDateColumn({ type: 'timestamptz', name: 'updated_at' })
  readonly updatedAt!: Date;

  @Column({ type: 'uuid', name: 'fk_cafe_id' })
  fkCafeId!: string;

  @OneToOne(() => Cafe)
  @JoinColumn({ name: 'fk_cafe_id' })
  readonly cafe!: Cafe;

  @Column({ type: 'int', name: 'total' })
  total!: number;

  @Column({ type: 'int', name: 'active' })
  active!: number;

  public toJsonObject(): AnyJson {
    return {
      id: this.id,
      createdAt: this.createdAt.toISOString(),
      updatedAt: this.updatedAt.toISOString(),
      cafeId: this.fkCafeId,
      total: this.total,
      active: this.active,
      hidden: this.total - this.active,
    };
  }

  static readonly columns: string[] = [
    'id',
    'createdAt',
    'updatedAt',
    'fkCafeId',
    'total',
    'active',
  ];

  static fromRawColumns(
    raw: Record<string, unknown>,
    options?: { alias?: string; connection?: Connection }
  ) {
    const rawColumnName = (column: string) =>
      [options?.alias, column].filter((e) => !!e).join('_');

    const repo =
      options?.connection?.getRepository(CafeImageCount) ??
      getRepository(CafeImageCount);

    return repo.create({
      id: raw[rawColumnName('id')],
      createdAt: raw[rawColumnName('created_at')],
      updatedAt: raw[rawColumnName('updated_at')],
      fkCafeId: raw[rawColumnName('fk_cafe_id')],
      total: raw[rawColumnName('total')],
      active: raw[rawColumnName('active')],
    } as DeepPartial<CafeImageCount>);
  }
}
