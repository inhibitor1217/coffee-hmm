import DataLoader from 'dataloader';
import {
  Column,
  Connection,
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

  static fromRawColumns(
    raw: Record<string, unknown>,
    options?: { alias?: string; connection?: Connection }
  ) {
    const rawColumnName = (column: string) =>
      [options?.alias, column].filter((e) => !!e).join('_');

    const repo =
      options?.connection?.getRepository(Policy) ?? getRepository(Policy);

    return repo.create({
      id: raw[rawColumnName('id')],
      createdAt: raw[rawColumnName('created_at')],
      updatedAt: raw[rawColumnName('updated_at')],
      name: raw[rawColumnName('name')],
      value: raw[rawColumnName('value')],
    } as DeepPartial<Policy>);
  }
}

export const createPolicyLoader = (state: KoaContextState) =>
  new DataLoader<string, Policy>(async (policyIds) => {
    await state.connection();

    const normalized = await getManager()
      .createQueryBuilder(Policy, 'policy')
      .whereInIds(policyIds)
      .getMany()
      .then((policies) =>
        Array.normalize<Policy>(policies, (policy) => policy.id)
      );

    return policyIds.map((id) => normalized[id]);
  });
