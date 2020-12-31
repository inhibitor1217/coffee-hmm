import {
  Column,
  Connection,
  CreateDateColumn,
  DeepPartial,
  Entity,
  getRepository,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import Cafe from './cafe';

export enum CafeImageState {
  active = 0,
  hidden = 1,
  deleted = 2,
}

export type CafeImageStateStrings = keyof typeof CafeImageState;

@Entity('cafe_images')
export default class CafeImage {
  @PrimaryGeneratedColumn('uuid', { name: 'id' })
  readonly id!: string;

  @CreateDateColumn({ type: 'timestamptz', name: 'created_at' })
  readonly createdAt!: Date;

  @UpdateDateColumn({ type: 'timestamptz', name: 'updated_at' })
  readonly updatedAt!: Date;

  @Column({ type: 'uuid', name: 'fk_cafe_id' })
  fkCafeId!: string;

  @ManyToOne(() => Cafe)
  @JoinColumn({ name: 'fk_cafe_id' })
  readonly cafe!: Cafe;

  @Column({ type: 'int2', name: 'index' })
  index!: number;

  @Column({ type: 'boolean', name: 'is_main' })
  isMain!: boolean;

  @Column({ type: 'varchar', name: 'metadata', length: 4000, nullable: true })
  metadata!: string | null;

  public get metadataObject(): AnyJson {
    return this.metadata ? JSON.parse(this.metadata) : null;
  }

  public set metadataObject(obj: AnyJson) {
    this.metadata = JSON.stringify(obj);
  }

  @Column({ type: 'varchar', name: 'relative_uri' })
  relativeUri!: string;

  @Column({ type: 'int2', name: 'state' })
  state!: CafeImageState;

  public get stateString(): CafeImageStateStrings {
    return CafeImageState[this.state] as CafeImageStateStrings;
  }

  public toJsonObject(): AnyJson {
    return {
      id: this.id,
      createdAt: this.createdAt.toISOString(),
      updatedAt: this.updatedAt.toISOString(),
      cafeId: this.fkCafeId,
      index: this.index,
      isMain: this.isMain,
      metadata: this.metadataObject,
      relativeUri: this.relativeUri,
      state: this.stateString,
    };
  }

  static readonly columns: string[] = [
    'id',
    'createdAt',
    'updatedAt',
    'fkCafeId',
    'index',
    'isMain',
    'metadata',
    'relativeUri',
    'state',
  ];

  static fromRawColumns(
    raw: Record<string, unknown>,
    options?: { alias?: string; connection?: Connection }
  ) {
    const rawColumnName = (column: string) =>
      [options?.alias, column].filter((e) => !!e).join('_');

    const repo =
      options?.connection?.getRepository(CafeImage) ?? getRepository(CafeImage);

    return repo.create({
      id: raw[rawColumnName('id')],
      createdAt: raw[rawColumnName('created_at')],
      updatedAt: raw[rawColumnName('updated_at')],
      fkCafeId: raw[rawColumnName('fk_cafe_id')],
      index: raw[rawColumnName('index')],
      isMain: raw[rawColumnName('is_main')],
      metadata: raw[rawColumnName('metadata')],
      relativeUri: raw[rawColumnName('relative_uri')],
      state: raw[rawColumnName('state')],
    } as DeepPartial<CafeImage>);
  }
}
