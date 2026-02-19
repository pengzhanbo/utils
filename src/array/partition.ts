/**
 * Splits an array into two groups based on a predicate function.
 *
 * The first group contains elements that satisfy the predicate function,
 * and the second group contains elements that do not satisfy the predicate function.
 *
 * 根据谓词函数将数组分成两组。
 *
 * 第一组包含满足谓词函数的元素，第二组包含不满足谓词函数的元素。
 *
 * @category Array
 *
 * @param array - The array to partition. 要分区的数组
 * @param predicate - The function to test each element. 用于测试每个元素的函数
 * @returns A tuple of two arrays: [elements that satisfy predicate, elements that don't]. 包含两个数组的元组：[满足谓词的元素, 不满足谓词的元素]
 *
 * @performance O(n) time complexity - single pass through the array
 *              O(n) 时间复杂度 - 单次遍历数组
 *
 * @example
 * ```ts
 * partition([1, 2, 3, 4, 5], n => n % 2 === 0)
 * // => [[2, 4], [1, 3, 5]]
 * ```
 *
 * @example
 * ```ts
 * partition(['a', 'bb', 'ccc', 'd'], s => s.length > 1)
 * // => [['bb', 'ccc'], ['a', 'd']]
 * ```
 */
export function partition<T>(
  array: readonly T[],
  predicate: (item: T, index: number, array: readonly T[]) => boolean,
): [T[], T[]] {
  const pass: T[] = []
  const fail: T[] = []

  for (let i = 0; i < array.length; i++) {
    const item = array[i]!
    if (predicate(item, i, array)) {
      pass.push(item)
    } else {
      fail.push(item)
    }
  }

  return [pass, fail]
}
