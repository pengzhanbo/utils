export function findIndex<T>(
  array: T[],
  predicate: (value: T, index: number, array: T[]) => boolean,
): number {
  return array.findIndex(predicate)
}
