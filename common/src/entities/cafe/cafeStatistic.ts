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

@Entity('cafe_statistics')
export default class CafeStatistic {
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

  @Column({ type: 'int', name: 'daily_views' })
  dailyViews!: number;

  @Column({ type: 'int', name: 'weekly_views' })
  weeklyViews!: number;

  @Column({ type: 'int', name: 'monthly_views' })
  monthlyViews!: number;

  @Column({ type: 'int', name: 'total_views' })
  totalViews!: number;

  @Column({ type: 'int', name: 'num_reviews' })
  numReviews!: number;

  @Column({ type: 'int', name: 'sum_ratings' })
  sumRatings!: number;

  @Column({ type: 'int', name: 'num_likes' })
  numLikes!: number;

  public toJsonObject(): AnyJson {
    return {
      id: this.id,
      createdAt: this.createdAt.toISOString(),
      updatedAt: this.updatedAt.toISOString(),
      cafeId: this.fkCafeId,
      views: {
        daily: this.dailyViews,
        weekly: this.weeklyViews,
        monthly: this.monthlyViews,
        total: this.totalViews,
      },
      numLikes: this.numLikes,
    };
  }

  static readonly columns: string[] = [
    'id',
    'createdAt',
    'updatedAt',
    'fkCafeId',
    'dailyViews',
    'weeklyViews',
    'monthlyViews',
    'totalViews',
    'numReviews',
    'sumRatings',
    'numLikes',
  ];

  static fromRawColumns(
    raw: Record<string, unknown>,
    options?: { alias?: string; connection?: Connection }
  ) {
    const rawColumnName = (column: string) =>
      [options?.alias, column].filter((e) => !!e).join('_');

    const repo =
      options?.connection?.getRepository(CafeStatistic) ??
      getRepository(CafeStatistic);

    return repo.create({
      id: raw[rawColumnName('id')],
      createdAt: raw[rawColumnName('created_at')],
      updatedAt: raw[rawColumnName('updated_at')],
      fkCafeId: raw[rawColumnName('fk_cafe_id')],
      dailyViews: raw[rawColumnName('daily_views')],
      weeklyViews: raw[rawColumnName('weekly_views')],
      monthlyViews: raw[rawColumnName('monthly_views')],
      totalViews: raw[rawColumnName('total_views')],
      numReviews: raw[rawColumnName('num_reviews')],
      sumRatings: raw[rawColumnName('sum_ratings')],
      numLikes: raw[rawColumnName('num_likes')],
    } as DeepPartial<CafeStatistic>);
  }
}
