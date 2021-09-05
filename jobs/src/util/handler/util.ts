import type { EventOptions } from '../../types/event';

export const formatBody = (body: AnyJson) =>
  typeof body === 'string' ? body : JSON.stringify(body);

export const formatJobCompleteMessage = (
  options: EventOptions,
  statusCode: number,
  body: AnyJson
): string => {
  const { name, buildString: version = 'unspecified' } = options;

  return [
    `job.name: ${name}`,
    `job.version: ${version}`,
    `statusCode: ${statusCode}`,
    formatBody(body),
  ].join('\n');
};
