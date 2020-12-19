import {
  Column,
  CreateDateColumn,
  DeepPartial,
  Entity,
  getRepository,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('user_profiles')
export default class UserProfile {
  @PrimaryGeneratedColumn('uuid', { name: 'id' })
  readonly id!: string;

  @CreateDateColumn({ type: 'timestamptz', name: 'created_at' })
  readonly createdAt!: Date;

  @UpdateDateColumn({ type: 'timestamptz', name: 'updated_at' })
  readonly updatedAt!: Date;

  @Column({ type: 'varchar', name: 'name', length: 255 })
  name!: string;

  @Column({ type: 'varchar', name: 'email', length: 255, nullable: true })
  email!: string | null;

  public toJsonObject(): AnyJson {
    return {
      id: this.id,
      createdAt: this.createdAt.toISOString(),
      updatedAt: this.updatedAt.toISOString(),
      name: this.name,
      email: this.email,
    };
  }

  static readonly columns: string[] = [
    'id',
    'createdAt',
    'updatedAt',
    'name',
    'email',
  ];

  static fromRawColumns(raw: Record<string, unknown>) {
    return getRepository(UserProfile).create({
      id: raw.id,
      createdAt: raw.created_at,
      updatedAt: raw.updated_at,
      name: raw.name,
      email: raw.email,
    } as DeepPartial<UserProfile>);
  }
}
