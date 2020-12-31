import {
  Column,
  Connection,
  CreateDateColumn,
  DeepPartial,
  Entity,
  getRepository,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('events')
export default class Event {
  @PrimaryGeneratedColumn('uuid', { name: 'id' })
  readonly id!: string;

  @CreateDateColumn({ type: 'timestamptz', name: 'created_at' })
  readonly createdAt!: Date;

  @UpdateDateColumn({ type: 'timestamptz', name: 'updated_at' })
  readonly updatedAt!: Date;

  @Column({ type: 'uuid', name: 'uid' })
  userId!: string;

  @Column({ type: 'varchar', name: 'category', length: 255 })
  category!: string;

  @Column({ type: 'varchar', name: 'name', length: 255 })
  name!: string;

  @Column({ type: 'varchar', name: 'label', length: 255, nullable: true })
  label!: string | null;

  @Column({ type: 'varchar', name: 'value', length: 255, nullable: true })
  value!: string | null;

  public toJsonObject(): AnyJson {
    return {
      id: this.id,
      createdAt: this.createdAt.toISOString(),
      updatedAt: this.updatedAt.toISOString(),
      userId: this.userId,
      category: this.category,
      name: this.name,
      label: this.label,
      value: this.value,
    };
  }

  static readonly columns: string[] = [
    'id',
    'createdAt',
    'updatedAt',
    'userId',
    'category',
    'name',
    'label',
    'value',
  ];

  static fromRawColumns(
    raw: Record<string, unknown>,
    options?: { alias?: string; connection?: Connection }
  ) {
    const rawColumnName = (column: string) =>
      [options?.alias, column].filter((e) => !!e).join('_');

    const repo =
      options?.connection?.getRepository(Event) ?? getRepository(Event);

    return repo.create({
      id: raw[rawColumnName('id')],
      createdAt: raw[rawColumnName('created_at')],
      updatedAt: raw[rawColumnName('updated_at')],
      userId: raw[rawColumnName('uid')],
      category: raw[rawColumnName('category')],
      name: raw[rawColumnName('name')],
      label: raw[rawColumnName('label')],
      value: raw[rawColumnName('value')],
    } as DeepPartial<Event>);
  }
}
