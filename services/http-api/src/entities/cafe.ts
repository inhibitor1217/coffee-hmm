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

export enum CafeState {
  active = 0,
  hidden = 1,
  deleted = 2,
}

export type CafeStateStrings = keyof typeof CafeState;

@Entity('cafes')
export default class Cafe {
  @PrimaryGeneratedColumn('uuid', { name: 'id' })
  readonly id!: string;

  @CreateDateColumn({ type: 'timestamptz', name: 'created_at' })
  readonly createdAt!: Date;

  @UpdateDateColumn({ type: 'timestamptz', name: 'updated_at' })
  readonly updatedAt!: Date;

  @Column({ type: 'varchar', name: 'name', length: 255 })
  name!: string;

  @Column({ type: 'varchar', name: 'place', length: 255 })
  place!: string;

  @Column({ type: 'varchar', name: 'metadata', length: 4000, nullable: true })
  metadata!: string | null;

  public get metadataObject(): AnyJson {
    return this.metadata ? JSON.parse(this.metadata) : null;
  }

  public set metadataObject(obj: AnyJson) {
    this.metadata = JSON.stringify(obj);
  }

  @Column({ type: 'int2', name: 'state' })
  state!: CafeState;

  public get stateString(): CafeStateStrings {
    return CafeState[this.state] as CafeStateStrings;
  }

  public toJsonObject(): AnyJson {
    return {
      id: this.id,
      createdAt: this.createdAt.toISOString(),
      updatedAt: this.updatedAt.toISOString(),
      name: this.name,
      place: this.place,
      metadata: this.metadataObject,
      state: this.stateString,
    };
  }

  static readonly columns: string[] = [
    'id',
    'createdAt',
    'updatedAt',
    'name',
    'place',
    'metadata',
    'state',
  ];

  static fromRawColumns(
    raw: Record<string, unknown>,
    options?: { alias?: string; connection?: Connection }
  ) {
    const rawColumnName = (column: string) =>
      [options?.alias, column].filter((e) => !!e).join('_');

    const repo =
      options?.connection?.getRepository(Cafe) ?? getRepository(Cafe);

    return repo.create({
      id: raw[rawColumnName('id')],
      createdAt: raw[rawColumnName('created_at')],
      updatedAt: raw[rawColumnName('updated_at')],
      name: raw[rawColumnName('name')],
      place: raw[rawColumnName('place')],
      metadata: raw[rawColumnName('metadata')],
      state: raw[rawColumnName('state')],
    } as DeepPartial<Cafe>);
  }
}
