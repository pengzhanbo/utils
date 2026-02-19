/**
 * Counts the number of elements in an array that satisfy the given predicate function.
 *
 * 统计数组中满足给定谓词函数的元素数量。
 *
 * @category Array
 *
 * @param array - The array to count elements in. 要统计元素数量的数组
 * @param predicate - The function to test each element. 用于测试每个元素的函数
 * @returns The number of elements that satisfy the predicate. 满足谓词的元素数量
 *
 * @performance O(n) time complexity - single pass through the array
 *              O(n) 时间复杂度 - 单次遍历数组
 *
 * @example
 * ```ts
 * count([1, 2, 3, 4, 5], n => n > 2)
 * // => 3
 * ```
 *
 * @example
 * ```ts
 * count(['a', 'bb', 'ccc'], s => s.length > 1)
 * // => 2
 * ```
 */
export function count<T>(array: readonly T[], predicate: (item: T) => boolean): number {
  let result = 0

  for (let i = 0; i < array.length; i++) {
    if (predicate(array[i]!)) {
      result++
    }
  }

  return result
}

/**
 * Counts the occurrences of each value returned by the iteratee function.
 *
 * This function takes an array and an iteratee function, and returns an object
 * where each key is a value returned by the iteratee function, and the value
 * is the count of elements that produced that key.
 *
 * 统计 iteratee 函数返回的每个值的出现次数。
 *
 * 此函数接收一个数组和一个 iteratee 函数，返回一个对象，其中每个键是 iteratee 函数返回的值，
 * 值是产生该键的元素数量。
 *
 * @category Array
 *
 * @param array - The array to count. 要统计的数组
 * @param iteratee - The function to transform elements into keys. 将元素转换为键的函数
 * @returns An object with keys mapped to their counts. 键映射到其计数的对象
 *
 * @performance Uses Map for O(1) key lookup, overall O(n) time complexity
 *              使用 Map 实现 O(1) 键查找，整体时间复杂度 O(n)
 *
 * @example
 * ```ts
 * countBy(['one', 'two', 'three'], x => x.length)
 * // => { 3: 2, 5: 1 }
 * ```
 *
 * @example
 * ```ts
 * countBy([6.1, 4.2, 6.3], Math.floor)
 * // => { 6: 2, 4: 1 }
 * ```
 */
export function countBy<T, K extends PropertyKey>(
  array: readonly T[],
  iteratee: (item: T) => K,
): Record<K, number> {
  const result = {} as Record<K, number>

  for (let i = 0; i < array.length; i++) {
    const key = iteratee(array[i]!)

    if (key in result) {
      result[key]++
    } else {
      result[key] = 1
    }
  }

  return result
}
