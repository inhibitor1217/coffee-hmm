import '../util/extension';

import DataLoader from 'dataloader';
import { ParameterizedContext } from 'koa';
import {
  Column,
  Connection,
  CreateDateColumn,
  DeepPartial,
  Entity,
  EntityManager,
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
import CafeImage, { CafeImageState } from './cafeImage';
import CafeImageCount from './cafeImageCount';
import { OperationSchema, OperationType } from '../util/iam';
import Exception, { ExceptionCode } from '../util/error';

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
  place!: Place;

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

  public isDeleted(): boolean {
    return this.state === CafeState.deleted;
  }

  @OneToOne(() => CafeStatistic, (statistic) => statistic.cafe)
  statistic!: CafeStatistic;

  @OneToOne(() => CafeImageCount, (imageCount) => imageCount.cafe)
  imageCount!: CafeImageCount;

  @OneToMany(() => CafeImage, (image) => image.cafe)
  images!: CafeImage[];

  public toJsonObject(options?: { showHiddenImages?: boolean }): AnyJson {
    if (this.isDeleted()) {
      return {
        id: this.id,
      };
    }

    const imageCount =
      options?.showHiddenImages ?? false
        ? this.imageCount.total
        : this.imageCount.active;

    const imageList = this.images
      ?.map((image) => image.toJsonObject())
      ?.map((imageObject, index) => {
        /* correct the image indices */
        return { ...(imageObject as JsonMap), index };
      });

    return {
      id: this.id,
      createdAt: this.createdAt.toISOString(),
      updatedAt: this.updatedAt.toISOString(),
      name: this.name,
      place: this.place?.toJsonObject(),
      metadata: this.metadataObject,
      state: this.stateString,
      image: this.imageCount && {
        count: imageCount,
        list: imageList,
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

export const createCafeLoader = (
  ctx: ParameterizedContext<KoaContextState>,
  options?: { manager?: EntityManager }
) =>
  new DataLoader<string, Cafe>(async (cafeIds) => {
    const manager =
      options?.manager ?? (await ctx.state.connection()).createEntityManager();

    const normalized = await manager
      .createQueryBuilder(Cafe, 'cafe')
      .select()
      .leftJoinAndSelect('cafe.place', 'place')
      .leftJoinAndSelect('cafe.statistic', 'cafe_statistic')
      .leftJoinAndSelect('cafe.imageCount', 'cafe_image_count')
      .whereInIds(cafeIds)
      .andWhere('cafe.state != :deleted', { deleted: CafeState.deleted })
      .getMany()
      .then((cafes) => Array.normalize<Cafe>(cafes, (cafe) => cafe.id));

    return cafeIds.map((id) => normalized[id]);
  });

export const createCafeWithImagesLoader = (
  ctx: ParameterizedContext<KoaContextState>,
  options?: { manager?: EntityManager; showHiddenImages?: boolean }
) =>
  new DataLoader<string, Cafe>(async (cafeIds) => {
    if (options?.showHiddenImages ?? false) {
      if (
        !(
          ctx.state.policy?.canExecuteOperations(
            ctx,
            cafeIds.map(
              (cafeId) =>
                new OperationSchema({
                  operationType: OperationType.query,
                  operation: 'api.cafe.image.hidden',
                  resource: cafeId,
                })
            )
          ) ?? false
        )
      ) {
        throw new Exception(ExceptionCode.forbidden);
      }
    }

    const manager =
      options?.manager ?? (await ctx.state.connection()).createEntityManager();

    let query = manager
      .createQueryBuilder(Cafe, 'cafe')
      .select()
      .leftJoinAndSelect('cafe.place', 'place')
      .leftJoinAndSelect('cafe.statistic', 'cafe_statistic')
      .leftJoinAndSelect('cafe.imageCount', 'cafe_image_count')
      .leftJoinAndSelect('cafe.images', 'cafe_image')
      .whereInIds(cafeIds)
      .andWhere('cafe.state IS DISTINCT FROM :deleted', {
        deleted: CafeState.deleted,
      })
      .andWhere('cafe_image.state IS DISTINCT FROM :deleted', {
        deleted: CafeImageState.deleted,
      });

    if (!(options?.showHiddenImages ?? false)) {
      query = query.andWhere('cafe_image.state IS DISTINCT FROM :hidden', {
        hidden: CafeImageState.hidden,
      });
    }

    query = query.orderBy(`"cafe_image"."index"`, 'ASC');

    const normalized = await query
      .getMany()
      .then((cafes) => Array.normalize<Cafe>(cafes, (cafe) => cafe.id));

    return cafeIds.map((id) => normalized[id]);
  });
