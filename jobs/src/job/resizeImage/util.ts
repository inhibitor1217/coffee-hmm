import { Dimension } from './type';

export function formatDimension(dimension: Dimension): string {
  const { width, height } = dimension;
  return `${width}x${height}`;
}

export function stringifyDimension(dimension: Dimension): string {
  return formatDimension(dimension);
}
