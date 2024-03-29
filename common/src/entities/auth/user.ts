import {
  Column,
  Connection,
  CreateDateColumn,
  DeepPartial,
  Entity,
  getRepository,
  Index,
  JoinColumn,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
  Unique,
  UpdateDateColumn,
} from 'typeorm';
import Policy from './policy';
import UserProfile from './userProfile';

export enum UserState {
  active = 0,
  deleted = 1,
}

export type UserStateStrings = keyof typeof UserState;

export enum AuthProvider {
  google = 0,
  custom = 10,
}

export type AuthProviderStrings = keyof typeof AuthProvider;

@Entity('users')
@Unique('idx_provider', ['provider', 'providerUserId'])
@Index('idx_updated_at', ['updatedAt'])
@Index('idx_policy_id', ['fkPolicyId'])
@Index('idx_state', ['state'])
export default class User {
  @PrimaryGeneratedColumn('uuid', { name: 'id' })
  readonly id!: string;

  @CreateDateColumn({ type: 'timestamptz', name: 'created_at' })
  readonly createdAt!: Date;

  @UpdateDateColumn({ type: 'timestamptz', name: 'updated_at' })
  readonly updatedAt!: Date;

  @Column({ type: 'timestamptz', name: 'last_signed_at', nullable: true })
  lastSignedAt!: Date | null;

  @Column({ type: 'uuid', name: 'fk_user_profile_id' })
  fkUserProfileId!: string;

  @OneToOne(() => UserProfile)
  @JoinColumn({ name: 'fk_user_profile_id' })
  readonly profile!: UserProfile;

  @Column({ type: 'uuid', name: 'fk_policy_id' })
  fkPolicyId!: string;

  @ManyToOne(() => Policy)
  @JoinColumn({ name: 'fk_policy_id' })
  readonly policy!: Policy;

  @Column({ type: 'int2', name: 'state' })
  state!: UserState;

  get stateString(): UserStateStrings {
    return UserState[this.state] as UserStateStrings;
  }

  @Column({ type: 'int2', name: 'provider' })
  provider!: AuthProvider;

  get providerString(): AuthProviderStrings {
    return AuthProvider[this.provider] as AuthProviderStrings;
  }

  @Column({ type: 'varchar', name: 'provider_uid', length: 255 })
  providerUserId!: string;

  @Column({
    type: 'varchar',
    name: 'provider_email',
    length: 255,
    nullable: true,
  })
  providerUserEmail!: string | null;

  public toJsonObject(): AnyJson {
    return {
      id: this.id,
      createdAt: this.createdAt.toISOString(),
      updatedAt: this.updatedAt.toISOString(),
      lastSignedAt: this.lastSignedAt?.toISOString() ?? null,
      userProfileId: this.fkUserProfileId,
      policyId: this.fkPolicyId,
      state: this.stateString,
      provider: this.providerString,
      providerUserId: this.providerUserId,
      providerUserEmail: this.providerUserEmail,
    };
  }

  static readonly columns: string[] = [
    'id',
    'createdAt',
    'updatedAt',
    'lastSignedAt',
    'fkUserProfileId',
    'fkPolicyId',
    'state',
    'provider',
    'providerUserId',
    'providerUserEmail',
  ];

  static fromRawColumns(
    raw: Record<string, unknown>,
    options?: { alias?: string; connection?: Connection }
  ) {
    const rawColumnName = (column: string) =>
      [options?.alias, column].filter((e) => !!e).join('_');

    const repo =
      options?.connection?.getRepository(User) ?? getRepository(User);

    return repo.create({
      id: raw[rawColumnName('id')],
      createdAt: raw[rawColumnName('created_at')],
      updatedAt: raw[rawColumnName('updated_at')],
      lastSignedAt: raw[rawColumnName('last_signed_at')],
      fkUserProfileId: raw[rawColumnName('fk_user_profile_id')],
      fkPolicyId: raw[rawColumnName('fk_policy_id')],
      state: raw[rawColumnName('state')],
      provider: raw[rawColumnName('provider')],
      providerUserId: raw[rawColumnName('provider_uid')],
      providerUserEmail: raw[rawColumnName('provider_email')],
    } as DeepPartial<User>);
  }
}
