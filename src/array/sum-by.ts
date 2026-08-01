/**
 * Computes the sum of the values returned by an iteratee function for each element of an array.
 *
 * The iteratee is invoked for each element, and the returned numbers are added
 * together. Returns `0` for an empty array.
 *
 * 根据迭代函数计算数组中所有元素返回值之和。
 *
 * 对每个元素调用迭代函数，将返回的数字累加求和。数组为空时返回 `0`。
 *
 * @category Array
 *
 * @typeParam T - The type of elements in the array / 数组元素的类型
 * @param arr - The array to sum. 要求和的数组
 * @param iteratee - The function invoked per element, returning a number. 对每个元素调用的迭代函数，返回数字
 * @returns The sum of the iteratee results. Returns 0 for an empty array. 迭代函数返回值之和，数组为空时返回 0
 *
 * @remarks
 * O(n) time complexity - single pass through the array
 *
 * O(n) 时间复杂度 - 单次遍历数组
 *
 * @example
 * ```ts
 * sumBy([{ p: 10 }, { p: 20 }], (o) => o.p)
 * // => 30
 * ```
 */
export function sumBy<T>(arr: readonly T[], iteratee: (item: T) => number): number {
  let sum = 0
  for (let i = 0; i < arr.length; i++) {
    sum += iteratee(arr[i]!)
  }
  return sum
}
