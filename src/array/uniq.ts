/**
 * Unique array by array element
 *
 * 通过数组元素的相同性来实现数组去重
 *
 * @category Array
 *
 * @see {@link uniqBy} and {@link uniqWith} — for custom deduplication strategies
 * @see {@link uniqBy} 和 {@link uniqWith} — 自定义去重策略
 *
 * @param v - The array to remove duplicates from / 要去重的数组
 * @returns The array with duplicates removed / 去重后的数组
 *
 * @example
 * ```ts
 * uniq([1, 1, 2, 2, 3, 3]) // => [1, 2, 3]
 * ```
 * @typeParam T - The type of elements in the array / 数组元素的类型
 * @typeParam U - The type of the mapped key or second array elements / 映射键或第二个数组元素的类型
 */
export function uniq<T>(v: readonly T[]): T[] {
  return Array.from(new Set(v))
}

/**
 * Unique array by a custom predicate function
 *
 * 通过自定义 predicate 函数实现数组去重
 *
 * @category Array
 *
 * @typeParam T - The type of elements in the array / 数组元素的类型
 * @typeParam U - The type of the mapped key or second array elements / 映射键或第二个数组元素的类型
 * @param v - The array to remove duplicates from / 要去重的数组
 * @param predicate - The function to use to transform each element / 用于每个元素的 predicate 函数
 * @returns The array with duplicates removed / 去重后的数组
 *
 * @example
 * ```ts
 * uniqBy([
 *  { id: 1, name: 'John' },
 *  { id: 2, name: 'Mark' },
 *  { id: 3, name: 'John' },
 * ], item => item.name)
 * // => [{ id: 1, name: 'John' }, { id: 2, name: 'Mark' }]
 * ```
 *
 * @example
 * ```ts
 * uniqBy([1.1, 1.2, 2.1, 2.2], Math.floor)
 * // => [1.1, 2.1]
 * ```
 */
export function uniqBy<T, U>(v: readonly T[], predicate: (item: T) => U): T[] {
  const map = new Map<U, T>()
  for (let i = 0; i < v.length; i++) {
    const value = v[i]!
    const key = predicate(value)
    if (!map.has(key)) map.set(key, value)
  }
  return Array.from(map.values())
}

/**
 * Unique array with a custom equality function
 *
 * 通过自定义相等函数实现数组去重
 *
 * @category Array
 *
 * @remarks
 * Time complexity: O(n²). For large arrays, consider using {@link uniqBy} with a key function for O(n) performance.
 *
 * 时间复杂度：O(n²)。对于大数组，建议使用 {@link uniqBy} 配合键函数以获得 O(n) 性能。
 *
 * @param array - The array to remove duplicates from / 要去重的数组
 * @param equal - The function to determine equality between elements / 判断元素是否相等的函数
 * @returns The array with duplicates removed / 去重后的数组
 *
 * @example
 * ```ts
 * uniqWith([1, 1, 2, 2, 3, 3], (a, b) => a === b)
 * // => [1, 2, 3]
 * ```
 */
export function uniqWith<T>(array: readonly T[], equal: (a: T, b: T) => boolean): T[] {
  return array.reduce((acc: T[], cur) => {
    if (!acc.some((item) => equal(cur, item))) acc.push(cur)
    return acc
  }, [])
}
