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

@Entity('user_cafe_likes')
export default class UserCafeLike {
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

  @Column({ type: 'uuid', name: 'uid' })
  userId!: string;

  @Column({ type: 'boolean', name: 'like' })
  like!: boolean;

  public toJsonObject(): AnyJson {
    return {
      id: this.id,
      createdAt: this.createdAt.toISOString(),
      updatedAt: this.updatedAt.toISOString(),
      cafeId: this.fkCafeId,
      userId: this.userId,
      like: this.like,
    };
  }

  static readonly columns: string[] = [
    'id',
    'createdAt',
    'updatedAt',
    'fkCafeId',
    'userId',
    'like',
  ];

  static fromRawColumns(
    raw: Record<string, unknown>,
    options?: { alias?: string; connection?: Connection }
  ) {
    const rawColumnName = (column: string) =>
      [options?.alias, column].filter((e) => !!e).join('_');

    const repo =
      options?.connection?.getRepository(UserCafeLike) ??
      getRepository(UserCafeLike);

    return repo.create({
      id: raw[rawColumnName('id')],
      createdAt: raw[rawColumnName('created_at')],
      updatedAt: raw[rawColumnName('updated_at')],
      fkCafeId: raw[rawColumnName('fk_cafe_id')],
      userId: raw[rawColumnName('uid')],
      like: raw[rawColumnName('like')],
    } as DeepPartial<UserCafeLike>);
  }
}
