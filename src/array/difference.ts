/**
 * Computes the difference between two arrays.
 *
 * This function takes two arrays and returns a new array containing the elements
 * that are present in the first array but not in the second array. It effectively
 * filters out any elements from the first array that also appear in the second array.
 *
 * 计算两个数组之间的差异。
 *
 * 此函数接收两个数组，并返回一个新数组，其中包含存在于第一个数组中但不在第二个数组中的元素。
 * 它有效地过滤掉第一个数组中同时出现在第二个数组中的任何元素。
 *
 * @category Array
 *
 * @param firstArr - the first array. 第一个数组
 * @param secondArr - the second array. 第二个数组
 * @returns - a new array containing the elements that are present in the first array but not in the second array. -- 包含存在于第一个数组中但不在第二个数组中的元素的新数组
 *
 * @example
 * ```ts
 * difference([1, 2, 3, 4, 5], [2, 4])
 * // => [1, 3, 5]
 * ```
 */
export function difference<T>(firstArr: readonly T[], secondArr: readonly T[]): T[] {
  const set = new Set(secondArr)
  return firstArr.filter((item) => !set.has(item))
}

/**
 * Computes the difference between two arrays after mapping their elements through a provided function.
 *
 * This function takes two arrays and a mapper function. It returns a new array containing the elements
 * that are present in the first array but not in the second array, based on the identity calculated
 * by the mapper function.
 *
 * Essentially, it filters out any elements from the first array that, when
 * mapped, match an element in the mapped version of the second array.
 *
 * 计算两个数组在通过提供的函数映射其元素后的差异。
 *
 * 此函数接收两个数组和一个映射函数。它返回一个新数组，包含那些存在于第一个数组中但不在第二个数组中的元素，
 * 基于映射函数计算出的标识。
 *
 * 本质上，它会过滤掉第一个数组中那些在映射后与第二个数组映射版本中元素匹配的元素。
 *
 * @category Array
 * @example
 * ```ts
 * const array1 = [{ id: 1 }, { id: 2 }, { id: 3 }]
 * const array2 = [{ id: 2 }, { id: 4 }]
 * const mapper = item => item.id
 * const result = differenceBy(array1, array2, mapper)
 * // -> [{ id: 1 }, { id: 3 }]
 * ```
 * @example
 * ```ts
 * const array1 = [{ id: 1 }, { id: 2 }, { id: 3 }]
 * const array2 = [2, 4]
 * const mapper = item => (typeof item === 'object' ? item.id : item)
 * const result = differenceBy(array1, array2, mapper)
 * // -> [{ id: 1 }, { id: 3 }]
 * ```
 */
export function differenceBy<T, U>(
  firstArr: readonly T[],
  secondArr: readonly U[],
  mapper: (value: T | U) => unknown,
): T[] {
  const set = new Set(secondArr.map((item) => mapper(item)))

  return firstArr.filter((item) => !set.has(mapper(item)))
}
