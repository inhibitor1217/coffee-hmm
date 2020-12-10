import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('user_profiles')
export default class UserProfile {
  @PrimaryGeneratedColumn('uuid')
  readonly id!: string;

  @CreateDateColumn({ type: 'timestamptz', name: 'created_at' })
  readonly createdAt!: Date;

  @UpdateDateColumn({ type: 'timestamptz', name: 'updated_at' })
  readonly updatedAt!: Date;

  @Column({ type: 'varchar', name: 'name', length: 255 })
  name!: string;

  @Column({ type: 'varchar', name: 'email', length: 255, nullable: true })
  email?: string;
}
