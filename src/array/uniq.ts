/**
 * Unique array by array element
 *
 * 通过数组元素的相同性来实现数组去重
 *
 * @category Array
 * @example
 * ```ts
 * uniq([1, 1, 2, 2, 3, 3]) // => [1, 2, 3]
 * ```
 */
export function uniq<T>(v: T[]): T[] {
  return Array.from(new Set(v))
}

/**
 * Unique array by a custom predicate function
 *
 * 通过自定义 predicate 函数实现数组去重
 *
 * @category Array
 * @example
 * ```ts
 * uniqBy([
 *  { id: 1, name: 'John' },
 *  { id: 2, name: 'Mark' },
 *  { id: 3, name: 'John' },
 * ], item => item.name)
 * // => [{ id: 1, name: 'John' }, { id: 2, name: 'Mark' }]
 * ```
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
 * @example
 * ```ts
 * uniqWith([1, 1, 2, 2, 3, 3], (a, b) => a === b)
 * // => [1, 2, 3]
 * ```
 */
export function uniqWith<T>(array: readonly T[], equal: (a: T, b: T) => boolean): T[] {
  return array.reduce((acc: T[], cur) => {
    const index = acc.findIndex((item) => equal(cur, item))
    if (index === -1) acc.push(cur)
    return acc
  }, [])
}
