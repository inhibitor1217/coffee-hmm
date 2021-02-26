import '../util/extension';

import { Connection, createConnection } from 'typeorm';
import * as uuid from 'uuid';
import Event, { EventCategory, EventName } from '../entities/event';
import { cleanDatabase, ormConfigs } from '../test';
import { setupCafe, setupPlace } from '../test/util';
import { env } from '../util';
import { updateCafeViewStatistics } from './updateEventStatistics';
import Cafe from '../entities/cafe';

let connection: Connection;

jest.setTimeout(60000);
// eslint-disable-next-line no-console
console.log = jest.fn();

beforeAll(async () => {
  connection = await createConnection(
    ormConfigs.worker(parseInt(env('JEST_WORKER_ID'), 10))
  );
});

afterAll(async () => {
  await connection?.close();
});

beforeEach(async () => {
  await cleanDatabase(connection);
});

const NUM_TEST_VIEWS_PER_CAFE = 200;

enum ScenarioEvent {
  view,
  cron,
}

type ScenarioViewEvent = {
  type: ScenarioEvent; // ScenarioEvent.view
  id: string;
  pastInMillis: number;
  cafeId: string;
};

type ScenarioCronEvent = {
  type: ScenarioEvent; // ScenarioEvent.cron
  id: string;
  pastInMillis: number;
};

type CronResult = {
  id: string;
  records: {
    cafeId: string;
    dailyViews: number;
    weeklyViews: number;
    monthlyViews: number;
    totalViews: number;
  }[];
};

const isViewEvent = (
  event: ScenarioViewEvent | ScenarioCronEvent
): event is ScenarioViewEvent => event.type === ScenarioEvent.view;

const postViewEvent = async ({ cafeId, pastInMillis }: ScenarioViewEvent) => {
  const createdAtTimestamp = new Date(2021, 1, 1).getTime() - pastInMillis;
  const createdAt = new Date(createdAtTimestamp);

  await connection
    .getRepository(Event)
    .createQueryBuilder('event')
    .insert()
    .values({
      createdAt,
      updatedAt: createdAt,
      category: EventCategory.CAFE,
      name: EventName.VIEW,
      value: cafeId,
    })
    .execute();
};

describe('Cron - update cafe view statistics', () => {
  test('Integrated test on updating cafe view', async () => {
    /* setup cafes */
    const place = await setupPlace(connection, { name: '판교' });
    const cafes = await Promise.all(
      ['알레그리아', '커피밀', '워터화이트', '파브리끄', '칼디'].map((name) =>
        setupCafe(connection, { name, placeId: place.id }).then(
          ({ cafe }) => cafe
        )
      )
    );

    /* setup scenario */
    const viewEvents: ScenarioViewEvent[] = [
      ...Array(cafes.length * NUM_TEST_VIEWS_PER_CAFE).keys(),
    ].map((i) => ({
      type: ScenarioEvent.view,
      id: uuid.v4(),
      cafeId: cafes[i % cafes.length].id,
      pastInMillis: Math.floor(Math.random() * 1000 * 60 * 60 * 24 * 30 * 2), // create a random interval between 0 and 2 months
    }));

    const cronEvents: ScenarioCronEvent[] = [
      ...Array(24 * 30 * 2 + 1).keys(),
    ].map((i) => ({
      type: ScenarioEvent.cron,
      id: uuid.v4(),
      pastInMillis: 1000 * 60 * 60 * i, // cron events every hour
    }));

    const scenario: (ScenarioViewEvent | ScenarioCronEvent)[] = [
      ...viewEvents,
      ...cronEvents,
    ].sort((one, other) => other.pastInMillis - one.pastInMillis); // sort by pastInMillis descending

    const answers: { [eventId: string]: CronResult } = Array.normalize(
      cronEvents.map((cron) => {
        const { id, pastInMillis } = cron;

        const records = cafes.map((cafe) => {
          const dailyViews = viewEvents.filter(
            (view) =>
              view.cafeId === cafe.id &&
              view.pastInMillis > pastInMillis &&
              view.pastInMillis <= pastInMillis + 1000 * 60 * 60 * 24
          ).length;

          const weeklyViews = viewEvents.filter(
            (view) =>
              view.cafeId === cafe.id &&
              view.pastInMillis > pastInMillis &&
              view.pastInMillis <= pastInMillis + 1000 * 60 * 60 * 24 * 7
          ).length;

          const monthlyViews = viewEvents.filter(
            (view) =>
              view.cafeId === cafe.id &&
              view.pastInMillis > pastInMillis &&
              view.pastInMillis <= pastInMillis + 1000 * 60 * 60 * 24 * 30
          ).length;

          const totalViews = viewEvents.filter(
            (view) =>
              view.cafeId === cafe.id && view.pastInMillis > pastInMillis
          ).length;

          return {
            cafeId: cafe.id,
            dailyViews,
            weeklyViews,
            monthlyViews,
            totalViews,
          };
        });

        return { id, records };
      }),
      (answer) => answer.id
    );

    const results: { [eventId: string]: CronResult } = Array.normalize(
      await Promise.chain(
        scenario.map((event) => async (prev) => {
          if (isViewEvent(event)) {
            await postViewEvent(event);
            return [...prev];
          }

          await updateCafeViewStatistics(connection, {
            now: new Date(new Date(2021, 1, 1).getTime() - event.pastInMillis),
          });

          const result: CronResult = await connection
            .createQueryBuilder(Cafe, 'cafe')
            .select()
            .leftJoinAndSelect('cafe.statistic', 'cafe_statistic')
            .whereInIds(cafes.map((cafe) => cafe.id))
            .getMany()
            .then((rows) => ({
              id: event.id,
              records: rows.map((cafe) => ({
                cafeId: cafe.id,
                dailyViews: cafe.statistic.dailyViews,
                weeklyViews: cafe.statistic.weeklyViews,
                monthlyViews: cafe.statistic.monthlyViews,
                totalViews: cafe.statistic.totalViews,
              })),
            }));

          return [...prev, result];
        }),
        []
      ),
      (result) => result.id
    );

    Object.keys(answers).forEach((eventId) => {
      const answer = answers[eventId];
      const result = results[eventId];

      expect(result).toBeTruthy();
      expect(answer.id).toBe(result.id);

      const answerRecords = answer.records.sort((one, other) =>
        one.cafeId.localeCompare(other.cafeId)
      );
      const resultRecords = result.records.sort((one, other) =>
        one.cafeId.localeCompare(other.cafeId)
      );

      expect(answerRecords).toEqual(resultRecords);
    });
  });
});
