export function getOrder(index: number, pos: number, numItems: number) {
  return index - pos < 0 ? numItems - Math.abs(index - pos) : index - pos;
}
