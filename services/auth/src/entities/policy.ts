import DataLoader from 'dataloader';
import {
  Column,
  CreateDateColumn,
  DeepPartial,
  Entity,
  getManager,
  getRepository,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { KoaContextState } from '../types/koa';
import { IamPolicy } from '../util/iam';

export const DEFAULT_USER_POLICY_NAME = 'DefaultUserPolicy';

@Entity('policies')
export default class Policy {
  @PrimaryGeneratedColumn('uuid', { name: 'id' })
  readonly id!: string;

  @CreateDateColumn({ type: 'timestamptz', name: 'created_at' })
  readonly createdAt!: Date;

  @UpdateDateColumn({ type: 'timestamptz', name: 'updated_at' })
  readonly updatedAt!: Date;

  @Column({ type: 'varchar', name: 'name', length: 255, unique: true })
  name!: string;

  @Column({ type: 'varchar', name: 'value', length: 4000 })
  value!: string;

  public get iamPolicy(): IamPolicy {
    return IamPolicy.parse(this.value);
  }

  public toJsonObject(): AnyJson {
    return {
      id: this.id,
      createdAt: this.createdAt.toISOString(),
      updatedAt: this.updatedAt.toISOString(),
      name: this.name,
      value: this.value,
      ...this.iamPolicy.toJsonObject(),
    };
  }

  static readonly columns: string[] = [
    'id',
    'createdAt',
    'updatedAt',
    'name',
    'value',
  ];

  static fromRawColumns(raw: Record<string, unknown>) {
    return getRepository(Policy).create({
      id: raw.id,
      createdAt: raw.created_at,
      updatedAt: raw.updated_at,
      name: raw.name,
      value: raw.value,
    } as DeepPartial<Policy>);
  }
}

export const createPolicyLoader = (context: KoaContextState) =>
  new DataLoader<string, Policy>(async (policyIds) => {
    await context.connection();

    const normalized = await getManager()
      .createQueryBuilder(Policy, 'policy')
      .whereInIds(policyIds)
      .getMany()
      .then((policies) =>
        Array.normalize<Policy>(policies, (policy) => policy.id)
      );

    return policyIds.map((id) => normalized[id]);
  });
