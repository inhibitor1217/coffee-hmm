import { Connection } from 'typeorm';
import Cafe, { CafeState } from '../entities/cafe';
import CafeImage, { CafeImageState } from '../entities/cafeImage';
import CafeImageCount from '../entities/cafeImageCount';
import CafeStatistic from '../entities/cafeStatistic';
import Place from '../entities/place';

export const setupPlace = async (
  connection: Connection,
  { name }: { name: string }
) => {
  const place = await connection
    .createQueryBuilder(Place, 'place')
    .insert()
    .values({ name })
    .returning(Place.columns)
    .execute()
    .then((insertResult) =>
      Place.fromRawColumns((insertResult.raw as Record<string, unknown>[])[0], {
        connection,
      })
    );

  return place;
};

export const setupCafe = async (
  connection: Connection,
  {
    name,
    placeId,
    metadata,
    state,
    images,
    mainImageIndex,
    views,
    numLikes,
  }: {
    name: string;
    placeId: string;
    metadata?: AnyJson;
    state?: CafeState;
    images?: {
      uri: string;
      state: CafeImageState;
      metadata?: AnyJson;
    }[];
    mainImageIndex?: number;
    views?: {
      daily?: number;
      weekly?: number;
      monthly?: number;
      total?: number;
    };
    numLikes?: number;
  }
) => {
  return connection.transaction(async (manager) => {
    const cafe = await manager
      .createQueryBuilder(Cafe, 'cafe')
      .insert()
      .values({
        name,
        fkPlaceId: placeId,
        metadata: JSON.stringify(metadata),
        state: state ?? CafeState.hidden,
      })
      .returning(Cafe.columns)
      .execute()
      .then((insertResult) =>
        Cafe.fromRawColumns(
          (insertResult.raw as Record<string, unknown>[])[0],
          {
            connection,
          }
        )
      );

    let cafeImages: CafeImage[] = [];
    if (images) {
      if (images.length === 0) {
        expect(mainImageIndex).toBeFalsy();
      } else {
        expect(mainImageIndex ?? 0).toBeLessThan(images.length);
      }

      cafeImages = await Promise.all(
        images.map((image, index) =>
          manager
            .createQueryBuilder(CafeImage, 'cafe_image')
            .insert()
            .values({
              fkCafeId: cafe.id,
              index,
              isMain: index === (mainImageIndex ?? 0),
              metadata: JSON.stringify(image.metadata),
              relativeUri: image.uri,
              state: image.state,
            })
            .returning(CafeImage.columns)
            .execute()
            .then((insertResult) =>
              CafeImage.fromRawColumns(
                (insertResult.raw as Record<string, unknown>[])[0],
                {
                  connection,
                }
              )
            )
        )
      );
    }

    const cafeStatistic = await manager
      .createQueryBuilder(CafeStatistic, 'cafe_statistic')
      .insert()
      .values({
        fkCafeId: cafe.id,
        dailyViews: views?.daily ?? 0,
        weeklyViews: views?.weekly ?? 0,
        monthlyViews: views?.monthly ?? 0,
        totalViews: views?.total ?? 0,
        numReviews: 0,
        sumRatings: 0,
        numLikes: numLikes ?? 0,
      })
      .returning(CafeStatistic.columns)
      .execute()
      .then((insertResult) =>
        CafeStatistic.fromRawColumns(
          (insertResult.raw as Record<string, number>[])[0],
          { connection }
        )
      );

    const cafeImageCount = await manager
      .createQueryBuilder(CafeImageCount, 'cafe_image_count')
      .insert()
      .values({
        fkCafeId: cafe.id,
        total: images?.length ?? 0,
        active:
          images?.filter((image) => image.state === CafeImageState.active)
            ?.length ?? 0,
      })
      .returning(CafeImageCount.columns)
      .execute()
      .then((insertResult) =>
        CafeImageCount.fromRawColumns(
          (insertResult.raw as Record<string, number>[])[0],
          { connection }
        )
      );

    return { cafe, cafeImages, cafeStatistic, cafeImageCount };
  });
};
