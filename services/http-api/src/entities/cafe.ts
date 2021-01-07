import '../util/extension';

import DataLoader from 'dataloader';
import {
  Column,
  Connection,
  CreateDateColumn,
  DeepPartial,
  Entity,
  getManager,
  getRepository,
  JoinColumn,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { KoaContextState } from '../types/koa';
import Place from './place';
import CafeStatistic from './cafeStatistic';
import CafeImage from './cafeImage';
import CafeImageCount from './cafeImageCount';

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

  @Column({ type: 'uuid', name: 'fk_place_id' })
  fkPlaceId!: string;

  @ManyToOne(() => Place)
  @JoinColumn({ name: 'fk_place_id' })
  readonly place!: Place;

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

  @OneToOne(() => CafeStatistic, (statistic) => statistic.cafe)
  readonly statistic!: CafeStatistic;

  @OneToOne(() => CafeImageCount, (imageCount) => imageCount.cafe)
  readonly imageCount!: CafeImageCount;

  @OneToMany(() => CafeImage, (image) => image.cafe)
  readonly images!: CafeImage[];

  public toJsonObject(options?: { showHiddenImage?: boolean }): AnyJson {
    return {
      id: this.id,
      createdAt: this.createdAt.toISOString(),
      updatedAt: this.updatedAt.toISOString(),
      name: this.name,
      place: this.place?.toJsonObject(),
      metadata: this.metadataObject,
      state: this.stateString,
      image: this.imageCount && {
        count:
          options?.showHiddenImage ?? false
            ? this.imageCount.total
            : this.imageCount.active,
        list: this.images?.map((image) => image.toJsonObject()),
      },
      views: this.statistic && {
        daily: this.statistic.dailyViews,
        weekly: this.statistic.weeklyViews,
        monthly: this.statistic.monthlyViews,
        total: this.statistic.totalViews,
      },
      numLikes: this.statistic.numLikes,
    };
  }

  static readonly columns: string[] = [
    'id',
    'createdAt',
    'updatedAt',
    'name',
    'fkPlaceId',
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
      fkPlaceId: raw[rawColumnName('fk_place_id')],
      metadata: raw[rawColumnName('metadata')],
      state: raw[rawColumnName('state')],
    } as DeepPartial<Cafe>);
  }
}

export const createCafeLoader = (context: KoaContextState) =>
  new DataLoader<string, Cafe>(async (cafeIds) => {
    await context.connection();

    const normalized = await getManager()
      .createQueryBuilder(Cafe, 'cafe')
      .select()
      .leftJoinAndSelect('cafe.place', 'place')
      .leftJoinAndSelect('cafe.statistic', 'cafe_statistic')
      .leftJoinAndSelect('cafe.imageCount', 'cafe_image_count')
      .whereInIds(cafeIds)
      .getMany()
      .then((cafes) => Array.normalize<Cafe>(cafes, (cafe) => cafe.id));

    return cafeIds.map((id) => normalized[id]);
  });

export const createCafeWithImagesLoader = (context: KoaContextState) =>
  new DataLoader<string, Cafe>(async (cafeIds) => {
    await context.connection();

    const normalized = await getManager()
      .createQueryBuilder(Cafe, 'cafe')
      .select()
      .leftJoinAndSelect('cafe.place', 'place')
      .leftJoinAndSelect('cafe.statistic', 'cafe_statistic')
      .leftJoinAndSelect('cafe.imageCount', 'cafe_image_count')
      .leftJoinAndSelect('cafe.images', 'cafe_image')
      .whereInIds(cafeIds)
      .getMany()
      .then((cafes) => Array.normalize<Cafe>(cafes, (cafe) => cafe.id));

    return cafeIds.map((id) => normalized[id]);
  });
