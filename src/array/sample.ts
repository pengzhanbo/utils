/**
 * Gets a random element from an array.
 *
 * 从数组中获取一个随机元素。
 *
 * @category Array
 *
 * @param array - The array to sample from. 要取样的数组
 * @returns A random element from the array, or undefined if the array is empty. 数组中的随机元素，如果数组为空则返回 undefined
 *
 * @performance O(1) time complexity - direct index access
 *              O(1) 时间复杂度 - 直接索引访问
 *
 * @example
 * ```ts
 * sample([1, 2, 3, 4, 5])
 * // => 2 (random element from the array)
 * ```
 *
 * @example
 * ```ts
 * sample([])
 * // => undefined
 * ```
 */
export function sample<T>(array: readonly T[]): T | undefined {
  if (array.length === 0) return undefined

  const randomIndex = Math.floor(Math.random() * array.length)
  return array[randomIndex]
}

/**
 * Gets n random elements from an array.
 *
 * If n is greater than the array length, returns all elements in random order.
 * If n is 0 or negative, returns an empty array.
 *
 * 从数组中获取 n 个随机元素。
 *
 * 如果 n 大于数组长度，则以随机顺序返回所有元素。
 * 如果 n 为 0 或负数，则返回空数组。
 *
 * @category Array
 *
 * @param array - The array to sample from. 要取样的数组
 * @param size - The number of elements to sample. 要取样的元素数量
 * @returns An array of random elements from the array. 数组中的随机元素数组
 *
 * @performance O(n) time complexity where n is the size parameter
 *              Uses Fisher-Yates partial shuffle for unbiased sampling
 *              O(n) 时间复杂度，其中 n 为 size 参数
 *              使用 Fisher-Yates 部分洗牌算法实现无偏取样
 *
 * @example
 * ```ts
 * sampleSize([1, 2, 3, 4, 5], 2)
 * // => [3, 1] (random 2 elements from the array)
 * ```
 *
 * @example
 * ```ts
 * sampleSize([1, 2, 3], 5)
 * // => [2, 1, 3] (all elements in random order)
 * ```
 */
export function sampleSize<T>(array: readonly T[], size: number): T[] {
  if (array.length === 0 || size <= 0) return []

  const resultLength = Math.min(size, array.length)

  const result = array.slice()

  for (let i = 0; i < resultLength; i++) {
    const randomIndex = i + Math.floor(Math.random() * (result.length - i))
    ;[result[i], result[randomIndex]] = [result[randomIndex]!, result[i]!]
  }

  return result.slice(0, resultLength)
}
