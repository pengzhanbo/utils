/**
 * Computes the intersection between two arrays.
 *
 * This function takes two arrays and returns a new array containing elements that exist in both the first and second arrays.
 * It effectively filters out any elements that do not appear in both arrays.
 *
 * 计算两个数组之间的差异。
 *
 * 此函数接收两个数组，并返回一个新数组，其中包含同时存在于第一个数组和第二个数组中的元素。
 * 它有效地过滤掉不在两个数组中同时出现的任何元素。
 *
 * @category Array
 *
 * @param firstArr - the first array. 第一个数组
 * @param secondArr - the second array. 第二个数组
 * @returns - a new array containing elements that exist in both the first and second arrays. -- 包含同时存在于第一个数组和第二个数组中的元素的新数组
 *
 * @example
 * ```ts
 * intersection([1, 2, 3, 4, 5], [2, 4, 6])
 * // => [2, 4]
 * ```
 */
export function intersection<T>(firstArr: readonly T[], secondArr: readonly T[]): T[] {
  const secondSet = new Set(secondArr)

  return firstArr.filter(item => secondSet.has(item))
}

/**
 * Computes the intersection between two arrays after mapping their elements through a provided function.
 *
 * This function takes two arrays and a mapper function. It returns a new array containing elements that exist in both the first and second arrays.
 * It effectively filters out any elements that do not appear in both arrays.
 *
 * Essentially, it only retains those elements from the first array that, after mapping, match elements in the mapped version of the second array.
 *
 * 计算两个数组在通过提供的函数映射其元素后的交集。
 *
 * 此函数接收两个数组和一个映射函数。它返回一个新数组，其中包含同时存在于第一个数组和第二个数组中的元素。
 * 它有效地过滤掉不在两个数组中同时出现的任何元素。
 *
 * 本质上，它仅保留过第一个数组中那些在映射后与第二个数组映射版本中元素匹配的元素。
 *
 * @category Array
 *
 * @param firstArr - the first array. 第一个数组
 * @param secondArr - the second array. 第二个数组
 * @param mapper - the mapper function. 映射函数
 * @returns - a new array containing elements that exist in both the first and second arrays. -- 包含同时存在于第一个数组和第二个数组中的元素的新数组
 *
 * @example
 * ```ts
 * const array1 = [{ id: 1 }, { id: 2 }, { id: 3 }]
 * const array2 = [{ id: 2 }, { id: 4 }]
 * const mapper = item => item.id
 * const result = differenceBy(array1, array2, mapper)
 * // -> [{ id: 2 }]
 * ```
 *
 * @example
 * ```ts
 * const array1 = [{ id: 1 }, { id: 2 }, { id: 3 }]
 * const array2 = [2, 4]
 * const mapper = item => (typeof item === 'object' ? item.id : item)
 * const result = differenceBy(array1, array2, mapper)
 * // -> [{ id: 2 }]
 * ```
 */
export function intersectionBy<T, U>(
  firstArr: readonly T[],
  secondArr: readonly U[],
  mapper: (item: T | U) => unknown,
): T[] {
  const secondSet = new Set(secondArr.map(item => mapper(item)))

  return firstArr.filter(item => secondSet.has(mapper(item)))
}
