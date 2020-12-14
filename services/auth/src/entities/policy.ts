import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
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

  get iamPolicy(): IamPolicy {
    return IamPolicy.parse(this.value);
  }
}
