import Logger from '../util/logger';
import scheduledEventHandler from '../util/scheduledEventHandler';

export const sample = async (logger?: Logger): Promise<[number, AnyJson]> => {
  await Promise.resolve(true);
  return [200, 'sample job completed!'];
};

export const handler = scheduledEventHandler(({ logger }) => sample(logger), {
  name: 'sample',
});
