import '../util/extension';

import { Cafe, CafeState, CafeImageState } from '@coffee-hmm/common';
import DataLoader from 'dataloader';
import { EntityManager } from 'typeorm';
import { KoaContextState } from '../types/koa';
import { OperationSchema, OperationType } from '../util/iam';
import Exception, { ExceptionCode } from '../util/error';

export const createCafeLoader = (
  state: KoaContextState,
  options?: { manager?: EntityManager }
) =>
  new DataLoader<string, Cafe>(async (cafeIds) => {
    const manager =
      options?.manager ?? (await state.connection()).createEntityManager();

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
  state: KoaContextState,
  options?: { manager?: EntityManager; showHiddenImages?: boolean }
) =>
  new DataLoader<string, Cafe>(async (cafeIds) => {
    if (options?.showHiddenImages ?? false) {
      if (
        !(
          state.policy?.canExecuteOperations(
            state,
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
      options?.manager ?? (await state.connection()).createEntityManager();

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
