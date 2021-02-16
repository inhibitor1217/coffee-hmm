import {
  Column,
  Connection,
  CreateDateColumn,
  DeepPartial,
  Entity,
  getRepository,
  PrimaryGeneratedColumn,
  Unique,
  UpdateDateColumn,
} from 'typeorm';

@Entity('places')
@Unique('idx_name', ['name'])
export default class Place {
  @PrimaryGeneratedColumn('uuid', { name: 'id' })
  readonly id!: string;

  @CreateDateColumn({ type: 'timestamptz', name: 'created_at' })
  readonly createdAt!: Date;

  @UpdateDateColumn({ type: 'timestamptz', name: 'updated_at' })
  readonly updatedAt!: Date;

  @Column({ type: 'varchar', name: 'name', length: 255 })
  name!: string;

  @Column({ type: 'boolean', name: 'pinned' })
  pinned!: boolean;

  public toJsonObject(): AnyJson {
    return {
      id: this.id,
      createdAt: this.createdAt.toISOString(),
      updatedAt: this.updatedAt.toISOString(),
      name: this.name,
      pinned: this.pinned,
    };
  }

  static readonly columns: string[] = [
    'id',
    'createdAt',
    'updatedAt',
    'name',
    'pinned',
  ];

  static fromRawColumns(
    raw: Record<string, unknown>,
    options?: { alias?: string; connection?: Connection }
  ) {
    const rawColumnName = (column: string) =>
      [options?.alias, column].filter((e) => !!e).join('_');

    const repo =
      options?.connection?.getRepository(Place) ?? getRepository(Place);

    return repo.create({
      id: raw[rawColumnName('id')],
      createdAt: raw[rawColumnName('created_at')],
      updatedAt: raw[rawColumnName('updated_at')],
      name: raw[rawColumnName('name')],
      pinned: raw[rawColumnName('pinned')],
    } as DeepPartial<Place>);
  }
}
