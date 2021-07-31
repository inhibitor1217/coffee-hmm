import Dimension from '../../types/dimension';

export function formatDimension(dimension: Dimension): string {
  const { width, height } = dimension;
  return `${width}x${height}`;
}

export function stringifyDimension(dimension: Dimension): string {
  return formatDimension(dimension);
}

export function parseDimension(dimension: string): Dimension {
  const matches = dimension.split('x');

  if (matches.length !== 2) {
    throw new TypeError('invalid format');
  }

  const width = parseInt(matches[0], 10);
  const height = parseInt(matches[1], 10);

  if (Number.isNaN(width) || Number.isNaN(height)) {
    throw new TypeError('invalid width or height');
  }

  return { width, height };
}
