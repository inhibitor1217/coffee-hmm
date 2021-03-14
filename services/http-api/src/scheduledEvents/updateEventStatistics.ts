import {
  CafeStatistic,
  Event,
  EventCategory,
  EventName,
} from '@coffee-hmm/common';
import { Connection } from 'typeorm';
import scheduledEventHandler from '../util/scheduler';

export const updateCafeViewStatistics = async (
  connection: Connection,
  options?: { now: Date }
) => {
  const newViewCafeEvents = await connection
    .createQueryBuilder(Event, 'event')
    .select(`event.value AS "cafeId", COUNT(event.id) AS "count"`)
    .where(`event.created_at >= (:now::timestamptz - INTERVAL '1 hour')`, {
      now: options?.now ?? `NOW()`,
    })
    .andWhere(`event.category = :category`, { category: EventCategory.CAFE })
    .andWhere(`event.name = :name`, { name: EventName.VIEW })
    .groupBy(`event.value`)
    .getRawMany()
    .then((rows) =>
      Array.normalize(
        rows as { cafeId: string; count: number }[],
        (row) => row.cafeId
      )
    );

  const oldDailyViewCafeEvents = await connection
    .createQueryBuilder(Event, 'event')
    .select(`event.value AS "cafeId", COUNT(event.id) AS "count"`)
    .where(
      `event.created_at >= (:now::timestamptz - INTERVAL '1 day' - INTERVAL '1 hour')`,
      {
        now: options?.now ?? `NOW()`,
      }
    )
    .andWhere(`event.created_at < (:now::timestamptz - INTERVAL '1 day')`, {
      now: options?.now ?? `NOW()`,
    })
    .andWhere(`event.category = :category`, { category: EventCategory.CAFE })
    .andWhere(`event.name = :name`, { name: EventName.VIEW })
    .groupBy(`event.value`)
    .getRawMany()
    .then((rows) =>
      Array.normalize(
        rows as { cafeId: string; count: number }[],
        (row) => row.cafeId
      )
    );

  const oldWeeklyViewCafeEvents = await connection
    .createQueryBuilder(Event, 'event')
    .select(`event.value AS "cafeId", COUNT(event.id) AS "count"`)
    .where(
      `event.created_at >= (:now::timestamptz - INTERVAL '7 days' - INTERVAL '1 hour')`,
      {
        now: options?.now ?? `NOW()`,
      }
    )
    .andWhere(`event.created_at < (:now::timestamptz - INTERVAL '7 days')`, {
      now: options?.now ?? `NOW()`,
    })
    .andWhere(`event.category = :category`, { category: EventCategory.CAFE })
    .andWhere(`event.name = :name`, { name: EventName.VIEW })
    .groupBy(`event.value`)
    .getRawMany()
    .then((rows) =>
      Array.normalize(
        rows as { cafeId: string; count: number }[],
        (row) => row.cafeId
      )
    );

  const oldMonthlyViewCafeEvents = await connection
    .createQueryBuilder(Event, 'event')
    .select(`event.value AS "cafeId", COUNT(event.id) AS "count"`)
    .where(
      `event.created_at >= (:now::timestamptz - INTERVAL '30 days' - INTERVAL '1 hour')`,
      {
        now: options?.now ?? `NOW()`,
      }
    )
    .andWhere(`event.created_at < (:now::timestamptz - INTERVAL '30 days')`, {
      now: options?.now ?? `NOW()`,
    })
    .andWhere(`event.category = :category`, { category: EventCategory.CAFE })
    .andWhere(`event.name = :name`, { name: EventName.VIEW })
    .groupBy(`event.value`)
    .getRawMany()
    .then((rows) =>
      Array.normalize(
        rows as { cafeId: string; count: number }[],
        (row) => row.cafeId
      )
    );

  const deltas = Array.normalize(
    [
      ...new Set<string>([
        ...Object.keys(newViewCafeEvents),
        ...Object.keys(oldDailyViewCafeEvents),
        ...Object.keys(oldWeeklyViewCafeEvents),
        ...Object.keys(oldMonthlyViewCafeEvents),
      ]),
    ].map((cafeId) => ({
      cafeId,
      daily:
        (newViewCafeEvents[cafeId]?.count ?? 0) -
        (oldDailyViewCafeEvents[cafeId]?.count ?? 0),
      weekly:
        (newViewCafeEvents[cafeId]?.count ?? 0) -
        (oldWeeklyViewCafeEvents[cafeId]?.count ?? 0),
      monthly:
        (newViewCafeEvents[cafeId]?.count ?? 0) -
        (oldMonthlyViewCafeEvents[cafeId]?.count ?? 0),
      total: newViewCafeEvents[cafeId]?.count ?? 0,
    })),
    (delta) => delta.cafeId
  );

  await connection.transaction((manager) =>
    Promise.all(
      Object.keys(deltas).map((cafeId) =>
        manager
          .getRepository(CafeStatistic)
          .createQueryBuilder()
          .update()
          .set({
            dailyViews: () => `"daily_views" + :daily`,
            weeklyViews: () => `"weekly_views" + :weekly`,
            monthlyViews: () => `"monthly_views" + :monthly`,
            totalViews: () => `"total_views" + :total`,
          })
          .where({ fkCafeId: cafeId })
          .setParameters(deltas[cafeId])
          .execute()
      )
    )
  );
};

export const handler = scheduledEventHandler(async (ctx) => {
  const connection = await ctx.connection();

  await updateCafeViewStatistics(connection);
});
