/**
 * Find the index of the first element that satisfies the predicate
 *
 * 查找数组中第一个满足条件的元素的索引
 *
 * @internal
 */
export function findIndex<T>(
  array: T[],
  predicate: (value: T, index: number, array: T[]) => boolean,
): number {
  return array.findIndex(predicate)
}
